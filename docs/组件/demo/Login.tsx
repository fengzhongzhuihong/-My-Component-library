import React, { useState, useEffect } from 'react';
import { Card, Checkbox } from 'antd';
import LoginItem from '../../../src/Login/LoginItem';
import LoginTab from '../../../src/Login/LoginTab';
import LoginSubmit from '../../../src/Login/LoginSubmit';

import Login from '../../../src/Login';

import { ICallBack } from '../../../src/typings';
import zlrequest from '../../../src/request';

const { UserName, Password, VerCode, Mobile, Captcha } = LoginItem;

interface LoginParamsType {
  data0: string;
  data1: string;
  data2: string;
  data3: string;
  // 是否记住密码
  data4: boolean;
}

interface IProps {}
/**
 * 说明：登录组件
 * @author
 * @date
 */

const Login1: React.FC<IProps> = () => {
  // const { login = {} as ILoginState, submitting, dispatch } = props;
  // const { status, type: loginType, verCode, errorMsg } = login;
  const [data4, setData4] = useState(false);
  const [verCode, setVerCode] = useState<string>('');
  const [type, setType] = useState<string>('account');
  const request2 = (url: string, opt: any, callback?: ICallBack) => {
    // 检查url是否需要进行扩充
    url = `http://192.168.1.69:8222/${url}`;
    opt.showLog = true;
    return zlrequest(
      url,
      opt,
      (err) => {
        console.log(err);
      },
      callback,
    );
  };

  const [data0] = useState<string>('2222222222222');
  const login = (values: LoginParamsType) => {
    console.log(values);
  };
  const getNewVerCode = () => {
    request2('passport-service/getvalidimg', { params: { data0 } }).then(
      (res) => {
        setVerCode(res.imgbase64);
      },
    );
  };

  const handleSubmit = (values: LoginParamsType) => {
    if (type === 'account') {
      values.data2 = '';
      values.data0 = data0;
      values.data4 = data4;
    }
    login(values);
  };

  // 自动登录
  const autoLogin = () => {
    console.log('自动登录');
  };

  useEffect(() => {
    // 检查下token
    if (localStorage.getItem('jwtToken')) {
      autoLogin();
    } else {
      getNewVerCode();
    }
  }, []);
  return (
    <Card>
      <div style={{ width: 380, margin: '0 auto' }}>
        <Login activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
          <LoginTab key="account" tab="账号密码登录">
            <UserName
              name="data1"
              rules={[
                {
                  required: true,
                  message: '请输入邮箱/手机号!',
                },
              ]}
            />
            <Password
              name="data2"
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            />
            <VerCode
              onGetVerCode={() => {}}
              verCode={verCode}
              name="data3"
              rules={[
                {
                  required: true,
                  message: '请输入验证码！',
                },
              ]}
            />
          </LoginTab>
          <LoginTab key="mobile" tab="手机号登录">
            <Mobile
              name="data0"
              placeholder="手机号"
              rules={[
                {
                  required: true,
                  message: '请输入手机号！',
                },
                {
                  pattern: /^1\d{10}$/,
                  message: '手机号格式错误！',
                },
              ]}
            />
            <Captcha
              name="data1"
              placeholder="验证码"
              countDown={120}
              getCaptchaButtonText=""
              getCaptchaSecondText="秒"
              rules={[
                {
                  required: true,
                  message: '请输入验证码！',
                },
              ]}
            />
          </LoginTab>
          <div>
            <Checkbox
              checked={data4}
              onChange={(e) => setData4(e.target.checked)}
            >
              自动登录
            </Checkbox>
            <a
              style={{
                float: 'right',
              }}
            >
              忘记密码
            </a>
          </div>
          <LoginSubmit loading={false}>登录</LoginSubmit>
        </Login>
      </div>
    </Card>
  );
};

export default Login1;
