import React from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

const ExplainTips: React.FC<{ content: string }> = ({ content }) => {
  return (
    <Tooltip title={content}>
      <QuestionCircleOutlined style={{ margin: '0 4px' }} />
    </Tooltip>
  );
};

export default ExplainTips;
