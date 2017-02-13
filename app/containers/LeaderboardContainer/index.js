import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Leaderboard from '../../components/Leaderboard';
import { addEntry } from '../../actions';

/**
 * Filter out only the relevant entries. The top ten
 * peoples best results of type.
 * @param  {[type]} entries [description]
 * @param  {[type]} type    [description]
 * @return {[type]}         [description]
 */
const getTopTenEntries = (entries, type) => {
  if (_.isEmpty(entries)) {
    return [];
  }

  const entriesByUser = _.chain(entries)
    .filter({ type })
    .groupBy('email')
    .value()

  const rankedEntries = _.chain(entriesByUser)
    .orderBy('score', 'desc')
    .map(entries =>
      _.take(entries, 1)
    )
    .flatten()
    .orderBy('score', 'desc')
    .take(10)
    .value()

  return rankedEntries;
}

const mapStateToProps = (state) => {
  console.log(state);
  return {
    scores: getTopTenEntries(state.app.scores, 'pullup')
  };
};

const mapDispatchToProps = (dispatch) => {
  return {}
};

export default connect(
  mapStateToProps,
  null,
)(Leaderboard);
