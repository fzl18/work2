import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import styles from './Order.less';
import OrderLayout from '../../components/OrderLayout/OrderLayout';
import DetailOrder from '../MyOrder/DetailOrder';

const pageTitle = '我要接单';

class AddOrder extends React.Component {
  state={
  }

  render() {
    // const { OrderFormFields, dispatch } = this.props;
    return (
      <OrderLayout location={location}>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>

        <div className={styles.AddOrder}>
          <div style={{ width: '100%', marginLeft: '0px', marginRight: '0px' }}>
            <DetailOrder
              type="SERVICE"
              nextPage={true} pullRefresh={true} scrollY={true}
              icoTyle="icon-dingdan2" nodatamsg="您暂时没有任务"
            />
          </div>
        </div>

      </OrderLayout>
    );
  }

    }

function mapStateToProps(state) {
  const { jobType = [], projectType = [],
    staffType = [], CommonPlace = [], RuleServicePrice, OrderFormFields }
  = state.Order || {};
  return {
    jobType,
    projectType,
    staffType,
    CommonPlace,
    RuleServicePrice,
    OrderFormFields,
  };
}

export default connect(mapStateToProps)(withRouter(AddOrder));
