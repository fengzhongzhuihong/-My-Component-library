/**
 * 计算区域的中心点
 * @param {Object} pointArr
 */
export const calculateCenter = (pointArr: any[]) => {
  let total = pointArr.length;
  let X = 0,
    Y = 0,
    Z = 0;
  pointArr.map((item) => {
    let lng = (item.lng * Math.PI) / 180;
    let lat = (item.lat * Math.PI) / 180;
    let x, y, z;
    x = Math.cos(lat) * Math.cos(lng);
    y = Math.cos(lat) * Math.sin(lng);
    z = Math.sin(lat);
    X += x;
    Y += y;
    Z += z;
  });

  X = X / total;
  Y = Y / total;
  Z = Z / total;

  let Lng = Math.atan2(Y, X);
  let Hyp = Math.sqrt(X * X + Y * Y);
  let Lat = Math.atan2(Z, Hyp);

  return { lng: (Lng * 180) / Math.PI, lat: (Lat * 180) / Math.PI };
};

/* eslint-disable */
const PI = 3.14159265358979324;

const xPi = (3.14159265358979324 * 3000.0) / 180.0;

const GPS = {
  PI: 3.14159265358979324,
  xPi: (3.14159265358979324 * 3000.0) / 180.0,
  // BD-09 to GCJ-02
  bd_decrypt(bdLat: number, bdLon: number) {
    const x = bdLon - 0.0065;
    const y = bdLat - 0.006;
    const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.xPi);
    const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.xPi);
    const gcjLon = z * Math.cos(theta);
    const gcjLat = z * Math.sin(theta);
    return { lat: gcjLat, lng: gcjLon };
  },
  // WGS-84 to Web mercator
  // mercatorLat -> y mercatorLon -> x
  mercator_encrypt(wgsLat: number, wgsLon: number) {
    const x = (wgsLon * 20037508.34) / 180;
    let y =
      Math.log(Math.tan(((90 + wgsLat) * this.PI) / 360)) / (this.PI / 180);
    y = (y * 20037508.34) / 180;
    return { lat: y, lng: x };
    /*
    if ((Math.abs(wgsLon) > 180 || Math.abs(wgsLat) > 90))
        return null;
    let x = 6378137.0 * wgsLon * 0.017453292519943295;
    let a = wgsLat * 0.017453292519943295;
    let y = 3189068.5 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
    return {'lat' : y, 'lng' : x};
    // */
  },
  // Web mercator to WGS-84
  // mercatorLat -> y mercatorLon -> x
  mercator_decrypt(mercatorLat: number, mercatorLon: number) {
    const x = (mercatorLon / 20037508.34) * 180;
    let y = (mercatorLat / 20037508.34) * 180;
    y =
      (180 / this.PI) *
      (2 * Math.atan(Math.exp((y * this.PI) / 180)) - this.PI / 2);
    return { lat: y, lng: x };
    /*
    if (Math.abs(mercatorLon) < 180 && Math.abs(mercatorLat) < 90)
        return null;
    if ((Math.abs(mercatorLon) > 20037508.3427892) || (Math.abs(mercatorLat) > 20037508.3427892))
        return null;
    let a = mercatorLon / 6378137.0 * 57.295779513082323;
    let x = a - (Math.floor(((a + 180.0) / 360.0)) * 360.0);
    let y = (1.5707963267948966 - (2.0 * Math.atan(Math.exp((-1.0 * mercatorLat) / 6378137.0)))) * 57.295779513082323;
    return {'lat' : y, 'lng' : x};
    // */
  },
  // two point's distance
  distance(latA: number, lonA: number, latB: number, lonB: number) {
    const earthR = 6371000;
    const x =
      Math.cos((latA * this.PI) / 180) *
      Math.cos((latB * this.PI) / 180) *
      Math.cos(((lonA - lonB) * this.PI) / 180);
    const y =
      Math.sin((latA * this.PI) / 180) * Math.sin((latB * this.PI) / 180);
    let s = x + y;
    if (s > 1) s = 1;
    if (s < -1) s = -1;
    const alpha = Math.acos(s);
    return alpha * earthR;
  },
  outOfChina(lat: number, lon: number) {
    if (lon < 72.004 || lon > 137.8347) return true;
    return lat < 0.8293 || lat > 55.8271;
  },
  transformLat(x: number, y: number) {
    let ret =
      -100.0 +
      2.0 * x +
      3.0 * y +
      0.2 * y * y +
      0.1 * x * y +
      0.2 * Math.sqrt(Math.abs(x));
    ret +=
      ((20.0 * Math.sin(6.0 * x * this.PI) +
        20.0 * Math.sin(2.0 * x * this.PI)) *
        2.0) /
      3.0;
    ret +=
      ((20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin((y / 3.0) * this.PI)) *
        2.0) /
      3.0;
    ret +=
      ((160.0 * Math.sin((y / 12.0) * this.PI) +
        320 * Math.sin((y * this.PI) / 30.0)) *
        2.0) /
      3.0;
    return ret;
  },
  transformLon(x: number, y: number) {
    let ret =
      300.0 +
      x +
      2.0 * y +
      0.1 * x * x +
      0.1 * x * y +
      0.1 * Math.sqrt(Math.abs(x));
    ret +=
      ((20.0 * Math.sin(6.0 * x * this.PI) +
        20.0 * Math.sin(2.0 * x * this.PI)) *
        2.0) /
      3.0;
    ret +=
      ((20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin((x / 3.0) * this.PI)) *
        2.0) /
      3.0;
    ret +=
      ((150.0 * Math.sin((x / 12.0) * this.PI) +
        300.0 * Math.sin((x / 30.0) * this.PI)) *
        2.0) /
      3.0;
    return ret;
  },
};

