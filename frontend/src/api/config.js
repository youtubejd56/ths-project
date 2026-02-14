const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const API_BASE_URL = isLocal
    ? (import.meta.env.VITE_API_URL || "http://localhost:8000")
    : "https://ths-backend-pvu4.onrender.com";

export default API_BASE_URL;
