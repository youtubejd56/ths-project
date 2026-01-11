import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const sections = [
  {
    title: "Introduction",
    content: `Ths School Website (“we”, “our”, “us”) values your privacy. This Privacy Policy explains how we collect, use, and protect your personal information in our school management system.`,
  },
  {
    title: "Information We Collect",
    content: `- Personal information: student names, phone numbers, addresses, roll numbers, division, year.
- Academic data: marks, attendance records.
- Uploaded files: images, PDFs, videos, event descriptions.
- Usage data: AI chatbot interactions, system logs.`,
  },
  {
    title: "How We Use Your Information",
    content: `- To manage student records, attendance, and marks.
- To provide event and media services.
- To improve AI chatbot and support.
- For administrative and compliance purposes.`,
  },
  {
    title: "Data Sharing",
    content: `- We do not sell or share your personal data with third parties for marketing.
- We may share data with authorized school administrators and staff.
- Legal obligations: We may disclose data if required by law.`,
  },
  {
    title: "Data Security",
    content: `- Personal and academic data is stored securely in the backend.
- Files are stored on server with restricted access.
- JWT authentication is used to protect API endpoints.`,
  },
  {
    title: "Retention",
    content: `- Student records are kept for the duration of enrollment plus any legally required period.
- AI chatbot logs may be anonymized and retained for improvement purposes.`,
  },
  {
    title: "Your Rights",
    content: `- Request access, correction, or deletion of your data.
- Opt-out from receiving non-essential communications.`,
  },
  {
    title: "Children's Privacy",
    content: `- Our system is intended for school use; we recommend parental consent for students.`,
  },
  {
    title: "Updates",
    content: `- We may update this policy. Last updated: 2025-09-08.`,
  },
  {
    title: "Contact",
    content: `For questions regarding this policy, contact: kkvinayak716@gmail.com or phone: 8075631073.`,
  },
];

export default function PrivacyPolicy() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
      <div className="space-y-4">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-lg shadow-sm overflow-hidden"
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 focus:outline-none"
            >
              <span className="font-semibold text-gray-800">{section.title}</span>
              {openIndex === idx ? <ChevronUp /> : <ChevronDown />}
            </button>
            {openIndex === idx && (
              <div className="p-4 text-gray-700 whitespace-pre-line">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
