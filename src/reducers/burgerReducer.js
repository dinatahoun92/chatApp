export default function burgerReducer(state = window.innerWidth <= 500 ? {
  open: false
} : {
  open: true
}, action) {

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