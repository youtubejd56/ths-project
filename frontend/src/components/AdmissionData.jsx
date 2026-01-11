import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const AdmissionData = () => {
  const [admissions, setAdmissions] = useState([]);
  const [filters, setFilters] = useState({ year: "", month: "", date: "" });

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/admissiondata/");
      setAdmissions(response.data);
    } catch (error) {
      console.error("Error fetching admission data:", error);
    }
  };

  const formatAdmission = (admission) => {
    const dateObj = new Date(admission.created_at);
    const year = dateObj.getFullYear();
    const month = dateObj.toLocaleString("default", { month: "long" });
    const date = dateObj.toLocaleDateString();
    const time = dateObj.toLocaleTimeString();

    return {
      ...admission,
      year,
      month,
      dateOnly: date,
      fullDate: `${date} ${time}`,
    };
  };

  const formattedAdmissions = admissions.map(formatAdmission);

  // ✅ Filtering
  const filteredAdmissions = formattedAdmissions.filter((ad) => {
    return (
      (filters.year === "" || ad.year.toString() === filters.year) &&
      (filters.month === "" || ad.month === filters.month) &&
      (filters.date === "" || ad.dateOnly === filters.date)
    );
  });

  // ✅ Extract unique values for dropdowns
  const years = [...new Set(formattedAdmissions.map((a) => a.year.toString()))];
  const months = [...new Set(formattedAdmissions.map((a) => a.month))];
  const dates = [...new Set(formattedAdmissions.map((a) => a.dateOnly))];

  // ✅ Export PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Admission Data", 14, 10);
    autoTable(doc, {
      head: [['Name', 'Phone', 'Address', 'Year', 'Month', 'Date']],
      body: filteredAdmissions.map((ad) => [
        ad.student_name,
        ad.phone_num,
        ad.address,
        ad.year,
        ad.month,
        ad.fullDate,
      ]),
    });
    doc.save("admission_data.pdf");
  };

  // ✅ Export Excel
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredAdmissions.map((ad) => ({
        Name: ad.student_name,
        Phone: ad.phone_num,
        Address: ad.address,
        Year: ad.year,
        Month: ad.month,
        Date: ad.fullDate,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Admissions");
    XLSX.writeFile(workbook, "admission_data.xlsx");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admission Data</h2>

      {/* ✅ Export buttons */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={downloadPDF}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Download PDF
        </button>
        <button
          onClick={downloadExcel}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Download Excel
        </button>
      </div>

      {/* ✅ Filter dropdowns */}
      <div className="flex gap-4 mb-4">
        <select
          className="border p-2 rounded"
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
        >
          <option value="">All Years</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={filters.month}
          onChange={(e) => setFilters({ ...filters, month: e.target.value })}
        >
          <option value="">All Months</option>
          {months.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        >
          <option value="">All Dates</option>
          {dates.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* ✅ Table */}
      {filteredAdmissions.length === 0 ? (
        <p>No admission records found.</p>
      ) : (
        <table className="w-full bg-white rounded shadow text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Address</th>
              <th className="p-2">Year</th>
              <th className="p-2">Month</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmissions.map((admission) => (
              <tr key={admission.id} className="border-b">
                <td className="p-2">{admission.student_name}</td>
                <td className="p-2">{admission.phone_num}</td>
                <td className="p-2">{admission.address}</td>
                <td className="p-2">{admission.year}</td>
                <td className="p-2">{admission.month}</td>
                <td className="p-2">{admission.fullDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdmissionData;
