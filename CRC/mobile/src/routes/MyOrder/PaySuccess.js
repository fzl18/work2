import React from 'react';
import Helmet from 'react-helmet';
import { Button } from 'antd-mobile';
import { withRouter } from 'react-router';
import { connect } from 'dva';
// import DataOrderFooter from './DataOrderFooter';
import styles from './DataOrderDetail.less';

const pageTitle = '支付成功';

class PaySuccess extends React.Component {

  state={

  }

  componentDidMount() {
    // const projectId = this.props.match.params.id;
    // this.props.dispatch({
    //   type: 'MyOrder/queryProjectVouchers',
    //   payload: {
    //     projectId,
    //   },
    //   callback: (response = {}) => {
    //     const { memberVouchersList = [] } = response;
    //     let selectedId = '';
    //     memberVouchersList.map((value) => {
    //       if (value.status == 'RESERVE') {
    //         selectedId = value.memberVouchersId;
    //       }
    //     });
    //     this.setState({
    //       voucherList: memberVouchersList,
    //       selectedId,
    //     });
    //   },
    // });
  }

  componentWillReceiveProps() {
    // this.setState({
    //   evaluationTypes: nextProps.evaluationTypes,
    // });
  }
  // selectTabIndex=() => {
   // return sessionStorage.role == 'INSIDE_ASSISTANT' ? 5 : 6;
  // }
  // sessionStorage.ChatTabIndex = this.selectTabIndex();

  render() {
    const { projectContent = {} } = this.props;
    const pay = projectContent.payInfo;
    console.log(pay.actualPay);
    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
          <style type="text/css">{`
                body,#root{
                    background-color: #f6f6f6;
                }
          `}</style>
        </Helmet>
        <div className={styles.paySuccess}>
          <i className={`icon iconfont icon-yue1-copy ${styles.icon_resize}`} />
          <p className={styles.paySuccessStr}>支付成功</p>
          <p className={styles.pay}>￥{pay.actualPay}</p>
          <Button
            type="ghost" inline
            style={{ marginRight: '4px', width: '55%', marginTop: '35%', height: '40px', lineHeight: '40px' }}
            className="am-button-borderfix"
            onClick={() => { this.props.history.push(`/MyOrder/DataOrder/${projectContent.projectId}`); }}
          >完成</Button>
        </div>
        <div />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { projectContent = {} } = state.MyOrder || {};
  return {
    projectContent,
  };
}

export default connect(mapStateToProps)(withRouter(PaySuccess));
