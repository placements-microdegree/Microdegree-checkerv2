import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

const PAGE_SIZE = 50;

const COURSE_PLAN_OPTIONS = [
  'Gold',
  'Diamond',
  'Diamond Plus',
  'Gen AI',
  'Platinum',
  'Titanium',
  'Titanium Plus',
];

const DELIVERY_MODE_OPTIONS = ['Live', 'Recorded'];

export default function AllStudents() {
  const navigate = useNavigate();

  const scrollContainerRef = useRef(null);
  const loaderRef = useRef(null);
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const pageIndexRef = useRef(0);

  const [students, setStudents] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Single source of truth for All Students filters
  const [allStudentsFilters, setAllStudentsFilters] = useState({
    joiningDateRange: { from: '', to: '' },
    coursePlan: '',
    deliveryMode: '',
  });

  useEffect(() => {
    isFetchingRef.current = isFetching;
  }, [isFetching]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    pageIndexRef.current = pageIndex;
  }, [pageIndex]);

  const hasActiveJoiningFilters = Boolean(
    allStudentsFilters.joiningDateRange.from || allStudentsFilters.joiningDateRange.to
  );

  const hasActiveCourseFilters = Boolean(allStudentsFilters.coursePlan || allStudentsFilters.deliveryMode);

  const handleJoiningDateChange = (key, value) => {
    setAllStudentsFilters((prev) => ({
      ...prev,
      joiningDateRange: { ...prev.joiningDateRange, [key]: value },
    }));
  };

  const setCoursePlan = (value) => {
    setAllStudentsFilters((prev) => ({ ...prev, coursePlan: value }));
  };

  const setDeliveryMode = (value) => {
    setAllStudentsFilters((prev) => ({ ...prev, deliveryMode: value }));
  };

  const clearAllFilters = () => {
    setAllStudentsFilters({
      joiningDateRange: { from: '', to: '' },
      coursePlan: '',
      deliveryMode: '',
    });
  };

  const filtersKey = useMemo(() => JSON.stringify(allStudentsFilters), [allStudentsFilters]);

  const loadPage = useCallback(async (targetPageIndex) => {
    if (isFetchingRef.current) return;
    if (!hasMoreRef.current && targetPageIndex !== 0) return;

    const from = targetPageIndex * PAGE_SIZE;
    const to = from + (PAGE_SIZE - 1);

    isFetchingRef.current = true;
    setIsFetching(true);
    try {
      // Query-level filters (must be applied before pagination)
      let query = supabase.from('students_enrolled_all').select('*');

      const coursePlan = (allStudentsFilters.coursePlan || '').toString().trim();
      if (coursePlan) {
        query = query.eq('course_plan', coursePlan);
      }

      const deliveryMode = (allStudentsFilters.deliveryMode || '').toString().trim();
      if (deliveryMode) {
        query = query.eq('course_type_1', deliveryMode);
      }

      const { from: dateFromRaw, to: dateToRaw } = allStudentsFilters.joiningDateRange;
      const dateFrom = (dateFromRaw || '').toString().trim();
      const dateTo = (dateToRaw || '').toString().trim();
      if (dateFrom) query = query.gte('date', dateFrom);
      if (dateTo) query = query.lte('date', dateTo);

      query = query.range(from, to);

      const { data, error } = await query;

      if (error) {
        console.error('Error loading students:', error);
        return;
      }

      const rows = Array.isArray(data) ? data : [];
      setStudents((prev) => (targetPageIndex === 0 ? rows : [...prev, ...rows]));
      setPageIndex(targetPageIndex + 1);
      const nextHasMore = rows.length === PAGE_SIZE;
      hasMoreRef.current = nextHasMore;
      setHasMore(nextHasMore);
    } catch (err) {
      console.error('Unexpected error loading students:', err);
    } finally {
      isFetchingRef.current = false;
      setIsFetching(false);
    }
  }, [allStudentsFilters]);

  useEffect(() => {
    // When filters change: clear results, reset pagination, fetch first page.
    hasMoreRef.current = true;
    setHasMore(true);
    setStudents([]);
    setPageIndex(0);
    pageIndexRef.current = 0;
    loadPage(0);
  }, [filtersKey, loadPage]);

  useEffect(() => {
    const node = loaderRef.current;
    if (!node) return;

    const root = scrollContainerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry || !entry.isIntersecting) return;
        if (isFetchingRef.current) return;
        if (!hasMoreRef.current) return;
        loadPage(pageIndexRef.current);
      },
      {
        root,
        rootMargin: '300px 0px',
        threshold: 0,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadPage]);

  const containerStyle = {
    height: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: '#f5f7fb',
    fontFamily: 'Inter, Arial, sans-serif',
    overflowX: 'hidden',
  };

  const headerStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '14px 16px',
    background: 'white',
    borderBottom: '1px solid #e6eef8',
  };

  const titleStyle = {
    margin: 0,
    fontSize: '18px',
    fontWeight: 800,
    color: '#0f172a',
  };

  const metaStyle = {
    color: '#475569',
    fontWeight: 600,
    fontSize: '13px',
    whiteSpace: 'nowrap',
  };

  const buttonStyle = {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #e6eef8',
    background: '#ffffff',
    cursor: 'pointer',
    fontWeight: 700,
    color: '#2563eb',
  };

  const bodyStyle = {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '12px 16px 18px 16px',
  };

  const filtersBarStyle = {
    background: 'white',
    borderRadius: '10px',
    border: '1px solid #eef2ff',
    padding: '10px 12px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    alignItems: 'end',
    maxWidth: '100%',
    boxSizing: 'border-box',
    overflowX: 'hidden',
  };

  const filterFieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    minWidth: 0,
    flex: '1 1 160px',
  };

  const filterLabelStyle = {
    fontSize: '12px',
    fontWeight: 800,
    color: '#334155',
    lineHeight: 1,
  };

  const compactInputStyle = {
    height: '34px',
    padding: '6px 10px',
    borderRadius: '10px',
    border: '1px solid #e6eef8',
    background: 'white',
    fontSize: '13px',
    outline: 'none',
    maxWidth: '100%',
    boxSizing: 'border-box',
  };

  const clearFiltersButtonStyle = {
    padding: '6px 10px',
    borderRadius: '999px',
    border: '1px solid #fde8e8',
    background: '#ffffff',
    cursor: 'pointer',
    fontWeight: 800,
    fontSize: '12px',
    color: '#b91c1c',
    lineHeight: 1,
    whiteSpace: 'nowrap',
  };

  const tableWrapStyle = {
    background: 'white',
    borderRadius: '10px',
    border: '1px solid #eef2ff',
    overflowX: 'hidden',
    maxWidth: '100%',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    tableLayout: 'fixed',
  };

  const thStyle = {
    padding: '8px 10px',
    borderBottom: '1px solid #e6eef8',
    borderRight: '1px solid #eef2ff',
    textAlign: 'left',
    background: '#f8fafc',
    position: 'sticky',
    top: 0,
    zIndex: 2,
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    overflowWrap: 'anywhere',
    lineHeight: 1.2,
    fontSize: '12px',
    color: '#0f172a',
  };

  const tdStyle = {
    padding: '8px 10px',
    borderBottom: '1px solid #f1f5f9',
    borderRight: '1px solid #f8fafc',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    overflowWrap: 'anywhere',
    lineHeight: 1.25,
    fontSize: '12px',
    color: '#0f172a',
    verticalAlign: 'top',
  };

  const footerStyle = {
    display: 'flex',
    justifyContent: 'center',
    padding: '12px 0 6px 0',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <button type="button" onClick={() => navigate('/checking')} style={buttonStyle}>
          ← Back
        </button>

        <h1 style={titleStyle}>All Students</h1>

        <div style={metaStyle}>
          Loaded {students.length}
          {isFetching ? ' • Loading…' : ''}
        </div>
      </div>

      <div ref={scrollContainerRef} style={bodyStyle}>
        <div style={{ marginBottom: '12px' }}>
          <div style={filtersBarStyle}>
            <div style={filterFieldStyle}>
              <label style={filterLabelStyle}>Joining Date From</label>
              <input
                type="date"
                value={allStudentsFilters.joiningDateRange.from}
                onChange={(e) => handleJoiningDateChange('from', e.target.value)}
                style={compactInputStyle}
              />
            </div>

            <div style={filterFieldStyle}>
              <label style={filterLabelStyle}>Joining Date To</label>
              <input
                type="date"
                value={allStudentsFilters.joiningDateRange.to}
                onChange={(e) => handleJoiningDateChange('to', e.target.value)}
                style={compactInputStyle}
              />
            </div>

            <div style={filterFieldStyle}>
              <label style={filterLabelStyle}>Course Plan</label>
              <select
                value={allStudentsFilters.coursePlan}
                onChange={(e) => setCoursePlan(e.target.value)}
                style={compactInputStyle}
              >
                <option value="">Any</option>
                {COURSE_PLAN_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div style={filterFieldStyle}>
              <label style={filterLabelStyle}>Delivery Mode</label>
              <select
                value={allStudentsFilters.deliveryMode}
                onChange={(e) => setDeliveryMode(e.target.value)}
                style={compactInputStyle}
              >
                <option value="">Any</option>
                {DELIVERY_MODE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', flex: '0 0 auto' }}>
              <button
                type="button"
                onClick={clearAllFilters}
                style={{
                  ...clearFiltersButtonStyle,
                  opacity:
                    (hasActiveJoiningFilters || hasActiveCourseFilters)
                      ? 1
                      : 0.5,
                  cursor:
                    (hasActiveJoiningFilters || hasActiveCourseFilters)
                      ? 'pointer'
                      : 'not-allowed',
                }}
                disabled={
                  !hasActiveJoiningFilters &&
                  !hasActiveCourseFilters
                }
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <colgroup>
              <col style={{ width: '13%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '6%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '7%' }} />
              <col style={{ width: '9%' }} />
              <col style={{ width: '9%' }} />
              <col style={{ width: '8%' }} />
            </colgroup>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Alt Email</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Alt Phone</th>
                <th style={thStyle}>Course Fee</th>
                <th style={thStyle}>Course Type</th>
                <th style={thStyle}>Delivery Mode</th>
                <th style={thStyle}>Course Plan</th>
                <th style={thStyle}>Location</th>
                <th style={thStyle}>Date</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => {
                const fullName = `${s?.first_name || ''} ${s?.last_name || ''}`.trim() || 'N/A';
                return (
                  <tr
                    key={s?.id ?? `${s?.email ?? 'row'}::${idx}`}
                    style={{ background: idx % 2 === 0 ? '#ffffff' : '#fbfdff' }}
                  >
                    <td style={tdStyle}>{fullName}</td>
                    <td style={tdStyle}>{s?.email || 'N/A'}</td>
                    <td style={tdStyle}>{s?.alternate_email || 'N/A'}</td>
                    <td style={tdStyle}>{s?.phone || 'N/A'}</td>
                    <td style={tdStyle}>{s?.alternate_phone || 'N/A'}</td>
                    <td style={tdStyle}>{s?.course_fee ?? 'N/A'}</td>
                    <td style={tdStyle}>{s?.course_type || 'N/A'}</td>
                    <td style={tdStyle}>{s?.course_type_1 || 'N/A'}</td>
                    <td style={tdStyle}>{s?.course_plan || 'N/A'}</td>
                    <td style={tdStyle}>{s?.location || 'N/A'}</td>
                    <td style={tdStyle}>{s?.date || 'N/A'}</td>
                  </tr>
                );
              })}

              {!isFetching && students.length === 0 && (
                <tr>
                  <td style={tdStyle} colSpan={11}>
                    No students found for selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={footerStyle}>
          <div ref={loaderRef} style={{ height: '1px', width: '100%' }} />
          {isFetching && (
            <div style={{ ...metaStyle, padding: '8px 0' }}>Loading more…</div>
          )}
          {!isFetching && !hasMore && students.length > 0 && (
            <div style={{ ...metaStyle, padding: '8px 0' }}>No more students</div>
          )}
        </div>
      </div>
    </div>
  );
}
