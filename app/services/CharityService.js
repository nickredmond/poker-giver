import { getApiUrl } from './Constants';

// minRating optional and defaults to zero on server side
export const searchCharities = (query, token) => {
    return new Promise((resolve, reject) => {
        fetch(getApiUrl() + 'charities/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query, token })
        })
        .then(
            response => {
                response.json().then(responseBody => {
                    resolve(responseBody);
                })
            },
            err => {
                reject(err);
            }
        )
    })
}