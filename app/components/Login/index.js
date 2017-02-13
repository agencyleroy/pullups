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
        <h4 className="login__title">Are you a winner or a loser?</h4>
        <p>Are you hungry enough? Will you set standards that others will be measured by?</p>
        <p>The majority will hate you for your success. Your success will make them feel small and insufficient. It will remind them of how they could’ve done what you did but they failed and never tried again. Many of us never realise our greatness. You are the star of your show and you will determine if your life is a box-office hit or flop. Do the job right or don’t do it at all.</p>
        <p><button onClick={this.login}>Login</button></p>
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
