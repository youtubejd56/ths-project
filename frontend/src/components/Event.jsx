import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/config';

const API_BASE = API_BASE_URL;

const Event = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    axios.get(`${API_BASE}/api/posts/`)
      .then((res) => {
        const formattedPosts = res.data.map(post => ({
          ...post,
          file: post.file
            ? (post.file.startsWith('http') ? post.file : `${API_BASE.replace(/\/$/, '')}${post.file}`)
            : null,
        }));
        setPosts(formattedPosts);
      })
      .catch((err) => console.error('Failed to load posts:', err));
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    const words = text.trim() ? text.trim().split(/\s+/) : [];

    setDescription(text);
    setWordCount(words.length);
  };

  const handlePost = async () => {
    if (!file && !description.trim()) {
      alert('Please add a file or description.');
      return;
    }

    if (wordCount > 20) {
      alert('Caption cannot exceed 20 words.');
      return;
    }

    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('description', description);

    try {
      const response = await axios.post(`${API_BASE}/api/posts/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

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
      alert('Failed to upload post.');
    }
  };

  const handleRemovePost = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/posts/${id}/`);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete post.');
    }
  };

  return (
    <div className="px-8 py-6 h-screen">
      <h2 className="text-3xl font-bold mb-6">Event Posts</h2>

      <button
        onClick={() => setShowModal(true)}
        className="mb-6 bg-green-700 hover:bg-green-500 text-white px-6 py-2 rounded"
      >
        + Create Post
      </button>

      {posts.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow p-4 flex flex-col h-full">
              {/* Media */}
              {post.file && (
                <div className="w-full max-h-60 flex items-center justify-center overflow-hidden rounded-lg mb-3 bg-gray-100">
                  {post.file.endsWith('.mp4') || post.file.endsWith('.webm') ? (
                    <video
                      controls
                      className="max-h-60 w-auto object-contain rounded"
                    >
                      <source src={post.file} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={post.file}
                      alt="Uploaded"
                      className="max-h-60 w-auto object-contain"
                    />
                  )}
                </div>
              )}

              {/* Description */}
              {post.description && (
                <p className="text-gray-800 text-sm mt-2 break-words line-clamp-4">
                  {post.description}
                </p>
              )}

              {/* Remove button */}
              <button
                onClick={() => handleRemovePost(post.id)}
                className="mt-4 bg-red-600 hover:bg-red-500 text-white px-4 py-1 rounded text-sm w-fit"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No posts yet.</p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-96 p-6 relative shadow-xl border border-white/20 animate-fadeIn">
            <h2 className="text-lg font-semibold mb-4 text-center">Create Post</h2>
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-700 text-xl"
            >
              &times;
            </button>

            {file && file.type.startsWith('image/') && (
              <div className="relative mb-4">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="rounded-lg w-full max-h-60 object-contain border bg-gray-100"
                />
                <button
                  onClick={removeFile}
                  className="absolute top-2 right-2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  &#10005;
                </button>
              </div>
            )}

            {file && file.type.startsWith('video/') && (
              <div className="relative mb-4">
                <video
                  controls
                  className="rounded-lg w-full max-h-60 object-contain border bg-gray-100"
                  src={URL.createObjectURL(file)}
                />
                <button
                  onClick={removeFile}
                  className="absolute top-2 right-2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  &#10005;
                </button>
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 p-4 text-center rounded-lg mb-4">
              <input
                type="file"
                accept="image/*,video/*,application/pdf"
                onChange={handleFileChange}
                id="fileInput"
                className="hidden"
              />
              <label htmlFor="fileInput" className="cursor-pointer text-blue-500">
                Browse File
              </label>
            </div>

            <textarea
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Write your caption here... (max 20 words)"
              className={`w-full h-24 p-2 border rounded-lg focus:outline-none focus:ring-2 ${wordCount > 20 ? 'border-red-500 focus:ring-red-400' : 'focus:ring-blue-400'
                } mb-1`}
            ></textarea>

            {/* Word counter */}
            <p className={`text-xs mb-4 text-right ${wordCount > 20 ? 'text-red-500' : 'text-gray-500'
              }`}>
              {wordCount}/20 words
            </p>

            <button
              onClick={handlePost}
              disabled={wordCount > 20}
              className={`w-full py-2 rounded text-white ${wordCount > 20
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-700 hover:bg-green-500'
                }`}
            >
              Upload Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Event;
