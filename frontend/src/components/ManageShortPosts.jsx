import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Film, Plus, ArrowLeft, Play, Calendar, Zap } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import API_BASE_URL from "../api/config";

const ManageShortPosts = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchVideos = async () => {
        try {
            const response = await api.get("/shorts/");
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

    const handleDelete = async (id) => {
        if (!window.confirm("This video will be permanently removed. Continue?")) return;
        try {
            await api.delete(`/shorts/${id}/`);
            setVideos(videos.filter((video) => video.id !== id));
        } catch (err) {
            console.error("❌ Failed to delete video:", err);
            alert("❌ Failed to delete video!");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
                    <Film className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-rose-500" size={24} />
                </div>
                <p className="mt-6 text-gray-500 font-bold tracking-widest uppercase text-sm">Loading your stories...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Card */}
                <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-white mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60"></div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-100 text-rose-600 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                            <Zap size={14} fill="currentColor" /> Live Portfolio
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                            Manage Short Videos <span className="text-rose-500">🎬</span>
                        </h2>
                        <p className="text-slate-500 mt-2 font-medium">Capture, manage, and share quick moments from Pala THS</p>
                    </div>

                    <div className="flex gap-3 relative z-10">
                        <button
                            onClick={() => navigate("/shorts")}
                            className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all duration-300 shadow-xl shadow-slate-200 font-bold"
                        >
                            <Plus size={20} /> Upload New
                        </button>
                    </div>
                </div>

                {videos.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-[2rem] p-20 text-center border-2 border-dashed border-slate-200"
                    >
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Film className="text-slate-300" size={48} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800">No stories yet</h3>
                        <p className="text-slate-500 mt-2 mb-8">Share your first vertical video with the school community!</p>
                        <button
                            onClick={() => navigate("/shorts")}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-rose-500 text-white rounded-2xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-100 font-bold"
                        >
                            <Plus size={20} /> Create Your First Short
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        <AnimatePresence>
                            {videos.map((video, index) => (
                                <motion.div
                                    key={video.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100"
                                >
                                    {/* Video Preview Container */}
                                    <div className="relative aspect-[9/16] bg-slate-900 overflow-hidden">
                                        <video
                                            src={video.video.startsWith("http") ? video.video : `${API_BASE_URL}${video.video}`}
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                            muted
                                            playsInline
                                            onMouseOver={(e) => e.target.play()}
                                            onMouseOut={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                                        />

                                        {/* Play Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                                                <Play className="text-white fill-white ml-1" size={32} />
                                            </div>
                                        </div>

                                        {/* Top Info Badge */}
                                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                            <div className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                                                {video.id % 2 === 0 ? 'Trending' : 'Recent'}
                                            </div>
                                            <button
                                                onClick={() => handleDelete(video.id)}
                                                className="p-2.5 bg-rose-500/80 hover:bg-rose-600 backdrop-blur-md text-white rounded-xl transition-all duration-300 hover:scale-110 shadow-lg"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        {/* Bottom Grad Overlay */}
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end">
                                            <h3 className="text-white font-bold text-lg line-clamp-1 group-hover:line-clamp-none transition-all duration-300">
                                                {video.title}
                                            </h3>
                                            <p className="text-slate-300 text-sm line-clamp-2 mt-1 italic">
                                                "{video.caption}"
                                            </p>
                                            <div className="flex items-center gap-2 mt-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                                <Calendar size={12} />
                                                {new Date(video.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageShortPosts;
