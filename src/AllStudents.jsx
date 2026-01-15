import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

const PAGE_SIZE = 50;

export default function AllStudents() {
  const navigate = useNavigate();

  const scrollContainerRef = useRef(null);
  const loaderRef = useRef(null);
  const isLoadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const pageIndexRef = useRef(0);

  const [students, setStudents] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    pageIndexRef.current = pageIndex;
  }, [pageIndex]);

  const loadPage = useCallback(async (targetPageIndex) => {
    if (isLoadingRef.current) return;
    if (!hasMoreRef.current && targetPageIndex !== 0) return;

    const from = targetPageIndex * PAGE_SIZE;
    const to = from + (PAGE_SIZE - 1);

    isLoadingRef.current = true;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('students_enrolled_all')
        .select('*')
        .range(from, to);

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
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // First load happens only when this route opens
    loadPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const node = loaderRef.current;
    if (!node) return;

    const root = scrollContainerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry || !entry.isIntersecting) return;
        if (isLoadingRef.current) return;
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
          {isLoading ? ' • Loading…' : ''}
        </div>
      </div>

      <div ref={scrollContainerRef} style={bodyStyle}>
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
                <th style={thStyle}>Course Type 1</th>
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

              {!isLoading && students.length === 0 && (
                <tr>
                  <td style={tdStyle} colSpan={11}>
                    No students loaded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={footerStyle}>
          <div ref={loaderRef} style={{ height: '1px', width: '100%' }} />
          {isLoading && (
            <div style={{ ...metaStyle, padding: '8px 0' }}>Loading more…</div>
          )}
          {!isLoading && !hasMore && students.length > 0 && (
            <div style={{ ...metaStyle, padding: '8px 0' }}>No more students</div>
          )}
        </div>
      </div>
    </div>
  );
}
