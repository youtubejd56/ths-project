import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function ViewResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const student = location.state?.student;

  if (!student) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 text-lg">No student data found.</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 text-white px-4 py-2 rounded mt-4 hover:bg-gray-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Exclude unwanted fields
  const excludedFields = ["id", "roll_no", "student_name", "division", "year"];

  // Extract marks
  const marksArray = Object.entries(student)
    .filter(([key]) => !excludedFields.includes(key))
    .map(([_, mark]) => Number(mark) || 0);

  const totalMarks = marksArray.reduce((sum, mark) => sum + mark, 0);
  const maxMarks = marksArray.length * 100;
  const percentage = ((totalMarks / maxMarks) * 100).toFixed(2);

  const getGrade = (mark) => {
    if (mark >= 95) return "A+";
    if (mark >= 80) return "A";
    if (mark >= 70) return "B+";
    if (mark >= 60) return "B";
    if (mark >= 50) return "C";
    if (mark >= 40) return "D";
    return "F";
  };

  const overallGrade = getGrade(percentage);

  // Download PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Result for ${student.student_name}`, 14, 10);

    const tableColumn = ["Subject", "Marks", "Grade"];
    const tableRows = Object.entries(student)
      .filter(([key]) => !excludedFields.includes(key))
      .map(([subject, mark]) => [
        subject,
        mark ?? "N/A",
        getGrade(Number(mark) || 0),
      ]);

    // Add summary rows
    tableRows.push(["Total", totalMarks, "-"]);
    tableRows.push(["Percentage", `${percentage}%`, "-"]);
    tableRows.push(["Grade", overallGrade, "-"]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save(`${student.student_name}_result.pdf`);
  };

  // Download Excel
  const handleDownloadExcel = () => {
    const data = Object.entries(student)
      .filter(([key]) => !excludedFields.includes(key))
      .map(([subject, mark]) => ({
        Subject: subject,
        Marks: mark ?? "N/A",
        Grade: getGrade(Number(mark) || 0),
      }));

    data.push({ Subject: "Total", Marks: totalMarks, Grade: "-" });
    data.push({ Subject: "Percentage", Marks: `${percentage}%`, Grade: "-" });
    data.push({ Subject: "Grade", Marks: overallGrade, Grade: "-" });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Result");
    XLSX.writeFile(workbook, `${student.student_name}_result.xlsx`);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white shadow-lg rounded-xl p-6">
        {/* Header */}
        <div className="border-b pb-4 mb-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 py-5">
            📊 THS Result
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-gray-700">
            <p>
              <span className="font-semibold">Name:</span>{" "}
              {student.student_name}
            </p>
            <p>
              <span className="font-semibold">Roll No:</span> {student.roll_no}
            </p>
            <p>
              <span className="font-semibold">Division:</span>{" "}
              {student.division}
            </p>
            <p>
              <span className="font-semibold">Year:</span>{" "}
              {student.year ?? "N/A"}
            </p>
          </div>
        </div>

        {/* Result Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border px-4 py-2 text-left">Subject</th>
                <th className="border px-4 py-2 text-center">Marks</th>
                <th className="border px-4 py-2 text-center">Grade</th>
              </tr>
            </thead>
            <tbody>
            {Object.entries(student)
  .filter(([key]) => !excludedFields.includes(key))
  .map(([subject, mark], index, arr) => (
    <tr
      key={subject}
      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
    >
      <td className="border px-4 py-2 capitalize">{subject}</td>
      <td className="border px-4 py-2 text-center">
        {mark ?? "N/A"}
      </td>
      <td className="border px-4 py-2 text-center">
        {
          index === 0 || index === arr.length - 1
            ? "" // leave empty for first and last row
            : getGrade(Number(mark) || 0)
        }
      </td>
    </tr>
  ))}
              {/* Summary Rows */}
              <tr className="bg-yellow-100 font-semibold">
                <td cla99ssName="border px-4 py-2">Total</td>
                <td className="border px-4 py-2 text-center">{totalMarks}</td>
                <td className="border px-4 py-2 text-center">-</td>
              </tr>
              <tr className="bg-green-100 font-semibold">
                <td className="border px-4 py-2">Percentage</td>
                <td className="border px-4 py-2 text-center">{percentage}%</td>
                <td className="border px-4 py-2 text-center">-</td>
              </tr>
              <tr className="bg-blue-100 font-semibold">
                <td className="border px-4 py-2">Grade</td>
                <td className="border px-4 py-2 text-center">
                  {overallGrade}
                </td>
                <td className="border px-4 py-2 text-center">-</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={handleDownloadPDF}
            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
          >
            📄 Download PDF
          </button>
          <button
            onClick={handleDownloadExcel}
            className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600"
          >
            📊 Download Excel
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
          >
            🔙 Back to Marks
          </button>
        </div>
      </div>
    </div>
  );
}
