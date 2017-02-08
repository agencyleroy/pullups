import axios from 'axios';
import _ from 'lodash';
import Config from '../../../config/config.json';

const config = Config[process.env.NODE_ENV || 'development'];

let connection = null;
let callbacks = {
  unauthorized: []
};

const Api = (options) => {
  connection = axios.create(Object.assign({}, options, {
    validateStatus: (status) => {
      if (_.indexOf([401, 403], status) > -1) {
        _.each(callbacks.unauthorized, (cb) => {
          if (_.isFunction(cb)) {
            cb();
          }
        });
      }
      return status >= 200 && status < 300;
    }
  }));

  return {
    on: (eventType, cb) => {
      if (_.has(callbacks, eventType)) {
        callbacks[eventType].push(cb);
      }
    },
    entries: {
      findAll: () => {
        return connection.get('/entries');
      },
      create: (entry) => {
        return connection.post('/entries', entry);
      }
    },
    users: {
      me: () => {
        return connection.get('/users/me');
      }
    },
    setAuthToken: (token = null) => {
      if (token) {
        connection.defaults.headers.common.Authorization = `JWT ${token}`;
      } else {
        delete connection.defaults.headers.common.Authorization;
      }
    }
  };
};

export let api = new Api({
  baseURL: `${config.api.host}/api/`,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});
