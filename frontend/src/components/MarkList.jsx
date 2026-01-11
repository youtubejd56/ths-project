import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SUBJECTS = [
  "maths",
  "physics",
  "chemistry",
  "english",
  "malayalam",
  "ss",
  "ed",
  "workshop",
  "eye",
  "ge",
  "tradeTheory",
];

const DIVISIONS = ["10A", "10B", "9A", "9B", "8A", "8B"];
const EXAM_TYPES = ["First Term", "Second Term", "Annual Exam"]; // ✅ new
const BASE_URL = "http://localhost:8000/api";

export default function MarkList() {
  const [selectedDivision, setSelectedDivision] = useState(DIVISIONS[0]);
  const [selectedExam, setSelectedExam] = useState(EXAM_TYPES[0]); // ✅ default exam
  const [year, setYear] = useState(new Date().getFullYear());
  const [rollNo, setRollNo] = useState("");
  const [studentName, setStudentName] = useState("");
  const [marks, setMarks] = useState({});
  const [savedMarks, setSavedMarks] = useState({});
  const navigate = useNavigate();

  // Fetch marks for selected division + exam + year
  const fetchDivisionMarks = (division, year, exam) => {
    axios
      .get(`${BASE_URL}/marks/?division=${division}&year=${year}&exam=${exam}`)
      .then((res) => {
        const sortedData = res.data.sort(
          (a, b) => parseInt(a.roll_no) - parseInt(b.roll_no)
        );
        setSavedMarks((prev) => ({
          ...prev,
          [`${division}-${year}-${exam}`]: sortedData,
        }));
      })
      .catch((err) => {
        console.error("Failed to fetch marks", err);
        setSavedMarks((prev) => ({
          ...prev,
          [`${division}-${year}-${exam}`]: [],
        }));
      });
  };

  useEffect(() => {
    fetchDivisionMarks(selectedDivision, year, selectedExam);
  }, [selectedDivision, year, selectedExam]);

  // Save marks
  const handleSave = () => {
    if (!studentName) return alert("Please enter student name");
    if (!rollNo) return alert("Please enter roll number");

    const key = `${selectedDivision}-${year}-${selectedExam}`;
    const existing = (savedMarks[key] || []).find(
      (student) => String(student.roll_no) === String(rollNo)
    );
    if (existing) {
      return alert(
        `Roll number ${rollNo} already exists for ${selectedDivision} (${selectedExam}, ${year})`
      );
    }

    const payload = {
      division: selectedDivision,
      roll_no: rollNo,
      student_name: studentName,
      year: year,
      exam: selectedExam, // ✅ send exam type
      ...marks,
    };

    axios
      .post(`${BASE_URL}/marks/`, payload)
      .then(() => {
        fetchDivisionMarks(selectedDivision, year, selectedExam);
        setRollNo("");
        setStudentName("");
        setMarks({});
      })
      .catch((err) => {
        console.error("Failed to save marks", err);
        alert("Error saving marks");
      });
  };

  // Clear single division/year/exam
  const handleClearDivision = () => {
    if (
      window.confirm(
        `Are you sure you want to clear all marks for ${selectedDivision} (${selectedExam}, ${year})?`
      )
    ) {
      axios
        .delete(
          `${BASE_URL}/marks/clear_division/${selectedDivision}/?year=${year}&exam=${selectedExam}`
        )
        .then(() => {
          setSavedMarks((prev) => ({
            ...prev,
            [`${selectedDivision}-${year}-${selectedExam}`]: [],
          }));
        })
        .catch((err) => {
          console.error("Failed to clear division marks", err);
          alert("Error clearing marks");
        });
    }
  };

  // Clear all
  const handleClearAll = () => {
    if (
      window.confirm("Are you sure you want to clear ALL marks for all divisions?")
    ) {
      axios
        .delete(`${BASE_URL}/marks/clear_all/`)
        .then(() => setSavedMarks({}))
        .catch((err) => {
          console.error("Failed to clear all marks", err);
          alert("Error clearing all marks");
        });
    }
  };

  const key = `${selectedDivision}-${year}-${selectedExam}`;
  const divisionCounts = {};
  DIVISIONS.forEach((div) => {
    EXAM_TYPES.forEach((exam) => {
      const k = `${div}-${year}-${exam}`;
      if (!divisionCounts[div]) divisionCounts[div] = 0;
      divisionCounts[div] += (savedMarks[k] || []).length;
    });
  });

  return (
    <div className="flex gap-5 p-5">
      {/* Left menu */}
      <div className="min-w-[150px] border border-gray-300 p-2.5 rounded-md">
        <h3 className="text-lg font-semibold mb-3">Divisions</h3>
        {DIVISIONS.map((div) => (
          <button
            key={div}
            className={`flex justify-between w-full px-2 py-2 mb-1.5 rounded-md cursor-pointer ${
              selectedDivision === div
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setSelectedDivision(div)}
          >
            <span>{div}</span>
            <span>{divisionCounts[div]}</span>
          </button>
        ))}

        {/* Exam Selector */}
        <h3 className="text-lg font-semibold mt-4 mb-2">Exam</h3>
        {EXAM_TYPES.map((exam) => (
          <button
            key={exam}
            className={`w-full px-2 py-2 mb-1 rounded-md cursor-pointer ${
              selectedExam === exam
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setSelectedExam(exam)}
          >
            {exam}
          </button>
        ))}

        <button
          className="bg-red-600 text-white w-full py-2 rounded-md hover:bg-red-700 transition mb-2"
          onClick={handleClearDivision}
        >
          Clear {selectedDivision} ({selectedExam}, {year})
        </button>
        <button
          className="bg-red-800 text-white w-full py-2 rounded-md hover:bg-red-900 transition"
          onClick={handleClearAll}
        >
          Clear All Data
        </button>
      </div>

      {/* Right form */}
      <div className="flex-grow border border-gray-300 rounded-md p-4">
        <div className="flex gap-2.5 mb-3">
          {/* Division select */}
          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            {DIVISIONS.map((div) => (
              <option key={div} value={div}>
                {div}
              </option>
            ))}
          </select>

          {/* Exam select */}
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            {EXAM_TYPES.map((exam) => (
              <option key={exam} value={exam}>
                {exam}
              </option>
            ))}
          </select>

          {/* Year input */}
          <input
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="p-2 border border-gray-300 rounded-md w-[100px]"
          />

          <input
            type="text"
            placeholder="Roll no"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-[120px]"
          />

          <input
            type="text"
            placeholder="Student name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-[200px]"
          />

          <button
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            onClick={handleSave}
          >
            Save to {selectedDivision} ({selectedExam}, {year})
          </button>
        </div>

        {/* Marks input */}
        <div className="grid grid-cols-4 gap-2.5">
          {SUBJECTS.map((subj) => (
            <div key={subj} className="flex flex-col">
              <label className="text-sm font-medium mb-1 capitalize">
                {subj}
              </label>
              <input
                type="number"
                placeholder="marks"
                value={marks[subj] || ""}
                onChange={(e) =>
                  setMarks({ ...marks, [subj]: e.target.value })
                }
                className="p-2 border border-gray-300 rounded-md"
              />
            </div>
          ))}
        </div>

        {/* Saved marks table */}
        <div className="mt-5">
          <h3 className="text-lg font-semibold mb-4">
            Saved Marks —{" "}
            <span className="text-blue-600">
              {selectedDivision} ({selectedExam}, {year}) (
              {savedMarks[key]?.length || 0})
            </span>
          </h3>

          {(savedMarks[key] || []).length === 0 ? (
            <p className="text-gray-500 italic">
              No saved marks for this division/year/exam yet.
            </p>
          ) : (
            <div className="overflow-x-auto border rounded-lg shadow-sm">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="bg-blue-100 text-blue-900 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-2">SL No</th>
                    <th className="px-4 py-2">Roll No</th>
                    <th className="px-4 py-2">Student Name</th>
                    {SUBJECTS.map((subj) => (
                      <th key={subj} className="px-4 py-2">
                        {subj}
                      </th>
                    ))}
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(savedMarks[key] || []).map((item, i) => (
                    <tr
                      key={i}
                      className={`border-b hover:bg-gray-50 ${
                        i % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-2">{i + 1}</td>
                      <td className="px-4 py-2">{item.roll_no}</td>
                      <td className="px-4 py-2 font-medium">
                        {item.student_name}
                      </td>
                      {SUBJECTS.map((subj) => (
                        <td
                          key={subj}
                          className="px-4 py-2 text-center"
                        >
                          {item[subj] ?? ""}
                        </td>
                      ))}
                      <td className="px-4 py-2">
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                          onClick={() =>
                            navigate("/admin-dashboard/view-result", {
                              state: { student: item, subjects: SUBJECTS },
                            })
                          }
                        >
                          View Result
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
