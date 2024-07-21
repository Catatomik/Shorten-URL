import axios from "axios";
import { APIHost } from "./config.json";
import { password } from "./auth";
import { ref } from "vue";
import type { URL } from "shorten-url-api/built/models";

const API = axios.create({
  baseURL: APIHost,
  timeout: 5_000,

  validateStatus: function (status) {
    return status < 500;
  },
});

function fetch<R = unknown>(path: string, overridePassword?: string) {
  return API.get<R>(path, {
    params: {
      password: overridePassword ?? password.value.hashed,
    },
  });
}

const shorteneds = ref<URL[]>([]);

export { API, fetch, shorteneds };
