
export const getApiUrl = () => {
    return 'https://poker-giver-api.herokuapp.com/';
}

// todo: use pagination?
export const getTables = () => {
    return fetch(getApiUrl() + 'tables');
}