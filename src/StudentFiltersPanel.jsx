import React from 'react';

const baseButtonStyle = {
  padding: '8px 14px',
  border: '1px solid transparent',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 600,
  transition: 'all 0.12s ease',
  boxShadow: '0 4px 12px rgba(2,6,23,0.06)',
};

const inactiveButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: '#ffffff',
  color: '#475569',
  borderColor: '#e6eef8',
};

const activeFilterAllStyle = {
  ...baseButtonStyle,
  backgroundColor: '#6c757d',
  color: 'white',
  borderColor: '#6c757d',
};

const activeFilterYesStyle = {
  ...baseButtonStyle,
  backgroundColor: '#28a745',
  color: 'white',
  borderColor: '#28a745',
};

const activeFilterNoStyle = {
  ...baseButtonStyle,
  backgroundColor: '#dc3545',
  color: 'white',
  borderColor: '#dc3545',
};

const unifiedFilterPanelStyle = {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '18px',
  boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
  display: 'flex',
  flexDirection: 'column',
  gap: '18px',
};

const sidebarSectionHeaderStyle = {
  fontWeight: 700,
  fontSize: '1rem',
  color: '#0f172a',
};

const filterGroupSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  borderBottom: '1px solid #f1f5f9',
  paddingBottom: '14px',
};

const statusFilterRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap',
};

const statusFilterButtonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '10px',
  flexWrap: 'wrap',
};

const dateFilterControlsStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr auto',
  gap: '10px',
  alignItems: 'end',
};

const filterFieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  minWidth: 0,
};

const filterFieldLabelStyle = {
  fontSize: '0.82rem',
  fontWeight: 700,
  color: '#334155',
};

const dateFilterSelectStyle = {
  padding: '8px 10px',
  borderRadius: '10px',
  border: '1px solid #e6eef8',
  background: 'white',
  fontSize: '0.9rem',
  outline: 'none',
};

const courseFilterFieldsWrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
};

const pillRowStyle = {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
  alignItems: 'center',
};

const pillButtonBaseStyle = {
  padding: '6px 10px',
  borderRadius: '999px',
  border: '1px solid #e6eef8',
  background: '#ffffff',
  cursor: 'pointer',
  fontWeight: 700,
  fontSize: '12px',
  color: '#334155',
};

const pillButtonSelectedStyle = {
  ...pillButtonBaseStyle,
  background: '#2563eb',
  borderColor: '#1e40af',
  color: 'white',
};

export default function StudentFiltersPanel({
  filterStatus,
  setFilterStatus,
  joiningDateRange,
  handleJoiningDateChange,
  resetJoiningDateFilters,
  hasActiveJoiningFilters,
  courseFilters,
  courseFilterOptions,
  handleCoursePillClick,
  hasActiveCourseFilters,
  clearAllFilters,
}) {
  return (
    <div style={unifiedFilterPanelStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <div style={sidebarSectionHeaderStyle}>Filters</div>
        <button
          type="button"
          onClick={clearAllFilters}
          style={{
            ...pillButtonBaseStyle,
            fontSize: '0.8rem',
            padding: '4px 10px',
            opacity: (filterStatus !== 'All' || hasActiveJoiningFilters || hasActiveCourseFilters) ? 1 : 0.5,
            cursor: (filterStatus !== 'All' || hasActiveJoiningFilters || hasActiveCourseFilters) ? 'pointer' : 'not-allowed',
          }}
          disabled={filterStatus === 'All' && !hasActiveJoiningFilters && !hasActiveCourseFilters}
        >
          Clear All
        </button>
      </div>

      <div style={filterGroupSectionStyle}>
        <div style={sidebarSectionHeaderStyle}>Status Filter</div>
        <div style={statusFilterRowStyle}>
          <div style={statusFilterButtonContainerStyle}>
            <button
              type="button"
              onClick={() => setFilterStatus('All')}
              style={filterStatus === 'All' ? activeFilterAllStyle : inactiveButtonStyle}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('Yes student found')}
              style={filterStatus === 'Yes student found' ? activeFilterYesStyle : inactiveButtonStyle}
            >
              Yes student found
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('Not a student')}
              style={filterStatus === 'Not a student' ? activeFilterNoStyle : inactiveButtonStyle}
            >
              Not a student
            </button>
          </div>
        </div>
      </div>

      <div style={filterGroupSectionStyle}>
        <div style={sidebarSectionHeaderStyle}>Joining Date</div>
        <div style={dateFilterControlsStyle}>
          <div style={filterFieldStyle}>
            <label style={filterFieldLabelStyle}>From</label>
            <input
              type="date"
              value={joiningDateRange.from}
              onChange={(e) => handleJoiningDateChange('from', e.target.value)}
              style={dateFilterSelectStyle}
            />
          </div>
          <div style={filterFieldStyle}>
            <label style={filterFieldLabelStyle}>To</label>
            <input
              type="date"
              value={joiningDateRange.to}
              onChange={(e) => handleJoiningDateChange('to', e.target.value)}
              style={dateFilterSelectStyle}
            />
          </div>
          <button
            type="button"
            onClick={resetJoiningDateFilters}
            style={{
              ...pillButtonBaseStyle,
              fontSize: '0.8rem',
              padding: '4px 10px',
              whiteSpace: 'nowrap',
              height: '34px',
            }}
            disabled={!hasActiveJoiningFilters}
          >
            Clear Date Filter
          </button>
        </div>
      </div>

      <div style={courseFilterFieldsWrapperStyle}>
        <div style={filterFieldStyle}>
          <label style={filterFieldLabelStyle}>Course Plan</label>
          <div style={pillRowStyle}>
            <button
              type="button"
              onClick={() => handleCoursePillClick('coursePlan', null)}
              style={(!courseFilters.coursePlan || courseFilters.coursePlan.length === 0) ? pillButtonSelectedStyle : pillButtonBaseStyle}
            >
              Any
            </button>
            {(courseFilterOptions?.plans || []).map((plan) => (
              <button
                key={plan}
                type="button"
                onClick={() => handleCoursePillClick('coursePlan', plan)}
                style={(courseFilters.coursePlan && courseFilters.coursePlan.includes(plan)) ? pillButtonSelectedStyle : pillButtonBaseStyle}
              >
                {plan}
              </button>
            ))}
          </div>
        </div>

        <div style={filterFieldStyle}>
          <label style={filterFieldLabelStyle}>Location</label>
          <div style={pillRowStyle}>
            <button
              type="button"
              onClick={() => handleCoursePillClick('location', null)}
              style={(!courseFilters.location || courseFilters.location.length === 0) ? pillButtonSelectedStyle : pillButtonBaseStyle}
            >
              Any
            </button>
            {(courseFilterOptions?.locations || []).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => handleCoursePillClick('location', loc)}
                style={(courseFilters.location && courseFilters.location.includes(loc)) ? pillButtonSelectedStyle : pillButtonBaseStyle}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        <div style={filterFieldStyle}>
          <label style={filterFieldLabelStyle}>Delivery Mode</label>
          <div style={pillRowStyle}>
            <button
              type="button"
              onClick={() => handleCoursePillClick('courseType1', null)}
              style={(!courseFilters.courseType1 || courseFilters.courseType1.length === 0) ? pillButtonSelectedStyle : pillButtonBaseStyle}
            >
              Any
            </button>
            {(courseFilterOptions?.courseType1Values || []).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleCoursePillClick('courseType1', value)}
                style={(courseFilters.courseType1 && courseFilters.courseType1.includes(value)) ? pillButtonSelectedStyle : pillButtonBaseStyle}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
