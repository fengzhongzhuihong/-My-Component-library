import React from 'react';
import { Card, Button } from 'antd';
import waterMark from '../../../src/waterMark';

interface IProps {}
/**
 * 说明：水印组件
 * @author
 * @date
 */
const WaterMark: React.FC<IProps> = () => {
  const addWaterMark = () => {
    waterMark({
      container: document.getElementById('waterMark'),
      width: '200px', // 水印的大小
      height: '200px',
      textAlign: 'center', // 文字对齐
      textBaseline: 'middle', // 基准线
      font: '20px Microsoft Yahei', // 字体大小及样式
      fillStyle: 'rgba(184, 184, 184, 0.4)', // 自定义水印的颜色以及透明度
      content: 'Open Components', // 内容
      rotate: 24, // 文字旋转角度
      zIndex: 1000, // 元素堆叠顺序，-1是在最下面
    });
  };
  return (
    <Card>
      <Button onClick={addWaterMark}> 添加水印</Button>
      <div
        id="waterMark"
        style={{ width: 800, height: 300, textAlign: 'center' }}
      >
        被加上水印的div
      </div>
    </Card>
  );
};

export default WaterMark;
