import api from './axios';

export const register = async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
};

export const login = async (data) => {
    const response = await api.post('/auth/login', data);
    return response.data;
};

export const logout = async () => {
    const response = await api.post('/auth/logout');
    return response.data;
};

export const refreshToken = async () => {
    const response = await api.post('/auth/refresh-token');
    return response.data;
};

export const getMe = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
};

export const resetPassword = async (token, data) => {
    const response = await api.patch(`/auth/reset-password/${token}`, data);
    return response.data;
};

export const changePassword = async (data) => {
    const response = await api.patch('/auth/change-password', data);
    return response.data;
};
