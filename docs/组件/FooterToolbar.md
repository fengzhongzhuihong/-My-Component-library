---
title: FooterToolbar
subtitle: 底部工具栏
cols: 1
order: 6
---

固定在底部的工具栏。

## 何时使用

固定在内容区域的底部，不随滚动条移动，常用于长页面的数据搜集和提交工作。


## 浮动固定页脚。

```jsx
import React from 'react';
import FooterToolbar from '../../src/FooterToolbar/index';
import { Button } from 'antd';

export default () => (
  <div style={{ background: '#f7f7f7', padding: 24 }}>
    <p>Content Content Content Content</p>
    <p>Content Content Content Content</p>
    <p>Content Content Content Content</p>
    <p>Content Content Content Content</p>
    <p>Content Content Content Content</p>
    <p>Content Content Content Content</p>
    <p>Content Content Content Content</p>
    <p>Content Content Content Content</p>
    <p>Content Content Content Content</p>
    <p>Content Content Content Content</p>
    <p>Content Content Content Content</p>
    <p>Content Content Content Content</p>
    <p>Content Content Content Content</p>
    <p>Content Content Content Content</p>
    <p>Content Content Content Content</p>
    <FooterToolbar extra="extra information">
      <Button>Cancel</Button>
      <Button type="primary">Submit</Button>
    </FooterToolbar>
  </div>
)
```

## API

| 参数     | 说明                 | 类型      | 默认值 |
| -------- | -------------------- | --------- | ------ |
| children | 工具栏内容，向右对齐 | ReactNode | -      |
| extra    | 额外信息，向左对齐   | ReactNode | -      |
