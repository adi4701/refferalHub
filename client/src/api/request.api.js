import api from './axios';

export const createRequest = async (data) => {
    const response = await api.post('/requests', data);
    return response.data;
};

export const getMyRequests = async (params) => {
    const response = await api.get('/requests/my', { params });
    return response.data;
};

export const getRequestById = async (id) => {
    const response = await api.get(`/requests/${id}`);
    return response.data;
};

export const updateRequestStatus = async (id, data) => {
    const response = await api.patch(`/requests/${id}/status`, data);
    return response.data;
};
