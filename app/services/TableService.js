import { getApiUrl } from './Constants';

// todo: use pagination?
export const getTables = (token) => {
    return fetch(getApiUrl() + 'tables', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
    });
}