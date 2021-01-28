import { Tooltip } from 'antd';
import { TooltipProps } from 'antd/es/tooltip';
import classNames from 'classnames';
import React, { Component } from 'react';

// @ts-ignore
import styles from './index.less';

/* eslint react/no-did-mount-set-state: 0 */
/* eslint no-param-reassign: 0 */

const isSupportLineClamp =
  (document.body.style as any).webkitLineClamp !== undefined;

const TooltipOverlayStyle = {
  overflowWrap: 'break-word',
  wordWrap: 'break-word',
};

interface EllipsisProps {
  /**
   * 移动到文本展示完整内容的提示
   */
  tooltip?: boolean | TooltipProps;
  /**
   * 移动到文本展示完整内容的提示
   */
  length?: number;
  /**
   * 在按照行数截取下最大的行数，超过则截取省略
   */
  lines?: number;
  /**
   * 样式
   */
  style?: React.CSSProperties;
  /**
   * 样式
   */
  className?: string;
  /**
   * 是否将全角字符的长度视为2来计算字符串长度
   */
  fullWidthRecognition?: boolean;
  /**
   * 自定义省略号
   */
  omitStr?: any;
  /**
   * 文字的后缀
   */
  suffix?: any;
  /**
   * 文字的前缀
   */
  prefix?: any;
}

/**
 * 获取字符串完成长度
 * @param str 目标字符串
 */
export const getStrFullLength: (str: string) => number = (str = '') =>
  str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0);
    if (charCode >= 0 && charCode <= 128) {
      return pre + 1;
    }
    return pre + 2;
  }, 0);

/**
 * 按照指定长度对字符串进行切割
 * @param str 目标字符串
 * @param maxLength 最大长度
 */
export const cutStrByFullLength: (str: string, maxLength: number) => string = (
  str = '',
  maxLength,
) => {
  let showLength = 0;
  return str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0);
    if (charCode >= 0 && charCode <= 128) {
      showLength += 1;
    } else {
      showLength += 2;
    }
    if (showLength <= maxLength) {
      return pre + cur;
    }
    return pre;
  }, '');
};

/**
 * 生成小提示
 * @param tooltip 提示
 * @param overlayStyle 样式
 * @param title 标题
 * @param children 子元素
 */
const getTooltip: ({
  tooltip,
  overlayStyle,
  title,
  children,
}: {
  tooltip: any;
  overlayStyle: typeof TooltipOverlayStyle;
  title: any;
  children: any;
}) => JSX.Element = ({ tooltip, overlayStyle, title, children }) => {
  if (tooltip) {
    const props =
      tooltip === true
        ? { overlayStyle, title }
        : { ...tooltip, overlayStyle, title };
    return <Tooltip {...props}>{children}</Tooltip>;
  }
  return children;
};

const EllipsisText: ({
  text,
  length,
  tooltip,
  fullWidthRecognition,
  className,
  prefix,
  suffix,
  omitStr,
  ...other
}: {
  text: any;
  length: number;
  tooltip: any;
  className?: string;
  prefix?: string;
  suffix?: string;
  fullWidthRecognition: boolean;
  omitStr?: any;
}) => JSX.Element = ({
  text,
  length,
  tooltip,
  fullWidthRecognition,
  prefix,
  suffix,
  omitStr,
  ...other
}) => {
  if (typeof text !== 'string') {
    throw new Error('Ellipsis children must be string.');
  }
  const textLength = fullWidthRecognition
    ? getStrFullLength(text)
    : text.length;
  if (textLength <= length || length < 0) {
    return (
      <span {...other}>
        {prefix}
        {text}
        {omitStr}
        {suffix}
      </span>
    );
  }
  const tail = '...';
  let displayText;
  if (length - tail.length <= 0) {
    displayText = '';
  } else {
    displayText = fullWidthRecognition
      ? cutStrByFullLength(text, length)
      : text.slice(0, length);
  }

  const spanAttrs = tooltip ? {} : { ...other };
  return getTooltip({
    tooltip,
    overlayStyle: TooltipOverlayStyle,
    title: text,
    children: (
      <span {...spanAttrs}>
        {prefix}
        {displayText}
        {tail}
        {omitStr}
        {suffix}
      </span>
    ),
  });
};

interface EllipsisState {
  text: string;
  targetCount: number;
}

export default class Ellipsis extends Component<EllipsisProps, EllipsisState> {
  state = {
    text: '',
    targetCount: 0,
  };

  node!: HTMLSpanElement;

  root!: HTMLDivElement;

  content!: HTMLDivElement;

  shadow!: HTMLDivElement;

  shadowChildren!: HTMLDivElement;

  componentDidMount() {
    if (this.node) {
      this.computeLine();
    }
  }

  componentDidUpdate(perProps: EllipsisProps) {
    const { lines } = this.props;
    if (lines !== perProps.lines) {
      this.computeLine();
    }
  }

