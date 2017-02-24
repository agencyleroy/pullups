import React from 'react';
import CSSModules from 'react-css-modules';
import Helmet from 'react-helmet';
import { connect } from 'react-redux'
import _ from 'lodash';
import moment from 'moment';

import styles from './styles.scss';

class Leaderboard extends React.Component {
  render() {

    const items = _.map(this.props.scores, (entry, ix) => {
      return <tr key={ix}><td className="leaders__table__person"><div className="leaders__number" data-position={`${ix+1}`}>{`${ix+1}`}</div><div className="leaders__person"><div className="leaders__person__image"><div className="leaders__person__image__bg" style={{backgroundImage: 'url(/assets/images/martin.jpg)'}}></div></div><div className="leaders__person__name">{`${entry.firstName} ${entry.lastName}`}</div></div></td><td  className="leaders__table__score"><div className="leaders__score">{entry.score}</div></td><td className="leaders__table__date"><div className="leaders__date">{moment(entry.createdAt).format("D.M.YYYY")}</div></td></tr>
    });

    return (
      <div className="leaders">
        <h1 className="leaders__title">Pullups</h1>
        <table className="leaders__table">
          <thead>
            <tr>
              <th className="leaders__table__person">Leader</th>
              <th className="leaders__table__score">Score</th>
              <th className="leaders__table__date">Date</th>
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

export default Leaderboard;
