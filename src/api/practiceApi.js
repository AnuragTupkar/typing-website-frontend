import axios from 'axios';

const API_URL = 'http://localhost:3000/api/practice';

// Helper to get the token (assuming it's stored in localStorage)
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const submitPracticeResult = async (sessionData) => {
    const response = await axios.post(`${API_URL}/submit`, sessionData, {
        headers: getAuthHeader(),
    });
    return response.data;
};
