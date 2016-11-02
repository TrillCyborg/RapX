import React, { PropTypes } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { tabBarIcons } from '../styles/icons.json';

const {
  feedIcon,
  liveIcon,
  battleIcon,
  activityIcon,
  profileIcon,
} = tabBarIcons;

const getIconName = (name, selected) => `${name}${selected ? '' : '-outline'}`;

const FeedIcon = ({ selected }) => (
  <Icon
    name={getIconName(feedIcon, selected)}
    size={styles.iconSize}
    color={selected ? styles.activeColor : styles.inactiveColor}
  />
);

const LiveIcon = ({ selected }) => (
  <Icon
    name={getIconName(liveIcon, selected)}
    size={30}
    color={selected ? styles.activeColor : styles.inactiveColor}
  />
);

const BattleIcon = ({ selected }) => (
  <Icon
    name={getIconName(battleIcon, selected)}
    size={30}
    color={selected ? styles.activeColor : styles.inactiveColor}
  />
);

const ActivityIcon = ({ selected }) => (
  <Icon
    name={getIconName(activityIcon, selected)}
    size={30}
    color={selected ? styles.activeColor : styles.inactiveColor}
  />
);

const ProfileIcon = ({ selected }) => (
  <Icon
    name={getIconName(profileIcon, selected)}
    size={30}
    color={selected ? styles.activeColor : styles.inactiveColor}
  />
);

const styles = {
  activeColor: '#673AB7',
  inactiveColor: '#555',
  iconSize: 30,
};

// ios-disc - live
// ios-home - Feed
// ios-notifications - activity
// ios-musical-notes - feed / live
// ios-radio - live

FeedIcon.propTypes = {
  selected: PropTypes.bool,
};

LiveIcon.propTypes = {
  selected: PropTypes.bool,
};

BattleIcon.propTypes = {
  selected: PropTypes.bool,
};

ActivityIcon.propTypes = {
  selected: PropTypes.bool,
};

ProfileIcon.propTypes = {
  selected: PropTypes.bool,
};

export { FeedIcon, LiveIcon, BattleIcon, ActivityIcon, ProfileIcon };
