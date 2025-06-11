import axios from 'axios';

const BASE_URL = 'http://localhost:8080/tasks'; // Update this based on your backend

export const getTasks = () => axios.get(BASE_URL);

export const getTaskById = (id) => axios.get(`${BASE_URL}/${id}`);

export const searchTasksByName = (query) => axios.get(`${BASE_URL}/search?name=${query}`);

export const createTask = (task) => axios.put(BASE_URL, task);

export const deleteTask = (id) => axios.delete(`${BASE_URL}/${id}`);

export const executeTask = (id) => axios.put(`${BASE_URL}/${id}/execute`);
