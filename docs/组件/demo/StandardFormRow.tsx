import React from 'react';
import StandardFormRow from '../../../src/StandardFormRow';
import { Form, Input } from 'antd';

interface IProps {}
/**
 * 说明：水印组件
 * @author
 * @date
 */
const StandardFormRow1: React.FC<IProps> = () => {
  return (
    <div>
      <div>
        <StandardFormRow title="基础用法">
          <Form>
            <Form.Item label="lable" name="state">
              <Input />
            </Form.Item>
            <Form.Item label="lable" name="state">
              <Input />
            </Form.Item>
            <Form.Item label="lable" name="state">
              <Input />
            </Form.Item>
          </Form>
        </StandardFormRow>
      </div>
      <div>
        <StandardFormRow title="网格grid" grid>
          <Form>
            <Form.Item label="lable" name="state">
              <Input />
            </Form.Item>
            <Form.Item label="lable" name="state">
              <Input />
            </Form.Item>
            <Form.Item label="lable" name="state">
              <Input />
            </Form.Item>
          </Form>
        </StandardFormRow>
      </div>

      <div>
        <StandardFormRow title="块block" block>
          <Form>
            <Form.Item label="lable" name="state">
              <Input />
            </Form.Item>
            <Form.Item label="lable" name="state">
              <Input />
            </Form.Item>
            <Form.Item label="lable" name="state">
              <Input />
            </Form.Item>
          </Form>
        </StandardFormRow>
      </div>
      <div>
        <StandardFormRow title="最后一个last" last>
          最后一个没有分割线
        </StandardFormRow>
      </div>
    </div>
  );
};

export default StandardFormRow1;
