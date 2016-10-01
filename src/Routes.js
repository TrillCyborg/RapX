import React, { PropTypes } from 'react';
import { Router, Scene } from 'react-native-router-flux';
import { FeedIcon, LiveIcon, BattleIcon, ActivityIcon, ProfileIcon } from './components/TabIcons';
import Modal from './components/Modal';

import Login from './components/Login';
import Feed from './components/Feed';
import Live from './components/Live';
import Battle from './components/Battle';
import Activity from './components/Activity';
import Profile from './components/Profile';

const Routes = ({ loggedIn }) => (
  <Router>
    <Scene key="root">
      <Scene key="login" component={Login} title="Login" initial={!loggedIn} hideNavBar />
      <Scene key="main" tabs initial={loggedIn} tabBarStyle={{ borderColor: '#000', borderTopWidth: 1 }}>
        <Scene key="tab1" title="Feed" icon={FeedIcon} initial>
          <Scene key="feed" component={Feed} title="RapX" />
        </Scene>
        <Scene key="tab2" title="Live" icon={LiveIcon}>
          <Scene key="live" component={Live} title="Live" />
        </Scene>
        <Scene key="tab3" title="Battle" icon={BattleIcon}>
          <Scene key="battle" component={Battle} title="Battle" />
        </Scene>
        <Scene key="tab4" title="Activity" icon={ActivityIcon}>
          <Scene key="activity" component={Activity} title="Activity" />
        </Scene>
        <Scene key="tab5" title="Profile" icon={ProfileIcon}>
          <Scene key="profile" component={Profile} title="Profile" />
        </Scene>
      </Scene>
      <Scene key="modal" title="Modal" component={Modal} direction="vertical" hideNavBar />
    </Scene>
  </Router>
);


Routes.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
};

export default Routes;
