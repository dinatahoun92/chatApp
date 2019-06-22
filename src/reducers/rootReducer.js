const intialState = {
  open: false
};
export default function rootReducer(state = intialState, action) {
  switch (action.type) {
    case "BURGER":
      return {
        open: !state.open
      };
    default:
      return {
        state
      };
  }
}
