import { FaTachometerAlt, FaClipboardList, FaUserGraduate, FaDivide, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import AdmissionData from './AdmissionData';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/adminlogin");
  };

  return (
    <div className="bg-[#0D1B2A] text-white w-64 h-screen p-6 flex flex-col justify-between fixed left-0 top-0">
      <div>
        <h1 className="text-2xl font-bold mb-12">GOVT.THS PALA</h1>
        <nav className="flex flex-col gap-6 text-sm font-medium">
          <Link to="/admin-dashboard" className="flex items-center gap-3 hover:text-yellow-400 transition">
            <FaTachometerAlt /> Dashboard
          </Link>
          <Link to="/admin-dashboard/marklist" className="flex items-center gap-3 hover:text-yellow-400 transition">
            <FaUserGraduate /> Mark List
          </Link>
          <Link to="/admin-dashboard/division" className="flex items-center gap-3 hover:text-yellow-400 transition">
            <FaDivide /> Division
          </Link>
          <Link to="/admin-dashboard/attendance" className="flex items-center gap-3 hover:text-yellow-400 transition">
            <FaClipboardList /> Attendance
          `</Link>

          <Link to="/admin-dashboard/admissiondata" className="flex items-center gap-3 hover:text-yellow-400 transition">
            <FaDivide /> Admission Data
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
  );
};

export default Sidebar;
