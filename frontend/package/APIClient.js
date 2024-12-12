import axios from 'axios';

const APIClient = axios.create({
//   baseURL: 'http://dhanutek-hrms.westus2.cloudapp.azure.com/api',
  baseURL: 'http://0.0.0.0:10000',
  // timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default APIClient;