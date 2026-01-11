import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow p-4">
        <h1 className="text-xl font-bold text-gray-800">Public Page</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white shadow p-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Your Website. All rights reserved.
      </footer>
    </div>
  );
};

export default PublicLayout;
