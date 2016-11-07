import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Text, View, TextInput, ListView } from 'react-native';
import { RTCView, getUserMedia } from 'react-native-webrtc';
import InCallManager from 'react-native-incall-manager';
import { getSocket, joinBattle, exchange, leave } from '../../lib/webRTC';
import {
  setLocalStream,
  setStatus,
  setBattleConnectionInfo,
  setRoomId,
  incrementMicChange,
} from '../../actions';
import ScreenContainer from '../ScreenContainer';
import { Button } from '../Input';

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
    this.getLocalStream = this.getLocalStream.bind(this);
    this.onPressEnterBattle = this.onPressEnterBattle.bind(this);
    this.renderBattleRoom = this.renderBattleRoom.bind(this);
    this.sendMicChange = this.sendMicChange.bind(this);
  }

  componentWillMount() {
    socket = getSocket();
    socket.on('connect', (/* data */) => {
      this.getLocalStream();
    });
    socket.on('exchange', data => exchange(socket, data));
    socket.on('leave', leave);
    this.props.setBattleConnectionInfo('Initializing');
  }

  onPressEnterBattle(/* event */) {
    this.refs.roomID.blur();
    this.props.setStatus(1);
    this.props.setBattleConnectionInfo('Connecting');
    joinBattle(socket, this.props.webRTC.roomId);
  }

  getLocalStream() {
    getUserMedia({
      audio: true,
      video: false,
    }, (stream) => {
      this.props.setLocalStream(stream);
      this.props.setStatus(2);
      this.props.setBattleConnectionInfo('Please enter or create room ID');
      InCallManager.start({ media: 'audio' });
      InCallManager.setForceSpeakerphoneOn(true);
      InCallManager.setSpeakerphoneOn(true);
      InCallManager.setKeepScreenOn(true); // TODO: get this working
    }, error => console.log('getUserMedia Error:', error));
  }

  sendMicChange() {
    for (const key in this.props.webRTC.pcPeers) {
      const pc = this.props.webRTC.pcPeers[key];
      pc.battleDataChannel.send('mic_change');
    }
    this.props.incrementMicChange();
  }

  renderBattleRoom() {
    return (
      <View>
        <Text>{this.props.webRTC.micChange}</Text>
        <Button onPress={this.sendMicChange}>
          Send Mic Change
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
          <Text>Battle Room Connected: {this.props.webRTC.battleRoomConnected.toString()}</Text>
          {this.props.webRTC.battleRoomConnected && this.renderBattleRoom()}
          { this.props.webRTC.status === 2 ?
            (<View>
              <TextInput
                ref="roomID"
                autoCorrect={false}
                style={{ width: 200, height: 40, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={this.props.setRoomId}
                value={this.props.webRTC.roomId}
              />
            <Button onPress={this.onPressEnterBattle}>
                Enter room
              </Button>
            </View>) : null
          }
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
  incrementMicChange: PropTypes.func.isRequired,
  webRTC: PropTypes.shape({
    pcPeers: PropTypes.object.isRequired,
    status: PropTypes.number.isRequired,
    roomId: PropTypes.string.isRequried,
    remoteList: PropTypes.object.isRequired,
    battleRoomConnected: PropTypes.bool.isRequired,
    micChange: PropTypes.number.isRequired,
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
  incrementMicChange,
})(Battle);
