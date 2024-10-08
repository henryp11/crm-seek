import React from "react";

const HeadersColumns = ({ classEsp, columnTitles }) => {
  console.log(columnTitles);

  return (
    <div className={`generalTitle ${classEsp.toString().replace(",", " ")}`}>
      {columnTitles.map((column) => {
        if (column.show)
          return (
            <span key={column.id} style={column.style && column.style}>
              {column.name}
            </span>
          );
      })}
    </div>
  );
};

export default HeadersColumns;
