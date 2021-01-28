---
title: AsyncTree 异步树
---

## 何时使用
用于异步动态地获取tree数据

## 使用方式

  
<code src="./demo/AsyncTree.tsx" />

##参数


| 参数 | 说明 | 类型 | 是否必传 |
| --- | --- | --- | --- |
| asyncTreeData | 获取数据的请求 |`(pcode?: string) => PromiseLike<any>`| 必须 |  |
| treeClick | 点击节点的方法 |`(nodeData: AntTreeNodeProps, s?: AntTreeNode) => void`| 非必须 |  |
| treeProps| 控制这个tree的参数集合 比如是否显示图标，是否自动展开节点等等 |`TreeProps`| 非必须 |  |
| openTreeKeys| 打开节点 |`(treeNode: AntTreeNode) => void`| 非必须 |  |
| openCallBack| 出发展开事件 |`(treeNode: AntTreeNode) => void`| 非必须 |  |



