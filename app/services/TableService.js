
export const getApiUrl = () => {
    return 'https://poker-giver-api.herokuapp.com:19056/';
}

// todo: use pagination?
export const getTables = () => {
    alert('hell ' + getApiUrl())
    return fetch(getApiUrl() + 'tables');
}