import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { FaBars } from "react-icons/fa";

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            <div className="flex-1 flex flex-col lg:ml-64">
                {/* Mobile Header */}
                <header className="lg:hidden bg-[#0D1B2A] text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
                    <h1 className="text-lg font-bold">THS PALA ADMIN</h1>
                    <button onClick={toggleSidebar} className="text-2xl p-2 hover:bg-white/10 rounded-lg transition">
                        <FaBars />
                    </button>
                </header>

                <main className="p-4 md:p-6 w-full">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
