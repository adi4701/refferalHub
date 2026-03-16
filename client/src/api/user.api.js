import api from './axios';

export const getUserProfile = async (id) => {
    const response = await api.get(`/users/profile/${id}`);
    return response.data;
};

export const updateProfile = async (data) => {
    const response = await api.patch('/users/profile', data);
    return response.data;
};

export const uploadAvatar = async (formData) => {
    const response = await api.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const getStats = async () => {
    const response = await api.get('/users/stats');
    return response.data;
};

export const getDashboard = async () => {
    const response = await api.get('/users/dashboard');
    return response.data;
};
