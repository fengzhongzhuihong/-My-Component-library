import {
  LockTwoTone,
  MailTwoTone,
  MobileTwoTone,
  UserOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import React from 'react';

// @ts-ignore
import styles from './index.less';

export default {
  UserName: {
    props: {
      size: 'large',
      id: 'data1',
      prefix: (
        <UserOutlined
          style={{
            color: '#1890ff',
          }}
          className={styles.prefixIcon}
        />
      ),
      placeholder: '请输入邮箱/手机号',
    },
    rules: [
      {
        required: true,
        message: '请输入邮箱/手机号!',
      },
    ],
  },
  Password: {
    props: {
      size: 'large',
      prefix: <LockTwoTone className={styles.prefixIcon} />,
      type: 'password',
      id: 'data2',
      placeholder: '请输入密码',
    },
    rules: [
      {
        required: true,
        message: '请输入密码!',
      },
    ],
  },
  Mobile: {
    props: {
      size: 'large',
      id: 'data0',
      prefix: <MobileTwoTone className={styles.prefixIcon} />,
      placeholder: '手机号',
    },
    rules: [
      {
        required: true,
        message: '请输入手机号!',
      },
      {
        pattern: /^1\d{10}$/,
        message: '无效的手机号!',
      },
    ],
  },
  Captcha: {
    props: {
      size: 'large',
      id: 'data0',
      prefix: <MailTwoTone className={styles.prefixIcon} />,
      placeholder: 'captcha',
    },
    rules: [
      {
        required: true,
        message: '请输入验证码!',
      },
    ],
  },
  VerCode: {
    props: {
      size: 'large',
      id: 'data1',
      prefix: <SmileOutlined className={styles.prefixIcon} />,
      placeholder: '请输入验证码',
    },
    rules: [
      {
        required: true,
        message: '请输入验证码!',
      },
    ],
  },
};
