/**
 * 接口的配置
 */
export interface IZlRequestOption {
  /**
   * post request data type
   */
  requestType?: 'form' | 'json';
  /**
   * 请求的类型
   */
  method?:
    | 'get'
    | 'post'
    | 'put'
    | 'delete'
    | 'options'
    | 'head'
    | 'trace'
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'OPTIONS'
    | 'HEAD'
    | 'TRACE';

  /**
   * 是否过滤参数
   */
  isFilter?: boolean;
  /**
   * 数据格式
   */
  manner?: 'form' | 'json' | 'file';
  /**
   * 请求头
   */
  headers?: {
    'Content-Type'?: string;
    Authorization?: string;
    [key: string]: string | null | undefined;
  };
  /**
   * 是否设置token
   */
  setToken?: boolean;
  /**
   * 是否是文件
   */
  isFile?: boolean;
  /**
   * 响应数据类型
   */
  responseType?: string;
  /**
   * 请求参数
   */
  params?: object;
  data?: object;
  /**
   * 返回数据格式
   */
  dataType?: string;
  /**
   * 跨域配置
   */
  mode?: 'no-cors' | 'cors';
  /**
   * 是否是外部接口
   */
  isExternal?: boolean;
  /**
   * 是否显示日志信息
   */
  showLog?: boolean;
  /**
   * 是否自动处理异常
   */
  autoCatch?: boolean;
}

export declare type ICallBack = (data: any) => void;

export declare const DEV_LOG: 'show' | undefined;

declare global {
  interface Window {
    WebKitMutationObserver?: any;
  }
}
