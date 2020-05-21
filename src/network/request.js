import axios from 'axios'

export function request(config) {
  //创建axios实例
  const instance = axios.create({
    baseURL:'http://123.207.32.32:8000/api/m3',
    // http://123.207.32.32:8000/api/hy
    // http://106.54.54.237:8000/api/hy
    timeout: 5000
  })

  //axios拦截器
  //请求拦截的作用
  instance.interceptors.request.use(config => {
    /*
    * 比如config中一些信息不符合服务器要求
    * 比如每次发送网络请求时，都希望在界面中显示一个请求的图标
    * 某些网络请求(比如登录(token))必须携带一些特殊的信息
    * */
    return config
  },err => {
    console.log(err);
  })

  //响应拦截
  instance.interceptors.response.use(res =>{
    return res.data
  },err => {
    console.log(err);
  })

  //发送真正的网络请求
  return instance(config)



}


