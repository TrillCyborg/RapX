import React, { PropTypes } from 'react';
import { View, Text, Image, ListView } from 'react-native';
import ScreenContainer from './ScreenContainer';
import followsData from '../followsData.json';

const Follows = ({ users = followsData.users }) => (
  <ScreenContainer center>
    <ListView
      dataSource={ds.cloneWithRows(users)}
      renderRow={rowData =>
        <View style={styles.userBarStyle}>
          <Image style={styles.userPicStyle} source={{ uri: rowData.picUrl }} />
          <Text style={styles.textStyle}>{rowData.name}</Text>
        </View>
      }
      style={styles.listStyle}
    />
  </ScreenContainer>
);

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

Follows.propTypes = {
  users: PropTypes.array,
};

const styles = {
  userBarStyle: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  listStyle: {
    alignSelf: 'stretch',
  },
  textStyle: {
    justifyContent: 'center',
    padding: 5,
  },
  userPicStyle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
};

export default Follows;
