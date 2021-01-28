import React, { ReactText } from 'react';
import { Tree } from 'antd';

const { TreeNode } = Tree;

/**
 * 树数据
 */
export interface ISysTree {
  // 自身编码
  code: string;
  // 父编码
  pcode: string;
  // 名称用于显示
  name: string;
  // 唯一标识
  id?: string;
  nodeType?: 1 | 0 | '1' | '0';
  // 子元素
  children?: ISysTree[];
}

export interface IProps {
  /**
   * 左侧树数据
   */
  treeList: ISysTree[];
  /**
   * 点击树节点的事件
   */
  onSelect?: (obj: ISysTree) => void;
}

const SysTree: React.FC<IProps> = ({ treeList, onSelect }: IProps) => {
  const dataList: ISysTree[] = [];

  // 节点的点击事件
  const onTreeSelect = (selectedKeys: ReactText[]) => {
    if (onSelect) {
      for (let i = 0; i < dataList.length; i++) {
        if (dataList[i].id === selectedKeys[0]) {
          onSelect(dataList[i]);
          break;
        }
      }
    }
  };

  // 构建父
  const buildTree = (list: ISysTree[]) =>
    list.map((item) => {
      dataList.push(item);
      // 判断是否有子
      if (item.children) {
        return (
          <TreeNode key={item.id} title={item.name}>
            {buildTree(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={item.name} />;
    });

  return (
    <div>
      <Tree showLine onSelect={onTreeSelect}>
        {buildTree(treeList)}
      </Tree>
    </div>
  );
};

export default SysTree;
