import io from 'socket.io-client/socket.io';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
} from 'react-native-webrtc';
import Store from '../store/Store';
import {
  setPcPeer,
  setBattleConnectionInfo,
  setRemoteList,
  setTextRoomConnected,
  addTextRoomData,
  setTextRoomValue,
} from '../actions';

const configuration = { iceServers: [{ url: 'stun:stun.l.google.com:19302' }] };

function logError(error) {
  console.log('logError', error);
}

function getSocket() {
  return io.connect('https://webrtc-signal-test-server.herokuapp.com/', { transports: ['websocket'] });
}

// Join a room with roomID
function joinRoom(socket, roomId) {
  socket.emit('join', roomId, (socketIds) => {
    console.log('join', socketIds);
    socketIds.forEach((id) => {
      createPC(socket, id, true);
    });
  });
}

// Create a peer connection for each socketId in the room
function createPC(socket, socketId, isOffer) {
  function createOffer() {
    // Request or update connection with other peer(s)
    pc.createOffer((desc) => {
      console.log('createOffer', desc);
      // Set data about local peer connection and media
      pc.setLocalDescription(desc, () => {
        console.log('setLocalDescription', pc.localDescription);
        socket.emit('exchange', { to: socketId, sdp: pc.localDescription });
      }, logError);
    }, logError);
  }
  function getStats() {
    const pcPeers = Store.getState().webRTC.pcPeers;
    const pc = pcPeers[Object.keys(pcPeers)[0]];
    // Get audio tracks of other peer(s)
    if (pc.getRemoteStreams()[0] && pc.getRemoteStreams()[0].getAudioTracks()[0]) {
      const track = pc.getRemoteStreams()[0].getAudioTracks()[0];
      console.log('track', track);
      //
      pc.getStats(track, (report) => {
        console.log('getStats report', report);
      }, logError);
    }
  }
  // Create data channel for peers to exchange data
  function createDataChannel() {
    if (pc.textDataChannel) {
      return;
    }
    // Create a data channel called text
    const dataChannel = pc.createDataChannel('text');

    dataChannel.onerror = (error) => {
      console.log('dataChannel.onerror', error);
    };

    dataChannel.onmessage = (event) => {
      console.log('dataChannel.onmessage', event.data);
      Store.dispatch(addTextRoomData({ user: socketId, message: event.data }));
      Store.dispatch(setTextRoomValue(''));
    };

    dataChannel.onopen = () => {
      console.log('dataChannel.onopen');
      Store.dispatch(setTextRoomConnected(true));
    };

    dataChannel.onclose = () => {
      console.log('dataChannel.onclose');
    };

    pc.textDataChannel = dataChannel;
  }

  const pc = new RTCPeerConnection(configuration);
  Store.dispatch(setPcPeer(socketId, pc));

  // Local ICE agent needs to deliver message to another peer
  pc.onicecandidate = (event) => {
    console.log('onicecandidate', event.candidate);
    if (event.candidate) {
      socket.emit('exchange', { to: socketId, candidate: event.candidate });
    }
  };

  // Change occured which requires session negotiation
  pc.onnegotiationneeded = () => {
    console.log('onnegotiationneeded');
    if (isOffer) {
      createOffer();
    }
  };

  // Handle connections ICE agent change
  pc.oniceconnectionstatechange = (event) => {
    console.log('oniceconnectionstatechange', event.target.iceConnectionState);
    if (event.target.iceConnectionState === 'completed') {
      setTimeout(() => {
        getStats();
      }, 1000);
      createDataChannel();
    }
  };

  // Handle signal state change caused by setLocalDescription or setRemoteDescription
  pc.onsignalingstatechange = (event) => {
    console.log('onsignalingstatechange', event.target.signalingState);
  };

  // Handle remote peer adding media stream to this current connection
  pc.onaddstream = (event) => {
    console.log('onaddstream', event.stream);
    Store.dispatch(setBattleConnectionInfo('One peer join!'));

    const remoteList = Store.getState().webRTC.remoteList;
    remoteList[socketId] = event.stream.toURL();
    Store.dispatch(setRemoteList(remoteList));
  };

  // Handle media stream being removed from this current connection
  pc.onremovestream = (event) => {
    console.log('onremovestream', event.stream);
  };

  // Add media stream as a local source of audio
  pc.addStream(Store.getState().webRTC.localStream);

  return pc;
}

function exchange(socket, data) {
  const fromId = data.from;
  const pcPeers = Store.getState().webRTC.pcPeers;
  let pc;
  if (fromId in pcPeers) {
    pc = pcPeers[fromId];
  } else {
    pc = createPC(socket, fromId, false);
  }

  if (data.sdp) {
    console.log('exchange sdp', data);
    // Set data about remote peer connection and media
    pc.setRemoteDescription(new RTCSessionDescription(data.sdp), () => {
      if (pc.remoteDescription.type === 'offer') {
        // Answer remote peers offer
        pc.createAnswer((desc) => {
          console.log('createAnswer', desc);
          // Set data about local peer connection and media
          pc.setLocalDescription(desc, () => {
            console.log('setLocalDescription', pc.localDescription);
            socket.emit('exchange', { to: fromId, sdp: pc.localDescription });
          }, logError);
        }, logError);
      }
    }, logError);
  } else {
    console.log('exchange candidate', data);
    // Add new candid to ICE agent
    pc.addIceCandidate(new RTCIceCandidate(data.candidate));
  }
}

function leave(socketId) {
  const pcPeers = Store.getState().webRTC.pcPeers;
  if (socketId) {
    console.log('leave', socketId);
    const pc = pcPeers[socketId];
    pc.close();
    delete pcPeers[socketId];

    const remoteList = Store.getState().webRTC.remoteList;
    delete remoteList[socketId];
    Store.dispatch(setRemoteList(remoteList));
    Store.dispatch(setBattleConnectionInfo('One peer leave!'));
  }
}

export {
  getSocket,
  joinRoom,
  createPC,
  exchange,
  leave,
};
