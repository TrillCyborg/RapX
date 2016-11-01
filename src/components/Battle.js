import React, { Component } from 'react';
import {
  Text,
  TouchableHighlight,
  View,
  TextInput,
  ListView,
} from 'react-native';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStreamTrack,
  getUserMedia,
} from 'react-native-webrtc';
import io from 'socket.io-client/socket.io';
// import ScreenContainer from './ScreenContainer';
// import { Button } from './Input';

const socket = io.connect('https://react-native-webrtc.herokuapp.com', { transports: ['websocket'] });
const configuration = { iceServers: [{ url: 'stun:stun.l.google.com:19302' }] };
const pcPeers = {};
let localStream;

function logError(error) {
  console.log('logError', error);
}

function join(roomID) {
  socket.emit('join', roomID, (socketIds) => {
    console.log('join', socketIds);
    socketIds.forEach((id) => {
      createPC(id, true);
    });
  });
}

function getLocalStream(isFront, callback) {
  MediaStreamTrack.getSources((sourceInfos) => {
    console.log(sourceInfos);
    let videoSourceId;
    for (let i = 0; i < sourceInfos.length; i += 1) {
      const sourceInfo = sourceInfos[i];
      if (sourceInfo.kind === 'video' && sourceInfo.facing === (isFront ? 'front' : 'back')) {
        videoSourceId = sourceInfo.id;
      }
    }
    getUserMedia({
      audio: true,
      video: {
        optional: [{ sourceId: videoSourceId }],
      },
    }, (stream) => {
      console.log('dddd', stream);
      callback(stream);
    }, logError);
  });
}

