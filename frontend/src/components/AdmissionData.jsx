import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileSpreadsheet, FileText, Filter, Search, User, Phone, MapPin, Calendar, Sparkles } from 'lucide-react';
import api from '../api/axiosInstance';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const AdmissionData = () => {
  const [admissions, setAdmissions] = useState([]);
  const [filters, setFilters] = useState({ year: "", month: "", date: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      const response = await api.get("/admissiondata/");
      setAdmissions(response.data);
    } catch (error) {
      console.error("Error fetching admission data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatAdmission = (admission) => {
    const dateObj = new Date(admission.created_at);
    const year = dateObj.getFullYear();
    const month = dateObj.toLocaleString("default", { month: "long" });
    const date = dateObj.toLocaleDateString();
    const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return {
      ...admission,
      year,
      month,
      dateOnly: date,
      fullDate: `${date}`,
      time: time,
    };
  };

  const formattedAdmissions = admissions.map(formatAdmission);

  const filteredAdmissions = formattedAdmissions.filter((ad) => {
    const matchesSearch =
      ad.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.phone_num.includes(searchTerm) ||
      ad.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters =
      (filters.year === "" || ad.year.toString() === filters.year) &&
      (filters.month === "" || ad.month === filters.month) &&
      (filters.date === "" || ad.dateOnly === filters.date);

    return matchesSearch && matchesFilters;
  });

  const years = [...new Set(formattedAdmissions.map((a) => a.year.toString()))];
  const months = [...new Set(formattedAdmissions.map((a) => a.month))];
  const dates = [...new Set(formattedAdmissions.map((a) => a.dateOnly))];

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Pala THS - Admission Records", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);

    autoTable(doc, {
      startY: 35,
      head: [['Student Name', 'Phone', 'Address', 'Submission Date']],
      body: filteredAdmissions.map((ad) => [
        ad.student_name,
        ad.phone_num,
        ad.address,
        `${ad.fullDate} ${ad.time}`,
      ]),
      headStyles: { fillStyle: [79, 70, 229] }, // Indigo
    });
    doc.save(`admissions_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredAdmissions.map((ad) => ({
        'Student Name': ad.student_name,
        'Phone Number': ad.phone_num,
        'Home Address': ad.address,
        'Year': ad.year,
        'Month': ad.month,
        'Timestamp': `${ad.fullDate} ${ad.time}`,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Admissions");
    XLSX.writeFile(workbook, `admissions_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-indigo-600 font-semibold animate-pulse tracking-widest">QUERYING DATABASE...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header & Stats Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
              <User className="text-white" size={28} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Admission Inquiry Vault</h2>
          </div>
          <p className="text-slate-500 font-medium ml-14">Review and export potential student admissions for the current academic session.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={downloadPDF}
            className="flex items-center gap-3 px-6 py-3.5 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all font-bold shadow-sm"
          >
            <FileText size={20} /> Export PDF
          </button>
          <button
            onClick={downloadExcel}
            className="flex items-center gap-3 px-6 py-3.5 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-100 transition-all font-bold shadow-sm"
          >
            <FileSpreadsheet size={20} /> Export Excel
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all outline-none font-medium"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-4 py-1">
            <Filter size={16} className="text-slate-400" />
            <select
              className="w-full bg-transparent border-none focus:ring-0 outline-none font-bold text-slate-600"
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            >
              <option value="">Any Year</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-4 py-1">
            <Calendar size={16} className="text-slate-400" />
            <select
              className="w-full bg-transparent border-none focus:ring-0 outline-none font-bold text-slate-600"
              value={filters.month}
              onChange={(e) => setFilters({ ...filters, month: e.target.value })}
            >
              <option value="">Any Month</option>
              {months.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-4 py-1">
            <Sparkles size={16} className="text-slate-400" />
            <select
              className="w-full bg-transparent border-none focus:ring-0 outline-none font-bold text-slate-600"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            >
              <option value="">Specific Date</option>
              {dates.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table Interface */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Student Information</th>
                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Contact Details</th>
                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Home Address</th>
                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {filteredAdmissions.map((ad, idx) => (
                  <motion.tr
                    key={ad.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="hover:bg-indigo-50/30 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm group-hover:scale-110 transition-transform">
                          {ad.student_name.charAt(0)}
                        </div>
                        <p className="font-bold text-slate-800 text-lg">{ad.student_name}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <div className="p-2 bg-slate-100 rounded-lg"><Phone size={14} /></div>
                        {ad.phone_num}
                      </div>
                    </td>
                    <td className="px-8 py-6 max-w-xs">
                      <div className="flex items-start gap-2 text-slate-500 text-sm leading-relaxed">
                        <MapPin size={16} className="mt-1 flex-shrink-0 text-slate-400" />
                        {ad.address}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-right flex flex-col items-end">
                        <span className="text-slate-900 font-bold">{ad.fullDate}</span>
                        <span className="text-slate-400 text-xs font-bold uppercase">{ad.time}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredAdmissions.length === 0 && (
          <div className="p-20 text-center">
            <p className="text-slate-400 font-bold text-lg italic tracking-wide">No search results matching your refined criteria.</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-8 flex justify-center">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Total Records Displayed: {filteredAdmissions.length}</p>
      </div>
    </div>
  );
};

export default AdmissionData;
