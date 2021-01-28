---
title: FileBox文件下载组件
---

## 何时使用

当文件需要下载时，无论时jpg、png等格式图片，或者txt、pdf等格式文件

## 使用方式
如下 传入文件对象的集合 
**注意** 如果是图片 可以不传入`download`方法 组件会根据图片地址下载  
如果是非图片类型的文件要传入`download`方法根据`fileId`下载
<code src="./demo/FileBox.tsx" />

## 参数

| 参数 | 说明 | 类型 | 是否必传 |
| --- | --- | --- | --- |
| fileList | 文件数组 |`IFileItem[]`| 非必须 |  |
| downloadFile | 文件下载的方法 |`(obj: IFileId) => void`| 非必须 |  |
| styles | 自定义的样式 |`React.CSSProperties`| 非必须 |  |
| fileObj | 需要显示的单个文件 |`IFileItem`| 非必须 |  |
| showDelete | 显示删除 |`boolean`| 非必须 |  |
| deleteFile | 删除的回调 | `(obj: IFileId) => void`| 非必须 |  |

