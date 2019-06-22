const intialState = {
  open: false
};
export default function rootReducer(state = intialState, action) {
  const newState = { ...state };
  switch (action.type) {
    case "BURGER":
      return {
        open: !newState.open
      };
    default:
      return {
        newState
      };
  }
}
