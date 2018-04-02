import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import WithdrawalsDetailInfo from './WithdrawalsDetailInfo';


const pageTitle = '提现明细';

class WithdrawalsDetail extends React.Component {

  componentDidMount() {
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>
        <div >
          <WithdrawalsDetailInfo nextPage={true} pullRefresh={true} scrollY={true} />
        </div>
      </div>
    );
  }
    }


function mapStateToProps(state) {
  const { WithdrawalsDetaillist = [], total, page, CallNumber = {} } = state.PersonalInfo || {};
  return {
    loading: state.loading.models.PersonalInfo,
    WithdrawalsDetaillist,
    total,
    page,
    CallNumber,
  };
}

export default connect(mapStateToProps)(withRouter(WithdrawalsDetail));
