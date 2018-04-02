import React from 'react';
import PropTypes from 'prop-types';
import { AUTH } from '../constants';


const { role = 'VISITOR' } = sessionStorage;
const curAuth = AUTH[role];
function PageAuth({ children, auth }) {
  return (
    curAuth[auth].access ?
      <div>
        {children}
      </div>
    :
    null
  );
}

PageAuth.propTypes = {
  auth: PropTypes.string,
};


export default PageAuth;
