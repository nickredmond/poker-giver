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
                    response => {
                        if (response.ok) {
                            response.json().then(responseBody => {
                                AsyncStorage.setItem('user-token', responseBody.refreshedToken, (err) => {
                                    if (err) {
                                        reject('Error using device storage.');
                                    }
                                    else {
                                        resolve(true);
                                    }
                                });
                            });
                        }
                        else if (response.status === 400 || response.status === 401) {
                            response.json().then(err => {
                                resolve(false);
                            });
                        }
                        else {
                            reject('Error while authenticating.');
                        }
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
                    const numberOfChips = response.numberOfChips.toString();
                    AsyncStorage.setItem('number-of-chips', numberOfChips, (err) => {
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
            response => {
                if (response.ok) {
                    response.json().then(responseBody => {
                        saveAuthResponseData(username, responseBody, resolve, reject);
                    });
                }
                else if (response.status === 400 || response.status === 401) {
                    response.json().then(err => {
                        resolve({ 
                            isSuccess: false, 
                            playerAlreadyExists: err.playerAlreadyExists,
                            isEmailTaken: player.isEmailTaken
                        });
                    });
                }
                else {
                    reject('Error while trying to create user.');
                }
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
            response => {
                if (response.ok) {
                    response.json().then(responseBody => {
                        saveAuthResponseData(username, responseBody, resolve, reject);
                    });
                }
                else if (response.status === 400 || response.status === 401) {
                    response.json().then(err => {
                        resolve({ isSuccess: false, playerExists: err.playerExists });
                    });
                }
                else {
                    reject('Error while trying to log in.');
                }
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