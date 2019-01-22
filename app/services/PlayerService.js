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
                                        setLastLogin().then(
                                            () => { resolve(true); },
                                            () => { reject('Error using device storage.') }
                                        )
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
                            setLastLogin().then(
                                () => { resolve({ isSuccess: true }); },
                                () => { reject('Error using device storage.') }
                            )
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

export const logOut = () => {
    return new Promise((resolve, reject) => {
        try {
            AsyncStorage.removeItem('user-token', err => {
                if (err) {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            })
        } catch(err) {
            reject('Error accessing device storage.');
        }
    })
}

export const removeChips = (numberOfChips, userToken) => {
    return new Promise((resolve, reject) => {
        fetch(getApiUrl() + 'player/removeChips', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ numberOfChips, token: userToken })
        }).then(
            response => {
                if (response.ok) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            }
        );
    });
}

export const getPlayerInfo = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('player-name', (err, playerName) => {
            if (err) {
                reject('Error reading from device storage.');
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
                        }).then(response => {
                            if (response.ok) {
                                response.json().then(responseBody => {
                                    const chipsCount = (responseBody.numberOfChips || 0).toString();
                                    AsyncStorage.setItem('number-of-chips', chipsCount, (err) => {
                                        if (err) {
                                            reject('Error reading from device storage.');
                                        }
                                        else {
                                            resolve({ name: playerName, numberOfChips: chipsCount });
                                        }
                                    })
                                })
                            }
                            else {
                                //todo: better error handling
                                alert('Error reading from device storage.');
                            }
                        });
                    }
                });
            }
        })
    })
}

export const getUserToken = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('user-token', (err, token) => {
            if (err) {
                reject('Error reading values from device.');
            }
            else {
                resolve(token);
            }
        });
    })
}
export const getLastLogin = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('last-login', (err, lastLogin) => {
            if (err) {
                reject('Error reading values from device.');
            }
            else {
                const lastLoginDate = lastLogin ? new Date(lastLogin) : null;
                resolve(lastLoginDate);
            }
        })
    })
}
export const setLastLogin = () => {
    return new Promise((resolve, reject) => {
        const lastLogin = new Date().toString();
        AsyncStorage.setItem('last-login', lastLogin, err => {
            if (err) {
                reject('Error reading values from device.');
            }
            else {
                resolve();
            }
        });
    })
}

export const isAuthorOfGame = (gameId) => {
    return new Promise((resolve, reject) => {
        getUserToken().then(
            token => {
                fetch(getApiUrl() + `player/start-game/${gameId}/is-authorized`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token })
                }).then(response => {
                    if (response.ok) {
                        response.json().then(responseBody => {
                            resolve({
                                token,
                                isAuthor: responseBody.isAuthorized
                            });
                        })
                    }
                    else {
                        reject('Error authorizing user for game.');
                    }
                })
            },
            err => {
                reject(err);
            }
        )
    })
}

// timeType=['current', 'previous']
export const getRankings = (timeType) => {
    return new Promise((resolve, reject) => {
        getUserToken().then(
            token => {
                fetch(getApiUrl() + `rankings/${timeType}`, {
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
                        reject('Error getting rankings.');
                    }
                })
            },
            err => {
                reject(err);
            }
        )
    })
}

export const getPlayerAccountInfo = () => {
    return new Promise((resolve, reject) => {
        getUserToken().then(
            token => {
                fetch(getApiUrl() + 'player-account', {
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
                        reject('Error getting player account info');
                    }
                })
            },
            err => {
                reject(err);
            }
        )
    })
}