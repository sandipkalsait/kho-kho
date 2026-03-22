import React from 'react';
import BatchesGroup from './BatchesGroup';

interface ChaseTableProps {
  rows: number;
}

const ChaseTable: React.FC<ChaseTableProps> = ({ rows }) => {
  return (
    <div className="scoresheet-table-wrapper">
      <div className="scoresheet-title">Chase Turns</div>
      <div className="chase-groups-wrapper">
        <BatchesGroup rows={rows} groupName="Batches of group A" />
        <BatchesGroup rows={rows} groupName="Batches of group B" />
      </div>
    </div>
  );
};

export default ChaseTable;
