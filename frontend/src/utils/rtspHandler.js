export const getRTSPlink = (model_type, ip_address, username, password) => {
  let rtsp_link = '';
  switch (model_type.toLowerCase()) {
    case 'test2':
      // rtsp_link = `rtsp://admin:L26A4E6A@192.168.1.4:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif`;
      rtsp_link = `rtsp://admin:L2427AA6@192.168.1.14:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif`;
      break;
    case 'test3':
      // rtsp_link = `rtsp://rtspstream:6152ea814d913af591cb203d7a51848c@zephyr.rtsp.stream/pattern`;
      rtsp_link = `rtsp://admin:L2427AA6@192.168.1.14:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif`;
      break;
    default:
      rtsp_link = `rtsp://${username}:${password}@${ip_address}:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif`;
  }
  return rtsp_link;
}