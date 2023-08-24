import React from "react";

const HeadersColumns = ({ classEsp, columnTitles }) => {
  return (
    <div className={`generalTitle ${classEsp.toString().replace(",", " ")}`}>
      {columnTitles.map((column, index) => {
        if (column.show) return <span key={column.name}>{column.name}</span>;
      })}
    </div>
  );
};

export default HeadersColumns;
