import React from 'react';
import numeral from 'numeral';
import { Tooltip } from 'antd';
import 'antd/lib/tooltip/style/index.less';
import { InfoCircleOutlined } from '@ant-design/icons/lib';
import Field from '../../../src/Charts/Field';
import ChartCard from '../../../src/Charts/ChartCard';
import Trend from '../../../src/Charts/Trend';

const trendText = {
  marginLeft: 8,
  color: 'red',
};

export default () => {
  return (
    <ChartCard
      bordered={false}
      title="总销售额"
      action={
        <Tooltip title="指标说明">
          <InfoCircleOutlined />
        </Tooltip>
      }
      total={`¥ ${numeral(12423).format('0,0')}`}
      footer={
        <Field label="日销售额" value={`￥${numeral(12423).format('0,0')}`} />
      }
      contentHeight={46}
    >
      <Trend flag="up" style={{ marginRight: 16 }}>
        周访问量
        <span style={trendText}>12%</span>
      </Trend>
      <Trend flag="down">
        日访问量
        <span style={trendText}>11%</span>
      </Trend>
    </ChartCard>
  );
};