/**
 * 换成
 * @param lng 经度
 * @param lat 纬度
 * @return {{lng: number, lat: number}}
 */
const delta = (lng: number, lat: number): { lat: number; lng: number } => {
  // Krasovsky 1940
  //
  // a = 6378245.0, 1/f = 298.3
  // b = a * (1 - f)
  // ee = (a^2 - b^2) / a^2;
  const a = 6378245.0; //  a: �����������ͶӰ��ƽ���ͼ���ϵ��ͶӰ���ӡ�
  const ee = 0.00669342162296594323; //  ee: �����ƫ���ʡ�
  let dLat = GPS.transformLat(lng - 105.0, lat - 35.0);
  let dLon = GPS.transformLon(lng - 105.0, lat - 35.0);
  const radLat = (lat / 180.0) * PI;
  let magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * PI);
  dLon = (dLon * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * PI);
  return { lat: dLat, lng: dLon };
};

/**
 * WGS-84 to GCJ-02
 * @param lng
 * @param lat
 */
export const gcjEncrypt = (
  lng: number,
  lat: number,
): { lng: number; lat: number } => {
  if (GPS.outOfChina(lat, lng)) return { lat: lat, lng: lng };

  const d = delta(lng, lat);
  return { lng: lng + d.lng, lat: lat + d.lat };
};

/**
 * GCJ-02 to WGS-84
 * @param lng
 * @param lat
 */
const gcjDecrypt = (lng: number, lat: number) => {
  if (GPS.outOfChina(lat, lng)) return { lat: lat, lng: lng };

  const d = delta(lng, lat);
  return { lat: lat - d.lat, lng: lng - d.lng };
};

/**
 * GCJ-02 to WGS-84 精确版本
 * @param {Object} lat
 * @param {Object} lng
 */
export const gcjDecryptExact = (lng: number, lat: number) => {
  lat = Number(lat);
  lng = Number(lng);
  const initDelta = 0.01;
  const threshold = 0.000000001;
  let dLat = initDelta;
  let dLon = initDelta;
  let mLat = lat - dLat;
  let mLon = lng - dLon;
  let pLat = lat + dLat;
  let pLon = lng + dLon;
  let wgsLat;
  let wgsLon;
  let i = 0;
  while (1) {
    wgsLat = (mLat + pLat) / 2;
    wgsLon = (mLon + pLon) / 2;
    const tmp = gcjEncrypt(wgsLat, wgsLon);
    dLat = tmp.lat - lat;
    dLon = tmp.lng - lng;
    if (Math.abs(dLat) < threshold && Math.abs(dLon) < threshold) break;

    if (dLat > 0) pLat = wgsLat;
    else mLat = wgsLat;
    if (dLon > 0) pLon = wgsLon;
    else mLon = wgsLon;

    if (++i > 10000) break;
  }
  // console.log(i);
  return { lng: wgsLon, lat: wgsLat };
};

/**
 * ]GCJ-02 to BD-09
 * @param lng
 * @param lat
 */
export const bdEncrypt = (lng: any, lat: any) => {
  const x = lng;
  const y = lat;
  const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * xPi);
  const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * xPi);
  const bdLon = z * Math.cos(theta) + 0.0065;
  const bdLat = z * Math.sin(theta) + 0.006;
  return { lng: bdLon, lat: bdLat };
};

/**
 * BD-09 to GCJ-02
 * @param lng
 * @param lat
 */
export const bdDecrypt = (lng: number, lat: number) => {
  const x = lng - 0.0065;
  const y = lat - 0.006;
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * xPi);
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * xPi);
  const gcjLon = z * Math.cos(theta);
  const gcjLat = z * Math.sin(theta);
  return { lng: gcjLon, lat: gcjLat };
};

const GPSUtils = {
  gcjEncrypt,
  gcjDecrypt,
  gcjDecryptExact,
  bdEncrypt,
  bdDecrypt,
};

export default GPSUtils;
