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
      <form onSubmit={this.onSubmit.bind(this)} >
        <div>
          <input type="number" name="score" defaultValue={''} ref={(input) => { this.input = input; }} />
          <button type="submit">Submit</button>
        </div>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, null)(AddEntry);
