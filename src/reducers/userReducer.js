const intialState = {
  user: 'Dina tahoun',
  photoUrl: '',
  userId: ''
};
export default function userReducer(state = intialState, action) {
  const newState = {
    ...state
  };
  switch (action.type) {
    case "USER_NAME":
      return {
        user: newState.user
      };
    default:
      return {
        ...state
      };
  }
}