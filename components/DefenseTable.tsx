import React from 'react';

interface DefenseTableProps {
  rows: number;
}

const DefenseTable: React.FC<DefenseTableProps> = ({ rows }) => {
  const defenseCols = ['Batch', 'Chest No', 'Time', 'Out by', 'Chest No'];
  return (
    <div className="scoresheet-table-wrapper">
      <div className="scoresheet-title">Defense</div>
      <table className="excel-table defense-table" aria-label="Defense">
        <thead>
          <tr>
            {defenseCols.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, rowIndex) => (
            <tr key={rowIndex}>
              {defenseCols.map((col, colIndex) => (
                <td key={`${rowIndex}-${colIndex}`}></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DefenseTable;
