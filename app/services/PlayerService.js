import { AsyncStorage } from 'react-native';
import { getApiUrl } from './Constants';

// todo: refresh token periodically
export const authenticate = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('user-token', (err, token) => {
            if (err) {
                reject('Error reading values from device.');
            }
            else if (token) {
                fetch(getApiUrl() + 'authenticate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token })
                }).then(
                    (response) => {
                        AsyncStorage.setItem('user-token', response.refreshedToken, (err) => {
                            if (err) {
                                reject('Error using device storage.');
                            }
                            else {
                                resolve(true);
                            }
                        });
                    },
                    (err) => {
                        alert('err authing ', err);
                        // todo: resolve(false) if 401 status, else reject
                    }
                );
            }
            else {
                resolve(false);
            }
        })
    });
}

export const saveAuthResponseData = (response, resolve, reject) => {
    AsyncStorage.setItem('user-token', response.token, (err) => {
        if (err) {
            reject('Error saving to device storage.');
        }
        else {
            AsyncStorage.setItem('number-of-chips', response.numberOfChips, (err) => {
                if (err) {
                    reject('Error saving to device storage.');
                }
                else {
                    resolve({ isSuccess: true });
                }
            })
        }
    })
}

export const createUser = (username, password) => {
    return new Promise((resolve, reject) => {
        fetch(getApiUrl() + 'create-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        }).then(
            (response) => {
                saveAuthResponseData(response, resolve, reject);
            },
            (err) => {
                alert('err creating user ', err);
                // todo: if 400 then resolve({isSuccess=false, isUserTaken})
            }
        );
    });
}

export const logIn = (username, password) => {
    return new Promise((resolve, reject) => {
        fetch(getApiUrl() + 'log-in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        }).then(
            (response) => {
                saveAuthResponseData(response, resolve, reject);
            },
            (err) => {
                alert('err logging in ', err);
                // todo: if 400 then resolve({isSuccess=false, playerExists, invalidPassword})
                // invalid password if 400 and !playerExists
            }
        );
    });
}

export const getNumberOfChips = (isLocal) => {
    return new Promise((resolve, reject) => {
        if (isLocal) {
            AsyncStorage.getItem('number-of-chips', (err, numberOfChips) => {
                if (err) {
                    reject('Error reading from device storage.');    
                }
                else {
                    const chipsCount = numberOfChips || 0;
                    resolve(chipsCount);
                }
            });
        }
        else {
            AsyncStorage.getItem('user-token', (err, token) => {
                if (err) {
                    reject('Error reading values from device.');
                }
                else {
                    // todo: implement this in API
                    fetch(getApiUrl() + 'chips-count', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ token })
                    }).then(
                        (chipsCount) => {
                            AsyncStorage.setItem('number-of-chips', chipsCount, (err) => {
                                if (err) {
                                    reject('Error reading from device storage.');
                                }
                                else {
                                    resolve(chipsCount);
                                }
                            })
                        }, 
                        (err) => {
                            reject('Error retrieving player info.');
                        }
                    );
                }
            });
        }
    })
}