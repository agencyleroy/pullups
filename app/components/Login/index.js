import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Route, Link, Redirect } from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment';
import Config from '../../../config/config.json';

const config = Config[process.env.NODE_ENV || 'development'];

import styles from './styles.scss';

class Login extends React.Component {

  login() {
    // window.location.href = `${config.api.host}/auth/google?redirect=${config.app.host}`
    window.location.href = `${config.api.host}/auth/google`
  }

  restoreSessionFromStorage() {
    const token = window.localStorage.getItem('token');
    if (_.isEmpty(token)) {
      throw new Error('Not implemented');
    }
  }

  render() {
    const { auth } = this.props;
    return (
      <div className="login">
        {auth.isLoggedIn &&
          <Redirect to="/" />
        }
        <h4 className="login__title">Login to get results</h4>
        <button onClick={this.login}>Login</button>
        <Route exact path="/login/callback" render={() => {
          return <h1>Callback</h1>;
        }} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Login);
