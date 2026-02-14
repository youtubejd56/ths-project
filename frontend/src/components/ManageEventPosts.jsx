import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Edit3, Save, X, Calendar, FileText, LayoutGrid, List, Sparkles } from 'lucide-react';
import api from "../api/axiosInstance";
import API_BASE_URL from "../api/config";

const API_BASE = API_BASE_URL.replace(/\/$/, "");

const ManageEventPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("grid"); // grid or list
    const [editingId, setEditingId] = useState(null);
    const [editDescription, setEditDescription] = useState("");

    const fetchPosts = async () => {
        try {
            const res = await api.get("/posts/");
            const raw = Array.isArray(res.data) ? res.data : Array.isArray(res.data.posts) ? res.data.posts : [];
            const formatted = raw.map((post) => ({
                ...post,
                file: post.file
                    ? (post.file.startsWith("http")
                        ? post.file
                        : `${API_BASE}${post.file.startsWith("/") ? "" : "/"}${post.file}`)
                    : null,
            }));
            setPosts(formatted);
        } catch (error) {
            console.error("Failed to load posts:", error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this event post?")) return;
        try {
            await api.delete(`/posts/${id}/`);
            setPosts((prev) => prev.filter((p) => p.id !== id));
        } catch {
            alert("❌ Delete failed. Please try again.");
        }
    };

    const handleEditSave = async () => {
        try {
            await api.patch(`/posts/${editingId}/`, { description: editDescription });
            setPosts((prev) =>
                prev.map((p) => (p.id === editingId ? { ...p, description: editDescription } : p))
            );
            setEditingId(null);
            setEditDescription("");
        } catch {
            alert("❌ Update failed. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-indigo-600 font-semibold animate-pulse">Loading amazing events...</p>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Manage Event Posts</h2>

            {posts.length === 0 ? (
                <p>No posts available.</p>
            ) : (
                <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
                    <AnimatePresence mode="popLayout">
                        {posts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                className={`relative group group-hover:drop-shadow-2xl transition-all duration-500 ${viewMode === 'grid' ? 'flex flex-col h-full bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl hover:shadow-2xl' : 'flex bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl p-4'
                                    }`}
                            >
                                {/* Media Section */}
                                <div className={`${viewMode === 'grid' ? 'w-full h-64' : 'w-48 h-48 flex-shrink-0'} relative overflow-hidden bg-gray-50 group`}>
                                    {post.file ? (
                                        <>
                                            {post.file.endsWith(".mp4") || post.file.endsWith(".webm") ? (
                                                <video className="w-full h-full object-cover">
                                                    <source src={post.file} type="video/mp4" />
                                                </video>
                                            ) : (
                                                <img src={post.file} alt="" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                                <span className="text-white text-xs font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                                                    {post.file.endsWith(".mp4") ? 'Video' : 'Image'}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-100 m-2 rounded-2xl">
                                            <FileText size={48} className="mb-2 opacity-50" />
                                            <span className="text-xs uppercase font-bold">No Preview</span>
                                        </div>
                                    )}
                                </div>

                                {/* Content Section */}
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center gap-2 mb-3 text-indigo-600 font-bold text-xs uppercase tracking-tighter">
                                        <Calendar size={14} />
                                        {new Date(post.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>

                                    {editingId === post.id ? (
                                        <div className="flex-1 flex flex-col gap-4">
                                            <textarea
                                                className="w-full flex-1 p-4 bg-gray-50 border-2 border-indigo-100 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all font-medium min-h-[100px]"
                                                value={editDescription}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                                autoFocus
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleEditSave}
                                                    className="flex-1 bg-indigo-600 text-white py-3 rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors font-bold flex items-center justify-center gap-2"
                                                >
                                                    <Save size={18} /> Update
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingId(null);
                                                        setEditDescription("");
                                                    }}
                                                    className="p-3 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-colors"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex flex-col">
                                            <p className="text-gray-800 text-sm md:text-base font-medium leading-relaxed line-clamp-4 italic mb-8">
                                                "{post.description || 'No description provided.'}"
                                            </p>

                                            <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingId(post.id);
                                                            setEditDescription(post.description || "");
                                                        }}
                                                        className="p-3 bg-amber-50 text-amber-600 rounded-2xl hover:bg-amber-100 transition-all duration-300 transform hover:-translate-y-1"
                                                        title="Edit Post"
                                                    >
                                                        <Edit3 size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(post.id)}
                                                        className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all duration-300 transform hover:-translate-y-1"
                                                        title="Delete Post"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                                <div className="text-xs font-black text-gray-300 tracking-widest uppercase">
                                                    ID: #{String(post.id).padStart(4, '0')}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default ManageEventPosts;
