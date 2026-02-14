import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import API_BASE_URL from "../api/config";

const API_URL = `${API_BASE_URL}/api/shorts/`;

const VideoUpload = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch uploaded videos
  const fetchVideos = async () => {
    try {
      const response = await axios.get(API_URL);
      setVideos(response.data);
    } catch (err) {
      console.error("❌ Error fetching videos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Delete a video
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      await axios.delete(`${API_URL}${id}/`);
      setVideos(videos.filter((video) => video.id !== id)); // Update UI
    } catch (err) {
      console.error("❌ Failed to delete video:", err);
      alert("Failed to delete video!");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-gray-100 to-slate-200 p-6 flex flex-col items-center font-sans mt-20">
      <div className="w-full max-w-7xl flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            School Highlights <span className="text-indigo-600">Shorts</span>
          </h2>
        </div>
        <button
          onClick={() => navigate("/shorts")}
          className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 hover:scale-105 transition-all active:scale-95"
        >
          <span>+</span> Upload Highlight
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600 font-medium">Fetching the latest highlights...</p>
        </div>
      ) : videos.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-slate-200 text-center max-w-md">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🎬</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No videos yet</h3>
          <p className="text-slate-500 mb-6">Be the first to upload a school highlight for everyone to see!</p>
          <button
            onClick={() => navigate("/shorts")}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold"
          >
            Start Uploading
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
          {videos.map((video) => {
            const isValidDate = video.created_at && !isNaN(Date.parse(video.created_at));

            return (
              <div
                key={video.id}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden border border-slate-200/60"
              >
                {/* Cinematic Video Container */}
                <div className="relative w-full h-[450px] bg-slate-950 flex items-center justify-center overflow-hidden">
                  <video
                    src={
                      video.video.startsWith("http")
                        ? video.video
                        : `${API_BASE_URL}${video.video}`
                    }
                    controls
                    className="w-full h-full object-contain z-10"
                    poster="/ths_logo.jpg"
                  />
                  {/* Background Blur Effect for Portrait Videos */}
                  <div
                    className="absolute inset-0 opacity-30 blur-2xl scale-110 pointer-events-none"
                    style={{
                      backgroundImage: `url(${video.video})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  ></div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-slate-500 text-sm mt-2 line-clamp-2 h-10">
                    {video.caption || "No caption provided."}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      {isValidDate ? (
                        <>{new Date(video.created_at).toLocaleDateString()}</>
                      ) : (
                        "Recently Added"
                      )}
                    </p>

                    {/* Only show delete if they have admin potential or just add it hidden */}
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                      title="Delete Video"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
