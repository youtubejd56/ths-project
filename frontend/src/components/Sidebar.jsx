import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../api/config";

const API_BASE = API_BASE_URL.replace(/\/$/, '');

const AdminEventPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/api/posts/`)
      .then(res => setPosts(res.data.posts || res.data))
      .catch(err => console.error("Failed to load posts:", err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await axios.delete(`${API_BASE}/api/posts/${id}/`);
      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Manage Event Posts</h2>

      {posts.length > 0 ? (
        <div className="grid grid-cols-3 gap-6">
          {posts.map(post => (
            <div key={post.id} className="border rounded-lg shadow p-4">
              {post.file && (
                <div className="w-full h-40 overflow-hidden rounded bg-gray-200 flex justify-center">
                  {post.file.endsWith(".mp4") ? (
                    <video controls className="h-full">
                      <source src={post.file} type="video/mp4" />
                    </video>
                  ) : (
                    <img src={post.file} className="h-full object-contain" />
                  )}
                </div>
              )}
              <p className="text-sm mt-2">{post.description}</p>

              <button
                onClick={() => handleDelete(post.id)}
                className="mt-3 bg-red-600 text-white px-4 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
};

export default AdminEventPosts;
