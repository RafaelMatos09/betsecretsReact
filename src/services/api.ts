import axios from 'axios';

const api = axios.create({
    baseURL : import.meta.env.REACT_APP_API   
});

export default api;