import React from 'react';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router';
import { Modal } from 'antd-mobile';
import { connect } from 'dva';
import styles from './AllOrder.less';
import MyOrderLayout from '../../components/MyOrderLayout/MyOrderLayout';

const pageTitle = '我的订单';
const alert = Modal.alert;
const { role } = sessionStorage;
class AllOrder extends React.Component {
  componentDidMount() {
    if ((!sessionStorage.acctId) || (role == 'INSIDE_ASSISTANT')) {
      return;
    }
    this.props.dispatch({ type: 'Register/NowAuditStatus',
      payload: {},
      callback: (response) => {
        if (response.success && response.success.auditStatus == 'no_audit') {
          this.props.history.push('/Register/RegisterNext');
          return;
        }
        if ((response.success && response.success.auditStatus == 'audit_pending') || (response.success && response.success.auditStatus == 'audit_failed')) {
          alert((<span>很抱歉</span>), <div style={{ textAlign: 'left' }} ><span style={{ color: '#333e4d', textAlign: 'left' }}>您的信息还未通过审核，此栏目还无法浏览</span></div>,
            [{ text: (<span style={{ color: '#f5a282' }}>好的</span>),
              onPress: () => {
                this.props.history.push('/PersonalInfo');
              } },
            ]);
        }
      },
    });
  }
  render() {
    return (
      <MyOrderLayout location={location} >
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
          <style type="text/css">{`
                body,#root{
                    background-color: #f6f6f6;
                }
          `}</style>
        </Helmet>
        <div className={styles.AllOrder} />
      </MyOrderLayout>
    );
  }
}

function mapStateToProps(state) {
  const { allOrder = [] } = state.MyOrder || {};
  return {
    allOrder,
  };
}

export default connect(mapStateToProps)(withRouter(AllOrder));
