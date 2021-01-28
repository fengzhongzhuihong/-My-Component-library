/**
 * @author tangbin
 * @date 2018/7/10-19:52
 * @descriptions:
 */
import React from 'react';
import Amap from '../Amap';
import { LngLatPos, MapProps } from 'react-amap';

interface IGis extends LngLatPos {
  address: string;
  addressinfo: string;
}

/**
 * MapPoint使用时需要传递的数据
 */
interface IMapPointProps {
  /**
   * 坐标点位置
   */
  gis: IGis;
  /**
   * 地图的外壳样式
   */
  mapstyle?: React.CSSProperties;
  /**
   * 版本号
   */
  version?: string;
  /**
   * 地图的key值
   */
  amapkey: string;
  /**
   * 放大级别
   */
  zoom?: number | 15;
  /**
   * 地图的配置项，可以直接传递一个这个来覆盖前面的配置
   */
  mapConfig?: MapProps;
}
/**
 * 基本信息
 * @param props 包含gis参数
 * @returns {*}
 * @constructor
 */
const Index: React.FC<IMapPointProps> = ({
  gis,
  mapstyle,
  amapkey,
  version,
  zoom,
  mapConfig,
}) => {
  if (gis) {
    const point = {
      lng: gis.lng,
      lat: gis.lat,
    };

    // 重构数据
    return (
      <div style={mapstyle}>
        <Amap
          {...gis}
          center={point}
          amapkey={amapkey}
          version={version}
          zoom={zoom}
          {...mapConfig}
        />
      </div>
    );
  }
  return null;
};

Index.defaultProps = {
  gis: {
    lat: 39.9078804302,
    lng: 116.2017810345,
    address: '中国北京市北京市石景山区',
    addressinfo: '盛景国际',
  },
  mapstyle: {
    width: '100%',
    height: 385,
  },
  version: '1.4.11',
  zoom: 15,
  mapConfig: {},
};

export default Index;
