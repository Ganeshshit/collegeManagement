import React, { useState } from 'react';
import '../styles/DataTable.css';

function DataTable({ 
  title, 
  columns, 
  data, 
  actions, 
  onRowClick, 
  pagination = true, 
  pageSize = 10,
  searchable = true,
  loading = false
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filter data based on search term
  const filteredData = searchTerm 
    ? data.filter(item => 
        Object.values(item).some(value => 
          value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  // Sort data
  const sortedData = React.useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] === null) return 1;
        if (b[sortConfig.key] === null) return -1;
        if (a[sortConfig.key] === undefined) return 1;
        if (b[sortConfig.key] === undefined) return -1;
        
        const aValue = typeof a[sortConfig.key] === 'string' 
          ? a[sortConfig.key].toLowerCase() 
          : a[sortConfig.key];
        const bValue = typeof b[sortConfig.key] === 'string' 
          ? b[sortConfig.key].toLowerCase() 
          : b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = pagination 
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize) 
    : sortedData;

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (column) => {
    if (sortConfig.key !== column.key) return null;
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (!pagination || totalPages <= 1) return null;
    
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Previous button
    pages.push(
      <li key="prev" className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        <button 
          className="page-link" 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &laquo;
        </button>
      </li>
    );
    
    // First page
    if (startPage > 1) {
      pages.push(
        <li key="1" className={`page-item ${currentPage === 1 ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(1)}>1</button>
        </li>
      );
      if (startPage > 2) {
        pages.push(<li key="ellipsis1" className="page-item disabled"><span className="page-link">...</span></li>);
      }
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(i)}>{i}</button>
        </li>
      );
    }
    
    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<li key="ellipsis2" className="page-item disabled"><span className="page-link">...</span></li>);
      }
      pages.push(
        <li key={totalPages} className={`page-item ${currentPage === totalPages ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
        </li>
      );
    }
    
    // Next button
    pages.push(
      <li key="next" className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
        <button 
          className="page-link" 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &raquo;
        </button>
      </li>
    );
    
    return (
      <div className="table-pagination">
        <div className="pagination-info">
          Showing {Math.min((currentPage - 1) * pageSize + 1, sortedData.length)} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
        </div>
        <ul className="pagination">
          {pages}
        </ul>
      </div>
    );
  };

  return (
    <div className="data-table-container">
      <div className="data-table-header">
        <h2 className="data-table-title">{title}</h2>
        <div className="data-table-actions">
          {searchable && (
            <div className="data-table-search">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="data-table-search-input"
              />
              <span className="data-table-search-icon">🔍</span>
            </div>
          )}
          {actions && actions}
        </div>
      </div>
      
      <div className="data-table-wrapper">
        {loading ? (
          <div className="data-table-loading">
            <div className="spinner"></div>
            <p>Loading data...</p>
          </div>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th 
                      key={column.key} 
                      onClick={() => column.sortable !== false && requestSort(column.key)}
                      className={column.sortable !== false ? 'sortable' : ''}
                      style={column.width ? { width: column.width } : {}}
                    >
                      {column.title}
                      {column.sortable !== false && getSortIndicator(column)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, rowIndex) => (
                    <tr 
                      key={row.id || rowIndex} 
                      onClick={() => onRowClick && onRowClick(row)}
                      className={onRowClick ? 'clickable' : ''}
                    >
                      {columns.map((column) => (
                        <td key={`${row.id || rowIndex}-${column.key}`}>
                          {column.render ? column.render(row) : row[column.key]}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="no-data">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
}

export default DataTable;
