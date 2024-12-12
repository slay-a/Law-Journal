import axios from 'axios';

const APIClient = axios.create({
  baseURL: 'http://0.0.0.0:10000',
  // timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});
// https://law-journal.onrender.com
export default APIClient;