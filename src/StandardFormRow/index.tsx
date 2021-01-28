import classNames from 'classnames';
import React from 'react';

// @ts-ignore
import styles from './index.less';

interface IProps {
  /**
   * 前面的标题
   */
  title?: string;
  /**
   * 是否是最后一个，如果是最后一个，就不显示那个虚线了
   */
  last?: boolean;
  /**
   * 块
   */
  block?: boolean;
  /**
   * 网格
   */
  grid?: boolean;
  /**
   * 样式
   */
  style?: React.CSSProperties;
}

const StandardFormRow: React.FC<IProps> = ({
  title,
  children,
  last,
  block,
  grid,
  ...rest
}) => {
  const cls = classNames(styles.standardFormRow, {
    [styles.standardFormRowBlock]: block,
    [styles.standardFormRowLast]: last,
    [styles.standardFormRowGrid]: grid,
  });

  return (
    <div className={cls} {...rest}>
      {title && (
        <div className={styles.label}>
          <span>{title}</span>
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default StandardFormRow;
