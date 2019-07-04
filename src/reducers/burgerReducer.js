const intialState = {
  open: true
};
export default function burgerReducer(state = intialState, action) {

  switch (action.type) {
    case "BURGER":
      return {
        open: !state.open
      };
    default:
      return {
        ...state
      };
  }
}