import { webRTC as webRTCTypes } from '../actions/Types';

// status: 0 = initializing, 1 = connecting, 2 = ready

const initWebRTCState = {
  localStream: null,
  pcPeers: {},
  status: 0,
  roomId: '',
  remoteList: {},
  battleRoomConnected: false,
};

export default function WebRTC(state = initWebRTCState, action) {
  switch (action.type) {
    case webRTCTypes.setLocalStream:
      return {
        ...state,
        localStream: action.value,
      };
    case webRTCTypes.setPcPeer:
      return {
        ...state,
        pcPeers: {
          ...state.pcPeers,
          [action.value.socketId]: action.value.pc,
        },
      };
    case webRTCTypes.setStatus:
      return {
        ...state,
        status: action.value,
      };
    case webRTCTypes.setRoomId:
      return {
        ...state,
        roomId: action.value,
      };
    case webRTCTypes.setRemoteList:
      return {
        ...state,
        remoteList: action.value,
      };
    case webRTCTypes.setBattleRoomConnected:
      return {
        ...state,
        battleRoomConnected: action.value,
      };
    case webRTCTypes.setBattleRoomValue:
      return {
        ...state,
        battleRoomValue: action.value,
      };
    default:
      return state;
  }
}
