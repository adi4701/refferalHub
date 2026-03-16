import api from './axios';

export const getListings = async (params) => {
    const response = await api.get('/listings', { params });
    return response.data;
};

export const getListingById = async (id) => {
    const response = await api.get(`/listings/${id}`);
    return response.data;
};

export const getMyListings = async () => {
    const response = await api.get('/listings/my');
    return response.data;
};

export const createListing = async (data) => {
    const response = await api.post('/listings', data);
    return response.data;
};

export const updateListing = async (id, data) => {
    const response = await api.put(`/listings/${id}`, data);
    return response.data;
};

export const deleteListing = async (id) => {
    const response = await api.delete(`/listings/${id}`);
    return response.data;
};
