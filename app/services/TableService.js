import { getApiUrl } from './Constants';

// todo: use pagination?
export const getTables = () => {
    return fetch(getApiUrl() + 'tables');
}