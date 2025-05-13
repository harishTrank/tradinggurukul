import { combineReducers } from "redux";
import { CHANGE_TOPIC } from "./actiontypes";

const INTIAL_STATE = {
  activeTopic: null,
};

export const topicReducer = (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case CHANGE_TOPIC:
      return {
        ...state,
        activeTopic: action.payload,
      };

    default:
      return state;
  }
};

export default combineReducers({
  topic: topicReducer,
});
