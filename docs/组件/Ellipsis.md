---
title: Ellipsis
subtitle: 文本自动省略号
cols: 1
order: 10
---

## 何时使用

文本过长自动处理省略号，支持按照文本长度和最大行数两种方式截取。


## 按照行数省略

通过设置 `lines` 属性指定最大行数，如果超过这个行数的文本会自动截取。但是在这种模式下所有 `children` 将会被转换成纯文本。

并且注意在这种模式下，外容器需要有指定的宽度（或设置自身宽度）。

```jsx
import React from 'react';
import Ellipsis from '../../src/Ellipsis/index';

const article = (
  <p>
    There were injuries alleged in three <a href="#cover">cases in 2015</a>, and
    a fourth incident in September, according to the safety recall report. After
    meeting with US regulators in October, the firm decided to issue a voluntary
    recall.
  </p>
);

export default () => (
  <div style={{ width: 200 }}>
    <Ellipsis tooltip lines={3}>
      {article}
    </Ellipsis>
  </div>
)
```

## 按照字符数省略

通过设置 `length` 属性指定文本最长长度，如果超过这个长度会自动截取。

```jsx
import React from 'react';
import Ellipsis from '../../src/Ellipsis/index';

const article =
  'There were injuries alleged in three cases in 2015, and a fourth incident in September, according to the safety recall report. After meeting with US regulators in October, the firm decided to issue a voluntary recall.';

export default () => (
  <div>
    <Ellipsis length={100}>{article}</Ellipsis>
    <h4 style={{ marginTop: 24 }}>Show Tooltip</h4>
    <Ellipsis length={100} tooltip>
      {article}
    </Ellipsis>
  </div>
)
```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| tooltip | 移动到文本展示完整内容的提示 | boolean | - |
| length | 在按照长度截取下的文本最大字符数，超过则截取省略 | number | - |
| lines | 在按照行数截取下最大的行数，超过则截取省略 | number | `1` |
| fullWidthRecognition | 是否将全角字符的长度视为 2 来计算字符串长度 | boolean | - |
