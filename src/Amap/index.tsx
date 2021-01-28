import React from 'react';
import { LngLat, Map, MapProps, Marker } from 'react-amap';

const layerStyle: React.CSSProperties = {
  padding: '10px',
  background: '#fff',
  border: '1px solid #ddd',
  borderRadius: '4px',
  position: 'absolute',
  top: '10px',
  left: '2%',
};

const defOptions = {
  point: {
    lat: '39.9078804302',
    lng: '116.2017810345',
  },
  version: '1.4.11',
  zoom: 15,
  mapPlugins: ['ToolBar'],
};

/**
 * 高德地图
 */
export interface IAmap {
  /**
   * 地图的中心点。默认
   * {lat: '39.9078804302',lng: '116.2017810345'}
   */
  center: LngLat;
  /**
   * 地图的key值，如果这个参数不传递的话，
   * 会获取window.amapkey中的值
   */
  amapkey?: string;
  /**
   * 版本号，默认：1.4.11
   */
  version?: string;
  /**
   * 放大级别
   */
  zoom?: number;
  /**
   * 填写的位置
   */
  addressinfo: string;
  /**
   * 定位位置
   */
  address: string;
  /**
   * 地图配置项
   */
  options?: MapProps;
}

const Index: React.FC<IAmap> = (props) => {
  const { address, addressinfo, center } = props;
  const mapOptions = {
    ...defOptions,
    ...props.options,
  };
  return (
    <Map {...mapOptions}>
      <Marker position={center} />
      <div style={layerStyle}>
        <div>定位地址：{address}</div>
        <div>详细位置：{addressinfo}</div>
      </div>
    </Map>
  );
};

export default Index;
