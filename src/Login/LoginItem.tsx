import { Button, Col, Input, Row, Form } from 'antd';
import React, { useState, useCallback, useEffect } from 'react';
import omit from 'omit.js';
import { FormItemProps } from 'antd/es/form/FormItem';
import ItemMap from './map';
import LoginContext, { LoginContextProps } from './LoginContext';

// @ts-ignore
import styles from './index.less';

export type WrappedLoginItemProps = ILoginItemProps;
export type LoginItemKeyType = keyof typeof ItemMap;
export interface ILoginItemType {
  UserName: React.FC<WrappedLoginItemProps>;
  Password: React.FC<WrappedLoginItemProps>;
  Mobile: React.FC<WrappedLoginItemProps>;
  Captcha: React.FC<WrappedLoginItemProps>;
  VerCode: React.FC<WrappedLoginItemProps>;
}

export interface ILoginItemProps extends Partial<FormItemProps> {
  name?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  buttonText?: React.ReactNode;
  countDown?: number;
  getCaptchaButtonText?: string;
  getCaptchaSecondText?: string;
  updateActive?: LoginContextProps['updateActive'];
  type?: string;
  defaultValue?: string;
  customProps?: { [key: string]: unknown };
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tabUtil?: LoginContextProps['tabUtil'];
  /**
   * 获取验证码的方法
   */
  onGetVerCode?: () => void;
  /**
   * 获取短信验证码
   */
  getSmsVerCode?: (m: string, type: number) => Promise<any>;
  // 验证码
  verCode?: string;
}

const FormItem = Form.Item;

const getFormItemOptions = ({
  onChange,
  defaultValue,
  customProps = {},
  rules,
}: ILoginItemProps) => {
  const options: {
    rules?: ILoginItemProps['rules'];
    onChange?: ILoginItemProps['onChange'];
    initialValue?: ILoginItemProps['defaultValue'];
  } = {
    rules: rules || (customProps.rules as ILoginItemProps['rules']),
  };
  if (onChange) {
    options.onChange = onChange;
  }
  if (defaultValue) {
    options.initialValue = defaultValue;
  }
  return options;
};

const LoginItem: React.FC<ILoginItemProps> = (props) => {
  const [count, setCount] = useState<number>(props.countDown || 0);
  const [timing, setTiming] = useState(false);
  // 这么写是为了防止restProps中 带入 onChange, defaultValue, rules props tabUtil
  const {
    onChange,
    customProps,
    defaultValue,
    rules,
    name,
    getCaptchaButtonText,
    getCaptchaSecondText,
    updateActive,
    type,
    tabUtil,
    verCode,
    onGetVerCode,
    getSmsVerCode,
    ...restProps
  } = props;

  const onGetCaptcha = useCallback(async (mobile: string) => {
    if (typeof getSmsVerCode === 'function') {
      const result = await getSmsVerCode(mobile, 0);
      if (result === false) {
        return;
      }
      setTiming(true);
    }
  }, []);

  useEffect(() => {
    let interval: number = 0;
    const { countDown } = props;
    if (timing) {
      interval = window.setInterval(() => {
        setCount((preSecond) => {
          if (preSecond <= 1) {
            setTiming(false);
            clearInterval(interval);
            // 重置秒数
            return countDown || 60;
          }
          return preSecond - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timing]);
  if (!name) {
    return null;
  }
  // get getFieldDecorator props
  const options = getFormItemOptions(props);
  const otherProps = restProps || {};

  if (type === 'Captcha') {
    // @ts-ignore
    const inputProps = omit(otherProps, ['onGetCaptcha', 'countDown']);

    return (
      <FormItem shouldUpdate>
        {({ getFieldValue }) => (
          <Row gutter={8}>
            <Col span={16}>
              <FormItem name={name} {...options}>
                <Input {...customProps} {...inputProps} />
              </FormItem>
            </Col>
            <Col span={8}>
              <Button
                disabled={timing}
                className={styles.getCaptcha}
                size="large"
                onClick={() => {
                  const value = getFieldValue('data0');
                  onGetCaptcha(value);
                }}
              >
                {timing ? `${count} 秒` : '获取验证码'}
              </Button>
            </Col>
          </Row>
        )}
      </FormItem>
    );
  }
  if (type === 'VerCode') {
    // @ts-ignore
    const inputProps = omit(otherProps, ['onGetVerCode']);
    return (
      <FormItem shouldUpdate>
        <Row gutter={8}>
          <Col span={16}>
            <FormItem name={name} {...options}>
              <Input {...customProps} {...inputProps} />
            </FormItem>
          </Col>
          <Col span={8}>
            <img
              style={{ width: '100%', height: '100%', paddingBottom: 24 }}
              alt="验证码"
              onClick={onGetVerCode}
              src={verCode}
            />
          </Col>
        </Row>
      </FormItem>
    );
  }
  return (
    <FormItem name={name} {...options}>
      <Input {...customProps} {...otherProps} />
    </FormItem>
  );
};

const LoginItems: Partial<ILoginItemType> = {};

Object.keys(ItemMap).forEach((key) => {
  const item = ItemMap[key];
  LoginItems[key] = (props: ILoginItemProps) => (
    <LoginContext.Consumer>
      {(context) => (
        <LoginItem
          customProps={item.props}
          rules={item.rules}
          {...props}
          type={key}
          {...context}
          updateActive={context.updateActive}
        />
      )}
    </LoginContext.Consumer>
  );
});

export default LoginItems as ILoginItemType;
