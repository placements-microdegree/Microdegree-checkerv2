import React, { useState } from 'react';
import { supabase } from './supabaseClient';

// Import Font Awesome components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

// Inline styles (as before)
const containerStyle = {
    padding: '20px',
    maxWidth: '800px', // Increased max-width for better layout
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
    overflowX: 'auto', // Enable horizontal scrolling for narrow screens
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
    whiteSpace: 'nowrap', // Prevent headers from wrapping
};

const tdStyle = {
    padding: '12px',
    border: '1px solid #ddd',
    whiteSpace: 'nowrap', // Prevent content from wrapping
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
    const [searchInput, setSearchInput] = useState('');
    const [results, setResults] = useState([]);
    const [activeSearchType, setActiveSearchType] = useState('phone');
    const [filterStatus, setFilterStatus] = useState('All');
    const [copiedIndex, setCopiedIndex] = useState(null);

    // Helper function to normalize a phone number for comprehensive search
    const normalizePhoneNumber = (num) => {
        let cleanedNum = num.replace(/[^0-9]/g, ''); // Remove all non-digits

        // Case 1: If it starts with '0' and is 11 digits (e.g., 01234567890)
        if (cleanedNum.startsWith('0') && cleanedNum.length === 11) {
            cleanedNum = cleanedNum.substring(1); // Remove the leading '0'
        }
        // Case 2: If it starts with '91' and is 12 digits (e.g., 911234567890)
        else if (cleanedNum.startsWith('91') && cleanedNum.length === 12) {
            cleanedNum = cleanedNum.substring(2); // Remove the leading '91'
        }
        // Case 3: If it starts with '+91' and is 13 digits (e.g., +911234567890)
        // This case is covered if it becomes 10 digits after initial removal of '+' and '91'
        else if (cleanedNum.startsWith('91') && cleanedNum.length === 12) {
             // No specific action needed as the '91' prefix case will cover this after stripping '+'
        }


        // After initial cleaning, ensure it's a 10-digit number for further permutations
        if (cleanedNum.length === 10) {
            return cleanedNum;
        }
        // If not a standard 10-digit number after basic normalization, return the cleaned version
        // This handles cases like international numbers that are not +91 or malformed inputs
        return cleanedNum;
    };

    // Function to perform a single Supabase query
    const performSingleSearch = async (value, type) => {
        // Always select all relevant fields for display
        let query = supabase.from('students_enrolled_all').select('first_name, last_name, course_fee, email, alternate_email, phone, alternate_phone');

        if (type === 'email') {
            query = query.or(`email.eq.${value},alternate_email.eq.${value}`);
        } else if (type === 'phone') {
            let searchConditions = new Set(); // Use a Set to avoid duplicate conditions

            const normalizedInput = normalizePhoneNumber(value);

            // Add permutations for a 10-digit normalized number
            if (normalizedInput.length === 10) {
                searchConditions.add(`phone.eq.${normalizedInput}`); // e.g., 1234567890
                searchConditions.add(`alternate_phone.eq.${normalizedInput}`);

                searchConditions.add(`phone.eq.${'+91' + normalizedInput}`); // e.g., +911234567890
                searchConditions.add(`alternate_phone.eq.${'+91' + normalizedInput}`);

                searchConditions.add(`phone.eq.${'0' + normalizedInput}`); // e.g., 01234567890
                searchConditions.add(`alternate_phone.eq.${'0' + normalizedInput}`);

                searchConditions.add(`phone.eq.${'91' + normalizedInput}`); // e.g., 911234567890
                searchConditions.add(`alternate_phone.eq.${'91' + normalizedInput}`);
            } else {
                // For inputs that don't normalize to 10 digits (e.g., international numbers, malformed)
                // search for the original cleaned value including '+' if present.
                const strictCleanedValue = value.replace(/\s/g, ''); // Remove only spaces for non-normalized numbers
                searchConditions.add(`phone.eq.${strictCleanedValue}`);
                searchConditions.add(`alternate_phone.eq.${strictCleanedValue}`);
            }

            query = query.or([...searchConditions].join(','));
        }

        const { data, error } = await query;
        return { value, type, data, error };
    };

    // Generic handler for both email and phone bulk search
    const handleSearch = async (type) => {
        setResults([]);
        setActiveSearchType(type);
        setFilterStatus('All');
        setCopiedIndex(null);

        const valuesToSearch = searchInput.split(/\s+/).map(v => v.trim()).filter(v => v !== '');

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
                        foundEmail: foundItem.email || foundItem.alternate_email || 'N/A', // From DB
                        foundPhone: foundItem.phone || foundItem.alternate_phone || 'N/A'  // From DB
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
    };

    // Function to handle copying a value with visual feedback
    const copyToClipboard = (text, index) => {
        const textarea = document.createElement('textarea');
        textarea.value = text.trim();
        textarea.style.position = 'fixed';
        textarea.style.opacity = 0;
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            document.execCommand('copy');
            setCopiedIndex(index);
            setTimeout(() => {
                setCopiedIndex(null);
            }, 1500);
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
                            : 'Enter contact numbers, space-separated (e.g., 9876543210 +911234567890 01234567890 911234567890)'
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

            {results.length > 0 && (
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

            {filteredResults.length > 0 && (
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
                                        <button
                                            onClick={() => copyToClipboard(item.value, index)}
                                            style={copyButtonStyle}
                                            title="Copy to clipboard"
                                        >
                                            <FontAwesomeIcon icon={faCopy} style={{ color: 'black', fontSize: '1.2em' }} />
                                            {/* Change 'black' to 'blue' or any other color you prefer */}
                                            {/* Adjust '1.2em' for different icon size */}
                                        </button>
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
                                    {/* Conditionally display Email or Contact No. data */}
                                    {activeSearchType === 'phone' && <td style={tdStyle}>{item.foundEmail}</td>}
                                    {activeSearchType === 'email' && <td style={tdStyle}>{item.foundPhone}</td>}
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