import { app } from './Types';

const toggleLoggedIn = () => ({ type: app.toggleLoggedIn });
const setRegistered = bool => ({ type: app.setRegistered, value: bool });
const setBattleConnectionInfo = info => ({ type: app.setBattleConnectionInfo, value: info });
const setDisableChangeMicButton = bool => ({ type: app.setDisableChangeMicButton, value: bool });

export {
  toggleLoggedIn,
  setRegistered,
  setBattleConnectionInfo,
  setDisableChangeMicButton,
};
