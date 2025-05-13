import {CHANGE_TOPIC} from "./actiontypes";

export const changeTopic = data => ({
  type: CHANGE_TOPIC,
  payload: data,
});
