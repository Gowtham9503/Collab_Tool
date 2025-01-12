import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const user = JSON.parse(localStorage.getItem('user'));
const token = user ? user.token : null;

export const getDocuments = async () => {
    try {
        const { data } = await axios.get(`${API_URL}/documents`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    } catch (error) {
        throw new Error('Failed to fetch documents');
    }
};

export const getDocumentById = async (id) => {
    try {
        const { data } = await axios.get(`${API_URL}/documents/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    } catch (error) {
        throw new Error('Failed to fetch document');
    }
};

export const updateDocument = async (id, documentData) => {
    try {
        const { data } = await axios.put(`${API_URL}/documents/${id}`, documentData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    } catch (error) {
        throw new Error('Failed to update document');
    }
};

export const deleteDocument = async (id) => {
    try {
        const { data } = await axios.delete(`${API_URL}/documents/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    } catch (error) {
        throw new Error('Failed to delete document');
    }
};