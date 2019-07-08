import {
  stat
} from "fs";

const intialState = {
  roomName: "room name 1",
  roomId: "-LjGY2z7bYPepIXdjxOP",
  roomDesc: "room 1 desc"
};

export default function roomReducer(state = intialState, action) {
  switch (action.type) {
    case "ROOM":
      return {
        roomId: action.value.roomId,
          roomName: action.value.roomName,
          roomDesc: action.value.roomDesc
      };
    default:
      return {
        ...state
      };
  }
}