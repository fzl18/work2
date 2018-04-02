import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import RechargeDetailInfo from './RechargeDetailInfo';


const pageTitle = '充值明细';

class RechargeDetail extends React.Component {

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
          <RechargeDetailInfo nextPage={true} pullRefresh={true} scrollY={true} />
        </div>
      </div>
    );
  }
    }


function mapStateToProps(state) {
  const { RechargeDetaillist = [], total, page } = state.PersonalInfo || {};
  return {
    loading: state.loading.models.PersonalInfo,
    RechargeDetaillist,
    total,
    page,
  };
}

export default connect(mapStateToProps)(withRouter(RechargeDetail));
