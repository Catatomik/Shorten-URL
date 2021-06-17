import axios from 'axios'
import { APIHost } from './config.json'

const API = axios.create({
    baseURL: APIHost,
    timeout: 1000,
    transformResponse: [function (data) {
        return JSON.parse(data);
    }],
    validateStatus: function (status) {
        return status < 500;
    },
});

async function sha256(message)  {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

export {
    API,
    sha256,
}