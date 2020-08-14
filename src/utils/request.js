import axios from "axios"
import store from "../store/index";
import { getToken, setToken } from "../utils/auth";

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 15000,
});

service.interceptors.request.use(
    (config) => {
        if (store.getters.isAuth) {
            config.headers["Authorization"] = "Bearer" + getToken();
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

service.interceptors.response.use(
    (response) => {
        const { data } = response;
        return data;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default service;