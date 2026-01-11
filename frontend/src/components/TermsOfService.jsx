import React from "react";

const sections = [
  {
    title: "Acceptance of Terms",
    content: `By using this website, you agree to these Terms of Service. If you do not agree, do not use the system.`,
  },
  {
    title: "User Responsibilities",
    content: `- Admins must keep credentials secure.\n- Users must provide accurate information (admissions, marks, attendance).\n- Prohibited actions: hacking, uploading harmful content, or violating laws.`,
  },
  {
    title: "Intellectual Property",
    content: `- All content, code, and AI chatbot responses are the property of the developer (Vinayak NV) or licensed parties.`,
  },
  {
    title: "Use of AI Chatbot",
    content: `- AI is provided for informational/support purposes.\n- Users should not rely on AI for legal, medical, or sensitive decisions.`,
  },
  {
    title: "File Uploads",
    content: `- Only upload permitted file types (JPG, PNG, PDF, MP4).\n- Do not upload harmful or copyrighted material without permission.`,
  },
  {
    title: "Limitation of Liability",
    content: `- We are not liable for errors in marks, attendance, or other academic data.\n- No warranty for system uptime or AI accuracy.`,
  },
  {
    title: "Privacy Compliance",
    content: `- Your personal and student data is handled according to the Privacy Policy.`,
  },
  {
    title: "Termination",
    content: `- Admins may revoke access for violations.\n- The system may suspend or delete data if terms are breached.`,
  },
  {
    title: "Changes to Terms",
    content: `- Terms may be updated. Users will be notified.`,
  },
  {
    title: "Contact",
    content: `Questions or complaints: thspala@gmail.com`,
  },
];

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <h1 className="text-2xl font-bold text-white">Terms of Service</h1>
          <p className="text-blue-100 text-sm">
            Please read these terms carefully. By using the system you agree to follow them.
          </p>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          {sections.map((section, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 bg-gray-50 shadow-sm"
            >
              <h2 className="font-semibold text-lg text-gray-800">
                {section.title}
              </h2>
              <p className="mt-2 text-gray-600 whitespace-pre-line">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
