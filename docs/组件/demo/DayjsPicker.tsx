import React from 'react';
import { Dayjs } from 'dayjs';
import DatePicker from '../../../src/DayjsPicker/DatePicker';
import 'antd/lib/date-picker/style/index.less';

const DayjsPicker = () => {
  function onChange(date: Dayjs | null, dateString: string) {
    console.log(date, dateString);
  }

  return (
    <div>
      <DatePicker onChange={onChange} />
    </div>
  );
};

export default DayjsPicker;
