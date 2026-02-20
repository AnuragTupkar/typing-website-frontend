import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// --- Dashboard Overview ---
export const getDashboardStats = async () => {
    const response = await axios.get(`${API_URL}/admin/dashboard`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

// --- Performance ---
export const getPerformanceReport = async () => {
    const response = await axios.get(`${API_URL}/admin/performance`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

// --- Attendance ---
export const getAttendanceReport = async () => {
    const response = await axios.get(`${API_URL}/admin/attendance`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

// --- Fees ---
export const getAllFees = async () => {
    const response = await axios.get(`${API_URL}/fees`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const createFee = async (feeData) => {
    const response = await axios.post(`${API_URL}/fees`, feeData, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const updateFee = async (id, feeData) => {
    const response = await axios.put(`${API_URL}/fees/${id}`, feeData, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const getFeeSummary = async () => {
    const response = await axios.get(`${API_URL}/fees/summary`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

// --- Users (for dropdowns) ---
export const getUserList = async () => {
    // Re-using the admin users endpoint
    const response = await axios.get(`${API_URL}/admin/users?limit=1000`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

// --- Students (full admission data with credentials) ---
export const getAllStudents = async () => {
    const response = await axios.get(`${API_URL}/admissions`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

// --- Batches ---
export const getAvailableBatches = async () => {
    const response = await axios.get(`${API_URL}/batches/available`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const changeStudentBatch = async (toBatchId, studentId, fromBatchId) => {
    const response = await axios.post(`${API_URL}/batches/${toBatchId}/change-batch`, { studentId, fromBatchId }, {
        headers: getAuthHeader(),
    });
    return response.data;
};