function createPC(socketId, isOffer) {
  function createOffer() {
    pc.createOffer((desc) => {
      console.log('createOffer', desc);
      pc.setLocalDescription(desc, () => {
        console.log('setLocalDescription', pc.localDescription);
        socket.emit('exchange', { to: socketId, sdp: pc.localDescription });
      }, logError);
    }, logError);
  }

  const pc = new RTCPeerConnection(configuration);
  pcPeers[socketId] = pc;

  pc.onicecandidate = (event) => {
    console.log('onicecandidate', event.candidate);
    if (event.candidate) {
      socket.emit('exchange', { to: socketId, candidate: event.candidate });
    }
  };

  pc.onnegotiationneeded = () => {
    console.log('onnegotiationneeded');
    if (isOffer) {
      createOffer();
    }
  };

  pc.oniceconnectionstatechange = (event) => {
    console.log('oniceconnectionstatechange', event.target.iceConnectionState);
    if (event.target.iceConnectionState === 'completed') {
      setTimeout(() => {
        getStats();
      }, 1000);
    } else if (event.target.iceConnectionState === 'completed') {
      createDataChannel();
    }
  };

  pc.onsignalingstatechange = (event) => {
    console.log('onsignalingstatechange', event.target.signalingState);
  };

  pc.onaddstream = (event) => {
    console.log('onaddstream', event.stream);
    container.setState({ info: 'One peer join!' });

    const remoteList = container.state.remoteList;
    remoteList[socketId] = event.stream.toURL();
    container.setState({ remoteList });
  };

  pc.onremovestream = (event) => {
    console.log('onremovestream', event.stream);
  };

  pc.addStream(localStream);

  function createDataChannel() {
    if (pc.textDataChannel) {
      return;
    }
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
    pc.setRemoteDescription(new RTCSessionDescription(data.sdp), () => {
      if (pc.remoteDescription.type === 'offer') {
        pc.createAnswer((desc) => {
          console.log('createAnswer', desc);
          pc.setLocalDescription(desc, () => {
            console.log('setLocalDescription', pc.localDescription);
            socket.emit('exchange', { to: fromId, sdp: pc.localDescription });
          }, logError);
        }, logError);
      }
    }, logError);
  } else {
    console.log('exchange candidate', data);
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

socket.on('exchange', exchange);

socket.on('connect', leave);

socket.on('connect', (/* data */) => {
  console.log('connect');
  getLocalStream(true, (stream) => {
    localStream = stream;
    container.setState({ selfViewSrc: stream.toURL() });
    container.setState({ status: 'ready', info: 'Please enter or create room ID' });
  });
});

function mapHash(hash, func) {
  const array = [];
  for (const key in hash) {
    const obj = hash[key];
    array.push(func(obj, key));
  }
}

function getStats() {
  const pc = pcPeers[Object.keys(pcPeers)[0]];
  if (pc.getRemoteStreams()[0] && pc.getRemoteStreams()[0].getAudioTracks()[0]) {
    const track = pc.getRemoteStreams()[0].getAudioTracks()[0];
    console.log('track', track);
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
      isFront: true,
      selfViewSrc: null,
      remoteList: {},
      textRoomConnected: false,
      textRoomData: [],
      textRoomValue: '',
    };
    this._press = this._press.bind(this);
    this._switchVideoType = this._switchVideoType.bind(this);
    this.receiveTextData = this.receiveTextData.bind(this);
    this._textRoomPress = this._textRoomPress.bind(this);
    this._renderTextRoom = this._renderTextRoom.bind(this);
  }

  componentDidMount() {
    container = this;
  }

  _press(/* event */) {
    this.refs.roomID.blur();
    this.setState({ status: 'connect', info: 'Connecting' });
    join(this.state.roomID);
  }

  _switchVideoType() {
    const isFront = !this.state.isFront;
    this.setState({ isFront });
    getLocalStream(isFront, (stream) => {
      if (localStream) {
        for (const id in pcPeers) {
          const pc = pcPeers[id];
          pc && pc.removeStream(localStream);
        }
        localStream.release();
      }
      localStream = stream;
      container.setState({ selfViewSrc: stream.toURL() });

      for (const id in pcPeers) {
        const pc = pcPeers[id];
        pc && pc.addStream(localStream);
      }
    });
  }

  receiveTextData(data) {
    const textRoomData = this.state.textRoomData.slice();
    textRoomData.push(data);
    this.setState({ textRoomData, textRoomValue: '' });
  }

  _textRoomPress() {
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

  _renderTextRoom() {
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
        <TouchableHighlight
          onPress={this._textRoomPress}>
          <Text>Send</Text>
        </TouchableHighlight>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          {this.state.info}
        </Text>
        {this.state.textRoomConnected && this._renderTextRoom()}
        <View style={{ flexDirection: 'row' }}>
          <Text>
            {this.state.isFront ? 'Use front camera' : 'Use back camera'}
          </Text>
          <TouchableHighlight
            style={{ borderWidth: 1, borderColor: 'black' }}
            onPress={this._switchVideoType}>
            <Text>Switch camera</Text>
          </TouchableHighlight>
        </View>
        { this.state.status === 'ready' ?
          (<View>
            <TextInput
              ref="roomID"
              autoCorrect={false}
              style={{ width: 200, height: 40, borderColor: 'gray', borderWidth: 1 }}
              onChangeText={text => this.setState({ roomID: text })}
              value={this.state.roomID}
            />
            <TouchableHighlight
              onPress={this._press}>
              <Text>Enter room</Text>
            </TouchableHighlight>
          </View>) : null
        }
        <RTCView streamURL={this.state.selfViewSrc} style={styles.selfView} />
        {
          mapHash(this.state.remoteList,
            (remote, index) => <RTCView key={index} streamURL={remote} style={styles.remoteView} />)
        }
      </View>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
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

// render() {
//   return (
//     <ScreenContainer center>
//       <Text>Battle</Text>
//       <Button onPress={this.getLocalStream}>Start Stream</Button>
//       <RTCView streamURL={this.state.streamURL} />
//     </ScreenContainer>
//   );
// }

export default Battle;
