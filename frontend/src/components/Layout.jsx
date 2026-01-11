import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <h1>My App Layout</h1>
      <Outlet /> {/* 👈 nested route content renders here */}
    </div>
  );
};

export default Layout;
