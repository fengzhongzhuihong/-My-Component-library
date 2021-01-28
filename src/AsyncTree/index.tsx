/**
 * 说明：异步加载的树组件
 * @author tangbin
 * @date 2019-12-19
 */
import React, { Component } from 'react';
import { Tree } from 'antd';
import { AntTreeNode, AntTreeNodeProps, TreeProps } from 'antd/lib/tree';

const { TreeNode } = Tree;

export interface IObjTreeProps {
  asyncTreeData: (pcode?: string) => PromiseLike<any>;
  treeClick?: (nodeData: AntTreeNodeProps, s?: AntTreeNode) => void;
  treeProps?: TreeProps;
  // 打开节点
  openTreeKeys?: (treeNode: AntTreeNode) => void;
  // 出发展开事件
  openCallBack?: (treeNode: AntTreeNode) => void;
}

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

interface IObjTreeState {
  treeData: ISysTree[];
}

class AsyncTree extends Component<IObjTreeProps, IObjTreeState> {
  state = {
    treeData: [],
  };

  tree: any = React.createRef();

  async componentDidMount() {
    await this.initData();
  }

  initData = async () => {
    const data = await this.props.asyncTreeData();
    this.setState({
      treeData: data,
    });
  };

  onLoadData = async (treeNode: AntTreeNode) => {
    if (treeNode.props.dataRef.nodeType === '0') {
      return;
    }
    treeNode.props.dataRef.children = await this.props.asyncTreeData(
      treeNode.props.dataRef.code,
    );
    this.setState(
      {
        treeData: [...this.state.treeData],
      },
      () => this.openTreeKeys(treeNode),
    );
  };

  openTreeKeys = (treeNode: AntTreeNode) => {
    // 判断是否需要展开
    const { treeProps = {}, openTreeKeys, openCallBack } = this.props;
    if (
      Array.isArray(treeProps.expandedKeys) &&
      typeof openTreeKeys === 'function'
    ) {
      // 存在这个方法
      openTreeKeys(treeNode);
    }
    if (typeof openCallBack === 'function') {
      openCallBack(treeNode);
    }
  };

  renderTreeNodes = (data: ISysTree[]): React.ReactNode =>
    data.map((item) => {
      if (item.nodeType === '1') {
        return (
          // @ts-ignore
          <TreeNode key={item.code} title={item.name} dataRef={item}>
            {item.children && this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.code}
          title={item.name}
          isLeaf
          // @ts-ignore
          dataRef={item}
        />
      );
    });

  treeClick = (e: AntTreeNodeProps, selectNodes?: AntTreeNode[]) => {
    const { treeClick } = this.props;
    if (typeof treeClick === 'function' && selectNodes) {
      treeClick(e, selectNodes[0]);
    }
  };

  render() {
    const { treeProps = {} } = this.props;

    return (
      <>
        {this.state.treeData.length ? (
          <Tree
            ref={this.tree}
            showLine
            // @ts-ignore
            loadData={this.onLoadData}
            // @ts-ignore
            onSelect={(s, e) => this.treeClick(e.node.props, e.selectedNodes)}
            {...treeProps}
          >
            {this.renderTreeNodes(this.state.treeData)}
          </Tree>
        ) : (
          '加载中...'
        )}
      </>
    );
  }
}

export default AsyncTree;
