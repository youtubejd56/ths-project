import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/config';

const API_BASE = API_BASE_URL.replace(/\/$/, '');

const Event = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false); // 🔥 ADDED

  useEffect(() => {
    axios.get(`${API_BASE}/api/posts/`)
      .then((res) => {

        // 🔥 EXPECT BACKEND RESPONSE LIKE:
        // { posts: [...], isAdmin: true/false }

        const formattedPosts = res.data.posts.map(post => ({
          ...post,
          file: post.file
            ? (post.file.startsWith('http') ? post.file : `${API_BASE}${post.file.startsWith('/') ? '' : '/'}${post.file}`)
            : null,
        }));

        setPosts(formattedPosts);
        setIsAdmin(res.data.isAdmin || false); // 🔥 SET ADMIN
      })
      .catch((err) => console.error('Failed to load posts:', err));
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/") && !selectedFile.type.startsWith("video/")) {
      alert("❌ Only image or video allowed!");
      e.target.value = null;
      return;
    }

    if (selectedFile.type.startsWith("image/") && selectedFile.size > 500 * 1024) {
      alert("❌ Image must be < 500KB!");
      e.target.value = null;
      return;
    }

    setFile(selectedFile);
  };

  const removeFile = () => setFile(null);

  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    const words = text.trim() ? text.trim().split(/\s+/) : [];
    setDescription(text);
    setWordCount(words.length);
  };

  const handlePost = async () => {
    if (posts.length >= 4) {
      alert("❌ Maximum 4 posts allowed!");
      return;
    }

    if (!file && !description.trim()) {
      alert('Add a file or description.');
      return;
    }

    if (wordCount > 20) {
      alert('Max 20 words allowed.');
      return;
    }

    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('description', description);

    try {
      const response = await axios.post(`${API_BASE}/api/posts/`, formData);
      const newPost = {
        ...response.data,
        file: response.data.file
          ? (response.data.file.startsWith('http')
            ? response.data.file
            : `${API_BASE}${response.data.file.startsWith('/') ? '' : '/'}${response.data.file}`)
          : null,
      };
      setPosts([newPost, ...posts]);
      setFile(null);
      setDescription('');
      setShowModal(false);
      setWordCount(0);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload.');
    }
  };

  const handleRemovePost = async (id) => {
    if (!isAdmin) return; // 🔥 BLOCK NON-ADMIN DELETE

    try {
      await axios.delete(`${API_BASE}/api/posts/${id}/`);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <div className="px-8 py-6 min-h-screen pb-32">
      <h2 className="text-3xl font-bold mb-6">Event Posts</h2>

      {posts.length < 4 ? (
        <button
          onClick={() => setShowModal(true)}
          className="mb-6 bg-green-700 hover:bg-green-500 text-white px-6 py-2 rounded"
        >
          + Create Post
        </button>
      ) : (
        <p className="text-red-600 mb-4 text-sm">Max 4 posts allowed!</p>
      )}

      {posts.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow p-4 flex flex-col h-full">
              {post.file && (
                <div className="w-full max-h-60 flex items-center justify-center overflow-hidden rounded-lg mb-3 bg-gray-100">
                  {post.file.endsWith('.mp4') || post.file.endsWith('.webm') ? (
                    <video controls className="max-h-60 w-auto object-contain rounded">
                      <source src={post.file} type="video/mp4" />
                    </video>
                  ) : (
                    <img src={post.file} alt="" className="max-h-60 w-auto object-contain" />
                  )}
                </div>
              )}

              {post.description && (
                <p className="text-gray-800 text-sm mt-2 break-words line-clamp-4">{post.description}</p>
              )}

              {/* 🔥 DELETE BUTTON ONLY FOR ADMIN */}
              {isAdmin && (
                <button
                  onClick={() => handleRemovePost(post.id)}
                  className="mt-4 bg-red-600 hover:bg-red-500 text-white px-4 py-1 rounded text-sm w-fit"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No posts yet.</p>
      )}
    </div>
  );
};

export default Event;
