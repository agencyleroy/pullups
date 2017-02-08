import {
  ADD_ENTRY, ADD_ENTRY_SUCCESS, ADD_ENTRY_FAIL,
  FETCH_ENTRIES, FETCH_ENTRIES_SUCCESS, FETCH_ENTRIES_FAIL,
  AUTH_SIGNIN, AUTH_SIGNIN_SUCCESS, AUTH_SIGNIN_FAIL, AUTH_SIGNOUT,
} from '../actions';

const initialState = {
  auth: {
    isLoggedIn: false,
    isLoading: false,
    user: {}
  },
  scores: [],
  redirect: false,
};

function appReducer(state = initialState, action) {
  // For now, don't handle any actions
  // and just return the state given to us.
  switch (action.type) {
    // case ADD_ENTRY: break;
    case ADD_ENTRY_SUCCESS:
      console.log(action.entry);
      return Object.assign({}, state, {
        scores: [
          ...state.scores,
          {
            isLoading: false,
            ...action.entry
          }
        ]
      });
    // case FETCH_ENTRIES: break;
    // case FETCH_ENTRIES_FAIL: break;
    case FETCH_ENTRIES_SUCCESS:
      return Object.assign({}, state, {
        isLoading: false,
        scores: action.data.data,
      });
    case AUTH_SIGNIN:
      return Object.assign({}, state, {
        auth: {
          isLoggedIn: false,
          isLoading: true,
          user: {},
        }
      });
    case AUTH_SIGNIN_SUCCESS:
      return Object.assign({}, state, {
        auth: {
          isLoggedIn: true,
          isLoading: false,
          user: action.user,
        }
      });
    case AUTH_SIGNIN_FAIL:
    case AUTH_SIGNOUT:
      return Object.assign({}, state, {
        auth: {
          isLoggedIn: false,
          isLoading: false,
          user: {},
        }
      });
    default:
      return state;
  }
}

export default appReducer;
