import React from 'react';
import '../../../src/FileBox/index.less';
import AsyncTree from '../../../src/AsyncTree';
import { AntTreeNodeProps, AntTreeNode } from 'antd/lib/tree/Tree';

const AsyncTree1 = () => {
  const getTreeData = async (pcode?: string) =>
    new Promise((resolve) => {
      if (pcode) {
        setTimeout(() => {
          resolve([
            {
              code: '001',
              pcode: '0',
              name: '北京市',
              id: '010',
              nodeType: '0',
            },
            {
              code: '002',
              pcode: '0',
              name: '天津市',
              id: '022',
              nodeType: '0',
            },
            {
              code: '003',
              pcode: '0',
              name: '河北省',
              id: '130000',
              nodeType: '0',
            },
            {
              code: '004',
              pcode: '0',
              name: '山西省',
              id: '140000',
              nodeType: '0',
            },
            {
              code: '005',
              pcode: '0',
              name: '内蒙古自治区',
              id: '150000',
              nodeType: '0',
            },
            {
              code: '006',
              pcode: '0',
              name: '辽宁省',
              id: '210000',
              nodeType: '0',
            },
            {
              code: '007',
              pcode: '0',
              name: '吉林省',
              id: '220000',
              nodeType: '0',
            },
            {
              code: '008',
              pcode: '0',
              name: '黑龙江省',
              id: '230000',
              nodeType: '0',
            },
            {
              code: '009',
              pcode: '0',
              name: '上海市',
              id: '310000',
              nodeType: '0',
            },
            {
              code: '010',
              pcode: '0',
              name: '江苏省',
              id: '320000',
              nodeType: '0',
            },
            {
              code: '011',
              pcode: '0',
              name: '浙江省',
              id: '330000',
              nodeType: '0',
            },
            {
              code: '013',
              pcode: '0',
              name: '安徽省',
              id: '340000',
              nodeType: '0',
            },
            {
              code: '014',
              pcode: '0',
              name: '福建省',
              id: '350000',
              nodeType: '0',
            },
            {
              code: '015',
              pcode: '0',
              name: '江西省',
              id: '360000',
              nodeType: '0',
            },
            {
              code: '021',
              pcode: '0',
              name: '海南省',
              id: '460000',
              nodeType: '0',
            },
            {
              code: '022',
              pcode: '0',
              name: '重庆市',
              id: '500000',
              nodeType: '0',
            },
            {
              code: '023',
              pcode: '0',
              name: '四川省',
              id: '510000',
              nodeType: '0',
            },
            {
              code: '024',
              pcode: '0',
              name: '贵州省',
              id: '520000',
              nodeType: '0',
            },
            {
              code: '025',
              pcode: '0',
              name: '云南省',
              id: '530000',
              nodeType: '0',
            },
            {
              code: '026',
              pcode: '0',
              name: '西藏自治区',
              id: '540000',
              nodeType: '0',
            },
            {
              code: '027',
              pcode: '0',
              name: '陕西省',
              id: '610000',
              nodeType: '0',
            },
            {
              code: '028',
              pcode: '0',
              name: '甘肃省',
              id: '620000',
              nodeType: '0',
            },
            {
              code: '030',
              pcode: '0',
              name: '青海省',
              id: '630000',
              nodeType: '0',
            },
            {
              code: '029',
              pcode: '0',
              name: '宁夏回族自治区',
              id: '640000',
              nodeType: '0',
            },
            {
              code: '031',
              pcode: '0',
              name: '新疆维吾尔自治区',
              id: '650000',
              nodeType: '0',
            },
            {
              code: '032',
              pcode: '0',
              name: '台湾省',
              id: '710000',
              nodeType: '0',
            },
            {
              code: '033',
              pcode: '0',
              name: '香港特别行政区',
              id: '810000',
              nodeType: '0',
            },
            {
              code: '034',
              pcode: '0',
              name: '澳门特别行政区',
              id: '820000',
              nodeType: '0',
            },
          ]);
        }, 2000);
      } else {
        setTimeout(() => {
          resolve([
            {
              code: '0',
              pcode: 'A',
              name: '全国',
              id: '010',
              nodeType: '1',
            },
          ]);
        }, 2000);
      }
    });
  const asyncTreeData = (pcode?: string) => getTreeData(pcode);

  const onTap = (obj: AntTreeNodeProps, selectNodes?: AntTreeNode) => {
    console.log('保存obj', obj, selectNodes);
  };
  return (
    <div style={{ width: 800, height: 800 }}>
      <AsyncTree asyncTreeData={asyncTreeData} treeClick={onTap} />
    </div>
  );
};

export default AsyncTree1;
