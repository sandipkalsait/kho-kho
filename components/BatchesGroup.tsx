import React from 'react';

interface BatchesGroupProps {
  rows: number;
  groupName: string;
}

const BatchesGroup: React.FC<BatchesGroupProps> = ({ rows, groupName }) => {
  const batches = [
    { label: 'I', columns: 3 },
    { label: 'II', columns: 4 },
    { label: 'III', columns: 4 },
    { label: 'IV', columns: 1 },
  ];

  return (
    <div className="batches-group-wrapper">
      <div className="batches-group-title">{groupName}</div>
      <div className="batches-group-container">
        {batches.map((batch, batchIndex) => (
          <div 
            key={batch.label} 
            className="batch-item"
            data-batch-index={batchIndex}
          >
            <table className="batch-item-table" aria-label={`${groupName} Batch ${batch.label}`}>
              <colgroup>
                {Array.from({ length: batch.columns }).map((_, idx) => (
                  <col key={idx} style={{ width: '50px' }} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  {Array.from({ length: batch.columns }).map((_, colIndex) => (
                    <th key={`label-${colIndex}`} className="batch-item-label">{batch.label}</th>
                  ))}
                </tr>
                <tr>
                  {Array.from({ length: batch.columns }).map((_, colIndex) => (
                    <th key={`col-${colIndex}`} className="batch-item-col-num">{colIndex + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: rows }, (_, rowIndex) => (
                  <tr key={rowIndex}>
                    {Array.from({ length: batch.columns }).map((_, colIndex) => (
                      <td key={`${rowIndex}-${colIndex}`}></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BatchesGroup;
