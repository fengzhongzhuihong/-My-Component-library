import { Tag } from 'antd';
import classNames from 'classnames';
import React, { Component } from 'react';
import { UpOutlined, DownOutlined } from '@ant-design/icons';

// @ts-ignore
import styles from './index.less';
const { CheckableTag } = Tag;

interface TagSelectOptionProps {
  value?: string | number;
  style?: React.CSSProperties;
  checked?: boolean;
  onChange?: (value: string | number, state: boolean) => void;
}

interface TagSelectOptionType extends React.FC<TagSelectOptionProps> {
  isTagSelectOption?: boolean;
}

const TagSelectOption: TagSelectOptionType = ({
  children,
  checked = false,
  onChange,
  value = '',
}) => (
  <CheckableTag
    checked={checked}
    key={value}
    onChange={(state) => onChange && onChange(value, state)}
  >
    {children}
  </CheckableTag>
);

TagSelectOption.isTagSelectOption = true;

interface TagSelectProps {
  onChange?: (value: string[]) => void;
  expandable?: boolean;
  value?: string[] | number[];
  defaultValue?: string[] | number[];
  style?: React.CSSProperties;
  hideCheckAll?: boolean;
  actionsText?: {
    expandText?: React.ReactNode;
    collapseText?: React.ReactNode;
    selectAllText?: React.ReactNode;
  };
  className?: string;
  Option?: TagSelectOptionProps;
  children: React.ReactElement<any> | React.ReactElement<any>[];
  setting?: string;
}

interface TagSelectState {
  value: any[];
  expand: boolean;
}
class TagSelect extends Component<TagSelectProps, TagSelectState> {
  static defaultProps = {
    hideCheckAll: false,
    actionsText: {
      expandText: '展开',
      collapseText: '收起',
      selectAllText: '选择全部',
    },
  };

  public static Option: typeof TagSelectOption;

  static getDerivedStateFromProps(nextProps: TagSelectProps) {
    if ('value' in nextProps) {
      return { value: nextProps.value || [] };
    }
    return null;
  }

  constructor(props: TagSelectProps) {
    super(props);
    this.state = {
      expand: false,
      value: props.value || props.defaultValue || [],
    };
  }

  onChange = (value: any[]) => {
    const { onChange } = this.props;
    if (!('value' in this.props)) {
      this.setState({ value });
    }
    if (onChange) {
      onChange(value);
    }
  };

  onSelectAll = (checked: boolean) => {
    let checkedTags: any[] = [];
    if (checked) {
      checkedTags = this.getAllTags();
    }
    this.onChange(checkedTags);
  };

  getAllTags() {
    let { children } = this.props;
    children = React.Children.toArray(children) as React.ReactElement<any>[];
    const checkedTags = children
      .filter((child) => this.isTagSelectOption(child))
      .map((child) => child.props.value);
    return checkedTags || [];
  }

  handleTagChange = (value: any, checked: any) => {
    //判断单选多选的问题value是选中的数据点击变色
    const { value: StateValue } = this.state;
    const checkedTags = [...StateValue];
    // let checkedTags: any[] = setting ? value.split(',') : [...StateValue];
    const index = checkedTags.indexOf(value);
    if (checked && index === -1) {
      checkedTags.push(value);
    } else if (!checked && index > -1) {
      checkedTags.splice(index, 1);
    }
    this.onChange(checkedTags);
  };

  handleExpand = () => {
    const { expand } = this.state;
    this.setState({
      expand: !expand,
    });
  };

  isTagSelectOption = (node: any) =>
    node &&
    node.type &&
    (node.type.isTagSelectOption ||
      node.type.displayName === 'TagSelectOption');

  render() {
    const { value, expand } = this.state;
    const {
      children,
      hideCheckAll,
      className,
      expandable,
      actionsText,
    } = this.props;
    const checkedAll = this.getAllTags().length === value.length;
    const actionsTextObj: any = actionsText === null ? {} : actionsText;
    const { expandText, collapseText, selectAllText } = actionsTextObj;

    const cls = classNames(styles.tagSelect, className, {
      [styles.hasExpandTag]: expandable,
      [styles.expanded]: expand,
    });

    return (
      <div className={cls} style={{ overflowY: 'auto', maxHeight: 200 }}>
        {hideCheckAll ? null : (
          <CheckableTag
            checked={checkedAll}
            key="tag-select-__all__"
            onChange={this.onSelectAll}
          >
            {selectAllText}
          </CheckableTag>
        )}
        {value &&
          React.Children.map(children, (child: React.ReactElement<any>) => {
            if (this.isTagSelectOption(child)) {
              return React.cloneElement(child, {
                key: `tag-select-${child.props.value}`,
                value: child.props.value,
                checked: value.indexOf(child.props.value) > -1,
                onChange: (v: string, state: boolean) => {
                  this.handleTagChange(v, state);
                  child.props.onChange(v, state);
                },
              });
            }
            return child;
          })}
        {expandable && (
          <a className={styles.trigger} onClick={this.handleExpand}>
            {expand ? (
              <>
                {collapseText}
                <UpOutlined />
              </>
            ) : (
              <>
                {expandText}
                <DownOutlined />
              </>
            )}
          </a>
        )}
      </div>
    );
  }
}

TagSelect.Option = TagSelectOption;

export default TagSelect;
