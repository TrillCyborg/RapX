import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  ListView,
} from 'react-native';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  getUserMedia,
} from 'react-native-webrtc';
import io from 'socket.io-client/socket.io';
import ScreenContainer from './ScreenContainer';
import { Button } from './Input';

let socket;
const configuration = { iceServers: [{ url: 'stun:stun.l.google.com:19302' }] };
const pcPeers = {};
let localStream;

function logError(error) {
  console.log('logError', error);
}

// Join a room with roomID
function join(roomID) {
  socket.emit('join', roomID, (socketIds) => {
    console.log('join', socketIds);
    socketIds.forEach((id) => {
      createPC(id, true);
    });
  });
}

// Create a peer connection for each socketId in the room
function createPC(socketId, isOffer) {
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

  const pc = new RTCPeerConnection(configuration);
  pcPeers[socketId] = pc;

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

  // Hanle remote peer adding media stream to this current connection
  pc.onaddstream = (event) => {
    console.log('onaddstream', event.stream);
    container.setState({ info: 'One peer join!' });

    const remoteList = container.state.remoteList;
    remoteList[socketId] = event.stream.toURL();
    container.setState({ remoteList });
  };

  // Hanlde media stream being removed from this current connection
  pc.onremovestream = (event) => {
    console.log('onremovestream', event.stream);
  };

  // Add media stream as a local source of audio
  pc.addStream(localStream);

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
      container.receiveTextData({ user: socketId, message: event.data });
    };

    dataChannel.onopen = () => {
      console.log('dataChannel.onopen');
      container.setState({ textRoomConnected: true });
    };

    dataChannel.onclose = () => {
      console.log('dataChannel.onclose');
    };

    pc.textDataChannel = dataChannel;
  }

  return pc;
}

function exchange(data) {
  const fromId = data.from;
  let pc;
  if (fromId in pcPeers) {
    pc = pcPeers[fromId];
  } else {
    pc = createPC(fromId, false);
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
  if (socketId) {
    console.log('leave', socketId);
    const pc = pcPeers[socketId];
    // const viewIndex = pc.viewIndex;
    pc.close();
    delete pcPeers[socketId];

    const remoteList = container.state.remoteList;
    delete remoteList[socketId];
    container.setState({ remoteList });
    container.setState({ info: 'One peer leave!' });
  }
}

function mapHash(hash, func) {
  const array = [];
  for (const key in hash) {
    const obj = hash[key];
    array.push(func(obj, key));
  }
}

function getStats() {
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

let container;

class Battle extends Component {
  constructor() {
    super();
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => true });
    this.state = {
      info: 'Initializing',
      status: 'init',
      roomID: '',
      selfViewSrc: null,
      remoteList: {},
      textRoomConnected: false,
      textRoomData: [],
      textRoomValue: '',
    };
    this.getLocalStream = this.getLocalStream.bind(this);
    this.onPressEnterRoom = this.onPressEnterRoom.bind(this);
    this.receiveTextData = this.receiveTextData.bind(this);
    this.textRoomPress = this.textRoomPress.bind(this);
    this.renderTextRoom = this.renderTextRoom.bind(this);
  }

  componentWillMount() {
    socket = io.connect('https://webrtc-signal-test-server.herokuapp.com/', { transports: ['websocket'] });
  }

  componentDidMount() {
    container = this;
    socket.on('exchange', exchange);
    socket.on('leave', leave);
    socket.on('connect', (/* data */) => {
      console.log('connect');
      this.getLocalStream();
    });
  }

  onPressEnterRoom(/* event */) {
    this.refs.roomID.blur();
    this.setState({ status: 'connect', info: 'Connecting' });
    join(this.state.roomID);
  }

  getLocalStream() {
    getUserMedia({
      audio: true,
      video: false,
    }, (stream) => {
      localStream = stream;
      this.setState({ selfViewSrc: stream.toURL() });
      this.setState({ status: 'ready', info: 'Please enter or create room ID' });
    }, logError);
  }

  receiveTextData(data) {
    const textRoomData = this.state.textRoomData.slice();
    textRoomData.push(data);
    this.setState({ textRoomData, textRoomValue: '' });
  }

  textRoomPress() {
    if (!this.state.textRoomValue) {
      return;
    }
    const textRoomData = this.state.textRoomData.slice();
    textRoomData.push({ user: 'Me', message: this.state.textRoomValue });
    for (const key in pcPeers) {
      const pc = pcPeers[key];
      pc.textDataChannel.send(this.state.textRoomValue);
    }
    this.setState({ textRoomData, textRoomValue: '' });
  }

  renderTextRoom() {
    return (
      <View style={styles.listViewContainer}>
        <ListView
          dataSource={this.ds.cloneWithRows(this.state.textRoomData)}
          renderRow={rowData => <Text>{`${rowData.user}: ${rowData.message}`}</Text>}
          />
        <TextInput
          style={{ width: 200, height: 30, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={value => this.setState({ textRoomValue: value })}
          value={this.state.textRoomValue}
        />
        <Button onPress={this.textRoomPress}>
          Send
        </Button>
      </View>
    );
  }

  render() {
    return (
      <ScreenContainer>
        <View>
          <Text style={styles.welcome}>
            {this.state.info}
          </Text>
          {this.state.textRoomConnected && this.renderTextRoom()}
          { this.state.status === 'ready' ?
            (<View>
              <TextInput
                ref="roomID"
                autoCorrect={false}
                style={{ width: 200, height: 40, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={text => this.setState({ roomID: text })}
                value={this.state.roomID}
              />
              <Button onPress={this.onPressEnterRoom}>
                Enter room
              </Button>
            </View>) : null
          }
          <RTCView streamURL={this.state.selfViewSrc} style={styles.selfView} />
          {
            mapHash(this.state.remoteList, (remote, index) => (
              <RTCView
                key={index}
                streamURL={remote}
                style={styles.remoteView}
              />))
          }
        </View>
      </ScreenContainer>
    );
  }
}

const styles = {
  selfView: {
    width: 200,
    height: 150,
  },
  remoteView: {
    width: 200,
    height: 150,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  listViewContainer: {
    height: 150,
  },
};

export default Battle;
