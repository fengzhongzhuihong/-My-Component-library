import React from 'react';
import { Modal, notification } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

export declare type promptType = 'Modal' | 'Notification' | 'Console';
/**
 * 版本号相关操作
 * newVer 新版本号
 * oldVer 旧版本号
 * promptType 提示方式
 * content 提示内容
 */
export const versionUpdate = (
  oldVer: string,
  newVer: string,
  promptType: promptType,
  content: string,
) => {
  if (oldVer && newVer) {
    if (oldVer == newVer) {
      console.log('版本号相同');
    }
    //将两个版本号拆成数字
    let arr1 = oldVer.split('.'),
      arr2 = newVer.split('.');
    let minLength = Math.min(arr1.length, arr2.length),
      position = 0,
      diff = 0;
    //依次比较版本号每一位大小，当对比得出结果后跳出循环（后文有简单介绍）
    while (
      position < minLength &&
      (diff = parseInt(arr1[position]) - parseInt(arr2[position])) == 0
    ) {
      position++;
    }
    diff = diff != 0 ? diff : arr1.length - arr2.length;
    if (diff < 0) {
      if (promptType === 'Modal') {
        Modal.success({
          title: `${newVer}版本已更新!`,
          content: content,
          icon: <SmileOutlined style={{ color: '#5ca200' }} />,
        });
      } else if (promptType === 'Console') {
        console.log(newVer, '版本已更新', '更新内容', content);
      } else {
        notification.open({
          message: `${newVer}版本已更新!`,
          description: content,
          icon: <SmileOutlined style={{ color: '#5ca200' }} />,
        });
      }
    }
  } else {
    console.log('版本号不能为空');
  }
};
const versionTips = {
  versionUpdate,
};
export default versionTips;
