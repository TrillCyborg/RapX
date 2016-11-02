import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Text, View, TextInput, ListView } from 'react-native';
import { RTCView, getUserMedia } from 'react-native-webrtc';
import { getSocket, joinRoom, exchange, leave } from '../lib/webRTC';
import {
  setLocalStream,
  setStatus,
  setBattleConnectionInfo,
  setRoomId,
  addTextRoomData,
  setTextRoomValue,
} from '../actions';
import ScreenContainer from './ScreenContainer';
import { Button } from './Input';

let socket;

function mapHash(hash, func) {
  const array = [];
  for (const key in hash) {
    const obj = hash[key];
    array.push(func(obj, key));
  }
}

class Battle extends Component {
  constructor() {
    super();
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => true });
    this.state = {
      selfViewSrc: null,
    };
    this.getLocalStream = this.getLocalStream.bind(this);
    this.onPressEnterRoom = this.onPressEnterRoom.bind(this);
    this.textRoomPress = this.textRoomPress.bind(this);
    this.renderTextRoom = this.renderTextRoom.bind(this);
  }

  componentWillMount() {
    socket = getSocket();
    this.props.setBattleConnectionInfo('Initializing');
  }

  componentDidMount() {
    socket.on('exchange', data => exchange(socket, data));
    socket.on('leave', leave);
    socket.on('connect', (/* data */) => {
      console.log('connect');
      this.getLocalStream();
    });
  }

  onPressEnterRoom(/* event */) {
    this.refs.roomID.blur();
    this.props.setStatus(1);
    this.props.setBattleConnectionInfo('Connecting');
    joinRoom(socket, this.props.webRTC.roomId);
  }

  getLocalStream() {
    getUserMedia({
      audio: true,
      video: false,
    }, (stream) => {
      this.props.setLocalStream(stream);
      this.setState({ selfViewSrc: stream.toURL() });
      this.props.setStatus(2);
      this.props.setBattleConnectionInfo('Please enter or create room ID');
    }, error => console.log('getUserMedia Error:', error));
  }

  textRoomPress() {
    if (!this.props.webRTC.textRoomValue) {
      return;
    }
    this.props.addTextRoomData({ user: 'Me', message: this.props.webRTC.textRoomValue });
    for (const key in this.props.webRTC.pcPeers) {
      const pc = this.props.webRTC.pcPeers[key];
      pc.textDataChannel.send(this.props.webRTC.textRoomValue);
    }
    this.props.setTextRoomValue('');
  }

  renderTextRoom() {
    return (
      <View style={styles.listViewContainer}>
        <ListView
          dataSource={this.ds.cloneWithRows(this.props.webRTC.textRoomData)}
          renderRow={rowData => <Text>{`${rowData.user}: ${rowData.message}`}</Text>}
        />
        <TextInput
          style={{ width: 200, height: 30, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={this.props.setTextRoomValue}
          value={this.props.webRTC.textRoomValue}
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
            {this.props.battleConnectionInfo}
          </Text>
          {this.props.webRTC.textRoomConnected && this.renderTextRoom()}
          { this.props.webRTC.status === 2 ?
            (<View>
              <TextInput
                ref="roomID"
                autoCorrect={false}
                style={{ width: 200, height: 40, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={this.props.setRoomId}
                value={this.props.webRTC.roomId}
              />
              <Button onPress={this.onPressEnterRoom}>
                Enter room
              </Button>
            </View>) : null
          }
          <RTCView streamURL={this.state.selfViewSrc} style={styles.selfView} />
          {
            mapHash(this.props.webRTC.remoteList, (remote, index) => (
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

Battle.propTypes = {
  setLocalStream: PropTypes.func.isRequired,
  setStatus: PropTypes.func.isRequired,
  setBattleConnectionInfo: PropTypes.func.isRequired,
  setRoomId: PropTypes.func.isRequired,
  addTextRoomData: PropTypes.func.isRequired,
  setTextRoomValue: PropTypes.func.isRequired,
  webRTC: PropTypes.shape({
    pcPeers: PropTypes.object.isRequired,
    status: PropTypes.number.isRequired,
    roomId: PropTypes.string.isRequried,
    remoteList: PropTypes.object.isRequired,
    textRoomConnected: PropTypes.bool.isRequired,
    textRoomData: PropTypes.array.isRequired,
    textRoomValue: PropTypes.string.isRequired,
  }),
  battleConnectionInfo: PropTypes.string.isRequired,
};

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

const mapStateToProps = state => ({
  webRTC: state.webRTC,
  battleConnectionInfo: state.app.battleConnectionInfo,
});

export default connect(mapStateToProps, {
  setLocalStream,
  setStatus,
  setBattleConnectionInfo,
  setRoomId,
  addTextRoomData,
  setTextRoomValue,
})(Battle);
