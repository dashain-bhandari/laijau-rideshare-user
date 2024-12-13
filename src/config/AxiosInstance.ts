
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const AxiosInstance = axios.create({
    baseURL: `http://192.168.1.65:8000`,

});

AxiosInstance.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("user-token");

    config.headers.Authorization = `Bearer ${token}`;
    return config;
});