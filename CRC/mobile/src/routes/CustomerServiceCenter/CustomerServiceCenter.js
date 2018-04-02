import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { WingBlank, Button, Modal } from 'antd-mobile';
import { withRouter } from 'react-router';
import styles from './CustomerServiceCenter.less';
import ProblemInfo from './ProblemInfo';


const pageTitle = '客服中心';
// const Item = List.Item;
const alert = Modal.alert;
const { role } = sessionStorage;
class CustomerServiceCenter extends React.Component {

  componentDidMount() {
    this.props.dispatch({ type: 'CustomerServiceCenter/CallCustomerService', payload: { } });
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
    const { customCenterOnline } = this.props.CallNumber;
    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>
        {/* 问题分类 */}
        <div className={styles.CustomerServiceCenterHead}>
          <ProblemInfo nextPage={true} pullRefresh={true} scrollY={true} />
        </div>
        <div className={styles.CustomerServiceCenter}>
          <p style={{ marginLeft: 15, paddingTop: 20, fontSize: 16, marginBottom: 35 }}>还未解决？</p>
          <WingBlank>
            <Button
              className={styles.CustomerButton1}
              onClick={() => alert('', `${customCenterOnline}`,
                [{ text: '取消', onPress: () => console.log('cancel'), style: 'default' },
                  { text: '呼叫',
                    onPress: () => {
                      window.location.href = `tel:${customCenterOnline}`;
                    } },
                ])}
            > <span style={{ marginRight: 15 }}>
              <i className="icon iconfont icon-dianhua" style={{ fontSize: 20 }} /></span>联系客服</Button>
          </WingBlank>
          <WingBlank>
            <Button
              className={styles.CustomerButton2}
              onClick={() => { this.props.history.push('/Feedback'); }}
            > <span style={{ marginRight: 15 }}>
              <i className="icon iconfont icon-boshiweb_liuyan" style={{ fontSize: 23 }} /></span>在线留言</Button>
          </WingBlank>

        </div>

      </div>
    );
  }
    }

// 问题
function mapStateToProps(state) {
  const { list = [], total, page, CallNumber = {} } = state.CustomerServiceCenter || {};
  return {
    loading: state.loading.models.CustomerServiceCenter,
    list,
    total,
    page,
    CallNumber,
  };
}

export default connect(mapStateToProps)(withRouter(CustomerServiceCenter));
