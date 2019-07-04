const intialState = {
  user: '',
  userId: ''
};
export default function userReducer(state = intialState, action) {
  const newState = {
    ...state
  };
  switch (action.type) {
    case "USER_NAME":
      return {
        user: action.value.user,
          userId: action.value.userId,
      };
    default:
      return {
        ...state
      };
  }
}