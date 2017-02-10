import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { addEntry } from '../../actions';
import styles from './styles.scss';

class AddEntry extends React.Component {

  onSubmit(event) {
    event.preventDefault();
    const value = parseInt(Math.max(0, this.input.value), 10);
    this.props.dispatch(addEntry(this.props.user, value));
    this.input.value = '';
  }

  render() {
    return (
      <div className="add-entry">
        <h2 className="add-entry__title">Submit your result</h2>
        <form onSubmit={this.onSubmit.bind(this)} className="add-entry__form">
          <input type="number" name="score" className="add-entry__input" defaultValue={''} ref={(input) => { this.input = input; }} placeholder="Write your result here" />
          <button type="submit" className="add-entry__button">Add result</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, null)(AddEntry);
