/**
 * @author tangbin
 * @date 2019/2/20-10:58
 * @descriptions: 全新日期选择器完成日期选择
 */
import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import dayjs, { Dayjs } from 'dayjs';
import DatePicker from '../DayjsPicker/DatePicker';

// @ts-ignore
import styles from './index.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

function fixedZero(val: any) {
  return val * 1 < 10 ? `0${val}` : val;
}

type DType = 'today' | 'week' | 'month' | 'year' | '';

// 日期选择后的值
export type DDateType = [Dayjs, Dayjs];

interface IProps {
  pickerChange: (e: DDateType) => void;
  style?: React.CSSProperties;
  layout?: 'radio' | 'selectItem';
  openDatePicker?: boolean;
  /**
   * 默认显示的类型 'today' | 'week' | 'month' | 'year'
   */
  type?: DType;
}

interface IState {
  rangePickerValue: DDateType;
  selectValue: DType;
}

/**
 * @descriptions: 全新日期选择器完成日期选择
 */
class DatePickerPlus extends React.Component<IProps, IState> {
  state: IState = {
    rangePickerValue: [dayjs(), dayjs()],
    selectValue: this.props.type || '',
  };

  static propTypes = {
    /**
     * 时间选择的回调函数
     */
    pickerChange: PropTypes.func,
    /**
     * 样式
     */
    style: PropTypes.object,
    /**
     * 布局
     */
    layout: PropTypes.string,
    /**
     * 是否开启时间展示
     */
    openDatePicker: PropTypes.bool,
  };

  static defaultProps = {
    pickerChange: () => console.log('无效的方法'),
    style: { width: 256 },
    layout: 'radio',
    openDatePicker: true,
  };

  /**
   * 判断是否选中
   * @param type
   * @returns {*}
   */
  isActive = (type: DType) => {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return 'currentDate';
    }
    return '';
  };
  componentDidMount() {
    this.props.type && this.selectDate(this.props.type);
  }

  // 判断是否选择了我
  isSelect = () => {
    // 拿到当前选中的值
    const { selectValue, rangePickerValue } = this.state;
    // 判断和选择的时间是否相同
    const value = getTimeDistance(selectValue);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return selectValue;
    }
    return '';
  };

  /**
   * 点击日期的选择
   * @param type
   */
  selectDate = (type: DType) => {
    this.setState({
      selectValue: type,
    });
    this.handleRangePickerChange(getTimeDistance(type));
  };

  /**
   * 选择事件
   * @param rangePickerValue 选择的值
   */
  handleRangePickerChange = (rangePickerValue: DDateType) => {
    if (rangePickerValue == null) return;
    const { pickerChange } = this.props;
    this.setState(
      {
        rangePickerValue,
      },
      () => pickerChange(rangePickerValue),
    );
  };

  render() {
    const { rangePickerValue } = this.state;

    const { style, layout, openDatePicker } = this.props;

    const radio = (
      <div className="salesExtra">
        <a
          className={this.isActive('today')}
          onClick={() => this.selectDate('today')}
        >
          今日
        </a>
        <a
          className={this.isActive('week')}
          onClick={() => this.selectDate('week')}
        >
          本周
        </a>
        <a
          className={this.isActive('month')}
          onClick={() => this.selectDate('month')}
        >
          本月
        </a>
        <a
          className={this.isActive('year')}
          onClick={() => this.selectDate('year')}
        >
          本年
        </a>
      </div>
    );

    const selectVal: DType = this.isSelect();

    const selectItem = (
      <Select
        placeholder="日期选择"
        value={selectVal}
        onChange={this.selectDate}
        className={styles.salesExtra}
        style={{ width: 120 }}
      >
        <Option value="">全部</Option>
        <Option value="today">今日</Option>
        <Option value="week">本周</Option>
        <Option value="month">本月</Option>
        <Option value="year">本年</Option>
      </Select>
    );

    return (
      <div className="salesExtraWrap">
        {layout === 'radio' ? radio : selectItem}
        {openDatePicker && (
          <RangePicker
            value={rangePickerValue as [Dayjs, Dayjs]}
            onChange={(values: any) =>
              this.handleRangePickerChange(values as DDateType)
            }
            style={style}
          />
        )}
      </div>
    );
  }
}

export default DatePickerPlus;

export function getTimeDistance(type: DType): [Dayjs, Dayjs] {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [dayjs(now), dayjs(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [dayjs(beginTime), dayjs(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = dayjs(now).add(1, 'month');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      dayjs(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      dayjs(
        dayjs(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() -
          1000,
      ),
    ];
  }

  const year = now.getFullYear();
  return [dayjs(`${year}-01-01 00:00:00`), dayjs(`${year}-12-31 23:59:59`)];
}
