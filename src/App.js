import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Make sure this path is correct for your project

// Import Font Awesome components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

// Inline styles
const containerStyle = {
    padding: '20px',
    maxWidth: '1200px', // INCREASED MAX-WIDTH FOR MORE SPACE
    margin: 'auto',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
};

const headerStyle = {
    textAlign: 'center',
    color: '#333',
    marginBottom: '25px',
};

const inputSectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '20px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 5px rgba(0,0,0,0.05)',
};

const textareaStyle = {
    width: 'calc(100% - 20px)',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    minHeight: '100px',
    resize: 'vertical',
};

const buttonGroupStyle = {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    flexWrap: 'wrap', // Allow buttons to wrap on smaller screens
};

const baseButtonStyle = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    minWidth: '150px', // Ensure buttons have a minimum width
};

const activeButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: '#007bff', // Blue for active
    color: 'white',
};

const inactiveButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: '#e9ecef', // Light grey for inactive
    color: '#6c757d',
};

const clearButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: '#dc3545', // Red for Clear
    color: 'white',
    marginTop: '10px', // Space from other buttons
    width: 'auto', // Allow it to be centered
    display: 'block', // To apply margin:auto
    margin: '10px auto 0 auto',
};

const tableContainerStyle = {
    marginTop: '25px',
    // Removed overflowX: 'auto' because you want to avoid horizontal scroll
    // If content still overflows, consider adjusting column widths or reducing font size
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
};

const thStyle = {
    padding: '12px',
    border: '1px solid #ddd',
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
    whiteSpace: 'nowrap', // Prevent headers from wrapping, but now with more space
};

const tdStyle = {
    padding: '12px',
    border: '1px solid #ddd',
    whiteSpace: 'nowrap', // Prevent content from wrapping, but now with more space
};

const filterButtonContainerStyle = {
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
    padding: '10px 0',
    borderTop: '1px solid #eee',
    borderBottom: '1px solid #eee',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 5px rgba(0,0,0,0.05)',
};

const filterLabelStyle = {
    fontWeight: 'bold',
    color: '#555',
    marginRight: '5px'
};

const baseFilterButtonStyle = {
    padding: '8px 15px',
    border: '1px solid',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease',
};

const activeFilterAllStyle = {
    ...baseFilterButtonStyle,
    backgroundColor: '#6c757d', // Grey for 'All' when active
    color: 'white',
    borderColor: '#6c757d',
};

const activeFilterYesStyle = {
    ...baseFilterButtonStyle,
    backgroundColor: '#28a745', // Green for 'Yes student found' when active
    color: 'white',
    borderColor: '#28a745',
};

const activeFilterNoStyle = {
    ...baseFilterButtonStyle,
    backgroundColor: '#dc3545', // Red for 'Not a student' when active
    color: 'white',
    borderColor: '#dc3545',
};

const inactiveFilterButtonStyle = {
    ...baseFilterButtonStyle,
    backgroundColor: '#f8f9fa',
    color: '#333',
    borderColor: '#ced4da',
};

const copyButtonStyle = {
    marginLeft: '8px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
    padding: '0',
    verticalAlign: 'middle',
};

const copiedMessageStyle = {
    fontSize: '0.8em',
    marginLeft: '5px',
    color: 'green',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
};


