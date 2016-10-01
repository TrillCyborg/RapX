import React, { PropTypes } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

const FeedIcon = ({ selected }) => (
  <Icon
    name="ios-home"
    size={30}
    color={selected ? styles.activeColor : styles.inactiveColor}
  />
);

const LiveIcon = ({ selected }) => (
  <Icon
    name="ios-radio"
    size={30}
    color={selected ? styles.activeColor : styles.inactiveColor}
  />
);

const BattleIcon = ({ selected }) => (
  <Icon
    name="ios-microphone"
    size={30}
    color={selected ? styles.activeColor : styles.inactiveColor}
  />
);

const ActivityIcon = ({ selected }) => (
  <Icon
    name="ios-notifications"
    size={30}
    color={selected ? styles.activeColor : styles.inactiveColor}
  />
);

const ProfileIcon = ({ selected }) => (
  <Icon
    name="ios-person"
    size={30}
    color={selected ? styles.activeColor : styles.inactiveColor}
  />
);

const styles = {
  activeColor: '#673AB7',
  inactiveColor: '#000',
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
