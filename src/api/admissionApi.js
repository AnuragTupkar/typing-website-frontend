import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createAdmission = async (data) => {
    const response = await axios.post(`${API_URL}/admissions`, data, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const getAllAdmissions = async () => {
    const response = await axios.get(`${API_URL}/admissions`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const deleteAdmission = async (id) => {
    const response = await axios.delete(`${API_URL}/admissions/${id}`, {
        headers: getAuthHeader()
    });
    return response.data;
};
