import React from 'react';
import FileBox, { IFileItem } from '../../../src/FileBox';
import '../../../src/FileBox/index.less';

const FileBox1 = () => {
  const fileList: IFileItem[] = [
    {
      /**
       * 文件的地址
       */
      filePath: 'https://avatars3.githubusercontent.com/u/5378891?s=40&v=4',
      /**
       * 文件的id
       */
      fileId: 'fileId',
      /**
       * 文件的名称
       */
      fileName: 'fileId.jpg',
      /**
       * 文件的后缀名
       */
      suffix: 'jpg',
    },
  ];
  // 删除方法
  const deleteFile = () => {
    console.log('删除成功');
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <h5>只传入图片对象数组</h5>
        <FileBox fileList={fileList} />
      </div>
      <div>
        <h5>只传入单个对象</h5>
        <FileBox fileObj={fileList[0]} />
      </div>
      <div>
        <h5>传入控制是否显示删除icon的deleteFile和showDelete</h5>
        <FileBox fileObj={fileList[0]} deleteFile={deleteFile} showDelete />
      </div>
    </div>
  );
};

export default FileBox1;
