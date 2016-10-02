import React, { PropTypes } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

const iconNames = {
  feed: 'ios-home',
  live: 'ios-radio',
  battle: 'ios-microphone',
  activity: 'ios-notifications',
  profile: 'ios-person',
};

const getIconName = (name, selected) => `${name}${selected ? '' : '-outline'}`;

const FeedIcon = ({ selected }) => (
  <Icon
    name={getIconName(iconNames.feed, selected)}
    size={styles.iconSize}
    color={selected ? styles.activeColor : styles.inactiveColor}
  />
);

const LiveIcon = ({ selected }) => (
  <Icon
    name={getIconName(iconNames.live, selected)}
    size={30}
    color={selected ? styles.activeColor : styles.inactiveColor}
  />
);

const BattleIcon = ({ selected }) => (
  <Icon
    name={getIconName(iconNames.battle, selected)}
    size={30}
    color={selected ? styles.activeColor : styles.inactiveColor}
  />
);

const ActivityIcon = ({ selected }) => (
  <Icon
    name={getIconName(iconNames.activity, selected)}
    size={30}
    color={selected ? styles.activeColor : styles.inactiveColor}
  />
);

const ProfileIcon = ({ selected }) => (
  <Icon
    name={getIconName(iconNames.profile, selected)}
    size={30}
    color={selected ? styles.activeColor : styles.inactiveColor}
  />
);

const styles = {
  activeColor: '#673AB7',
  inactiveColor: '#000',
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
