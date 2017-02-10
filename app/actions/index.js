// import axios from 'axios';
import { api } from '../lib/api';
import cheers from '../assets/cheers.js';


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
export const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION';
export const HIDE_NOTIFICATION = 'HIDE_NOTIFICATION';

let cheerTimeoutId = null;
/**
 * other constants
 */

/*
 * action creators
 */
function hideCheer() {
 window.clearTimeout(cheerTimeoutId);
 return { type: HIDE_NOTIFICATION };
}

export function cheer() {
  return (dispatch) => {
    dispatch(hideCheer());
    dispatch({ type: SHOW_NOTIFICATION, text: cheers[ parseInt(Math.random() * cheers.length)] });
    cheerTimeoutId = window.setTimeout(() => {
      dispatch(hideCheer());
    }, 2000);
  };
}

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
    .then(entry => {
      dispatch({ type: ADD_ENTRY_SUCCESS, entry });
      dispatch(cheer());
    })
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
