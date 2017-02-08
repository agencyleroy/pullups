// import axios from 'axios';
import { api } from '../lib/api';


/*
 * action types
 */

export const ADD_ENTRY = 'ADD_ENTRY';
export const ADD_ENTRY_SUCCESS = 'ADD_ENTRY_SUCCESS';
export const ADD_ENTRY_FAIL = 'ADD_ENTRY_FAIL';
export const FETCH_ENTRIES = 'FETCH_ENTRIES';
export const FETCH_ENTRIES_SUCCESS = 'FETCH_ENTRIES_SUCCESS';
export const FETCH_ENTRIES_FAIL = 'FETCH_ENTRIES_FAIL';
export const AUTH_SIGNIN = 'AUTH_SIGNIN';
export const AUTH_SIGNIN_SUCCESS = 'AUTH_SIGNIN_SUCCESS';
export const AUTH_SIGNIN_FAIL = 'AUTH_SIGNIN_FAIL';
export const AUTH_SIGNOUT = 'AUTH_SIGNOUT';

/*
 * other constants
 */

/*
 * action creators
 */
export function signOut() {
  api.setAuthToken(null);
  window.sessionStorage.removeItem('token');
  return { type: AUTH_SIGNOUT };
}

export function signIn(token = null) {
  api.setAuthToken(token);
  return (dispatch) => {
    dispatch({ type: AUTH_SIGNIN });
    api.users.me()
      .then(response => response.data.data)
      .then((user) => {
        window.sessionStorage.setItem('token', token);
        dispatch({ type: AUTH_SIGNIN_SUCCESS, user });
      })
      .catch(error =>
        dispatch({ type: AUTH_SIGNIN_FAIL, error })
      );
  };
}

export function addEntry(user, score) {
  return (dispatch) => {
    dispatch({ type: ADD_ENTRY });
    api.entries.create({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      score: score,
      type: 'pullup',
    })
    .then(response => response.data.data)
    .then(entry =>
      dispatch({ type: ADD_ENTRY_SUCCESS, entry })
    )
    .catch(error =>
      dispatch({ type: ADD_ENTRY_FAIL, error })
    );
  }
  return { type: ADD_ENTRY, data: { user, score, timestamp: Date.now(), type: 'pullup' } };
}

export function fetchEntries() {
  return (dispatch) => {
    dispatch({ type: FETCH_ENTRIES });

    api.entries.findAll()
      .then(response => response.data)
      .then(data =>
        dispatch({ type: FETCH_ENTRIES_SUCCESS, data })
      )
      .catch(error =>
        dispatch({ type: FETCH_ENTRIES_FAIL, error })
      );
  };
}
