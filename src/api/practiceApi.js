import axios from 'axios';

const API_URL = 'http://localhost:3000/api/practice';

// Helper to get the token
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

export const getMyStats = async () => {
    const response = await axios.get(`${API_URL}/stats`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const getMyHistory = async (page = 1, limit = 10) => {
    const response = await axios.get(`${API_URL}/history`, {
        headers: getAuthHeader(),
        params: { page, limit },
    });
    return response.data;
};

export const getSessionDetail = async (id) => {
    const response = await axios.get(`${API_URL}/history/${id}`, {
        headers: getAuthHeader(),
    });
    return response.data;
};
