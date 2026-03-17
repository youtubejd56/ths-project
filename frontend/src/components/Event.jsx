import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../api/config";

const API_BASE = API_BASE_URL.replace(/\/$/, "");

const Event = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [weeklyStatus, setWeeklyStatus] = useState({ week: 1, count: 0, total: 0 });

  const getWeeklyStatus = (allPosts) => {
    if (allPosts.length === 0) return { week: 1, count: 0, total: 0 };

    // Sort posts by created_at (oldest first)
    const sortedPosts = [...allPosts]
      .filter(p => p.created_at)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    if (sortedPosts.length === 0) return { week: 1, count: 0, total: 0 };

    const firstPostDate = new Date(sortedPosts[0].created_at);
    const now = new Date();

    const diffMs = now - firstPostDate;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    const currentWeekIndex = Math.floor(diffDays / 7);

    // Calculate current week's posts
    const weekStart = new Date(firstPostDate);
    weekStart.setDate(weekStart.getDate() + currentWeekIndex * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const postsThisWeek = allPosts.filter((p) => {
      const d = new Date(p.created_at);
      return d >= weekStart && d < weekEnd;
    });

    return {
      week: currentWeekIndex + 1,
      count: postsThisWeek.length,
      total: allPosts.length,
    };
  };

  useEffect(() => {
    axios.get(`${API_BASE}/api/posts/`)
      .then((res) => {
        const postsArray = Array.isArray(res.data) ? res.data : (res.data.posts || []);

        const formatted = postsArray.map((post) => ({
          ...post,
          file: post.file
            ? (post.file.startsWith("http")
              ? post.file
              : `${API_BASE}${post.file.startsWith("/") ? "" : "/"}${post.file}`)
            : null,
        }));

        setPosts(formatted);
        setWeeklyStatus(getWeeklyStatus(formatted));

        const token = localStorage.getItem("token");
        setIsAdmin(!!token);
      })
      .catch((err) => console.error("Failed to load posts:", err));
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/") && !selectedFile.type.startsWith("video/")) {
      alert("Only image or video allowed!");
      return;
    }

    if (selectedFile.type.startsWith("image/") && selectedFile.size > 500 * 1024) {
      alert("Image must be < 500KB!");
      return;
    }

    setFile(selectedFile);
  };

  const handlePost = async () => {
    const status = getWeeklyStatus(posts);

    if (posts.length >= 16) {
      alert("Maximum 16 posts allowed for this month (4 weeks)!");
      return;
    }

    if (status.week <= 4 && status.count >= 4) {
      alert("Weekly limit reached! Please upload next week.");
      return;
    }

    if (status.week > 4) {
      alert("The 4-week event period has ended.");
      return;
    }

    if (!file && !description.trim()) {
      alert("Add a file or description.");
      return;
    }

    if (wordCount > 20) {
      alert("Max 20 words allowed.");
      return;
    }

    const formData = new FormData();
    if (file) formData.append("file", file);
    formData.append("description", description);

    try {
      const res = await axios.post(`${API_BASE}/api/posts/`, formData);
      const newPost = {
        ...res.data,
        file: res.data.file
          ? (res.data.file.startsWith("http")
            ? res.data.file
            : `${API_BASE}${res.data.file.startsWith("/") ? "" : "/"}${res.data.file}`)
          : null,
      };

      const updatedPosts = [newPost, ...posts];
      setPosts(updatedPosts);
      setWeeklyStatus(getWeeklyStatus(updatedPosts));
      setFile(null);
      setDescription("");
      setWordCount(0);
      setShowModal(false);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed.");
    }
  };

  const handleRemovePost = async (id) => {
    if (!isAdmin) return;

    try {
      await axios.delete(`${API_BASE}/api/posts/${id}/`);
      const updatedPosts = posts.filter((post) => post.id !== id);
      setPosts(updatedPosts);
      setWeeklyStatus(getWeeklyStatus(updatedPosts));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 min-h-screen pb-32">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Event Posts</h2>

      <div className="mb-6">
        {weeklyStatus.total >= 16 ? (
          <p className="text-red-600 font-medium">Maximum 16 posts reached for the month!</p>
        ) : weeklyStatus.week > 4 ? (
          <p className="text-red-600 font-medium">Event period (4 weeks) has ended!</p>
        ) : weeklyStatus.count >= 4 ? (
          <div className="flex flex-col gap-2">
            <p className="text-orange-600 font-medium">Weekly limit reached (4/4)!</p>
            <p className="text-gray-600 text-sm">Please upload next week (Week {weeklyStatus.week + 1})</p>
          </div>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-700 hover:bg-green-500 text-white px-4 sm:px-6 py-2 rounded text-sm sm:text-base shadow-lg transition-all"
          >
            + Create Post (Week {weeklyStatus.week}: {weeklyStatus.count}/4)
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-2">
          <div
            className="w-full max-w-xs sm:max-w-md md:max-w-lg rounded-2xl shadow-xl p-4 sm:p-6 border border-white/30"
            style={{
              background: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">Create New Post</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-600 hover:text-black text-2xl">×</button>
            </div>

            <label className="border border-dashed rounded-xl cursor-pointer h-48 flex flex-col justify-center items-center mb-4 bg-white/20 w-full">
              {file ? (
                file.type.startsWith("video/") ? (
                  <video className="max-h-40 sm:max-h-48 md:max-h-56 lg:max-h-60 rounded" controls>
                    <source src={URL.createObjectURL(file)} />
                  </video>
                ) : (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="max-h-40 sm:max-h-48 md:max-h-56 lg:max-h-60 rounded object-contain"
                  />
                )
              ) : (
                <>
                  <span className="text-gray-700 text-sm sm:text-base">Click to upload</span>
                  <span className="text-gray-800 text-xs sm:text-sm">Image (&lt;500KB) Jpg or Png</span>
                </>
              )}
              <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
            </label>

            <p className="text-sm sm:text-base font-medium text-black mb-1">Description</p>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setWordCount(e.target.value.trim().split(/\s+/).filter(Boolean).length);
              }}
              placeholder="Share what makes this moment special..."
              className="w-full rounded-lg p-2 sm:p-3 md:p-4 border text-sm sm:text-base bg-white/40 backdrop-blur"
              rows={3}
            />
            <p className="text-xs sm:text-sm text-black mt-1">{wordCount}/20 words</p>

            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 sm:px-5 sm:py-3 rounded bg-white/50 hover:bg-white/70 text-sm sm:text-base">
                Cancel
              </button>
              <button onClick={handlePost} className="px-5 py-2 sm:px-6 sm:py-3 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm sm:text-base">
                Publish Post
              </button>
            </div>
          </div>
        </div>
      )}

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow p-3 sm:p-4 flex flex-col h-full">
              {post.file && (
                <div className="w-full max-h-60 sm:max-h-64 md:max-h-72 flex items-center justify-center overflow-hidden rounded-lg mb-3 bg-gray-100">
                  {post.file.endsWith(".mp4") || post.file.endsWith(".webm") ? (
                    <video controls className="max-h-60 sm:max-h-64 md:max-h-72 w-auto object-contain rounded">
                      <source src={post.file} type="video/mp4" />
                    </video>
                  ) : (
                    <img src={post.file} alt="" className="max-h-60 sm:max-h-64 md:max-h-72 w-auto object-contain" />
                  )}
                </div>
              )}

              {post.description && (
                <p className="text-gray-800 text-sm sm:text-base mt-2 break-words line-clamp-4">{post.description}</p>
              )}

            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm sm:text-base">No posts yet.</p>
      )}
    </div>
  );
};

export default Event;
