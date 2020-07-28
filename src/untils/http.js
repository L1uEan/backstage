
import axios from 'axios';

axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1'

// 请求拦截
axios.interceptors.request.use(config => {

   let token = localStorage.getItem("token")
        if(token){
              config.headers.Authorization = token
        }
   return config;
})

export default axios;

