import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const uploadDocument = async (formData) => {
    const response = await axios.post(`${API_URL}/documents`, formData, {
        headers: {
            ...getAuthHeader(),
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const getAllDocuments = async () => {
    const response = await axios.get(`${API_URL}/documents`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const downloadDocument = async (id, originalName) => {
    const response = await axios.get(`${API_URL}/documents/${id}/download`, {
        headers: getAuthHeader(),
        responseType: 'blob'
    });
    // Trigger browser download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', originalName || 'document');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};

export const deleteDocument = async (id) => {
    const response = await axios.delete(`${API_URL}/documents/${id}`, {
        headers: getAuthHeader()
    });
    return response.data;
};
