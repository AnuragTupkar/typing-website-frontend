import axios from 'axios';

const API_URL = 'http://localhost:3000/api/attendance';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const sendHeartbeat = async () => {
    const response = await axios.post(`${API_URL}/heartbeat`, {}, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const getTodayAttendance = async () => {
    const response = await axios.get(`${API_URL}/today`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const getAttendanceSummary = async () => {
    const response = await axios.get(`${API_URL}/summary`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const getMyAttendance = async (page = 1, limit = 30) => {
    const response = await axios.get(`${API_URL}/my`, {
        headers: getAuthHeader(),
        params: { page, limit },
    });
    return response.data;
};
