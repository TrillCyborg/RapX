import { app } from './Types';

const setBattleConnectionInfo = info => ({ type: app.setBattleConnectionInfo, value: info });
const setDisableChangeMicButton = bool => ({ type: app.setDisableChangeMicButton, value: bool });

export {
  setBattleConnectionInfo,
  setDisableChangeMicButton,
};
