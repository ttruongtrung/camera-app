export const getRTSPlink = (model_type, ip_address, username, password) => {
  let rtsp_link = '';
  switch (model_type.toLowerCase()) {
    case 'imou c22':
      rtsp_link = `rtsp://${username}:${password}@${ip_address}:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif`;
      break;
    default:
      rtsp_link = `rtsp://${username}:${password}@${ip_address}:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif`;
  }
  return rtsp_link;
}