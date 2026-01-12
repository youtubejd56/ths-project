import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api/config";
import axios from "axios";
import { User, Phone, MapPin, Send, School, Sparkles, CheckCircle2, ChevronRight, GraduationCap, ArrowLeft } from 'lucide-react';

const Admission = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone_num: '',
    student_name: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false); // Reset success state on new submission attempt

    try {
      const response = await axios.post(`${API_BASE_URL}/api/admission/`, formData);
      setSuccess(true);
      alert('Submitted Successfully!');
      console.log(response.data);

      // ✅ Reset form after submission
      setFormData({
        phone_num: '',
        student_name: '',
        address: '',
      });

    } catch (error) {
      console.error('Error submitting admission form:', error);
      alert('Submission failed!');
    }
  };

  const handleGoBack = () => navigate(-1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-24 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-indigo-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white text-center tracking-wide">
              Student Application
            </h2>
            <p className="text-indigo-100 text-center text-sm mt-2">Fill in your details below</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8 space-y-6">
            {/* Phone Number */}
            <div className="relative">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="text"
                  name="phone_num"
                  value={formData.phone_num}
                  onChange={handleChange}
                  placeholder="Enter your Number"
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none"
                />
              </div>
            </div>

            {/* Student Name */}
            <div className="relative">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Student Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-purple-400" />
                </div>
                <input
                  type="text"
                  name="student_name"
                  value={formData.student_name}
                  onChange={handleChange}
                  placeholder="Enter your Name"
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 outline-none"
                />
              </div>
            </div>

            {/* Address */}
            <div className="relative">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-pink-400" />
                </div>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your Address"
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 outline-none"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Send className="h-5 w-5" />
                Submit
              </button>

              <button
                onClick={handleGoBack}
                className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-gray-700 hover:to-gray-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-5 w-5" />
                Go Back
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            All fields are required to complete your application
          </p>
        </div>
      </div>
    </div>
  );
};

export default Admission;
