import React from "react";

const HeadersColumns = ({ classEsp, columnTitles }) => {
  return (
    <div className={`generalTitle ${classEsp.toString().replace(",", " ")}`}>
      {columnTitles.map((column, index) => {
        return <span key={index}>{column}</span>;
      })}
    </div>
  );
};

export default HeadersColumns;
