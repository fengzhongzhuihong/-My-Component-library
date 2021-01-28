import umiRequest, { extend } from 'umi-request';
import { codeMessage, defOption } from './httpCode';
import { ICallBack, IZlRequestOption } from '../typings';
import { notification } from 'antd';

const isExit = (str?: string | number) => {
  if (str === '') {
    return false;
  }
  if (str === 0) {
    return true;
  }
  return str;
};
/**
 * 参数去空
 * @param params
 */
const buildParamsNull = (params: any) => {
  const newParams = {};
  if (params) {
    Object.keys(params).forEach((key) => {
      if (isExit(params[key])) {
        newParams[key] = params[key];
      }
    });
  }
  return newParams;
};

/**
 * 请求拦截
 * @param url 请求地址
 * @param options 请求配置
 * @return {{options: *, url: *}}
 */
const requestErrorIntercept = (url: string, options: IZlRequestOption) => {
  // 覆盖默认值
  const newOptions: IZlRequestOption = { ...defOption, ...options };
  const { isFile } = newOptions;
  // 如果是文件，那就是说明要下载文件
  if (isFile) {
    // 设置响应类型
    newOptions.responseType = 'blob';
  }
  // 如果不是上传文件
  if (newOptions.manner !== 'file') {
    if (newOptions.isFilter) {
      // 去除无效的参数
      newOptions.params = buildParamsNull(newOptions.params);
    }
  }
  // 获取要添加token的url
  const tokenUrl: string = sessionStorage.getItem('tokenUrl') || '';
  // 请求的地址判断
  if (url.search(tokenUrl) !== -1) {
    let userToken = localStorage.getItem('jwtToken');
    // 如果sessionStorage的存在，那就用sessionStorage
    if (sessionStorage.getItem('jwtToken')) {
      userToken = sessionStorage.getItem('jwtToken');
    }
    // 加上请求头
    newOptions.headers!.authorization = userToken;
  } else {
    delete newOptions.headers!.usertoken;
  }
  newOptions.method = newOptions.method?.toLowerCase() as IZlRequestOption['method'];
  // 对数据进行判断，转小写判断
  if (newOptions.method !== 'get') {
    newOptions.requestType = newOptions.manner === 'json' ? 'json' : 'form';
    newOptions.data = newOptions.params;
    delete newOptions.params;
  }
  // 如果是上传的文件
  if (newOptions.manner === 'file') {
    // 完整表单
    const formData = new FormData();
    if (Array.isArray(newOptions.params)) {
      newOptions.params.forEach((item) => {
        formData.append('file', item);
      });
    } else {
      Object.keys(newOptions.params as {}).forEach((key) => {
        formData.append('file', (newOptions.params as {})[key]);
      });
    }
    newOptions.params = formData;
  }
  // 判断是否是开发环境
  if (newOptions.showLog) {
    console.log(
      `%c ${new Date().toLocaleString()}本次请求地址：`,
      'color:#007eff',
      url,
    );
    console.log(
      `%c ${new Date().toLocaleString()}本次请求参数：`,
      'color:blue',
      newOptions.params,
    );
  }
  delete newOptions.setToken;
  return newOptions;
};

/**
 * 对服务器返回的错误进行拦截
 * @param newOptions 请求的配置
 * @param data 后台传递的结果数据
 * @param url 请求的地址
 * @param type 数据的类型
 */
function errorIntercept(
  newOptions: IZlRequestOption,
  url: string,
  data: any,
  type?: string,
) {
  let jsonData = null;
  if (typeof data === 'undefined' || data === null) {
    data = { code: 504, msg: codeMessage[504] };
  }
  // 判断是否文件下载
  if (type === 'blob') {
    jsonData = data;
  } else if (Number(data.code) === 0) {
    jsonData = data.result;
  } else {
    const status = data.code || data.status;
    const errorData = {
      msg: data.msg || data.errmsg || codeMessage[status],
      url,
      status,
      code: status,
      statusText: data.msg,
    };
    // 返回错误信息
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({ ...data, response: errorData });
  }
  // 返回数据
  return jsonData;
}

/**
 * 请求错误拦截——后台返回错误数据的拦截
 * @param resJson 后台传递的结果数据
 * @param url 请求的地址
 * @param newOptions 请求的配置项
 * @param callback 回调函数
 */
const responseErrorIntercept = (
  resJson: any,
  newOptions: IZlRequestOption,
  url: string,
  callback?: ICallBack,
) => {
  // 判断是否是开发环境
  if (newOptions.showLog) {
    console.log(
      `%c ${new Date().toLocaleString()}本次返回值：`,
      'color:#9100ff',
      resJson,
    );
  }
  if (callback) {
    return callback(resJson);
  }
  // 判断是否文件下载
  if (newOptions.isFile) {
    return errorIntercept(newOptions, url, resJson, 'blob');
  }
  return errorIntercept(newOptions, url, resJson);
};

const zlrequest = (
  url: string,
  option: IZlRequestOption = {},
  errorHandler: (error: { response: Response }) => void,
  callback?: ICallBack,
): Promise<any> => {
  if (url.length === 0) {
    return new Promise((reject) => reject(new Error('无效的请求地址')));
  }
  // 判断是否外部接口
  if (option.isExternal) {
    return umiRequest(url, option as any).then((resJson: any) => {
      if (callback) {
        return callback(resJson);
      }
      return resJson;
    });
  }
  // 检查参数
  const newOptions = requestErrorIntercept(url, option);
  if (newOptions.showLog) {
    console.log('newOptions', newOptions);
  }
  /**
   * 配置request请求时的默认参数
   */
  const request = extend({
    maxCache: 10, // 最大缓存个数, 超出后会自动清掉按时间最开始的一个.
    headers: newOptions.headers as any,
    errorHandler,
    ttl: 600,
  });

  return request(url, newOptions as any)
    .then((resJson: any) =>
      responseErrorIntercept(resJson, newOptions, url, callback),
    )
    .catch((e) => {
      if (newOptions.autoCatch) {
        // 如果是系统错误，就进行自动处理
        if (typeof e.code === 'undefined') {
          e.code = e.response.status;
          e.msg = e.response.msg;
        }
        if (typeof e.code != 'undefined') {
          notification.error({
            message: `请求错误: ${url.split('/').pop()}`,
            description: e.msg,
            key: 'zl-request-notification',
          });
        }
      }
      return Promise.reject(e);
    });
};

export default zlrequest;
