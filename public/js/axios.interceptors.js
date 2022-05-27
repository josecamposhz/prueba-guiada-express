// Agregar un interceptor a la petición
axios.interceptors.request.use(function (config) {
    // Haz algo antes que la petición se ha enviada
    config.headers.authorization = localStorage.getItem("token") || "";
    return config;
}, function (error) {
    // Haz algo con el error de la petición
    return Promise.reject(error);
});