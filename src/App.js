import React, { useState } from 'react';
import { supabase } from './supabaseClient'; // Ensure this path is correct

// Inline styles (consider moving to a CSS file for larger projects)
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

const messageStyle = {
  marginTop: '20px',
  padding: '10px',
  backgroundColor: '#e9ecef',
  borderRadius: '4px',
  textAlign: 'center',
  color: '#333',
  wordBreak: 'break-word', // Ensure long messages wrap
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


function App() {
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [activeSearchType, setActiveSearchType] = useState('phone'); // 'phone' or 'email'
  const [filterStatus, setFilterStatus] = useState('All'); // 'All', 'Yes student found', 'Not a student'

  // Function to perform a single Supabase query
  const performSingleSearch = async (value, type) => {
    let query = supabase.from('students_enrolled_all').select('first_name, last_name, course_fee');

    if (type === 'email') {
      query = query.or(`email.eq.${value},alternate_email.eq.${value}`);
    } else if (type === 'phone') {
      const cleanedValue = value.replace(/\s/g, ''); // Remove any spaces from the input number
      let searchConditions = [];

      // Always check for the cleaned original value
      searchConditions.push(`phone.eq.${cleanedValue}`);
      searchConditions.push(`alternate_phone.eq.${cleanedValue}`);

      // If the cleaned value doesn't start with '+91', add the +91 prefixed version
      if (!cleanedValue.startsWith('+91')) {
        const valueWithPlus91 = `+91${cleanedValue}`;
        searchConditions.push(`phone.eq.${valueWithPlus91}`);
        searchConditions.push(`alternate_phone.eq.${valueWithPlus91}`);
      }

      // If the cleaned value starts with '+91', add the version without +91 prefix
      if (cleanedValue.startsWith('+91')) {
        const valueWithoutPlus91 = cleanedValue.substring(3); // Remove '+91'
        searchConditions.push(`phone.eq.${valueWithoutPlus91}`);
        searchConditions.push(`alternate_phone.eq.${valueWithoutPlus91}`);
      }

      // Join all generated conditions with 'or' for the query
      query = query.or(searchConditions.join(','));
    }

    const { data, error } = await query;
    return { value, type, data, error };
  };

  // Generic handler for both email and phone bulk search
  const handleSearch = async (type) => {
    setMessage('');
    setResults([]); // Clear previous results
    setActiveSearchType(type); // Set the active button color
    setFilterStatus('All'); // Reset filter to All whenever a new search is performed

    const valuesToSearch = searchInput.split(/\s+/).map(v => v.trim()).filter(v => v !== '');

    if (valuesToSearch.length === 0) {
      setMessage(`Please enter at least one ${type === 'email' ? 'email address' : 'contact number'}.`);
      return;
    }

    let allProcessedResults = [];
    let feedbackMessages = [];

    for (const value of valuesToSearch) {
      console.log(`Searching for ${type}:`, value);
      const { data, error } = await performSingleSearch(value, type); // data is now an array

      if (error) {
        console.error(`Error fetching data for ${value}:`, error); // Log actual error to console
        feedbackMessages.push(`Error for ${value}: ${error.message}`);
        allProcessedResults.push({
          value: value,
          fullName: 'Error fetching data', // Changed to reflect error type
          courseFees: 'Error',
          microdegreeStudentStatus: 'Not a student'
        });
      } else if (data && data.length > 0) { // Check if data is an array and has elements
        data.forEach(foundItem => {
            const fullName = `${foundItem.first_name || ''} ${foundItem.last_name || ''}`.trim();
            const courseFees = foundItem.course_fee !== null ? foundItem.course_fee : 'N/A';
            allProcessedResults.push({
                value: value, // The original searched input value
                fullName: fullName || 'N/A',
                courseFees: courseFees,
                microdegreeStudentStatus: 'Yes student found'
            });
        });
        feedbackMessages.push(`Found: ${value}`);
      } else {
        feedbackMessages.push(`Not Found: ${value}`);
        allProcessedResults.push({
          value: value,
          fullName: 'Not Found',
          courseFees: 'Not Found',
          microdegreeStudentStatus: 'Not a student'
        });
      }
    }

    setResults(allProcessedResults);
    setMessage(feedbackMessages.length > 0 ? feedbackMessages.join(' | ') : 'No results to display.');
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
    setMessage('');
    setActiveSearchType('phone'); // Reset default search type
    setFilterStatus('All'); // Reset filter to All
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
              : 'Enter contact numbers, space-separated (e.g., 9876543210 +911234567890)'
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

      {message && <p style={messageStyle}>{message}</p>}

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
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((item, index) => (
                <tr key={index}>
                  <td style={tdStyle}>{item.value}</td>
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