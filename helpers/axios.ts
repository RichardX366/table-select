import axios from 'axios';
import { error } from '@bctc/components';

const a = axios.create({ baseURL: '/api' });
a.interceptors.response.use(
  (response) => {
    return response;
  },
  (response) => {
    if (response?.name !== 'AbortError' && response?.name !== 'CanceledError') {
      error(response);
    }
    return response;
  },
);

export default a;
