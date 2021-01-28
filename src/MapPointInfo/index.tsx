/* eslint-disable */
/**
 * @author tangbin
 * @date 2018/7/10-20:13
 * @descriptions:
 */
import React from 'react';
import { LngLat, Map, MapProps, Marker } from 'react-amap';
import { Input } from 'antd';
import { gcjDecryptExact } from './GPSUtils';

const Search = Input.Search;

/**
 * MapPointInfo使用时需要传递的数据
 */
export interface IMapPointInfo {
  /**
   * 地图信息方法
   */
  mapInfoFn: (
    result: {
      info: string;
      regeocode: any;
      geocodes: any[];
      resultNum: number;
    },
    pointobj: any,
  ) => void;
  /**
   * 地图中心点
   */
  center: LngLat;
  /**
   * 坐标点
   */
  markerPoint?: LngLat;
  /**
   * 地图的key值
   */
  amapkey?: string;
  /**
   * 版本号
   */
  version?: string;
  /**
   * 放大级别,默认值为15
   */
  zoom?: number;
  /**
   * 地图配置属性，可以覆盖之前的属性
   */
  mapConfig?: MapProps;
  /**
   * 自定义地图容器样式
   */
  mapStyle?: React.CSSProperties;
  /**
   * 默认信息
   */
  gis?: {
    sysAddress: string;
  };
}

const layerStyle: React.CSSProperties = {
  position: 'absolute',
  top: '15px',
  left: '51%',
};

const searchStyle: React.CSSProperties = {
  padding: '10px',
  position: 'absolute',
  top: '5px',
  left: '10px',
  maxWidth: '49%',
};

let self: MapPointInfo = {} as MapPointInfo;

interface IState {
  what: string;
  draggable: boolean;
  pointObj: LngLat;
  point: LngLat | undefined;
  pgypoint: LngLat | undefined;
}

class MapPointInfo extends React.Component<IMapPointInfo, IState> {
  constructor(props: IMapPointInfo) {
    super(props);
    self = this;
  }

  state: IState = {
    what: '点击地图开始绘制',
    draggable: false,
    pointObj: {} as LngLat,
    point: undefined,
    pgypoint: undefined,
  };

  map: any;
  geocoder: any;

  // 地图事件
  mapEvents = {
    // 构建后触发
    created: (mapInstance: { getZoom: () => any }) => {
      console.log(
        '高德地图 Map 实例创建成功；如果你要亲自对实例进行操作，可以从这里开始。比如：',
      );
      console.log(mapInstance.getZoom());
      this.map = mapInstance;
      // @ts-ignore
      const AMap = window.AMap;
      AMap.plugin('AMap.Geocoder', () => {
        this.geocoder = new AMap.Geocoder({
          city: '010', // 城市，默认：“全国”
        });
      });
      // 是否需要直地址转坐标
      if (typeof this.props.gis === 'object') {
        const address = this.props.gis.sysAddress;
        this.addressToPoint(address);
      }
    },
    // 点击事件
    click: (e: any) => {
      // 显示坐标点
      this.setState({
        point: e.lnglat,
      });
      this.pointToAddress(e.lnglat, e);
    },
    // 定位操作
    Geolocation: () => {
      // @ts-ignore
      const geolocation = window.AMap.Geolocation({
        // 是否使用高精度定位，默认：true
        enableHighAccuracy: true,
        // 设置定位超时时间，默认：无穷大
        timeout: 10000,
        // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
        // @ts-ignore
        buttonOffset: new window.AMap.Pixel(10, 20),
        //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        zoomToAccuracy: true,
        //  定位按钮的排放位置,  RB表示右下
        buttonPosition: 'RB',
      });
      geolocation.getCurrentPoint();
      // @ts-ignore
      window.AMap.event.addListener(geolocation, 'complete', self.onComplete);
      // @ts-ignore
      window.AMap.event.addListener(geolocation, 'error', self.onError);
    },
  };
  mapPlugins: any = ['ToolBar'];

  // 定位信息显示
  onComplete = (data: any) => {
    console.log(data);
  };

  // 监听报错
  onError = (data: any) => {
    console.log(data);
  };

  // 坐标转地理信息
  pointToAddress = (lnglat: any, e: any) => {
    this.geocoder &&
      this.geocoder.getAddress(
        lnglat,
        (status: string, result: { regeocode: { formattedAddress: any } }) => {
          let text = '';
          console.log(result);
          this.mapAddress(result, e);
          // 在地图上显示一个点
          if (status === 'complete') {
            if (result.regeocode) {
              text = `您当前所选择的坐标位置是 {${
                result.regeocode.formattedAddress || '未知地点'
              }}`;
            } else {
              text = '未知地点';
            }
          } else {
            text = '未知地点';
          }
          this.setState({
            what: text,
          });
        },
      );
  };

  // 地址-》坐标
  addressToPoint = (address: any) => {
    const _this = this;
    // 地址解析
    _this.geocoder.getLocation(
      address,
      (
        status: string,
        result: {
          info: string;
          geocodes: { location: { lng: any; lat: any } }[];
          regeocode: { formattedAddress: any };
        },
      ) => {
        if (status === 'complete' && result.info === 'OK') {
          console.log(result);
          // 构建坐标点
          _this.setState({
            point: result.geocodes[0].location,
            pgypoint: {
              longitude: result.geocodes[0].location.lng,
              latitude: result.geocodes[0].location.lat,
            }, // 苹果园坐标
          });
          // 构建坐标
          const pointobj = {
            lnglat: {
              lat: result.geocodes[0].location.lat,
              lng: result.geocodes[0].location.lng,
            },
          };
          result.regeocode = {
            formattedAddress: address,
          };
          _this.mapAddress(result, pointobj);
        }
      },
    );
  };

  // 地理信息，接收两个参数，一个坐标对象，一个转码结果
  mapAddress(result: any, pointobj: any) {
    const { mapInfoFn } = this.props;
    // 坐标进行转码
    const wgsObj = gcjDecryptExact(pointobj.lnglat.lat, pointobj.lnglat.lng);
    pointobj.lnglat.wgslat = wgsObj.lat;
    pointobj.lnglat.wgslng = wgsObj.lng;
    // 执行方法
    mapInfoFn(result, pointobj);
  }

  // 查询关键词
  searchValue(value: any) {
    this.addressToPoint(value);
  }

  enterValue(event: any) {
    // 阻止事件
    event.preventDefault();
    this.addressToPoint(event.target.value);
  }

  render() {
    const { point, what } = this.state;

    const {
      center = {
        lat: 39.9078804302,
        lng: 116.2017810345,
      },
      markerPoint,
      amapkey,
      zoom = 15,
      mapConfig = {},
      version = '1.4.12',
      mapStyle = { width: '100%', height: 450 },
    } = this.props;

    return (
      <React.Fragment>
        <div style={mapStyle}>
          <Map
            amapkey={amapkey}
            plugins={this.mapPlugins}
            center={point || center}
            events={this.mapEvents}
            zoom={zoom}
            version={version}
            {...mapConfig}
          >
            {point || markerPoint ? (
              <Marker position={point || markerPoint} />
            ) : (
              ''
            )}
            <div className="ant-btn" style={layerStyle}>
              {what}
            </div>
            <Search
              placeholder="请输入地理位置描述"
              onSearch={(value) => this.searchValue(value)}
              onPressEnter={(e) => this.enterValue(e)}
              enterButton
              style={searchStyle}
            />
          </Map>
        </div>
      </React.Fragment>
    );
  }
}

export default MapPointInfo;
