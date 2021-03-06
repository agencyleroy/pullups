import React from 'react';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux'

import styles from './styles.scss';

class Notification extends React.Component {
  render() {
    const { text } = this.props;
    return (
      <div className="notification animate">
        <div className="notification__icon" dangerouslySetInnerHTML={{ __html: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 80.8 94.3" style="enable-background:new 0 0 80.8 94.3;" xml:space="preserve"><path d="M72.1,49.2c-6.5,0.4-9.6,6.3-9.6,6.3s3,1.2,4.4,3.5c1.6,2.6,1,6.7,1,6.7s-1.8-5.3-4.9-7.4c-3.5-2.4-7.8-2.9-10.4-3C45.7,54.8,40.3,56.1,37,58c-6.4,3.7-10.9,11.9-10.9,11.9s-0.4-2.7,0.4-3.9c2.1-3.1,5.2-6.7,5.2-6.7S31,51,29.7,49c-1.3-2-7.5-10-7.5-12.5c0-2.5,1.4-16.1,0.2-16.8c-6.8-3.7-2.3-4.5-2.3-4.5s3.4,4.9,4.3,5.1c0.9,0.2,3.9-1,4.9-1.1c1-0.1,5.6,1.4,6.3,0.6c0.7-0.8,1.9-1.6,2.1-1.6c0.3,0,0.5-1.9-0.1-2.3c-0.7-0.4,2.9-4.2,3-5.3c0.3-2-7.7-7.3-9.7-8.9c-2-1.6-3.1-0.3-5.3,0.4c-2.4,0.7-9.8,3.4-9.8,3.4c-2.8,1.6-3.5,1.9-6,9.8C9,18,4.8,48.2,4.1,50.9c-0.8,2.8-3.5,14.1-3,18.8s3.5,8.8,4.3,11c0.8,2.3,0.5,6.8,1,8c0.5,1.3,6,1.8,9.8,1c3.8-0.8,19.1,4,27.3,3.5c6.5-0.4,25.3-4.9,33.2-6.3c2.2-0.4,3.5,0.7,3.5,0.7l0-36.6C80.1,51.2,75.1,49,72.1,49.2z M15,57.2c-0.3,3.5,1.5,11.5,1.5,11.5s-2.8-4.5-3-10.8c-0.3-6.3,2-11.5,2-11.5s0,2.3,0.8,3.3C17,50.7,15.2,53.7,15,57.2z M48,76.9c-7.9,0.3-13-6.1-13-6.1s8.7,3.6,13.7,2.9c5-0.8,11.3-2.6,11.3-2.6S55.9,76.6,48,76.9z"/></svg>'}} />
        <div className="notification__text">{text}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  text: state.notification,
});

export default connect(mapStateToProps)(Notification);