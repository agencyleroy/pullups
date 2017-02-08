import React from 'react';
import CSSModules from 'react-css-modules';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Route, Link, Redirect } from 'react-router-dom';
import _ from 'lodash';

import Leaderboard from './Leaderboard';
import AddEntry from './AddEntry';
import Login from './Login';

import styles from './styles.scss';

class App extends React.Component {

  render() {

    const { auth, leaderboard, redirect, redirectTo } = this.props;
    const initials = auth.isLoggedIn ? `${auth.user.firstName[0]}${auth.user.lastName[0]}` : '?';

    return (
      <div className="app">
        <Helmet
          titleTemplate={"Pullups challenge - %s"}
          meta={[
            {name: "description", content: "Hee" }
          ]}
        />

        {(!auth.isLoggedIn && auth.isLoading) &&
          <Redirect to="/login" />
        }

        <header className="header">
          <nav>
            <figure>
              <span className="intials">{initials}</span>
            </figure>
          </nav>
        </header>

        <section className="content">
          <Route exact path="/" component={Leaderboard} />
          <Route exact path="/" component={AddEntry} />
          <Route path="/login" component={Login} />
        </section>

        <footer>
          <span>Made with &lsaquo;3 by <a target="_blank" href="https://www.agencyleroy.com">Agency Leroy</a></span>
          <span>Check me out on <a target="_blank" href="https://github.com/agencyleroy/pullups">Github</a></span>
        </footer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  leaderboard: state.leaderboard,
  redirect: state.redirect,
  rediretTo: state.redirectTo,
});

export default connect(mapStateToProps)(App);
