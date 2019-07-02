const intialState = {
  roomName: 'room 1',
  roomId: '',
  roomDesc: ''
};
export default function roomReducer(state = intialState, action) {
  const newState = {
    ...state
  };
  switch (action.type) {
    case "ROOM":
      return {
        room: newState.roomName
      };
    default:
      return {
        ...state
      };
  }
}