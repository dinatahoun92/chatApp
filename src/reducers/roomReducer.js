export default function roomReducer(state = {}, action) {
  const newState = {
    ...state
  };
  switch (action.type) {
    case "ROOM":
      return Object.assign({}, newState, action.value)
    default:
      return {
        ...newState
      };
  }
}