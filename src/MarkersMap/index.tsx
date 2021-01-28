import React from 'react';
import { Map, MapProps, Markers } from 'react-amap';

const shopImgUrl =
  'https://cxbj-public-1302123862.cos.ap-beijing.myqcloud.com/home/shop.png';
const defaultOptions: MapProps = {
  amapkey: 'ae4d33cf3acc35fa490b177ca3ba7255',
  version: '2.0',
  // 默认缩放级别
  zoom: 12,
  // 缩放级别
  zooms: [10, 18],
  plugins: ['ToolBar', 'Scale'],
};

// @ts-ignore
export interface IPosition {
  latitude: string;
  longitude: string;
}
export interface IMarker {
  position: IPosition;
  entId: string;
}
export interface IBounds {
  x0: number | string;
  y0: number | string;
  x1: number | string;
  y1: number | string;
}
export interface IMapProps {
  markers?: IMarker[];
  children?: JSX.Element;
  marksEvents?: any;
  mapEvents?: any;
  mapStyle?: any;
  defaultCenter?: IPosition;
  options?: any;
  markersRender?: (data: any) => JSX.Element;
}

/**
 * @name 地图组件(附带markers功能)
 * @author 喵怼怼
 * @param markers 标记点集合
 * @param children children
 * @param mapEvents Map组件的events属性
 * @param marksEvents Markers组件的events属性
 * @param mapStyle 地图样式
 * @param defaultCenter 默认中心点
 * @param options 配置
 * @param markersRender 标记点 JSXElement
 */
const MarkersMap = ({
  markers,
  markersRender,
  children,
  mapEvents,
  marksEvents,
  mapStyle,
  defaultCenter,
  options,
}: IMapProps) => {
  const myOptions = { ...defaultOptions, ...options };
  return (
    <div style={{ width: '100%', height: 500, ...mapStyle }}>
      <Map
        center={
          defaultCenter || { longitude: '116.201203', latitude: '39.90759' }
        }
        events={mapEvents}
        {...myOptions}
      >
        {markers && (
          <Markers
            render={(data: any) => {
              if (markersRender) {
                return markersRender(data);
              } else {
                return <img src={shopImgUrl} width={30} height={30} />;
              }
            }}
            events={marksEvents}
            markers={markers || []}
            useCluster
          />
        )}
        {children || null}
      </Map>
    </div>
  );
};
export default MarkersMap;
