import { webRTC } from './Types';

const setLocalStream = stream => ({ type: webRTC.setLocalStream, value: stream });
const setPcPeer = (socketId, pc) => ({ type: webRTC.setPcPeer, value: { socketId, pc } });
const setStatus = status => ({ type: webRTC.setStatus, value: status });
const setRoomId = id => ({ type: webRTC.setRoomId, value: id });
const setRemoteList = list => ({ type: webRTC.setRemoteList, value: list });
const setBattleRoomConnected = bool => ({ type: webRTC.setBattleRoomConnected, value: bool });

export {
  setLocalStream,
  setPcPeer,
  setStatus,
  setRoomId,
  setRemoteList,
  setBattleRoomConnected,
};
