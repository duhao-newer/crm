//对axios的请求地址进行统一的调配，即二次封装
axios.defaults.baseURL = 'http://localhost:8888';
//改变提交数据的格式，使之以表单的形式提交
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
//再次改变数据的格式，使之成为:name=s&age=4
axios.defaults.transformRequest = function (data) {
    if (!data) return data;
    let result = '';
    for (let attr in data) {
        if (!data.hasOwnProperty(attr)) break;
        result += `&${attr}=${data[attr]}`;
    }
    return result.substring(1);
}
//配置请求拦截器，如果有token，可以在这里配置
axios.interceptors.request.use(config=>{
    return config;
})
//配置相应拦截器
axios.interceptors.response.use(response=>{
    return response.data;
},reason=>{
    if(reason.response){
        switch(String(reason.response.status)){
            case '404':
                alert("当前请求的路径不存在");
                break;
            default:
                break;    
        }
    }
    return Promise.reject(reason);
})