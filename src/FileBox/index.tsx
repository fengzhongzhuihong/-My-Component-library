import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox';
import isEqual from 'lodash/isEqual';
import Tooltip from 'antd/es/tooltip';
import 'antd/es/tooltip/style';
import { Popconfirm } from 'antd';
import {
  CloudDownloadOutlined,
  DeleteOutlined,
  FilePptOutlined,
  FileTextOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileZipOutlined,
  FileUnknownOutlined,
} from '@ant-design/icons';
import Ellipsis from '../Ellipsis';
import { downloadFileUtil, openUrlDown } from '../utils/zlNetWork';
import 'react-image-lightbox/style.css';

// @ts-ignore
import boxStyles from './index.less';

/**
 * 单个文件
 */
export interface IFileItem {
  /**
   * 文件的地址
   */
  filePath: string;
  /**
   * 文件的id
   */
  fileId: string;
  /**
   * 文件的名称
   */
  fileName: string;
  /**
   * 文件的后缀名
   */
  suffix: string;
}

/**
 * 文件的id
 */
interface IFileId {
  fileId: string;
}

interface IFileBoxProps {
  /**
   * 需要显示的文件列表
   */
  fileList?: Array<IFileItem>;
  /**
   * 文件下载的方法
   */
  downloadFile?: (obj: IFileId) => void;
  /**
   * 需要显示的单个文件
   */
  fileObj?: IFileItem;
  /**
   * 自定义的样式
   */
  styles?: React.CSSProperties;
  /**
   * 显示删除
   */
  showDelete?: boolean;
  /**
   * 删除的回调
   */
  deleteFile?: (obj: IFileId) => void;
}

/**
 * 判断是否照片文件
 * @param suffix
 */
const isImageFile = (suffix: string) => {
  const rgx = '(JPEG|jpeg|JPG|jpg|gif|GIF|HEIC|heic|BMP|bmp|PNG|png)$';
  const re = new RegExp(rgx, 'i');
  const fileExt = suffix.replace(/.+\./, '');
  return re.test(fileExt);
};

function buildFileType(str: string) {
  switch (str) {
    case 'pdf':
      return <FilePptOutlined />;
    case 'pptx':
      return <FilePptOutlined />;
    case 'ppt':
      return <FilePptOutlined />;
    case 'txt':
      return <FileTextOutlined />;
    case 'doc':
      return <FileWordOutlined />;
    case 'docx':
      return <FileWordOutlined />;
    case 'xls':
      return <FileExcelOutlined />;
    case 'xlsx':
      return <FileExcelOutlined />;
    case 'rar':
      return <FileZipOutlined />;
    case 'zip':
      return <FileZipOutlined />;
    default:
      return <FileUnknownOutlined />;
  }
}

interface IState {
  photoIndex: number;
  isOpen: boolean;
  // 图片数组
  fileList: IFileItem[];
}

class FileBox extends Component<IFileBoxProps, IState> {
  state = {
    photoIndex: 0,
    isOpen: false,
    // 图片数组
    fileList: this.props.fileList ? this.props.fileList : [],
  };

  // 获取新的props数据的时候变化
  static getDerivedStateFromProps(nextProps: IFileBoxProps, preState: IState) {
    if (isEqual(nextProps.fileList, preState.fileList)) {
      return null;
    }
    const { fileObj = {} as IFileItem, fileList } = nextProps;
    let newList = fileList;
    if (Object.keys(fileObj).length > 0) {
      newList = [fileObj];
      return {
        fileList: newList,
      };
    }
    return {
      fileList,
    };
  }

  // 文件下载
  downFile(item: IFileItem) {
    // 父组件需要传递一个下载文件的方法
    const { downloadFile } = this.props;
    if (typeof downloadFile === 'function') {
      // 如果父组件传递了下载方法
      downloadFileUtil(downloadFile, item.fileId, item.fileName, item.suffix);
    } else {
      // 打开url进行下载
      openUrlDown(item.filePath);
    }
  }

  // TODO 可以根据文件的类型显示不同的icon
  render() {
    const { photoIndex, isOpen, fileList } = this.state;
    const { styles, showDelete, deleteFile } = this.props;
    // 获得地址数组
    const imageUrlList = fileList.map((item) => item.filePath);
    const zoomBox = fileList.map((item, index) => {
      return (
        <div className={boxStyles.zlImageBoxImageDiv} key={item.fileId}>
          <div className={boxStyles.zlImageBoxImageBox} style={styles}>
            {isImageFile(item.suffix) ? (
              <img
                className={boxStyles.zlImageBoxImages}
                src={item.filePath}
                alt="图片"
                onClick={() =>
                  this.setState({ photoIndex: index, isOpen: true })
                }
              />
            ) : (
              <span
                className={boxStyles.zlImageBoxImages}
                style={{
                  display: 'inline-block',
                  fontSize: '100px',
                  textAlign: 'center',
                  color: '#1890FF',
                }}
              >
                {buildFileType(item.suffix)}
              </span>
            )}
            <div style={{ margin: 5 }}>
              <Ellipsis tooltip length={6}>
                {item.fileName}
              </Ellipsis>
              <Tooltip title="下载到本地">
                <CloudDownloadOutlined
                  style={{ marginRight: 3, marginLeft: 3 }}
                  onClick={() => this.downFile(item)}
                />
              </Tooltip>
              {showDelete && deleteFile && (
                <Popconfirm
                  title="是否要删除此附件？"
                  onConfirm={() => deleteFile(item)}
                  okText="删除"
                  cancelText="取消"
                >
                  <DeleteOutlined style={{ color: 'red' }} />
                </Popconfirm>
              )}
            </div>
          </div>
        </div>
      );
    });

    return (
      <div>
        {zoomBox}
        {isOpen ? (
          <Lightbox
            mainSrc={imageUrlList[photoIndex]}
            nextSrc={imageUrlList[(photoIndex + 1) % imageUrlList.length]}
            prevSrc={
              imageUrlList[
                (photoIndex + imageUrlList.length - 1) % imageUrlList.length
              ]
            }
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex:
                  (photoIndex + imageUrlList.length - 1) % imageUrlList.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % imageUrlList.length,
              })
            }
          />
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default FileBox;
