import { webRTC } from './Types';

const setLocalStream = stream => ({ type: webRTC.setLocalStream, value: stream });
const setPcPeer = (socketId, pc) => ({ type: webRTC.setPcPeer, value: { socketId, pc } });
const setStatus = status => ({ type: webRTC.setStatus, value: status });
const setRoomId = id => ({ type: webRTC.setRoomId, value: id });
const setRemoteList = list => ({ type: webRTC.setRemoteList, value: list });
const setTextRoomConnected = bool => ({ type: webRTC.setTextRoomConnected, value: bool });
const addTextRoomData = data => ({ type: webRTC.addTextRoomData, value: data });
const setTextRoomValue = data => ({ type: webRTC.setTextRoomValue, value: data });

export {
  setLocalStream,
  setPcPeer,
  setStatus,
  setRoomId,
  setRemoteList,
  setTextRoomConnected,
  addTextRoomData,
  setTextRoomValue,
};
