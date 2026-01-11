import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_URL = "http://127.0.0.1:8000/api/attendance/";

const ViewAttendance = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(API_URL).then((res) => {
      const uniqueMap = new Map();

      res.data.forEach((rec) => {
        const key = `${rec.date}-${rec.division}-${rec.year}-${rec.roll_number}`;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, rec);
        }
      });

      const uniqueRecords = Array.from(uniqueMap.values()).sort(
        (a, b) => Number(a.roll_number) - Number(b.roll_number)
      );

      setRecords(uniqueRecords);
      setFilteredRecords(uniqueRecords);
    });
  }, []);

  useEffect(() => {
    let filtered = [...records];

    if (selectedDivision) {
      filtered = filtered.filter((rec) => rec.division === selectedDivision);
    }

    if (selectedYear) {
      filtered = filtered.filter((rec) => String(rec.year) === selectedYear);
    }

    if (selectedMonth) {
      filtered = filtered.filter((rec) => {
        const month = new Date(rec.date).toLocaleString("default", { month: "long" });
        return month === selectedMonth;
      });
    }

    if (selectedDate) {
      filtered = filtered.filter((rec) => rec.date === selectedDate);
    }

    filtered.sort((a, b) => Number(a.roll_number) - Number(b.roll_number));
    setFilteredRecords(filtered);
  }, [selectedDivision, selectedYear, selectedMonth, selectedDate, records]);

  const handleDownload = () => {
    if (filteredRecords.length === 0) {
      alert("No attendance records to download.");
      return;
    }

    const worksheetData = filteredRecords.map((rec) => ({
      Date: rec.date,
      Division: rec.division,
      Year: rec.year,
      "Roll No": rec.roll_number,
      Name: rec.student_name,
      Status: rec.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, "student_attendance.xlsx");
  };

  const divisions = ["10A", "10B", "9A", "9B", "8A", "8B"];
  const years = [...new Set(records.map((rec) => rec.year))];
  const months = [...new Set(records.map((rec) =>
    new Date(rec.date).toLocaleString("default", { month: "long" })
  ))];
  const dates = [...new Set(records.map((rec) => rec.date))];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Saved Attendance</h1>
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            ⬇ Download Excel
          </button>
          <button
            onClick={() => navigate("/attendance")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ← Back to Entry
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label className="block mb-1">Division</label>
          <select
            className="border px-2 py-1 rounded"
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
          >
            <option value="">All</option>
            {divisions.map((div) => (
              <option key={div} value={div}>
                {div}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Year</label>
          <select
            className="border px-2 py-1 rounded"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">All</option>
            {years.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Month</label>
          <select
            className="border px-2 py-1 rounded"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">All</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Date</label>
          <select
            className="border px-2 py-1 rounded"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            <option value="">All</option>
            {dates.map((dt) => (
              <option key={dt} value={dt}>
                {dt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Attendance Table */}
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">Date</th>
            <th className="border px-3 py-2">Division</th>
            <th className="border px-3 py-2">Year</th>
            <th className="border px-3 py-2">Roll No</th>
            <th className="border px-3 py-2">Name</th>
            <th className="border px-3 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((rec, i) => (
            <tr key={i}>
              <td className="border px-3 py-2">{rec.date}</td>
              <td className="border px-3 py-2">{rec.division}</td>
              <td className="border px-3 py-2">{rec.year}</td>
              <td className="border px-3 py-2">{rec.roll_number}</td>
              <td className="border px-3 py-2">{rec.student_name}</td>
              <td className="border px-3 py-2">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    rec.status === "Present" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {rec.status}
                </span>
              </td>
            </tr>
          ))}
          {filteredRecords.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-4">
                No attendance records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAttendance;
