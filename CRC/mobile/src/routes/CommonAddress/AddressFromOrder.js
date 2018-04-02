import React from 'react';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import SetNewAddress from './SetNewAddress';


class AddressFromOrder extends React.Component {
  render() {
    return (
      <div>
        <SetNewAddress fromOrder={true} />
      </div>
    );
  }

     }

function mapStateToProps(state) {
  const { listProvince = [], placeList = [] } = state.Setting || {};
  return {
    listProvince,
    placeList,
  };
}

export default connect(mapStateToProps)(withRouter(AddressFromOrder));
