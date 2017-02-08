import React from 'react';
import CSSModules from 'react-css-modules';
import Helmet from 'react-helmet';
import { connect } from 'react-redux'
import { Match, Miss, Link, Redirect } from 'react-router';
import _ from 'lodash';
import moment from 'moment';

import styles from './styles.scss';

class Leaderboard extends React.Component {
  render() {

    const items = _.map(this.props.scores, (entry, ix) => {
      return <tr key={ix}><td>{`${ix+1}.`}</td><td>{`${entry.firstName} ${entry.lastName}`}</td><td>{moment(entry.timestamp).format("D.M.YYYY")}</td><td>{entry.score}</td></tr>
    });

    return (
      <div>
        <h1>Leaderboard</h1>
        <table>
          <thead>
            <tr>
              <th>Position</th>
              <th>Name</th>
              <th>Date</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {items}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  scores: state.scores
});

export default connect(mapStateToProps)(Leaderboard);
