import { getUserToken } from './PlayerService';
import { getApiUrl } from './Constants';

export const makeDonation = (donationAmount, charityName) => {
    return new Promise((resolve, reject) => {
        getUserToken().then(
            token => {
                fetch(getApiUrl() + 'player/donate', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token, donationAmount, charityName })
                }).then(response => {
                    if (response.ok) {
                        resolve();
                    }
                    else {
                        reject('Error submitting player donation');
                    }
                })
            },
            err => {
                reject(err);
            }
        )
    })
}

export const getDonationsInfo = () => {
    return new Promise((resolve, reject) => {
        getUserToken().then(
            token => {
                fetch(getApiUrl() + 'donations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token })
                }).then(response => {
                    if (response.ok) {
                        response.json().then(responseBody => {
                            resolve(responseBody);
                        })
                    }
                    else {
                        reject('Error getting donations');
                    }
                })
            },
            err => {
                reject(err);
            }
        )
    })
}