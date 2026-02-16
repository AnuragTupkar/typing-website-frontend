import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createInquiry = async (data) => {
    const response = await axios.post(`${API_URL}/inquiries`, data, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const getAllInquiries = async () => {
    const response = await axios.get(`${API_URL}/inquiries`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const deleteInquiry = async (id) => {
    const response = await axios.delete(`${API_URL}/inquiries/${id}`, {
        headers: getAuthHeader(),
    });
    return response.data;
};
