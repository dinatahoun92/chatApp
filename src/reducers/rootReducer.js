import { combineReducers } from "redux";
import burgerReducer from "./burgerReducer";
import userReducer from "./userReducer";
import roomReducer from "./roomReducer";

export default combineReducers({
  burgerReducer,
  userReducer,
  roomReducer
});
