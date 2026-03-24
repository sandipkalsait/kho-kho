import React from 'react';

interface ScoreTableProps {
  title: string;
  columns: string[];
  rows?: number;
}

export const ScoreTable: React.FC<ScoreTableProps> = ({
  title,
  columns,
  rows = 15,
}) => {
  const emptyRows = Array.from({ length: rows }, (_, i) => i);

  return (
    <div className="border border-gray-400 bg-gray-50">
      {/* Header */}
      <div className="bg-gray-100 px-3 py-2 border-b border-gray-400">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="border border-gray-400 px-2 py-2 text-xs font-semibold text-gray-700 text-center h-8"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {emptyRows.map((rowIdx) => (
            <tr key={rowIdx} className="hover:bg-gray-100 transition-colors">
              {columns.map((_, colIdx) => (
                <td
                  key={colIdx}
                  className="border border-gray-400 px-2 py-2 h-10 text-xs text-gray-700"
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