function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // ✅ track auth status

    useEffect(() => {
        async function checkSession() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // Redirect to login page if not logged in
                window.location.href = 'https://tools.microdegree.in';
            } else {
                setIsAuthenticated(true);
            }
        }
        checkSession();
    }, []);

    if (isAuthenticated === null) {
        return <div>Checking authentication...</div>; // Loading state
    }
    
    const [searchInput, setSearchInput] = useState('');
    const [results, setResults] = useState([]);
    const [activeSearchType, setActiveSearchType] = useState('phone');
    const [filterStatus, setFilterStatus] = useState('All');
    const [copiedIndex, setCopiedIndex] = useState(null); // For "Searched Value" column
    const [copiedEmailIndex, setCopiedEmailIndex] = useState(null); // For "Email" or "Contact No." column

    // Helper function to normalize a phone number for comprehensive search
    const normalizePhoneNumber = (num) => {
        // Allow '+' sign in initial cleaning
        let cleanedNum = num.replace(/[^0-9+]/g, '');

        // If it starts with a '+' (international format)
        if (cleanedNum.startsWith('+')) {
            let numWithoutPlus = cleanedNum.substring(1);

            // Attempt to strip common country codes (1, 91) if the result is 10 digits
            if (numWithoutPlus.startsWith('1') && numWithoutPlus.length === 11) {
                return numWithoutPlus.substring(1); // e.g., +12125551234 -> 2125551234
            }
            if (numWithoutPlus.startsWith('91') && numWithoutPlus.length === 12) {
                return numWithoutPlus.substring(2); // e.g., +919876543210 -> 9876543210
            }
            // For other international numbers starting with '+', return the number without '+'
            // It will be searched as is in Supabase.
            return numWithoutPlus;
        }

        // If it doesn't start with '+', apply previous and new logic
        // Case 1: If it starts with '0' and is 11 digits (e.g., 01234567890)
        if (cleanedNum.startsWith('0') && cleanedNum.length === 11) {
            cleanedNum = cleanedNum.substring(1); // Remove the leading '0'
        }
        // Case 2: If it starts with '91' and is 12 digits (e.g., 911234567890)
        else if (cleanedNum.startsWith('91') && cleanedNum.length === 12) {
            cleanedNum = cleanedNum.substring(2); // Remove the leading '91'
        }
        // Case 3: If it starts with '1' and is 11 digits (e.g., 11234567890 for USA)
        else if (cleanedNum.startsWith('1') && cleanedNum.length === 11) {
            cleanedNum = cleanedNum.substring(1); // Remove the leading '1'
        }

        // After initial cleaning, if it's a 10-digit number, it's our core
        if (cleanedNum.length === 10) {
            return cleanedNum;
        }

        // Fallback: return the most cleaned version if not a standard 10-digit
        return cleanedNum;
    };

    // Function to perform a single Supabase query
    const performSingleSearch = async (value, type) => {
        let query = supabase.from('students_enrolled_all').select('first_name, last_name, course_fee, email, alternate_email, phone, alternate_phone');

        if (type === 'email') {
            query = query.or(`email.eq.${value},alternate_email.eq.${value}`);
        } else if (type === 'phone') {
            let searchConditions = new Set();
            // Initial cleaning for direct database lookup
            const originalCleanedValue = value.replace(/[^0-9+]/g, '');

            // 1. Add the original cleaned value (e.g., '11234567891', '+11234567891', or '1234567890')
            if (originalCleanedValue) {
                searchConditions.add(`phone.eq.${originalCleanedValue}`);
                searchConditions.add(`alternate_phone.eq.${originalCleanedValue}`);
            }

            // 2. Normalize the input to a core local number (e.g., 10 digits) if possible
            const normalizedCoreNumber = normalizePhoneNumber(value);

            // If a 10-digit core number was successfully extracted, generate permutations
            if (normalizedCoreNumber.length === 10) {
                // Add the 10-digit core number itself
                searchConditions.add(`phone.eq.${normalizedCoreNumber}`);
                searchConditions.add(`alternate_phone.eq.${normalizedCoreNumber}`);

                // Add common international permutations for the 10-digit core
                searchConditions.add(`phone.eq.${'+1' + normalizedCoreNumber}`);
                searchConditions.add(`alternate_phone.eq.${'+1' + normalizedCoreNumber}`);

                searchConditions.add(`phone.eq.${'1' + normalizedCoreNumber}`); // e.g., 1 + 10-digit
                searchConditions.add(`alternate_phone.eq.${'1' + normalizedCoreNumber}`);

                searchConditions.add(`phone.eq.${'+91' + normalizedCoreNumber}`);
                searchConditions.add(`alternate_phone.eq.${'+91' + normalizedCoreNumber}`);

                searchConditions.add(`phone.eq.${'91' + normalizedCoreNumber}`);
                searchConditions.add(`alternate_phone.eq.${'91' + normalizedCoreNumber}`);

                searchConditions.add(`phone.eq.${'0' + normalizedCoreNumber}`);
                searchConditions.add(`alternate_phone.eq.${'0' + normalizedCoreNumber}`);
            } else if (normalizedCoreNumber) {
                // If it normalized to something but not 10 digits (e.g., a shorter international number
                // or a number that couldn't be stripped to 10 digits easily),
                // add it as a direct match condition if not already covered by originalCleanedValue
                // (this check prevents redundant adds if originalCleanedValue == normalizedCoreNumber)
                if (normalizedCoreNumber !== originalCleanedValue) {
                     searchConditions.add(`phone.eq.${normalizedCoreNumber}`);
                     searchConditions.add(`alternate_phone.eq.${normalizedCoreNumber}`);
                }
            }

            // Remove any empty strings from the set that might occur from initial processing
            const finalConditions = [...searchConditions].filter(c => c.length > 0);

            if (finalConditions.length > 0) {
                 query = query.or(finalConditions.join(','));
            } else {
                console.warn("No valid phone search conditions generated for:", value);
                return { value, type, data: [], error: null }; // Return empty data to prevent query with no conditions
            }
        }

        const { data, error } = await query;
        return { value, type, data, error };
    };

    // Generic handler for both email and phone bulk search
    const handleSearch = async (type) => {
        setResults([]);
        setActiveSearchType(type);
        setFilterStatus('All');
        setCopiedIndex(null); // Reset copied state for searched value
        setCopiedEmailIndex(null); // Reset copied state for email/phone in result column

        const valuesToSearch = searchInput.split(/\s+/).map(v => v.trim()).filter(v => v !== '');
        console.log("value to search"+valuesToSearch)

        if (valuesToSearch.length === 0) {
            return;
        }

        let allProcessedResults = [];

        for (const value of valuesToSearch) {
            console.log(`Searching for ${type}:`, value);
            const { data, error } = await performSingleSearch(value, type);

            if (error) {
                console.error(`Error fetching data for ${value}:`, error);
                allProcessedResults.push({
                    value: value,
                    fullName: 'Error fetching data',
                    courseFees: 'Error',
                    microdegreeStudentStatus: 'Not a student',
                    foundEmail: 'Error', // Default for error
                    foundPhone: 'Error'  // Default for error
                });
            } else if (data && data.length > 0) {
                data.forEach(foundItem => {
                    const fullName = `${foundItem.first_name || ''} ${foundItem.last_name || ''}`.trim();
                    const courseFees = foundItem.course_fee !== null ? foundItem.course_fee : 'N/A';
                    allProcessedResults.push({
                        value: value,
                        fullName: fullName || 'N/A',
                        courseFees: courseFees,
                        microdegreeStudentStatus: 'Yes student found',
                        foundEmail: foundItem.email || foundItem.alternate_email || 'N/A', // Email from DB
                        foundPhone: foundItem.phone || foundItem.alternate_phone || 'N/A'  // Phone from DB
                    });
                });
            } else {
                allProcessedResults.push({
                    value: value,
                    fullName: 'Not Found',
                    courseFees: 'Not Found',
                    microdegreeStudentStatus: 'Not a student',
                    foundEmail: 'Not Found', // For not found cases
                    foundPhone: 'Not Found'  // For not found cases
                });
            }
        }

        setResults(allProcessedResults);
    };

    // Function to filter results based on selected status
    const getFilteredResults = () => {
        if (filterStatus === 'All') {
            return results;
        }
        return results.filter(item => item.microdegreeStudentStatus === filterStatus);
    };

    const filteredResults = getFilteredResults();

    // Function to clear all inputs and results
    const clearAll = () => {
        setSearchInput('');
        setResults([]);
        setActiveSearchType('phone');
        setFilterStatus('All');
        setCopiedIndex(null);
        setCopiedEmailIndex(null);
    };

    // Function to handle copying a value with visual feedback
    const copyToClipboard = (text, index, type = 'searched') => {
        // Prevent copying 'N/A', 'Error', or 'Not Found'
        if (text === 'N/A' || text === 'Error' || text === 'Not Found') {
            return;
        }

        const textarea = document.createElement('textarea');
        textarea.value = text.trim();
        textarea.style.position = 'fixed';
        textarea.style.opacity = 0;
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            document.execCommand('copy');
            if (type === 'searched') {
                setCopiedIndex(index);
                setTimeout(() => {
                    setCopiedIndex(null);
                }, 1500);
            } else if (type === 'email' || type === 'phone') { // Unified state for the secondary column
                setCopiedEmailIndex(index); // Using copiedEmailIndex for both email and phone in this column
                setTimeout(() => {
                    setCopiedEmailIndex(null);
                }, 1500);
            }
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
        document.body.removeChild(textarea);
    };

    return (
        <div style={containerStyle}>
            <h2 style={headerStyle}>Microdegree Enrolled Student Checker</h2>

            <div style={inputSectionStyle}>
                <textarea
                    style={textareaStyle}
                    placeholder={
                        activeSearchType === 'email'
                            ? 'Enter emails, space-separated (e.g., email1@example.com email2@example.com)'
                            : 'Enter contact numbers, space-separated (e.g., 9876543210 +911234567890 01234567890 911234567890 11234567890)'
                    }
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    rows="5"
                />
                <div style={buttonGroupStyle}>
                    <button
                        onClick={() => handleSearch('phone')}
                        style={activeSearchType === 'phone' ? activeButtonStyle : inactiveButtonStyle}
                    >
                        Search by Contact (Default)
                    </button>
                    <button
                        onClick={() => handleSearch('email')}
                        style={activeSearchType === 'email' ? activeButtonStyle : inactiveButtonStyle}
                    >
                        Search by Email
                    </button>
                </div>
                <button onClick={clearAll} style={clearButtonStyle}>
                    Clear All
                </button>
            </div>

            {results.length > 0 && ( // Only show filters if there are results
                <div style={filterButtonContainerStyle}>
                    <span style={filterLabelStyle}>Filter:</span>
                    <button
                        onClick={() => setFilterStatus('All')}
                        style={filterStatus === 'All' ? activeFilterAllStyle : inactiveFilterButtonStyle}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilterStatus('Yes student found')}
                        style={filterStatus === 'Yes student found' ? activeFilterYesStyle : inactiveFilterButtonStyle}
                    >
                        Yes student found
                    </button>
                    <button
                        onClick={() => setFilterStatus('Not a student')}
                        style={filterStatus === 'Not a student' ? activeFilterNoStyle : inactiveFilterButtonStyle}
                    >
                        Not a student
                    </button>
                </div>
            )}

            {filteredResults.length > 0 && ( // Only show table if there are filtered results
                <div style={tableContainerStyle}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Searched Value</th>
                                <th style={thStyle}>Full Name</th>
                                <th style={thStyle}>Course Fees</th>
                                <th style={thStyle}>Microdegree Student</th>
                                {/* Conditionally display Email or Contact No. header */}
                                {activeSearchType === 'phone' && <th style={thStyle}>Email</th>}
                                {activeSearchType === 'email' && <th style={thStyle}>Contact No.</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredResults.map((item, index) => (
                                <tr key={index}>
                                    <td style={tdStyle}>
                                        {item.value}
                                        {/* Copy button for Searched Value */}
                                        {item.value !== 'N/A' && item.value !== 'Error' && item.value !== 'Not Found' && (
                                            <button
                                                onClick={() => copyToClipboard(item.value, index, 'searched')}
                                                style={copyButtonStyle}
                                                title="Copy to clipboard"
                                            >
                                                <FontAwesomeIcon icon={faCopy} style={{ color: 'black', fontSize: '1.2em' }} />
                                            </button>
                                        )}
                                        {copiedIndex === index && (
                                            <span style={copiedMessageStyle}>Copied!</span>
                                        )}
                                    </td>
                                    <td style={tdStyle}>{item.fullName}</td>
                                    <td style={tdStyle}>{item.courseFees}</td>
                                    <td
                                        style={{
                                            ...tdStyle,
                                            fontWeight: 'bold',
                                            color:
                                                item.microdegreeStudentStatus === 'Yes student found'
                                                    ? 'green'
                                                    : 'red',
                                        }}
                                    >
                                        {item.microdegreeStudentStatus}
                                    </td>
                                    {/* Conditionally display Email column (if searching by phone) */}
                                    {activeSearchType === 'phone' && (
                                        <td style={tdStyle}>
                                            {item.foundEmail}
                                            {/* Copy button for Email, only if a valid email is found */}
                                            {item.foundEmail !== 'N/A' && item.foundEmail !== 'Error' && item.foundEmail !== 'Not Found' && (
                                                <button
                                                    onClick={() => copyToClipboard(item.foundEmail, index, 'email')}
                                                    style={copyButtonStyle}
                                                    title="Copy email to clipboard"
                                                >
                                                    <FontAwesomeIcon icon={faCopy} style={{ color: 'black', fontSize: '1.2em' }} />
                                                </button>
                                            )}
                                            {copiedEmailIndex === index && (
                                                <span style={copiedMessageStyle}>Copied!</span>
                                            )}
                                        </td>
                                    )}
                                    {/* Conditionally display Contact No. column (if searching by email) */}
                                    {activeSearchType === 'email' && (
                                        <td style={tdStyle}>
                                            {item.foundPhone}
                                            {/* Copy button for Phone, only if a valid phone is found */}
                                            {item.foundPhone !== 'N/A' && item.foundPhone !== 'Error' && item.foundPhone !== 'Not Found' && (
                                                <button
                                                    onClick={() => copyToClipboard(item.foundPhone, index, 'phone')}
                                                    style={copyButtonStyle}
                                                    title="Copy phone to clipboard"
                                                >
                                                    <FontAwesomeIcon icon={faCopy} style={{ color: 'black', fontSize: '1.2em' }} />
                                                </button>
                                            )}
                                            {copiedEmailIndex === index && (
                                                <span style={copiedMessageStyle}>Copied!</span>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default App;