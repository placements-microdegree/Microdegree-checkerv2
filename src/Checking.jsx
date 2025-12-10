import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Make sure this path is correct for your project

// Import Font Awesome components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

// Inline styles
const containerStyle = {
    padding: '28px 28px 36px 28px',
    maxWidth: '1200px', // INCREASED MAX-WIDTH FOR MORE SPACE
    margin: '28px auto',
    fontFamily: 'Inter, Arial, sans-serif',
    backgroundColor: '#f5f7fb',
    borderRadius: '12px',
    boxShadow: '0 6px 24px rgba(16,24,40,0.06)',
};

const headerStyle = {
    textAlign: 'center',
    color: '#0f172a',
    marginBottom: '22px',
    marginTop: '2px',
    fontSize: '25px',
    lineHeight: '1.15',
    fontWeight: 700,
    fontFamily: "'Poppins', Inter, Arial, sans-serif",
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
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #e6eef8',
    fontSize: '15px',
    minHeight: '120px',
    resize: 'vertical',
    backgroundColor: '#ffffff'
};

const buttonGroupStyle = {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    flexWrap: 'wrap',
};

const baseButtonStyle = {
    padding: '8px 14px',
    border: '1px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'all 0.12s ease',
    boxShadow: '0 4px 12px rgba(2,6,23,0.06)'
};

const activeButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: '#2563eb',
    color: 'white',
    borderColor: '#1e40af'
};

const inactiveButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: '#ffffff',
    color: '#475569',
    borderColor: '#e6eef8'
};

const clearButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: '#ffffff',
    color: '#b91c1c',
    borderColor: '#fde8e8',
    marginTop: '10px',
    width: 'auto',
    display: 'block',
    margin: '10px auto 0 auto',
};

const tableContainerStyle = {
    marginTop: '25px',
    overflowX: 'auto',
    backgroundColor: 'white',
    padding: '8px',
    borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    minWidth: '800px',
};

const thStyle = {
    padding: '12px',
    border: '1px solid #ddd',
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    position: 'sticky',
    top: 0,
    zIndex: 2,
};

const tdStyle = {
    padding: '12px',
    border: '1px solid #ddd',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
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
    backgroundColor: '#6c757d',
    color: 'white',
    borderColor: '#6c757d',
};

const activeFilterYesStyle = {
    ...baseFilterButtonStyle,
    backgroundColor: '#28a745',
    color: 'white',
    borderColor: '#28a745',
};

const activeFilterNoStyle = {
    ...baseFilterButtonStyle,
    backgroundColor: '#dc3545',
    color: 'white',
    borderColor: '#dc3545',
};

const inactiveFilterButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: '#f8f9fa',
    color: '#333',
    borderColor: '#ced4da',
};

const dateFilterWrapperStyle = {
    marginTop: '10px',
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '14px 18px',
    boxShadow: '0 1px 5px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
};

const dateFilterHeaderStyle = {
    fontWeight: 700,
    fontSize: '0.95rem',
    color: '#1f2937',
};

const dateFilterControlsStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    alignItems: 'center',
};

const dateFilterSelectStyle = {
    minWidth: '110px',
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #dbe6ff',
    backgroundColor: '#f9fbff',
    fontSize: '0.95rem',
};

const dateFilterResetButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: '#fef2f2',
    color: '#b91c1c',
    borderColor: '#fecaca',
};

const filterMenuContainerStyle = {
    marginTop: '12px',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
};

const filterMenuHeaderStyle = {
    fontWeight: 700,
    fontSize: '1rem',
    color: '#111827',
};

const filterSectionsWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
};

const filterSectionStyle = {
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '12px 14px',
    backgroundColor: '#f9fafb',
};

const filterSectionHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    fontWeight: 600,
    color: '#1f2937',
};

const filterFieldGroupStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '12px',
};

const filterFieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
};

const filterFieldLabelStyle = {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#374151',
};

const filterToggleRowStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
};

const filterToggleButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: '#f5f7ff',
    color: '#1d4ed8',
    borderColor: '#bfdbfe',
};

const filterToggleButtonActiveStyle = {
    ...filterToggleButtonStyle,
    backgroundColor: '#1d4ed8',
    color: '#fff',
    borderColor: '#1e40af',
};

const filterSubMenuStyle = {
    marginTop: '12px',
    border: '1px solid #e0e7ff',
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
};

const filterSubGroupStyle = {
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    backgroundColor: '#fff',
    overflow: 'hidden',
};

const filterSubGroupButtonStyle = {
    width: '100%',
    textAlign: 'left',
    backgroundColor: '#fff',
    border: 'none',
    padding: '10px 12px',
    fontWeight: 600,
    fontSize: '0.95rem',
    color: '#111827',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

const filterSubGroupContentStyle = {
    padding: '10px 12px 14px 12px',
    borderTop: '1px solid #f1f5f9',
};

const filterSubResetRowStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '4px',
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

const validationMessageStyle = {
    color: '#dc3545',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: '10px',
};

const csvUploadSectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '15px',
    border: '1px dashed #ced4da',
    borderRadius: '6px',
    backgroundColor: '#fdfdfd',
};

const csvStatusTextStyle = {
    fontSize: '0.9rem',
    color: '#0056b3',
    fontWeight: 'bold',
};

const formSectionStyle = {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 5px rgba(0,0,0,0.05)',
};

const formGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '15px',
};

const formFieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
};

const formInputStyle = {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #e6eef8',
    fontSize: '15px',
    backgroundColor: '#ffffff'
};

const formSubmitButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: '#16a34a',
    color: 'white',
    marginTop: '15px',
    minWidth: '180px',
};

const selectionBarStyle = {
    position: 'fixed',
    left: 16,
    right: 16,
    bottom: 16,
    background: 'white',
    borderRadius: '10px',
    border: '1px solid #eef3fb',
    padding: '12px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    zIndex: 9000,
    boxShadow: '0 6px 20px rgba(31,45,61,0.06)'
};

const checkboxStyle = { width: '18px', height: '18px', cursor: 'pointer' };

const formStatusStyle = {
    marginTop: '10px',
    fontWeight: 'bold',
};

const errorTextStyle = {
    color: '#dc3545',
    fontSize: '0.85rem',
};

const addStudentButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: '#17a2b8',
    color: 'white',
};

// 🔹 NEW: Modal styles
const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
};

const modalContentStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '26px',
    maxWidth: '900px',
    width: '95%',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
};

const modalCloseButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    border: 'none',
    background: 'transparent',
    fontSize: '20px',
    cursor: 'pointer',
};

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function Checking() {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    const [searchInput, setSearchInput] = useState('');
    const [results, setResults] = useState([]);
    const [activeSearchType, setActiveSearchType] = useState('phone');
    const [filterStatus, setFilterStatus] = useState('All');
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [copiedEmailIndex, setCopiedEmailIndex] = useState(null);
    const [validationMessage, setValidationMessage] = useState('');
    const [csvPhoneNumbers, setCsvPhoneNumbers] = useState([]);
    const [csvStatusMessage, setCsvStatusMessage] = useState('');
    const [isCsvProcessing, setIsCsvProcessing] = useState(false);
    const [csvFileName, setCsvFileName] = useState(''); 
    const [formData, setFormData] = useState({
        id: '',
        createdAt: '',
        firstName: '',
        lastName: '',
        email: '',
        alternateEmail: '',
        phone: '',
        alternatePhone: '',
        courseFee: '',
        location: '',
        emailCount: '',
        courseType: '',
        date: '',
        coursePlan: '',
        coursesTaken: '',
        salesAgent: '',
        courseType1: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [formStatus, setFormStatus] = useState({ type: '', message: '' });
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);
    // Email selection + sending state
    const [selectedEmails, setSelectedEmails] = useState(new Set());
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const [emailAttachments, setEmailAttachments] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [emailSendStatus, setEmailSendStatus] = useState({ type: '', text: '' });
    const [sendResults, setSendResults] = useState([]);
    const [isResultsModalVisible, setIsResultsModalVisible] = useState(false);
    const [isDebugModalVisible, setIsDebugModalVisible] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [debugResults, setDebugResults] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [isDebugging, setIsDebugging] = useState(false);
    const [joiningDateFilters, setJoiningDateFilters] = useState({ day: '', month: '', year: '' });
    const [courseFilters, setCourseFilters] = useState({ coursePlan: '', location: '', courseType1: '', courseType: '' });
    const [expandedFilterMenu, setExpandedFilterMenu] = useState('');
    const [expandedSubmenus, setExpandedSubmenus] = useState({ joining: '', course: '' });

    useEffect(() => {
        async function checkSession() {
            const { data: { session } } = await supabase.auth.getSession();
            
            console.log(session);
            if (!session) {
                setIsAuthenticated(false);
            } else {
                setIsAuthenticated(true);
            }
        }
        checkSession();
    }, []);

    if (!isAuthenticated) {
        return (
            <div style={containerStyle}>
                <h2 style={headerStyle}>Please log in to Microdegree Checking</h2>
                <p style={{ textAlign: 'center', color: '#666' }}>
                    For local development, redirect disabled.
                </p>
            </div>
        );
    }

    const normalizePhoneNumber = (num) => {
        let cleanedNum = num.replace(/[^0-9+]/g, '');
        if (cleanedNum.startsWith('+')) {
            let numWithoutPlus = cleanedNum.substring(1);
            if (numWithoutPlus.startsWith('91') && numWithoutPlus.length === 12) {
                return numWithoutPlus.substring(2);
            }
            if (numWithoutPlus.startsWith('1') && numWithoutPlus.length === 11) {
                return numWithoutPlus.substring(1);
            }
            return numWithoutPlus;
        }
        if (cleanedNum.startsWith('0') && cleanedNum.length === 11) {
            cleanedNum = cleanedNum.substring(1);
        } else if (cleanedNum.startsWith('91') && cleanedNum.length === 12) {
            cleanedNum = cleanedNum.substring(2);
        } else if (cleanedNum.startsWith('1') && cleanedNum.length === 11) {
            cleanedNum = cleanedNum.substring(1);
        }
        return cleanedNum.length === 10 ? cleanedNum : cleanedNum;
    };

    const isValidPhoneSearchValue = (value) => {
        if (!value) return false;
        const digitsOnly = value.replace(/\D/g, '');
        return digitsOnly.length >= 10;
    };

    const toComparableString = (value) => (value ?? '').toString();

    const stripToDigits = (value) => toComparableString(value).replace(/\D/g, '');

    const buildPhoneKey = (value) => {
        const strValue = toComparableString(value).trim();
        if (!strValue) return 'no-phone';
        const normalized = normalizePhoneNumber(strValue);
        if (normalized) return normalized;
        const digits = stripToDigits(strValue);
        return digits || 'no-phone';
    };

    // Lightweight CSV row parser that respects quoted values and double-quotes
    const parseCsvRow = (row) => {
        const cells = [];
        let current = '';
        let insideQuotes = false;
        for (let i = 0; i < row.length; i++) {
            const char = row[i];
            if (char === '"') {
                if (insideQuotes && row[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    insideQuotes = !insideQuotes;
                }
            } else if (char === ',' && !insideQuotes) {
                cells.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        cells.push(current);
        return cells;
    };

    // Return an array of unique, cleaned phone numbers from primary and alternate inputs
    const getUniquePhoneNumbers = (phone1, phone2) => {
        const seen = new Set();
        const out = [];
        const addIfValid = (p) => {
            if (!p && p !== 0) return;
            const cleaned = (p || '').toString().replace(/[^0-9+]/g, '');
            if (!cleaned) return;
            // Normalize using existing helper
            const normalized = normalizePhoneNumber(cleaned) || stripToDigits(cleaned);
            if (!normalized) return;
            const key = normalized;
            if (!seen.has(key)) {
                seen.add(key);
                out.push(normalized);
            }
        };

        addIfValid(phone1);
        addIfValid(phone2);
        return out;
    };

    // Create a stable, safe ID for results to help React keying and deduplication
    const createResultId = (type, value, suffix) => {
        const t = (type || 'val').toString();
        const v = (value || '').toString();
        const s = (suffix || '').toString();
        // sanitize: replace whitespace with underscore and drop weird chars
        const cleanV = v.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
        const cleanT = t.trim().replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
        const cleanS = s.trim().replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
        return `${cleanT}::${cleanV || 'empty'}::${cleanS || 'x'}`;
    };

    const extractPhoneNumbersFromText = (text) => {
        const rows = text.split(/\r?\n/);
        const headerRow = parseCsvRow(rows[0]);
        const phoneIndexes = headerRow
            .map((h, i) => (/phone/i.test(h) ? i : -1))
            .filter(i => i !== -1);
        const seen = new Set();
        const extracted = [];
        rows.forEach((row, index) => {
            if (!row.trim()) return;
            const cells = parseCsvRow(row);
            const targets =
                phoneIndexes.length > 0 && index > 0
                    ? phoneIndexes.map(i => cells[i] || '')
                    : cells;
            targets.forEach(v => {
                const cleaned = v.replace(/[^0-9+]/g, '');
                if (isValidPhoneSearchValue(cleaned)) {
                    const key = buildPhoneKey(cleaned);
                    if (!seen.has(key)) {
                        seen.add(key);
                        extracted.push(cleaned);
                    }
                }
            });
        });
        return extracted;
    };

    const extractJoiningDateParts = (value) => {
        if (value === null || value === undefined) return null;
        const normalized = value.toString().trim();
        if (!normalized) return null;
        const isoMatch = normalized.match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})/);
        if (isoMatch) {
            return {
                year: Number(isoMatch[1]),
                month: Number(isoMatch[2]),
                day: Number(isoMatch[3]),
            };
        }
        const parsed = new Date(normalized);
        if (!Number.isNaN(parsed.getTime())) {
            return {
                year: parsed.getFullYear(),
                month: parsed.getMonth() + 1,
                day: parsed.getDate(),
            };
        }
        return null;
    };

    const buildJoiningDateMeta = (value) => {
        const raw = (value || '').toString().trim();
        const parts = extractJoiningDateParts(raw);
        const display = parts
            ? `${String(parts.day).padStart(2, '0')}-${String(parts.month).padStart(2, '0')}-${parts.year}`
            : (raw || 'N/A');
        return { raw, display, parts };
    };

    const computeJoiningDateOptions = (items) => {
        const daySet = new Set();
        const monthSet = new Set();
        const yearSet = new Set();
        items.forEach(item => {
            const parts = item?.joiningDateParts;
            if (!parts) return;
            if (parts.day) daySet.add(parts.day);
            if (parts.month) monthSet.add(parts.month);
            if (parts.year) yearSet.add(parts.year);
        });
        const sortNumeric = (list) => Array.from(list).sort((a, b) => a - b);
        return {
            days: sortNumeric(daySet),
            months: sortNumeric(monthSet),
            years: sortNumeric(yearSet),
        };
    };

    const computeCourseFilterOptions = (items) => {
        const planSet = new Set();
        const locationSet = new Set();
        const courseTypeSet = new Set();
        const courseType1Set = new Set();
        items.forEach(item => {
            if (item.coursePlan) planSet.add(item.coursePlan);
            if (item.location) locationSet.add(item.location);
            if (item.courseType) courseTypeSet.add(item.courseType);
            if (item.courseType1) courseType1Set.add(item.courseType1);
        });
        const sortAlpha = (set) => Array.from(set).sort((a, b) => a.localeCompare(b));
        return {
            plans: sortAlpha(planSet),
            locations: sortAlpha(locationSet),
            courseTypes: sortAlpha(courseTypeSet),
            courseType1Values: sortAlpha(courseType1Set),
        };
    };

    const formatCountMessage = (count) => {
        if (count === 0) {
            return 'No phone numbers detected in the uploaded CSV.';
        }
        if (count === 1) {
            return 'Extracted 1 unique phone number from the CSV.';
        }
        return `Extracted ${count} unique phone numbers from the CSV.`;
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.firstName.trim()) {
            errors.firstName = 'First name is required';
        }
        if (!formData.lastName.trim()) {
            errors.lastName = 'Last name is required';
        }
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            errors.email = 'Enter a valid email';
        }
        if (!formData.phone.trim()) {
            errors.phone = 'Primary phone is required';
        } else if (!isValidPhoneSearchValue(formData.phone.trim())) {
            errors.phone = 'Enter a valid phone number (min 10 digits)';
        }
        if (formData.alternateEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.alternateEmail.trim())) {
            errors.alternateEmail = 'Enter a valid alternate email';
        }
        if (formData.alternatePhone.trim() && !isValidPhoneSearchValue(formData.alternatePhone.trim())) {
            errors.alternatePhone = 'Enter a valid alternate phone (min 10 digits)';
        }
        if (formData.courseFee.trim() && isNaN(Number(formData.courseFee))) {
            errors.courseFee = 'Course fee must be a number';
        }
        return errors;
    };

    const handleFormInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        setFormErrors(prev => ({
            ...prev,
            [name]: '',
        }));
        setFormStatus({ type: '', message: '' });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            setFormStatus({ type: 'error', message: 'Please fix the highlighted errors.' });
            return;
        }

        setIsFormSubmitting(true);
        setFormStatus({ type: '', message: '' });

        const payload = {
            // id and created_at are NOT sent so Supabase can auto-generate them
            first_name: formData.firstName.trim(),
            last_name: formData.lastName.trim(),
            email: formData.email.trim(),
            alternate_email: formData.alternateEmail.trim() || null,
            phone: formData.phone.trim(),
            alternate_phone: formData.alternatePhone.trim() || null,
            course_fee: formData.courseFee.trim() ? Number(formData.courseFee.trim()) : null,
            location: formData.location.trim() || null,
            course_type: formData.courseType.trim() || null,
            date: formData.date.trim() || null,
            course_plan: formData.coursePlan.trim() || null,
            courses_taken: formData.coursesTaken.trim() || null,
            course_type_1: formData.courseType1.trim() || null,
            sales_agent: formData.salesAgent.trim() || null,
        };

        const { error } = await supabase.from('students_enrolled_all').insert([payload]);

        if (error) {
            console.error('Failed to insert student:', error);
            setFormStatus({ type: 'error', message: 'Unable to save student. Please try again.' });
        } else {
            setFormStatus({ type: 'success', message: 'Student saved successfully.' });
            setFormData({
                id: '',
                createdAt: '',
                firstName: '',
                lastName: '',
                email: '',
                alternateEmail: '',
                phone: '',
                alternatePhone: '',
                courseFee: '',
                location: '',
                pending: '',
                courseType: '',
                date: '',
                leadSource: '',
                salesAgent: '',
                leadCampaign: '',
                coursePlan: '',
                coursesTaken: '',
                courseType1: '',
            });
            setFormErrors({});
        }

        setIsFormSubmitting(false);
    };

    const performSingleSearch = async (value, type) => {
        let query = supabase
            .from('students_enrolled_all')
            .select('first_name, last_name, course_fee, course_type, course_type_1, course_plan, location, date, email, alternate_email, phone, alternate_phone');

        if (type === 'email') {
            query = query.or(`email.eq.${value},alternate_email.eq.${value}`);
        } else if (type === 'phone') {
            let searchConditions = new Set();
            const originalCleanedValue = value.replace(/[^0-9+]/g, '');

            if (originalCleanedValue) {
                searchConditions.add(`phone.eq.${originalCleanedValue}`);
                searchConditions.add(`alternate_phone.eq.${originalCleanedValue}`);
            }

            const normalizedCoreNumber = normalizePhoneNumber(value);

            if (normalizedCoreNumber.length === 10) {
                searchConditions.add(`phone.eq.${normalizedCoreNumber}`);
                searchConditions.add(`alternate_phone.eq.${normalizedCoreNumber}`);

                searchConditions.add(`phone.eq.${'+1' + normalizedCoreNumber}`);
                searchConditions.add(`alternate_phone.eq.${'+1' + normalizedCoreNumber}`);

                searchConditions.add(`phone.eq.${'1' + normalizedCoreNumber}`);
                searchConditions.add(`alternate_phone.eq.${'1' + normalizedCoreNumber}`);

                searchConditions.add(`phone.eq.${'+91' + normalizedCoreNumber}`);
                searchConditions.add(`alternate_phone.eq.${'+91' + normalizedCoreNumber}`);

                searchConditions.add(`phone.eq.${'91' + normalizedCoreNumber}`);
                searchConditions.add(`alternate_phone.eq.${'91' + normalizedCoreNumber}`);

                searchConditions.add(`phone.eq.${'0' + normalizedCoreNumber}`);
                searchConditions.add(`alternate_phone.eq.${'0' + normalizedCoreNumber}`);
            }

            const finalConditions = [...searchConditions].filter(c => c.length > 0);

            if (finalConditions.length > 0) {
                query = query.or(finalConditions.join(','));
            } else {
                return { value, type, data: [], error: null };
            }
        }

        const { data, error } = await query;
        return { value, type, data, error };
    };

    

    const parseInputValues = (inputText) => {
        if (!inputText) {
            return [];
        }
        return inputText
            .split(/[\s,;|]+/)
            .map(v => v.trim())
            .filter(v => v !== '');
    };

    const handleSearch = async (type, inputOverride) => {
        // Reset previous results and selections before a new search
        setResults([]);
        setActiveSearchType(type);
        setFilterStatus('All');
        setCopiedIndex(null);
        setCopiedEmailIndex(null);
        setSelectedEmails(new Set());

        const inputToUse = typeof inputOverride === 'string' ? inputOverride : searchInput;
        const valuesToSearch = Array.isArray(inputOverride) ? inputOverride : parseInputValues(inputToUse);

        // Debug: show what values we're searching for (non-invasive)
        try {
            console.debug('handleSearch start', { type, valuesToSearch });
        } catch (e) {
            // ignore during SSR or restricted consoles
        }

        if (valuesToSearch.length === 0) {
            setValidationMessage('Please enter at least one value before searching.');
            return;
        }

        if (type === 'phone') {
            const validPhoneValues = valuesToSearch.filter(isValidPhoneSearchValue);
            if (validPhoneValues.length === 0) {
                setValidationMessage('Please enter at least one valid phone number (min 10 digits).');
                setResults([]);
                return;
            }
        }

        setValidationMessage('');

        if (type === 'phone') {
            const seenPhoneEntries = new Set();
            let allProcessedResults = [];

            for (const value of valuesToSearch) {
                const { data, error } = await performSingleSearch(value, type);
                try {
                    console.debug('performSingleSearch result', { value, error: error ? true : false, dataLength: Array.isArray(data) ? data.length : 0 });
                } catch (e) {}

                if (error) {
                    allProcessedResults.push({
                        id: createResultId(type, value, 'error'),
                        value: value,
                        fullName: 'Error fetching data',
                        courseFees: 'Error',
                        microdegreeStudentStatus: 'Not a student',
                        foundEmail: 'Error',
                        foundPhone: 'Error',
                        courseType: 'N/A',
                        courseType1: '',
                        coursePlan: 'N/A',
                        location: 'N/A',
                        joiningDate: '',
                        joiningDateDisplay: 'N/A',
                        joiningDateParts: null,
                    });
                } else if (data && data.length > 0) {
                    data.forEach(foundItem => {
                        const fullName = `${foundItem.first_name || ''} ${foundItem.last_name || ''}`.trim();
                        const courseFees = foundItem.course_fee !== null ? foundItem.course_fee : 'N/A';
                        const primaryEmail = foundItem.email || foundItem.alternate_email || 'N/A';
                        const courseType = foundItem.course_type || '';
                        const courseType1 = foundItem.course_type_1 || '';
                        const coursePlan = foundItem.course_plan || '';
                        const location = foundItem.location || '';
                        const joiningDateMeta = buildJoiningDateMeta(foundItem.date);
                        const baseResult = {
                            value: value,
                            fullName: fullName || 'N/A',
                            courseFees: courseFees,
                            microdegreeStudentStatus: 'Yes student found',
                            foundEmail: primaryEmail,
                            courseType,
                            courseType1,
                            coursePlan: coursePlan || 'N/A',
                            location: location || 'N/A',
                            joiningDate: joiningDateMeta.raw,
                            joiningDateDisplay: joiningDateMeta.display,
                            joiningDateParts: joiningDateMeta.parts,
                        };

                        const uniquePhones = getUniquePhoneNumbers(foundItem.phone, foundItem.alternate_phone);
                        const identifierParts = [
                            (primaryEmail || '').toLowerCase(),
                            (foundItem.first_name || '').toLowerCase(),
                            (foundItem.last_name || '').toLowerCase()
                        ];
                        const studentIdentifier = identifierParts.join('::') || 'student';

                        if (uniquePhones.length === 0) {
                            const dedupKey = `${studentIdentifier}::no-phone`;
                            if (!seenPhoneEntries.has(dedupKey)) {
                                seenPhoneEntries.add(dedupKey);
                                allProcessedResults.push({
                                    ...baseResult,
                                    id: createResultId(type, value, 'no-phone'),
                                    foundPhone: 'N/A'
                                });
                            }
                            return;
                        }

                        uniquePhones.forEach(phoneNumber => {
                            const phoneKey = buildPhoneKey(phoneNumber);
                            const dedupKey = `${studentIdentifier}::${phoneKey}`;
                            if (!seenPhoneEntries.has(dedupKey)) {
                                seenPhoneEntries.add(dedupKey);
                                allProcessedResults.push({
                                    ...baseResult,
                                    id: createResultId(type, value, phoneKey || 'phone'),
                                    foundPhone: phoneNumber
                                });
                            }
                        });
                    });
                } else {
                    allProcessedResults.push({
                        id: createResultId(type, value, 'not-found'),
                        value: value,
                        fullName: 'Not Found',
                        courseFees: 'Not Found',
                        microdegreeStudentStatus: 'Not a student',
                        foundEmail: 'Not Found',
                        foundPhone: 'Not Found',
                        courseType: 'N/A',
                        courseType1: '',
                        coursePlan: 'N/A',
                        location: 'N/A',
                        joiningDate: '',
                        joiningDateDisplay: 'N/A',
                        joiningDateParts: null,
                    });
                }
            }

            // Deduplicate results by email + normalized phone + name
            const uniqueResults = [];
            const seenKeys = new Set();
            allProcessedResults.forEach(item => {
                const emailKey = (item.foundEmail || '').toString().toLowerCase();
                const phoneKey = buildPhoneKey(item.foundPhone || '');
                const nameKey = (item.fullName || '').toString().toLowerCase();
                const dedupeKey = `${emailKey}::${phoneKey}::${nameKey}`;
                if (!seenKeys.has(dedupeKey)) {
                    seenKeys.add(dedupeKey);
                    uniqueResults.push(item);
                }
            });

            setResults(uniqueResults);

            // Validation: report any searched values not found in results or CSV
            const csvKeySet = new Set((csvPhoneNumbers || []).map(p => buildPhoneKey(p || '')));
            const missingNumbers = [];
            valuesToSearch.forEach(v => {
                const key = buildPhoneKey(v || '');
                const foundInResults = uniqueResults.some(r => buildPhoneKey(r.foundPhone || '') === key || buildPhoneKey(r.value || '') === key);
                const foundInCsv = csvKeySet.has(key);
                if (!foundInResults && !foundInCsv) missingNumbers.push(v);
            });

            if (missingNumbers.length > 0) {
                const list = missingNumbers.join(', ');
                setValidationMessage(missingNumbers.length === 1 ? `Number not found: ${list}` : `Numbers not found: ${list}`);
            } else {
                setValidationMessage('');
            }

            return;
        }

        if (type === 'email') {
            const allEmailResults = [];

            for (const value of valuesToSearch) {
                const { data, error } = await performSingleSearch(value, type);
                try {
                    console.debug('performSingleSearch result (email)', { value, error: !!error, dataLength: Array.isArray(data) ? data.length : 0 });
                } catch (e) {}

                if (error) {
                    allEmailResults.push({
                        id: createResultId(type, value, 'error'),
                        value,
                        fullName: 'Error fetching data',
                        courseFees: 'Error',
                        microdegreeStudentStatus: 'Not a student',
                        foundEmail: 'Error',
                        foundPhone: 'Error',
                        courseType: 'N/A',
                        courseType1: '',
                        coursePlan: 'N/A',
                        location: 'N/A',
                        joiningDate: '',
                        joiningDateDisplay: 'N/A',
                        joiningDateParts: null,
                    });
                    continue;
                }

                if (data && data.length > 0) {
                    data.forEach(foundItem => {
                        const fullName = `${foundItem.first_name || ''} ${foundItem.last_name || ''}`.trim();
                        const courseFees = foundItem.course_fee !== null ? foundItem.course_fee : 'N/A';
                        const primaryEmail = foundItem.email || foundItem.alternate_email || 'N/A';
                        const courseType = foundItem.course_type || '';
                        const courseType1 = foundItem.course_type_1 || '';
                        const coursePlan = foundItem.course_plan || '';
                        const location = foundItem.location || '';
                        const joiningDateMeta = buildJoiningDateMeta(foundItem.date);
                        const baseResult = {
                            value,
                            fullName: fullName || 'N/A',
                            courseFees,
                            microdegreeStudentStatus: 'Yes student found',
                            foundEmail: primaryEmail,
                            courseType,
                            courseType1,
                            coursePlan: coursePlan || 'N/A',
                            location: location || 'N/A',
                            joiningDate: joiningDateMeta.raw,
                            joiningDateDisplay: joiningDateMeta.display,
                            joiningDateParts: joiningDateMeta.parts,
                        };

                        const uniquePhones = getUniquePhoneNumbers(foundItem.phone, foundItem.alternate_phone);

                        if (uniquePhones.length === 0) {
                            allEmailResults.push({
                                ...baseResult,
                                id: createResultId(type, value, 'no-phone'),
                                foundPhone: 'N/A',
                            });
                            return;
                        }

                        uniquePhones.forEach(phoneNumber => {
                            const phoneKey = buildPhoneKey(phoneNumber);
                            allEmailResults.push({
                                ...baseResult,
                                id: createResultId(type, value, phoneKey || 'phone'),
                                foundPhone: phoneNumber,
                            });
                        });
                    });
                } else {
                    allEmailResults.push({
                        id: createResultId(type, value, 'not-found'),
                        value,
                        fullName: 'Not Found',
                        courseFees: 'Not Found',
                        microdegreeStudentStatus: 'Not a student',
                        foundEmail: 'Not Found',
                        foundPhone: 'Not Found',
                        courseType: 'N/A',
                        courseType1: '',
                        coursePlan: 'N/A',
                        location: 'N/A',
                        joiningDate: '',
                        joiningDateDisplay: 'N/A',
                        joiningDateParts: null,
                    });
                }
            }

            const dedupedByEmail = [];
            const seen = new Set();
            allEmailResults.forEach(item => {
                const key = `${(item.foundEmail || '').toLowerCase()}::${buildPhoneKey(item.foundPhone || '')}::${(item.fullName || '').toLowerCase()}`;
                if (seen.has(key)) return;
                seen.add(key);
                dedupedByEmail.push(item);
            });

            setResults(dedupedByEmail);

            const missingEmails = valuesToSearch.filter(val => !dedupedByEmail.some(r => (r.value || '').toLowerCase() === (val || '').toLowerCase() && r.microdegreeStudentStatus === 'Yes student found'));
            if (missingEmails.length > 0) {
                const list = missingEmails.join(', ');
                setValidationMessage(missingEmails.length === 1 ? `Email not found: ${list}` : `Emails not found: ${list}`);
            } else {
                setValidationMessage('');
            }

            return;
        }
    };

    const handleCsvFileChange = (event) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;

        setIsCsvProcessing(true);
        setCsvStatusMessage('Processing CSV...');

        const reader = new FileReader();
        reader.onload = () => {
            try {
                const text = typeof reader.result === 'string'
                    ? reader.result
                    : new TextDecoder().decode(reader.result);

                const extractedPhones = extractPhoneNumbersFromText(text);

                setCsvPhoneNumbers(extractedPhones);
                setCsvStatusMessage(formatCountMessage(extractedPhones.length));
                if (extractedPhones.length > 0) {
                    setSearchInput(extractedPhones.join(' '));
                    setActiveSearchType('phone');
                    setValidationMessage('');
                }

            } catch (error) {
                setCsvPhoneNumbers([]);
                setCsvStatusMessage('Unable to process CSV. Try another file.');
            } finally {
                setIsCsvProcessing(false);
            }
        };

        reader.onerror = () => {
            setCsvPhoneNumbers([]);
            setCsvStatusMessage('Failed to read file.');
            setIsCsvProcessing(false);
        };

        reader.readAsText(file);
        event.target.value = '';
    };

    // Populate the search box from extracted CSV phone numbers and trigger a phone search
    // eslint-disable-next-line no-unused-vars
    const handleFetchAllFromCsv = async () => {
        if (!csvPhoneNumbers || csvPhoneNumbers.length === 0) return;
        const joined = csvPhoneNumbers.join(', ');
        setSearchInput(joined);
        setActiveSearchType('phone');
        setValidationMessage('');
        // Pass the array directly to avoid parsing/timing issues
        await handleSearch('phone', csvPhoneNumbers);
    };

    const getFilteredResults = () => {
        const statusFiltered = filterStatus === 'All'
            ? results
            : results.filter(item => item.microdegreeStudentStatus === filterStatus);

        const hasDateFilters = Boolean(joiningDateFilters.day || joiningDateFilters.month || joiningDateFilters.year);
        if (!hasDateFilters) {
            return statusFiltered;
        }

        const dateFiltered = statusFiltered.filter(item => {
            const parts = item.joiningDateParts;
            if (!parts) return false;
            if (joiningDateFilters.day && Number(joiningDateFilters.day) !== Number(parts.day)) return false;
            if (joiningDateFilters.month && Number(joiningDateFilters.month) !== Number(parts.month)) return false;
            if (joiningDateFilters.year && Number(joiningDateFilters.year) !== Number(parts.year)) return false;
            return true;
        });

        return dateFiltered;
    };

    const applyCourseFilters = (items) => {
        const hasCourseFilters = Boolean(courseFilters.coursePlan || courseFilters.location || courseFilters.courseType1 || courseFilters.courseType);
        if (!hasCourseFilters) return items;
        return items.filter(item => {
            if (courseFilters.coursePlan && item.coursePlan !== courseFilters.coursePlan) return false;
            if (courseFilters.location && item.location !== courseFilters.location) return false;
            if (courseFilters.courseType && item.courseType !== courseFilters.courseType) return false;
            if (courseFilters.courseType1 && item.courseType1 !== courseFilters.courseType1) return false;
            return true;
        });
    };

    const filteredResults = applyCourseFilters(getFilteredResults());
    const joiningDateOptions = computeJoiningDateOptions(results);
    const hasActiveJoiningFilters = Boolean(joiningDateFilters.day || joiningDateFilters.month || joiningDateFilters.year);
    const courseFilterOptions = computeCourseFilterOptions(results);
    const hasActiveCourseFilters = Boolean(courseFilters.coursePlan || courseFilters.location || courseFilters.courseType1 || courseFilters.courseType);

    const copyToClipboard = (text, index, type = 'searched') => {
        if (text === 'N/A' || text === 'Error' || text === 'Not Found') return;

        navigator.clipboard.writeText(text.trim());

        if (type === 'searched') {
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 1500);
        } else {
            setCopiedEmailIndex(index);
            setTimeout(() => setCopiedEmailIndex(null), 1500);
        }
    };

    const resetJoiningDateFilters = () => setJoiningDateFilters({ day: '', month: '', year: '' });

    const handleJoiningFilterChange = (key, value) => {
        setJoiningDateFilters(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const resetCourseFilters = () => setCourseFilters({ coursePlan: '', location: '', courseType1: '', courseType: '' });

    const handleCourseFilterChange = (key, value) => {
        setCourseFilters(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const toggleFilterMenu = (menuKey) => {
        setExpandedFilterMenu(prev => (prev === menuKey ? '' : menuKey));
        setExpandedSubmenus(prev => ({
            ...prev,
            [menuKey]: prev[menuKey] || '',
        }));
    };

    const toggleSubmenu = (groupKey, subKey) => {
        setExpandedSubmenus(prev => ({
            ...prev,
            [groupKey]: prev[groupKey] === subKey ? '' : subKey,
        }));
    };

    const resetFilterMenus = () => {
        setExpandedFilterMenu('');
        setExpandedSubmenus({ joining: '', course: '' });
    };

    const renderFilterSubsection = (groupKey, subKey, label, controls) => (
        <div style={filterSubGroupStyle}>
            <button
                type="button"
                onClick={() => toggleSubmenu(groupKey, subKey)}
                style={{
                    ...filterSubGroupButtonStyle,
                    backgroundColor: expandedSubmenus[groupKey] === subKey ? '#eef2ff' : '#fff',
                }}
            >
                <span>{label}</span>
                <span style={{ fontWeight: 700 }}>{expandedSubmenus[groupKey] === subKey ? '-' : '+'}</span>
            </button>
            {expandedSubmenus[groupKey] === subKey && (
                <div style={filterSubGroupContentStyle}>{controls}</div>
            )}
        </div>
    );

    const clearAll = () => {
        setSearchInput('');
        setResults([]);
        setActiveSearchType('phone');
        setFilterStatus('All');
        setCopiedIndex(null);
        setCopiedEmailIndex(null);
        setValidationMessage('');
        setSelectedEmails(new Set());
        resetJoiningDateFilters();
        resetCourseFilters();
        resetFilterMenus();
    };

    const toggleSelectEmail = (email) => {
        if (!email) return;
        setSelectedEmails(prev => {
            const next = new Set(prev);
            if (next.has(email)) {
                next.delete(email);
            } else {
                next.add(email);
            }
            return next;
        });
    };

    // Return an array of unique, selectable emails from the currently filtered results
    const getSelectableEmails = () => {
        const out = [];
        const seen = new Set();
        filteredResults.forEach(item => {
            const e = item.foundEmail;
            if (!e) return;
            if (e === 'N/A' || e === 'Error' || e === 'Not Found') return;
            const lower = e.toLowerCase();
            if (!seen.has(lower)) {
                seen.add(lower);
                out.push(e);
            }
        });
        return out;
    };

    const toggleSelectAll = () => {
        const selectable = getSelectableEmails();
        if (selectable.length === 0) return;
        const allSelected = selectable.every(e => selectedEmails.has(e));
        if (allSelected) {
            setSelectedEmails(new Set());
        } else {
            setSelectedEmails(new Set(selectable));
        }
    };

    const handleAttachmentChange = (event) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;

        const mapped = files.map((file) => ({
            id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
            name: file.name,
            size: file.size,
            type: file.type,
            file,
        }));

        setEmailAttachments((prev) => [...prev, ...mapped]);

        // allow re-selecting the same file(s)
        event.target.value = '';
    };

    const removeAttachment = (id) => {
        setEmailAttachments((prev) => prev.filter((att) => att.id !== id));
    };

    const sendBulkEmail = async () => {
        const emails = Array.from(selectedEmails).filter(Boolean);
        if (emails.length === 0) {
            alert('Please select at least one recipient.');
            return;
        }
        if (!emailSubject.trim() || !emailBody.trim()) {
            alert('Please provide both subject and message body.');
            return;
        }

        setIsSending(true);
        try {
            // Prepare recipients as objects with email + name (if available from results)
            const recipients = emails.map(e => {
                const found = results.find(r => (r.foundEmail || '').toLowerCase() === (e || '').toLowerCase());
                return { email: e, name: found ? found.fullName : null };
            });

            const formData = new FormData();
            formData.append('subject', emailSubject);
            formData.append('message', emailBody);
            formData.append('emails', JSON.stringify(recipients));

            emailAttachments.forEach((att) => {
                if (att.file) {
                    formData.append('attachments', att.file, att.name);
                }
            });

            const resp = await fetch('http://localhost:5000/send-bulk-email', {
                method: 'POST',
                body: formData,
            });
            let data = null;
            try {
                data = await resp.json();
            } catch (e) {
                console.warn('No JSON response from send-bulk-email', e);
            }
            // Always set results modal if backend returned per-recipient results
            if (data && Array.isArray(data.results)) {
                setSendResults(data.results);
                setIsResultsModalVisible(true);
            }

            if (resp.ok && data && data.success) {
                // show light-weight toast
                setSuccessMessage('Emails sent successfully');
                setTimeout(() => setSuccessMessage(''), 3000);
                setSelectedEmails(new Set());
                setEmailSubject('');
                setEmailBody('');
                setEmailAttachments([]);
                setIsEmailModalVisible(false);
            } else {
                console.error('Send error', { status: resp.status, data });
                const errMsg = (data && (data.error || data.message)) ? (data.error || data.message) : `Server responded ${resp.status}`;
                setEmailSendStatus({ type: 'error', text: 'Failed to send: ' + errMsg });
                // show alert but still allow user to inspect per-recipient results
                alert('Failed to send some or all emails. See details in the results window.');
            }
        } catch (err) {
            console.error('Network error', err);
            alert('Network error: ' + err.message);
        } finally {
            setIsSending(false);
        }
    };

    const selectableEmails = getSelectableEmails();
    const areAllSelectableSelected = selectableEmails.length > 0 && selectableEmails.every(e => selectedEmails.has(e));

    return (
        <div style={containerStyle}>
            <h2 style={headerStyle}>Microdegree Enrolled Student Checking</h2>

            <div style={inputSectionStyle}>
                <textarea
                    style={textareaStyle}
                    placeholder={
                        activeSearchType === 'email'
                            ? 'Enter emails space-separated'
                            : 'Enter phone numbers space-separated'
                    }
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    rows="5"
                />

                <div style={buttonGroupStyle}>
                    <button
                        onClick={() => handleSearch('phone', parseInputValues(searchInput))}
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
                    <button
                        onClick={() => setIsFormVisible(true)}
                        style={addStudentButtonStyle}
                    >
                        Add Student Details
                    </button>
                </div>

                <button onClick={clearAll} style={clearButtonStyle}>
                    Clear All
                </button>

                {validationMessage && <div style={validationMessageStyle}>{validationMessage}</div>}

                <div style={csvUploadSectionStyle}>
    <input
        type="file"
        accept=".csv"
        onChange={(event) => {
            setCsvFileName(event.target.files[0]?.name || '');
            handleCsvFileChange(event);
        }}
        disabled={isCsvProcessing}
    />

    {/* SHOW FILE NAME + SMALL RED X */}
    {csvFileName && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
            <span style={{ fontSize: '14px', color: '#333' }}>{csvFileName}</span>

            <button
                onClick={() => {
                    setCsvPhoneNumbers([]);
                    setCsvStatusMessage('');
                    setCsvFileName('');
                }}
                style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: 'red',
                }}
                title="Remove CSV"
            >
                ✖
            </button>
        </div>
    )}

    {isCsvProcessing && <span style={{ fontStyle: 'italic', color: '#6c757d' }}>Extracting...</span>}

    {!isCsvProcessing && csvStatusMessage && (
        <div style={csvStatusTextStyle}>{csvStatusMessage}</div>
    )}

    {csvPhoneNumbers.length > 0 && (
        <div style={{ fontSize: '0.9rem', color: '#333' }}>
            {csvPhoneNumbers.length} number{csvPhoneNumbers.length > 1 ? 's' : ''} detected.
        </div>
    )}
</div>

            </div>
{/* MODAL FOR ADD STUDENT */}
{isFormVisible && (
    <div style={modalOverlayStyle}>
        <div style={modalContentStyle}>
            
            {/* Main Close Button (Modal) */}
            <button
                type="button"
                style={modalCloseButtonStyle}
                onClick={() => setIsFormVisible(false)}
                aria-label="Close"
            >
                ×
            </button>

            <div style={formSectionStyle}>

                {/* Second Close Button Inside Form */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', margin: 0 }}>
    <button
        type="button"
        onClick={() => setIsFormVisible(false)}
        style={{
            background: 'transparent',
            color: 'red',
            border: 'none',
            cursor: 'pointer',
            fontSize: '22px',
            fontWeight: 'bold',
        }}
    >
        X
    </button>
</div>



                <h3 style={{ marginBottom: '15px' }}>Add Student Details</h3>

                <form onSubmit={handleFormSubmit}>
                    <div style={formGridStyle}>
                        
                        {/* Removed: ID + Created_at */}

                        <div style={formFieldStyle}>
                            <label>First Name *</label>
                            <input
                                style={formInputStyle}
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleFormInputChange}
                            />
                            {formErrors.firstName && <span style={errorTextStyle}>{formErrors.firstName}</span>}
                        </div>

                        <div style={formFieldStyle}>
                            <label>Last Name *</label>
                            <input
                                style={formInputStyle}
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleFormInputChange}
                            />
                            {formErrors.lastName && <span style={errorTextStyle}>{formErrors.lastName}</span>}
                        </div>

                        <div style={formFieldStyle}>
                            <label>Email *</label>
                            <input
                                style={formInputStyle}
                                name="email"
                                value={formData.email}
                                onChange={handleFormInputChange}
                                type="email"
                            />
                            {formErrors.email && <span style={errorTextStyle}>{formErrors.email}</span>}
                        </div>

                        <div style={formFieldStyle}>
                            <label>Alternate Email</label>
                            <input
                                style={formInputStyle}
                                name="alternateEmail"
                                value={formData.alternateEmail}
                                onChange={handleFormInputChange}
                            />
                        </div>

                        <div style={formFieldStyle}>
                            <label>Phone *</label>
                            <input
                                style={formInputStyle}
                                name="phone"
                                value={formData.phone}
                                onChange={handleFormInputChange}
                            />
                            {formErrors.phone && <span style={errorTextStyle}>{formErrors.phone}</span>}
                        </div>

                        <div style={formFieldStyle}>
                            <label>Alternate Phone</label>
                            <input
                                style={formInputStyle}
                                name="alternatePhone"
                                value={formData.alternatePhone}
                                onChange={handleFormInputChange}
                            />
                        </div>

                        <div style={formFieldStyle}>
                            <label>Course Fee</label>
                            <input
                                style={formInputStyle}
                                name="courseFee"
                                value={formData.courseFee}
                                onChange={handleFormInputChange}
                            />
                        </div>

                        {/* Extra Fields remain same */}
                        <div style={formFieldStyle}><label>Location</label><input style={formInputStyle} name="location" value={formData.location} onChange={handleFormInputChange} /></div>
                        <div style={formFieldStyle}><label>Sales Agent</label><input style={formInputStyle} name="salesAgent" value={formData.salesAgent} onChange={handleFormInputChange} /></div>
                        <div style={formFieldStyle}><label>Course</label><input style={formInputStyle} name="courseType" value={formData.courseType} onChange={handleFormInputChange} /></div>
                        <div style={formFieldStyle}>
                            <label>Date of Joining</label>
                            <input
                                style={formInputStyle}
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleFormInputChange}
                            />
                        </div>
                        <div style={formFieldStyle}>
                            <label>Course Plan</label>
                            <select
                                style={formInputStyle}
                                name="coursePlan"
                                value={formData.coursePlan}
                                onChange={handleFormInputChange}
                            >
                                <option value="">Select plan</option>
                                <option value="Gold">Gold</option>
                                <option value="Diamond">Diamond</option>
                                <option value="Diamond Plus">Diamond Plus</option>
                                <option value="Platinum">Platinum</option>
                                <option value="Titanium">Titanium</option>
                                <option value="Titanium Plus">Titanium Plus</option>
                            </select>
                        </div>
                        <div style={formFieldStyle}><label>Courses Taken</label><input style={formInputStyle} name="coursesTaken" value={formData.coursesTaken} onChange={handleFormInputChange} /></div>
                        <div style={formFieldStyle}>
                            <label>Course Type</label>
                            <select
                                style={formInputStyle}
                                name="courseType1"
                                value={formData.courseType1}
                                onChange={handleFormInputChange}
                            >
                                <option value="">Select type</option>
                                <option value="Live">Live</option>
                                <option value="Recorded">Recorded</option>
                            </select>
                        </div>

                    </div>

                    <button type="submit" style={formSubmitButtonStyle} disabled={isFormSubmitting}>
                        {isFormSubmitting ? 'Saving…' : 'Save Student'}
                    </button>

                    {formStatus.message && (
                        <div style={{ ...formStatusStyle, color: formStatus.type === 'success' ? '#28a745' : '#dc3545' }}>
                            {formStatus.message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    </div>
)}


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

            {results.length > 0 && (
                <div style={filterMenuContainerStyle}>
                    <div style={filterMenuHeaderStyle}>Filters</div>
                    <div style={filterToggleRowStyle}>
                        <button
                            type="button"
                            style={expandedFilterMenu === 'joining' ? filterToggleButtonActiveStyle : filterToggleButtonStyle}
                            onClick={() => toggleFilterMenu('joining')}
                        >
                            Joining Date
                        </button>
                        <button
                            type="button"
                            style={expandedFilterMenu === 'course' ? filterToggleButtonActiveStyle : filterToggleButtonStyle}
                            onClick={() => toggleFilterMenu('course')}
                        >
                            Course Details
                        </button>
                    </div>

                    {expandedFilterMenu === 'joining' && (
                        <div style={filterSubMenuStyle}>
                            {renderFilterSubsection(
                                'joining',
                                'day',
                                'Day',
                                <select
                                    value={joiningDateFilters.day}
                                    onChange={(e) => handleJoiningFilterChange('day', e.target.value)}
                                    style={dateFilterSelectStyle}
                                >
                                    <option value="">Any</option>
                                    {joiningDateOptions.days.map((day) => (
                                        <option key={day} value={day}>
                                            {String(day).padStart(2, '0')}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {renderFilterSubsection(
                                'joining',
                                'month',
                                'Month',
                                <select
                                    value={joiningDateFilters.month}
                                    onChange={(e) => handleJoiningFilterChange('month', e.target.value)}
                                    style={dateFilterSelectStyle}
                                >
                                    <option value="">Any</option>
                                    {joiningDateOptions.months.map((month) => (
                                        <option key={month} value={month}>
                                            {monthLabels[month - 1] || 'Month'}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {renderFilterSubsection(
                                'joining',
                                'year',
                                'Year',
                                <select
                                    value={joiningDateFilters.year}
                                    onChange={(e) => handleJoiningFilterChange('year', e.target.value)}
                                    style={dateFilterSelectStyle}
                                >
                                    <option value="">Any</option>
                                    {joiningDateOptions.years.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            )}

                            <div style={filterSubResetRowStyle}>
                                <button
                                    type="button"
                                    onClick={resetJoiningDateFilters}
                                    style={{
                                        ...dateFilterResetButtonStyle,
                                        opacity: hasActiveJoiningFilters ? 1 : 0.6,
                                        cursor: hasActiveJoiningFilters ? 'pointer' : 'not-allowed'
                                    }}
                                    disabled={!hasActiveJoiningFilters}
                                >
                                    Reset Joining Filters
                                </button>
                            </div>
                        </div>
                    )}

                    {expandedFilterMenu === 'course' && (
                        <div style={filterSubMenuStyle}>
                            {renderFilterSubsection(
                                'course',
                                'coursePlan',
                                'Course Plan',
                                <select
                                    value={courseFilters.coursePlan}
                                    onChange={(e) => handleCourseFilterChange('coursePlan', e.target.value)}
                                    style={dateFilterSelectStyle}
                                >
                                    <option value="">Any</option>
                                    {courseFilterOptions.plans.map((plan) => (
                                        <option key={plan} value={plan}>
                                            {plan}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {renderFilterSubsection(
                                'course',
                                'location',
                                'Location',
                                <select
                                    value={courseFilters.location}
                                    onChange={(e) => handleCourseFilterChange('location', e.target.value)}
                                    style={dateFilterSelectStyle}
                                >
                                    <option value="">Any</option>
                                    {courseFilterOptions.locations.map((loc) => (
                                        <option key={loc} value={loc}>
                                            {loc}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {renderFilterSubsection(
                                'course',
                                'courseType',
                                'Course Type',
                                <select
                                    value={courseFilters.courseType}
                                    onChange={(e) => handleCourseFilterChange('courseType', e.target.value)}
                                    style={dateFilterSelectStyle}
                                >
                                    <option value="">Any</option>
                                    {courseFilterOptions.courseTypes.map((value) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {renderFilterSubsection(
                                'course',
                                'courseType1',
                                'Course Type 1',
                                <select
                                    value={courseFilters.courseType1}
                                    onChange={(e) => handleCourseFilterChange('courseType1', e.target.value)}
                                    style={dateFilterSelectStyle}
                                >
                                    <option value="">Any</option>
                                    {(courseFilterOptions.courseType1Values.length > 0
                                        ? courseFilterOptions.courseType1Values
                                        : ['Live', 'Recorded'])
                                        .map((value) => (
                                            <option key={value} value={value}>
                                                {value}
                                            </option>
                                        ))}
                                </select>
                            )}

                            <div style={filterSubResetRowStyle}>
                                <button
                                    type="button"
                                    onClick={resetCourseFilters}
                                    style={{
                                        ...dateFilterResetButtonStyle,
                                        opacity: hasActiveCourseFilters ? 1 : 0.6,
                                        cursor: hasActiveCourseFilters ? 'pointer' : 'not-allowed'
                                    }}
                                    disabled={!hasActiveCourseFilters}
                                >
                                    Reset Course Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Bottom selection bar + Email modal: appears when at least one recipient selected */}
            {results.length > 0 && selectedEmails.size > 0 && (
                <div style={selectionBarStyle}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{selectedEmails.size} selected</div>
                    <div style={{ color: '#64748b' }}>Select recipients for bulk email</div>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
                            <button
                            onClick={() => setSelectedEmails(new Set())}
                            style={{ ...inactiveButtonStyle }}
                        >
                            Clear
                        </button>
                        <button
                            onClick={() => setIsEmailModalVisible(true)}
                            style={{ ...activeButtonStyle }}
                        >
                            Send ({selectedEmails.size})
                        </button>
                    </div>
                </div>
            )}

            {/* Email Modal */}
            {isEmailModalVisible && (
                <div style={modalOverlayStyle}>
                    <div style={{ ...modalContentStyle, maxWidth: '720px' }}>
                        <button
                            type="button"
                            style={modalCloseButtonStyle}
                            onClick={() => setIsEmailModalVisible(false)}
                            aria-label="Close"
                        >
                            ×
                        </button>

                        <h3 style={{ marginTop: 0 }}>Send Email to Selected ({selectedEmails.size})</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <input
                                placeholder="Subject"
                                value={emailSubject}
                                onChange={(e) => setEmailSubject(e.target.value)}
                                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                            />

                            <textarea
                                placeholder="Message (HTML allowed)"
                                value={emailBody}
                                onChange={(e) => setEmailBody(e.target.value)}
                                rows={8}
                                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                            />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Attachments</label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleAttachmentChange}
                                />
                                {emailAttachments.length > 0 && (
                                    <div style={{ fontSize: '0.85rem', color: '#374151' }}>
                                        {emailAttachments.map((att) => (
                                            <div
                                                key={att.id}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '4px 0',
                                                    borderBottom: '1px solid #f3f4f6',
                                                }}
                                            >
                                                <span>
                                                    {att.name}{' '}
                                                    <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                                                        ({Math.round(att.size / 1024)} KB)
                                                    </span>
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeAttachment(att.id)}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: '#b91c1c',
                                                        cursor: 'pointer',
                                                        fontSize: '0.85rem',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {emailSendStatus.text && (
                                <div style={{ color: emailSendStatus.type === 'error' ? '#dc3545' : '#28a745', fontWeight: 'bold' }}>
                                    {emailSendStatus.text}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => setIsEmailModalVisible(false)}
                                    style={{ ...baseButtonStyle, backgroundColor: '#f8f9fa', color: '#333' }}
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={sendBulkEmail}
                                    disabled={isSending || selectedEmails.size === 0 || !emailSubject.trim() || !emailBody.trim()}
                                    style={{ ...formSubmitButtonStyle }}
                                >
                                    {isSending ? 'Sending…' : 'Send'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Small toast for success */}
            {successMessage && (
                <div style={{ position: 'fixed', right: '16px', top: '16px', background: '#28a745', color: 'white', padding: '10px 14px', borderRadius: '6px', zIndex: 10000 }}>
                    {successMessage}
                </div>
            )}

            {/* Results modal: shows per-recipient send status returned by backend */}
            {isResultsModalVisible && (
                <div style={modalOverlayStyle}>
                    <div style={{ ...modalContentStyle, maxWidth: '720px' }}>
                        <button
                            type="button"
                            style={modalCloseButtonStyle}
                            onClick={() => setIsResultsModalVisible(false)}
                            aria-label="Close"
                        >
                            ×
                        </button>

                        <h3 style={{ marginTop: 0 }}>Email send results</h3>

                        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                            {sendResults.length === 0 && <div>No send results available.</div>}
                            {sendResults.map((r, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 6px', borderBottom: '1px solid #eee' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{r.to}</div>
                                        <div style={{ fontSize: '0.9rem', color: r.success ? '#28a745' : '#dc3545' }}>
                                            {r.success ? 'Delivered' : `Failed: ${r.error || 'unknown error'}`}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#666', marginLeft: '12px' }}>{r.messageId ? r.messageId : ''}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                            <button onClick={() => setIsResultsModalVisible(false)} style={{ ...baseButtonStyle, backgroundColor: '#007bff', color: 'white' }}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {isDebugModalVisible && (
                <div style={modalOverlayStyle}>
                    <div style={{ ...modalContentStyle, maxWidth: '720px' }}>
                        <button
                            type="button"
                            style={modalCloseButtonStyle}
                            onClick={() => setIsDebugModalVisible(false)}
                            aria-label="Close"
                        >
                            ×
                        </button>

                        <h3 style={{ marginTop: 0 }}>Debug Fetch Preview</h3>

                        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                            {isDebugging && <div>Running preview…</div>}
                            {!isDebugging && debugResults.length === 0 && <div>No debug results yet. Click Debug Fetch.</div>}
                            {debugResults.map((r, idx) => (
                                <div key={idx} style={{ padding: '8px 6px', borderBottom: '1px solid #eee' }}>
                                    <div style={{ fontWeight: 'bold' }}>{r.value}</div>
                                    <div style={{ fontSize: '0.9rem', color: r.error ? '#dc3545' : '#28a745' }}>
                                        {r.error ? `Error` : `${r.count} records matched`}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                            <button onClick={() => setIsDebugModalVisible(false)} style={{ ...baseButtonStyle, backgroundColor: '#007bff', color: 'white' }}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {filteredResults.length > 0 && (
                <div style={tableContainerStyle}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={{ ...thStyle, textAlign: 'center' }}>
                                    <input
                                        type="checkbox"
                                        checked={areAllSelectableSelected}
                                        onChange={toggleSelectAll}
                                        title="Select all visible"
                                        style={checkboxStyle}
                                    />
                                </th>
                                <th style={thStyle}>Searched Value</th>
                                <th style={thStyle}>Full Name</th>
                                <th style={thStyle}>Course Fees</th>
                                <th style={thStyle}>Course Type</th>
                                <th style={thStyle}>Course Type 1</th>
                                <th style={thStyle}>Course Plan</th>
                                <th style={thStyle}>Location</th>
                                <th style={thStyle}>Date of Joining</th>
                                <th style={thStyle}>Microdegree Student</th>
                                {activeSearchType === 'phone' && <th style={thStyle}>Email</th>}
                                {activeSearchType === 'email' && <th style={thStyle}>Contact No.</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredResults.map((item, index) => (
                                <tr key={item.id || index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#fbfbfb' }}>
                                    <td style={tdStyle}>
                                        { /* Checkbox for selecting recipient (only when email is available) */ }
                                        {item.foundEmail && item.foundEmail !== 'N/A' && item.foundEmail !== 'Error' && item.foundEmail !== 'Not Found' ? (
                                                <input
                                                    type="checkbox"
                                                    checked={selectedEmails.has(item.foundEmail)}
                                                    onChange={() => toggleSelectEmail(item.foundEmail)}
                                                    title={`Select ${item.foundEmail}`}
                                                    style={checkboxStyle}
                                                />
                                        ) : (
                                            <input type="checkbox" disabled title="No valid email" style={{ ...checkboxStyle, opacity: 0.45 }} />
                                        )}
                                    </td>
                                    <td style={tdStyle}>
                                        {item.value}
                                        {item.value !== 'N/A' && item.value !== 'Error' && item.value !== 'Not Found' && (
                                            <button
                                                onClick={() => copyToClipboard(item.value, index, 'searched')}
                                                style={copyButtonStyle}
                                            >
                                                <FontAwesomeIcon icon={faCopy} style={{ color: 'black', fontSize: '1.2em' }} />
                                            </button>
                                        )}
                                        {copiedIndex === index && <span style={copiedMessageStyle}>Copied!</span>}
                                    </td>

                                    <td style={tdStyle}>{item.fullName}</td>
                                    <td style={tdStyle}>{item.courseFees}</td>

                                    <td style={tdStyle}>
                                        {item.courseType || 'N/A'}
                                    </td>

                                    <td style={tdStyle}>
                                        {item.courseType1 || 'N/A'}
                                    </td>

                                    <td style={tdStyle}>
                                        {item.coursePlan || 'N/A'}
                                    </td>

                                    <td style={tdStyle}>
                                        {item.location || 'N/A'}
                                    </td>

                                    <td style={tdStyle}>
                                        {item.joiningDateDisplay || 'N/A'}
                                    </td>

                                    <td style={{
                                        ...tdStyle,
                                        fontWeight: 'bold',
                                        color: item.microdegreeStudentStatus === 'Yes student found' ? 'green' : 'red'
                                    }}>
                                        {item.microdegreeStudentStatus}
                                    </td>

                                    {activeSearchType === 'phone' && (
                                        <td style={tdStyle}>
                                            {item.foundEmail}
                                            {item.foundEmail !== 'N/A' && item.foundEmail !== 'Error' && item.foundEmail !== 'Not Found' && (
                                                <button
                                                    onClick={() => copyToClipboard(item.foundEmail, index, 'email')}
                                                    style={copyButtonStyle}
                                                >
                                                    <FontAwesomeIcon icon={faCopy} style={{ color: 'black', fontSize: '1.2em' }} />
                                                </button>
                                            )}
                                            {copiedEmailIndex === index && <span style={copiedMessageStyle}>Copied!</span>}
                                        </td>
                                    )}

                                    {activeSearchType === 'email' && (
                                        <td style={tdStyle}>
                                            {item.foundPhone}
                                            {item.foundPhone !== 'N/A' && item.foundPhone !== 'Error' && item.foundPhone !== 'Not Found' && (
                                                <button
                                                    onClick={() => copyToClipboard(item.foundPhone, index, 'phone')}
                                                    style={copyButtonStyle}
                                                >
                                                    <FontAwesomeIcon icon={faCopy} style={{ color: 'black', fontSize: '1.2em' }} />
                                                </button>
                                            )}
                                            {copiedEmailIndex === index && <span style={copiedMessageStyle}>Copied!</span>}
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

export default Checking;
