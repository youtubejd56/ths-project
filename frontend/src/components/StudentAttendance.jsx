import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api/attendance/";

const AttendanceEntry = () => {
  const navigate = useNavigate();
  const divisions = ["10A", "10B", "9A", "9B", "8A", "8B"];

  const [selectedDivision, setSelectedDivision] = useState("10A");
  const [studentName, setStudentName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [status, setStatus] = useState("Present");
  const [entries, setEntries] = useState([]);

  const todayDate = new Date().toISOString().split("T")[0];

  // Load saved attendance from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("attendanceEntries")) || [];
    setEntries(saved);
  }, []);

  const addStudent = () => {
    if (!studentName || !rollNumber) {
      return alert("Enter roll number & student name!");
    }
    const newEntry = { roll_number: rollNumber, student_name: studentName, year, status, division: selectedDivision, date: todayDate };
    const updated = [...entries, newEntry].sort(
      (a, b) => Number(a.roll_number) - Number(b.roll_number)
    );
    setEntries(updated);
    localStorage.setItem("attendanceEntries", JSON.stringify(updated)); // Save locally
    setStudentName("");
    setRollNumber("");
    setStatus("Present");
  };

  const saveAttendance = async () => {
    if (entries.length === 0) return alert("No students added!");

    try {
      for (const student of entries) {
        await axios.post(API_URL, {
          date: student.date,
          division: student.division,
          year: student.year,
          roll_number: student.roll_number,
          student_name: student.student_name,
          status: student.status,
        });
      }
      alert(`✅ Attendance for ${selectedDivision} saved!`);
      localStorage.removeItem("attendanceEntries"); // Clear local after save
      setEntries([]);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save attendance!");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Student Attendance Entry</h2>
      <p className="mb-4">Date: {todayDate}</p>

      {/* Input Row */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <select
          value={selectedDivision}
          onChange={(e) => setSelectedDivision(e.target.value)}
          className="border p-2 rounded"
        >
          {divisions.map((div) => (
            <option key={div}>{div}</option>
          ))}
        </select>

        <input
          type="number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          placeholder="Roll Number"
          className="border p-2 rounded w-32"
        />

        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Student name"
          className="border p-2 rounded"
        />

        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Year"
          className="border p-2 rounded w-32"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>

        <button
          onClick={addStudent}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Current Entries */}
      {entries.length > 0 && (
        <table className="w-full border mb-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">SL</th>
              <th className="p-2 border">Roll No</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Year</th>
              <th className="p-2 border">Division</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((s, i) => (
              <tr key={i}>
                <td className="p-2 border">{i + 1}</td>
                <td className="p-2 border">{s.roll_number}</td>
                <td className="p-2 border">{s.student_name}</td>
                <td className="p-2 border">{s.year}</td>
                <td className="p-2 border">{s.division}</td>
                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 rounded text-white text-xs ${
                      s.status === "Present" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={saveAttendance}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save Attendance
        </button>
        <button
          onClick={() => navigate("/attendance-view")}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          View Attendance
        </button>
      </div>
    </div>
  );
};

export default AttendanceEntry;
