import React from "react";
import "@/app/loader.css";
const Loader = () => {
  return (
    <div className="Loading">
      <div className="three-body">
        <div className="three-body__dot"></div>
        <div className="three-body__dot"></div>
        <div className="three-body__dot"></div>
      </div>
    </div>
  );
};

export default Loader;
