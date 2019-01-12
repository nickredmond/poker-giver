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

export const saveAuthResponseData = (username, response, resolve, reject) => {
    AsyncStorage.setItem('player-name', username, (err) => {
        if (err) {
            reject('Error saving to device storage.');
        }
        else {
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
            });
        }
    })
}

export const createUser = (username, password, email) => {
    return new Promise((resolve, reject) => {
        fetch(getApiUrl() + 'create-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, email })
        }).then(
            (response) => {
                saveAuthResponseData(userame, response, resolve, reject);
            },
            (err) => {
                alert('err creating user ', err);
                // todo: if 400 then resolve({isSuccess=false, isUserTaken, isEmailTaken})
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
                saveAuthResponseData(username, response, resolve, reject);
            },
            (err) => {
                alert('err logging in ', err);
                // todo: if 400 then resolve({isSuccess=false, playerExists, invalidPassword})
                // invalid password if 400 and !playerExists
            }
        );
    });
}

export const getPlayerInfo = (isLocal) => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('player-name', (err, playerName) => {
            if (err) {
                reject('Error reading from device storage.');
            }
            else if (isLocal) {
                AsyncStorage.getItem('number-of-chips', (err, numberOfChips) => {
                    if (err) {
                        reject('Error reading from device storage.');    
                    }
                    else {
                        const chipsCount = numberOfChips || 0;
                        resolve({ playerName, numberOfChips: chipsCount });
                    }
                });
            }
            else {
                AsyncStorage.getItem('user-token', (err, token) => {
                    if (err) {
                        reject('Error reading values from device.');
                    }
                    else {
                        fetch(getApiUrl() + 'chips-count', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ token })
                        }).then(
                            (response) => {
                                const chipsCount = response.numberOfChips || 0;
                                AsyncStorage.setItem('number-of-chips', chipsCount, (err) => {
                                    if (err) {
                                        reject('Error reading from device storage.');
                                    }
                                    else {
                                        resolve({ playerName, numberOfChips: chipsCount });
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
    })
}