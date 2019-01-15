import { getApiUrl } from './Constants';

// todo: use pagination?
export const getTables = (token) => {
    return new Promise((resolve, reject) => {
        fetch(getApiUrl() + 'tables', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
        })
        .then(response => {
            if (response.ok) {
                response.json().then(body => {
                    resolve({isSuccess: true, tables: body});
                });
            }
            else {
                resolve({isSuccess: false});
            }
        });
    });
}

export const createTable = (table, token) => {
    //isNameTaken
    return new Promise((resolve, reject) => {
        fetch(getApiUrl() + 'table', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ table, token })
        }).then(response => {
            // response => {
            //     if (response.ok) {
            //         response.json().then(responseBody => {
            //             saveAuthResponseData(username, responseBody, resolve, reject);
            //         });
            //     }
            //     else if (response.status === 400 || response.status === 401) {
            //         response.json().then(err => {
            //             resolve({ isSuccess: false, playerExists: err.playerExists });
            //         });
            //     }
            //     else {
            //         reject('Error while trying to log in.');
            //     }
            // }
            if (response.ok) {
                response.json().then(responseBody => {
                    resolve({ isSuccess: true, gameId: responseBody.gameId });
                });
            }
            else if (response.status === 400) {
                response.json().then(err => {
                    resolve({ isSuccess: false, isNameTaken: err.isNameTaken });
                });
            }
            else {
                reject('Error while trying to create table.');
            }
        });
    })
}