  computeLine = () => {
    const { lines } = this.props;
    if (lines && !isSupportLineClamp) {
      const text =
        this.shadowChildren.innerText || this.shadowChildren.textContent || '';
      const lineHeight = parseInt(
        getComputedStyle(this.root).lineHeight || '',
        10,
      );
      const targetHeight = lines * lineHeight;
      this.content.style.height = `${targetHeight}px`;
      const totalHeight = this.shadowChildren.offsetHeight;
      const shadowNode = this.shadow.firstChild;

      if (totalHeight <= targetHeight) {
        this.setState({
          text,
          targetCount: text.length,
        });
        return;
      }

      // bisection
      const len = text.length;
      const mid = Math.ceil(len / 2);

      const count = this.bisection(targetHeight, mid, 0, len, text, shadowNode);

      this.setState({
        text,
        targetCount: count,
      });
    }
  };

  bisection: (
    th: number,
    m: number,
    b: number,
    e: number,
    text: string,
    shadowNode: any,
  ) => number = (th, m, b, e, text, shadowNode) => {
    const suffix = '...';
    let mid = m;
    let end = e;
    let begin = b;
    shadowNode.innerHTML = text.substring(0, mid) + suffix;
    let sh = shadowNode.offsetHeight;

    if (sh <= th) {
      shadowNode.innerHTML = text.substring(0, mid + 1) + suffix;
      sh = shadowNode.offsetHeight;
      if (sh > th || mid === begin) {
        return mid;
      }
      begin = mid;
      if (end - begin === 1) {
        mid = 1 + begin;
      } else {
        mid = Math.floor((end - begin) / 2) + begin;
      }
      return this.bisection(th, mid, begin, end, text, shadowNode);
    }
    if (mid - 1 < 0) {
      return mid;
    }
    shadowNode.innerHTML = text.substring(0, mid - 1) + suffix;
    sh = shadowNode.offsetHeight;
    if (sh <= th) {
      return mid - 1;
    }
    end = mid;
    mid = Math.floor((end - begin) / 2) + begin;
    return this.bisection(th, mid, begin, end, text, shadowNode);
  };

  handleRoot = (n: HTMLDivElement) => {
    this.root = n;
  };

  handleContent = (n: HTMLDivElement) => {
    this.content = n;
  };

  handleNode = (n: HTMLSpanElement) => {
    this.node = n;
  };

  handleShadow = (n: HTMLDivElement) => {
    this.shadow = n;
  };

  handleShadowChildren = (n: HTMLDivElement) => {
    this.shadowChildren = n;
  };

  render() {
    const { text, targetCount } = this.state;
    const {
      children,
      lines,
      length,
      className,
      tooltip,
      fullWidthRecognition,
      omitStr,
      suffix,
      prefix,
      ...restProps
    } = this.props;

    const cls = classNames(styles.ellipsis, className, {
      [styles.lines]: lines && !isSupportLineClamp,
      [styles.lineClamp]: lines && isSupportLineClamp,
    });

    if (!lines && !length) {
      return (
        <span className={cls} {...restProps}>
          {prefix}
          {children}
          {omitStr}
          {suffix}
        </span>
      );
    }

    // 如果只限制长度
    if (!lines) {
      return (
        <EllipsisText
          className={cls}
          length={length!}
          text={children || ''}
          tooltip={tooltip}
          fullWidthRecognition={fullWidthRecognition!}
          suffix={suffix}
          omitStr={omitStr}
          prefix={prefix}
          {...restProps}
        />
      );
    }

    const id = `antd-pro-ellipsis-${`${new Date().getTime()}${Math.floor(
      Math.random() * 100,
    )}`}`;

    // support document.body.style.webkitLineClamp
    if (isSupportLineClamp) {
      const style = `#${id}{-webkit-line-clamp:${lines};-webkit-box-orient: vertical;}`;

      const node = (
        <div id={id} className={cls} {...restProps}>
          <style>{style}</style>
          {prefix}
          {children}
          {omitStr}
          {suffix}
        </div>
      );

      return getTooltip({
        tooltip,
        overlayStyle: TooltipOverlayStyle,
        title: children,
        children: node,
      });
    }

    const childNode = (
      <span ref={this.handleNode}>
        {prefix}
        {targetCount > 0 && text.substring(0, targetCount)}
        {targetCount > 0 && targetCount < text.length && '...'}
        {omitStr}
        {suffix}
      </span>
    );

    return (
      <div {...restProps} ref={this.handleRoot} className={cls}>
        <div ref={this.handleContent}>
          {getTooltip({
            tooltip,
            overlayStyle: TooltipOverlayStyle,
            title: text,
            children: childNode,
          })}
          {prefix}
          <div className={styles.shadow} ref={this.handleShadowChildren}>
            {children}
          </div>
          {omitStr}
          {suffix}
          <div className={styles.shadow} ref={this.handleShadow}>
            <span>
              {prefix}
              {text}
              {omitStr}
              {suffix}
            </span>
          </div>
        </div>
      </div>
    );
  }
}
