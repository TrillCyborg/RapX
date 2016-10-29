import React, { Component } from 'react';
import { Text } from 'react-native';
import { getUserMedia, RTCView } from 'react-native-webrtc';
import ScreenContainer from './ScreenContainer';
import { Button } from './Input';

class Battle extends Component {
  constructor() {
    super();
    this.state = {
      streamURL: '',
    };
    this.getLocalStream = this.getLocalStream.bind(this);
  }

  getLocalStream() {
    getUserMedia({
      audio: true,
      video: false,
    }, (stream) => {
      console.log('THE STREAM', stream);
      this.setState({ streamURL: stream.toURL() });
    }, (error) => {
      console.log('STREAM ERROR', error);
    });
  }

  render() {
    return (
      <ScreenContainer center>
        <Text>Battle</Text>
        <Button onPress={this.getLocalStream}>Start Stream</Button>
        <RTCView streamURL={this.state.streamURL} />
      </ScreenContainer>
    );
  }
}

export default Battle;
