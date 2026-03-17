import { FaTachometerAlt, FaClipboardList, FaUserGraduate, FaSignOutAlt, FaFileAlt, FaVideo, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/adminlogin");
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      <div className={`bg-[#0D1B2A] text-white w-64 h-screen p-6 flex flex-col justify-between fixed left-0 top-0 z-50 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div>
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-xl font-bold">GOVT.THS PALA</h1>
            <button onClick={onClose} className="lg:hidden text-2xl hover:text-red-500 transition">
              <FaTimes />
            </button>
          </div>
          <nav className="flex flex-col gap-6 text-sm font-medium">
            <Link to="/admin-dashboard" onClick={onClose} className="flex items-center gap-3 hover:text-yellow-400 transition">
              <FaTachometerAlt /> Dashboard
            </Link>
            <Link to="/admin-dashboard/marklist" onClick={onClose} className="flex items-center gap-3 hover:text-yellow-400 transition">
              <FaUserGraduate /> Mark List
            </Link>
            <Link to="/admin-dashboard/attendance" onClick={onClose} className="flex items-center gap-3 hover:text-yellow-400 transition">
              <FaClipboardList /> Attendance
            </Link>
            <Link to="/admin-dashboard/admissiondata" onClick={onClose} className="flex items-center gap-3 hover:text-yellow-400 transition">
              <FaFileAlt /> Admission Data
            </Link>
            <Link to="/admin-dashboard/manage-events" onClick={onClose} className="flex items-center gap-3 hover:text-yellow-400 transition">
              <FaFileAlt /> Manage Event Posts
            </Link>
            <Link to="/admin-dashboard/manage-shorts" onClick={onClose} className="flex items-center gap-3 hover:text-yellow-400 transition">
              <FaVideo /> Manage Short Posts
            </Link>
          </nav>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 text-sm font-medium hover:text-yellow-400 transition"
        >
          <FaSignOutAlt /> Sign Out
        </button>
      </div>
    </>
  );
};

export default Sidebar;
