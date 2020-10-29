import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Root from './components/root';
import configureStore from "./store/store";
import jwt_decode from "jwt-decode";
import axios from 'axios';
import { setAuthToken } from "./util/session_api_util";
import { logout } from "./actions/session_actions";
import * as APIUtil from './util/session_api_util';

document.addEventListener('DOMContentLoaded', () => {
  window.axios = axios;
  window.APIUtil = APIUtil;
  let store;

  if (localStorage.jwtToken) {
    setAuthToken(localStorage.jwtToken);

    const decodedUser = jwt_decode(localStorage.jwtToken);
    const preloadedState = {
      session: { isAuthenticated: true, user: decodedUser },
    };

    store = configureStore(preloadedState);

    const currentTime = Date.now() / 1000;

    if (decodedUser.exp < currentTime) {
      store.dispatch(logout());
      window.location.href = "/login";
    }
  } else {
    store = configureStore({});
  }

  const root = document.getElementById('root')
  ReactDOM.render(<Root store = {store}/>, root)
});


