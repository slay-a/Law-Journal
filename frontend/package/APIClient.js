import axios from 'axios';

const APIClient = axios.create({
  baseURL: 'https://law-journal.onrender.com',
  // timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});
// https://law-journal.onrender.com
export default APIClient;