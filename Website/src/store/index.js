import axios from 'axios'
import { APIHost } from './config.json'

const API = axios.create({
    baseURL: APIHost,
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