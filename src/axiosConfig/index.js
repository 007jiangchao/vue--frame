import axios from "./axiosConfig";

//设置默认请求头
axios.defaults.headers = {
  "X-Requested-With": "XMLHttpRequest",
  Connection: "keep-alive"
};

axios.defaults.timeout = 5000;

export default {
  //get请求
  get(url, param, time) {
    return new Promise(resolve => {
      axios({
        method: "get",
        url,
        params: param,
        timeout: time || 20000
      })
        .then(res => {
          resolve(res);
        })
        .catch(error => errorDispose(url, error))
        .finally(); //一般用于关闭load
    });
  },
  //post请求
  post(url, param, time) {
    return new Promise(resolve => {
      axios({
        method: "post",
        url,
        data: param,
        timeout: time || 20000
      })
        .then(res => {
          resolve(res);
        })
        .catch(error => errorDispose(url, error));
    }).finally(); ////一般用于关闭load
  }
};
function errorDispose(url, error) {
  /* eslint-disable */
  console.error("请求的错误地址 : " + url + "错误信息 : " + error.message);
}
