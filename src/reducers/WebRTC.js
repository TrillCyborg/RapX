import { webRTC as webRTCTypes } from '../actions/Types';

// status: 0 = initializing, 1 = connecting, 2 = ready

const initWebRTCState = {
  localStream: null,
  pcPeers: {},
  status: 0,
  roomId: '',
  remoteList: {},
  textRoomConnected: false,
  textRoomData: [],
  textRoomValue: '',
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
    case webRTCTypes.setTextRoomConnected:
      return {
        ...state,
        textRoomConnected: action.value,
      };
    case webRTCTypes.addTextRoomData:
      return {
        ...state,
        textRoomData: [
          ...state.textRoomData,
          action.value,
        ],
      };
    case webRTCTypes.setTextRoomValue:
      return {
        ...state,
        textRoomValue: action.value,
      };
    default:
      return state;
  }
}
