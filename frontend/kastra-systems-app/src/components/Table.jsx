import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Search, Filter, Download, MoreVertical } from 'lucide-react';

// /Reusable Table Component
//   Feature-rich table with sorting, filtering, pagination, and actions

const Table = ({ 
  columns = [], 
  data = [], 
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  actions,
  className = '',
  striped = false,
  hoverable = true,
  compact = false,
  bordered = false
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === bVal) return 0;
      
      const comparison = aVal > bVal ? 1 : -1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  // Get cell value
  const getCellValue = (row, column) => {
    if (column.render) {
      return column.render(row[column.key], row);
    }
    return row[column.key];
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y divide-gray-200 ${bordered ? 'border' : ''}`}>
          {/* Table Header */}
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                    ${column.sortable ? 'cursor-pointer select-none hover:bg-gray-100' : ''}
                    ${compact ? 'px-4 py-2' : ''}
                  `}
                  onClick={() => column.sortable && handleSort(column.key)}
                  style={{ width: column.width }}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <span className="ml-2">
                        {sortConfig.key === column.key ? (
                          sortConfig.direction === 'asc' ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )
                        ) : (
                          <ChevronUp className="w-4 h-4 opacity-30" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th className={`px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase ${compact ? 'px-4 py-2' : ''}`}>
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className={`bg-white divide-y divide-gray-200 ${striped ? 'divide-y-0' : ''}`}>
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  className={`
                    ${hoverable ? 'hover:bg-gray-50' : ''}
                    ${striped && rowIndex % 2 === 1 ? 'bg-gray-50' : ''}
                    ${onRowClick ? 'cursor-pointer' : ''}
                  `}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`
                        px-6 py-4 whitespace-nowrap text-sm text-gray-900
                        ${compact ? 'px-4 py-2' : ''}
                        ${column.className || ''}
                      `}
                    >
                      {getCellValue(row, column)}
                    </td>
                  ))}
                  {actions && (
                    <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${compact ? 'px-4 py-2' : ''}`}>
                      <div className="flex items-center justify-end space-x-2">
                        {actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick(row);
                            }}
                            className={`${action.className || 'text-blue-600 hover:text-blue-900'}`}
                            title={action.label}
                          >
                            {action.icon ? <action.icon className="w-5 h-5" /> : action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// DataTable - Enhanced table with search and pagination
 
export const DataTable = ({ 
  columns = [], 
  data = [], 
  searchable = true,
  searchPlaceholder = 'Search...',
  itemsPerPage = 10,
  actions,
  onExport,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Search filtering
  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((row) =>
      columns.some((column) => {
        const value = row[column.key];
        return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Search */}
        {searchable && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={paginatedData}
        actions={actions}
        emptyMessage={searchTerm ? 'No results found' : 'No data available'}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              // Show first, last, current, and adjacent pages
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded-lg ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page}>...</span>;
              }
              return null;
            })}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// SimpleTable - Lightweight table for quick displays

export const SimpleTable = ({ 
  headers = [], 
  rows = [], 
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4 text-sm text-gray-900">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ResponsiveTable - Mobile-friendly table that converts to cards on small screens

export const ResponsiveTable = ({ 
  columns = [], 
  data = [], 
  mobileCardRender 
}) => {
  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block">
        <Table columns={columns} data={data} />
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {data.map((row, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            {mobileCardRender ? (
              mobileCardRender(row)
            ) : (
              columns.map((column) => (
                <div key={column.key} className="flex justify-between py-2 border-b last:border-b-0">
                  <span className="font-medium text-gray-600">{column.label}:</span>
                  <span className="text-gray-900">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </span>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Table;