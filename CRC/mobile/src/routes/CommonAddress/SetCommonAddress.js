import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import { Modal } from 'antd-mobile';
// import styles from './SetCommonAddress.less';
import Address from './Address';

const alert = Modal.alert;
const pageTitle = '常用地址设置';
const { role } = sessionStorage;
class SetCommonAddress extends React.Component {
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
  NewAddress=() => {
    this.props.history.push('/SetNewAddress');
  }
  render() {
    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>
        <Address nextPage={true} pullRefresh={true} scrollY={true} />
      </div>
    );
  }
}


function mapStateToProps(state) {
  const { list = [], total, page } = state.SettingModel || {};
  return {
    loading: state.loading.models.SettingModel,
    list,
    total,
    page,
  };
}

export default connect(mapStateToProps)(withRouter(SetCommonAddress));
