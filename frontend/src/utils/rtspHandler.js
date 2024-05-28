export const getRTSPlink = (model_type, ip_address, username, password) => {
  let rtsp_link = '';
  switch (model_type.toLowerCase()) {
    case 'test2':
      rtsp_link = `rtsp://rtspstream:e97f4613041acde1ff18c547f7d02fe9@zephyr.rtsp.stream/movie`;
      break;
    case 'test3':
      rtsp_link = `rtsp://rtspstream:6152ea814d913af591cb203d7a51848c@zephyr.rtsp.stream/pattern`;
      break;
    default:
      rtsp_link = `rtsp://${username}:${password}@${ip_address}:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif`;
  }
  return rtsp_link;
}