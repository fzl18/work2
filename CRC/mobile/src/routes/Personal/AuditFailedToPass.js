import React from 'react';
// import { Tabs } from 'antd-mobile';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { Button } from 'antd-mobile';
import { withRouter } from 'react-router';
import styles from './PersonalInfo.less';

const pageTitle = '审核未通过';
// const { role } = sessionStorage;
class AuditFailedToPass extends React.Component {
  // state = {
  //   info: {},
  // }
  // componentDidMount() {
  //   if ((!sessionStorage.acctId)) {
  //     return;
  //   }
  //   this.props.dispatch({ type: 'PersonalInfo/AuditFailReason',
  //     payload: {},
  //   });
  //   this.setState({
  //     info: this.props.FailReason.success,
  //   });
  // }
  // componentWillReceiveProps() {
  //   this.setState({
  //     info: this.props.FailReason.success,
  //   });
  // }

  Resubmit=() => {
    location.href = 'AuditInfomation';
  }

  render() {
    // const { auditReason } = this.state.info || {};
    const { auditReason } = this.props.FailReason.success || {};
    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>
        <div>
          <p className={styles.Audit}>
            <i className="icon iconfont icon-shenheweitongguo" style={{ fontSize: 40 }} /></p>
          <p className={styles.AuditWords}>很抱歉,您的资料因为以下原因没有审核通过，请修改后重新提交。</p>
        </div>
        <div className={styles.AuditWords2} >
          <p>{auditReason}</p>
        </div>
        <div className={styles.Resubmitbotton} >
          <Button
            className={styles.Button}
            onClick={this.Resubmit}
          >
            <p style={{ color: 'white', fontSize: 16, position: 'relative', marginTop: 0 }}>重新提交</p></Button>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  const { FailReason = {} } = state.PersonalInfo || {};
  return {
    FailReason,
  };
}

export default connect(mapStateToProps)(withRouter(AuditFailedToPass));
