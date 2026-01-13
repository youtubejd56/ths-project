import React, { useState } from "react";
import { Upload, X, Video, FileText, Image } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api/config";

const API_URL = `${API_BASE_URL}/api/shorts/`;

const Short = () => {
  const [video, setVideo] = useState(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const wordCount = caption.trim() ? caption.trim().split(/\s+/).length : 0;


  const handleVideoUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("video/")) {
      setError("❌ Please upload a valid video file!");
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("❌ File size must be less than 10MB!");
      return;
    }

    const videoElement = document.createElement("video");
    videoElement.preload = "metadata";

    videoElement.onloadedmetadata = () => {
      window.URL.revokeObjectURL(videoElement.src);
      if (videoElement.duration > 120) {
        setError("❌ Video must be less than 2 minutes!");
        return;
      }
      setError("");
      setVideo(URL.createObjectURL(selectedFile));
      setFile(selectedFile);
    };

    videoElement.src = URL.createObjectURL(selectedFile);
  };

  const handleRemoveVideo = () => {
    setVideo(null);
    setFile(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const wordCount = caption.trim().split(/\s+/).length;

    if (!file) {
      alert("Please upload a video before submitting.");
      return;
    }

    if (!caption.trim()) {
      alert("Please enter a caption.");
      return;
    }

    if (wordCount > 30) {
      alert("❌ Caption must not exceed 30 words.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("caption", caption);
    formData.append("video", file);

    try {
      setLoading(true);
      await axios.post(API_URL, formData);
      alert("✅ Video uploaded successfully!");
      handleRemoveVideo();
      setTitle("");
      setCaption("");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to upload video!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-3xl p-8 border border-white/20 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl -z-0"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-400/20 to-purple-400/20 rounded-full blur-3xl -z-0"></div>

        {/* Header */}
        <div className="relative z-10 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-2xl shadow-lg">
              <Video className="text-white" size={28} />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Upload Short Video
            </h2>
          </div>
          <p className="text-gray-600 ml-16">Share your moment with the world</p>
        </div>

        {/* Upload Section */}
        <div className="relative z-10">
          {!video ? (
            <label className="group relative flex flex-col items-center justify-center border-2 border-dashed border-indigo-300 rounded-2xl p-12 cursor-pointer hover:border-indigo-500 transition-all duration-300 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 hover:from-indigo-100/50 hover:to-purple-100/50">
              {/* Animated upload icon */}
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Upload className="text-white" size={40} />
                </div>
              </div>

              <p className="text-gray-800 font-semibold text-lg mb-2">
                Click or drag & drop to upload
              </p>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                MP4, MOV • Max 10MB • Max 2 minutes
              </p>

              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative">
                <video
                  src={video}
                  controls
                  className="w-full rounded-2xl max-h-96 object-cover shadow-xl"
                />
                <button
                  onClick={handleRemoveVideo}
                  className="absolute top-4 right-4 bg-red-500 text-white p-2.5 rounded-full hover:bg-red-600 shadow-lg hover:scale-110 transition-all duration-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 animate-pulse">
            <p className="text-red-700 font-medium flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
              {error}
            </p>
          </div>
        )}

        {/* Form */}
        <div className="mt-8 space-y-6 relative z-10">
          {/* Title Input */}
          <div className="group">
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
              <FileText size={18} className="text-indigo-600" />
              Title
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-300 bg-white/50 hover:bg-white"
                placeholder="Give your video an awesome title..."
                required
              />
            </div>
          </div>

          {/* Caption/Description */}
          <div className="group">
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
              <Image size={18} className="text-purple-600" />
              Caption / Description
            </label>
            <div className="relative">
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300 bg-white/50 hover:bg-white resize-none"
                rows="4"
                placeholder="Write something engaging about your short..."
                required
              ></textarea>
              <div className="absolute bottom-3 right-3">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${wordCount > 30
                  ? "bg-red-100 text-red-600"
                  : wordCount > 20
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
                  }`}>
                  {wordCount} / 30 words
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={handleRemoveVideo}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-200 font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Cancel
            </button>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="relative px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      Upload Video
                    </>
                  )}
                </span>
                {!loading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/videos")}
                className="relative px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Video size={18} />
                  View Videos
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Short;
