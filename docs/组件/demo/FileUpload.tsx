import React from 'react';
import '../../../src/FileBox/index.less';
import FileUpload from '../../../src/FileUpload';
import { Divider } from 'antd';

const FileUpload1 = () => {
  return (
    <div style={{ width: 800, height: 800 }}>
      boxType为picture
      <FileUpload saveImgList={() => {}} boxType="picture" />
      <Divider />
      boxType为picture-card
      <FileUpload saveImgList={() => {}} boxType="picture-card" />
    </div>
  );
};

export default FileUpload1;
