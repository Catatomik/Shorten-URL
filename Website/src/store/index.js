import axios from 'axios'

const API = axios.create({
    baseURL: 'https://localhost:3001/',
    timeout: 1000,
    transformResponse: [function (data) {
        console.log(data)
        return JSON.parse(data);
    }],
    validateStatus: function (status) {
        return status < 500;
    },
});

export {
    API,
}