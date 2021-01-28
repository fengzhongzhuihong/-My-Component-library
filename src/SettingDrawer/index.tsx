import React, { useState } from 'react';
import { Drawer, Select } from 'antd';
import { CloseOutlined, SettingOutlined } from '@ant-design/icons';

// @ts-ignore
import styles from './index.less';

const SettingDrawer = ({
  zlServerList,
}: {
  zlServerList: { path: string; name: string }[];
}) => {
  const [show, setShow] = useState(false);

  const saveTestServer = (path: string) => {
    sessionStorage.setItem('testServer', path);
    // 刷新页面
    window.location.reload();
  };

  return (
    <Drawer
      title="环境配置"
      visible={show}
      width={300}
      onClose={() => setShow(false)}
      placement="right"
      style={{
        zIndex: 999,
      }}
      getContainer={false}
      handler={
        <div
          className={styles.zlSettingDrawerHandle}
          onClick={() => setShow(!show)}
        >
          {show ? (
            <CloseOutlined
              style={{
                color: '#fff',
                fontSize: 20,
              }}
            />
          ) : (
            <SettingOutlined
              style={{
                color: '#fff',
                fontSize: 20,
              }}
            />
          )}
        </div>
      }
    >
      <Select
        defaultValue={
          window.sessionStorage.getItem('testServer') || '请选择服务器地址'
        }
        style={{ width: '100%', marginBottom: 20 }}
        onChange={(checked: any) => saveTestServer(checked)}
      >
        {zlServerList &&
          zlServerList.map((item) => (
            <Select.Option key={item.path} value={item.path}>
              {item.name}
            </Select.Option>
          ))}
      </Select>
    </Drawer>
  );
};

export default SettingDrawer;
