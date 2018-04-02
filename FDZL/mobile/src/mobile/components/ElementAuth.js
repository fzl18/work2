import React from 'react';
import PropTypes from 'prop-types';
import { AUTH } from '../constants';

const { role = 'VISITOR' } = sessionStorage;
const curAuth = AUTH[role];
function ElementAuth({ children, auth }) {
  return (
    curAuth[auth] && curAuth[auth].access ?
      <div>
        {React.Children.map(children, (child) => {
          const eleAuth = child.props.auth;
          if (eleAuth) {
            if (curAuth[auth].dataAuth[eleAuth]) {
              return child;
            } else {
              return null;
            }
          } else {
            return child;
          }
        })}
      </div>
    :
    null
  );
}

ElementAuth.propTypes = {
  auth: PropTypes.string,
};


export default ElementAuth;
