import React, { Component } from 'react';
import { List, ListItem } from 'react-native-elements';
import { ListView, ScrollView } from 'react-native';
import ScreenContainer from './ScreenContainer';
import followsData from '../followsData.json';

class Follows extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows(followsData.users),
    };
  }

  renderRow(rowData, sectionID) {
    return (
      <ListItem
        roundAvatar
        key={sectionID}
        title={rowData.name}
        subtitle={`@${rowData.username}`}
        avatar={{ uri: rowData.picUrl }}
      />
    );
  }

  render() {
    return (
      <ScreenContainer>
        <ScrollView>
          <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0, marginTop: 0, marginBottom: 20, alignSelf: 'stretch' }}>
            {
              <ListView
                renderRow={this.renderRow}
                dataSource={this.state.dataSource}
              />
            }
          </List>
        </ScrollView>
      </ScreenContainer>
    );
  }
}

export default Follows;
