import React from 'react';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router';
import { Toast } from 'antd-mobile';
import { connect } from 'dva';
import moment from 'moment';
import styles from './DataOrderDetail.less';
// import DataOrderFooter from './DataOrderFooter';

const pageTitle = '选择代金券';

class AddComment extends React.Component {

  state={
    evaluationTypes: [],
    voucherList: [],
    selectedId: '',
  }

  componentDidMount() {
    const projectId = this.props.match.params.id;
    this.props.dispatch({
      type: 'MyOrder/queryProjectVouchers',
      payload: {
        projectId,
      },
      callback: (response = {}) => {
        const { memberVouchersList = [] } = response;
        let selectedId = '';
        memberVouchersList.map((value) => {
          if (value.status == 'RESERVE') {
            selectedId = value.memberVouchersId;
          }
        });
        this.setState({
          voucherList: memberVouchersList,
          selectedId,
        });
      },
    });
  }

  componentWillReceiveProps() {
    // this.setState({
    //   evaluationTypes: nextProps.evaluationTypes,
    // });
  }

  selectVoucher = (selectedId) => {
    const projectId = this.props.match.params.id;
    this.setState({
      selectedId,
    });
    Toast.loading('加载中...', 0);
    const selectedLoad = {};
    if (selectedId != '') {
      selectedLoad['ids[0]'] = selectedId;
    }
    this.props.dispatch({
      type: 'MyOrder/preUseByProjectIdAndVoucherIds',
      payload: {
        projectId,
        ...selectedLoad,
      },
      callback: (response = {}) => {
        if (response.error) {
          Toast.info(response.error, 1.8);
          return;
        }
        this.props.dispatch({
          type: 'MyOrder/queryProjectContent',
          payload: { projectId, clearReserve: false },
          callback: () => {
            Toast.hide();
            this.props.history.push(`/MyOrder/DataOrder/fromVoucher/${projectId}`);
          },
        });
      },
    });
  }

  render() {
    const { voucherList, selectedId } = this.state;
    return this.props.loading.effects['MyOrder/queryProjectVouchers'] ? null : (
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
        <div>

          <div>
            {voucherList.length != 0 && <div
              className="clearPrefix select_radio_line" onClick={() => {
                this.selectVoucher('');
              }}
            >
              <span className={styles.noInfo}>不使用代金券</span>
              <span className={styles.voucherRight}><i className="iconfont icon-gou" style={{ color: selectedId == '' ? '#2784e1' : '#8a8a8a', fontSize: '20px' }} /></span>
            </div>
            }
            {
              voucherList.map(value =>
                <div
                  className="clearPrefix select_radio_line" onClick={() => {
                    this.selectVoucher(value.memberVouchersId);
                  }}
                >
                  <span className={styles.voucherInfo}>
                    <p className={styles.voucherHour}>通用券({value.quantity}小时)</p>
                    <p className={styles.voucherDate}>有效期至{moment(value.expirationTime).format('YYYY-MM-DD')}</p></span>
                  <span className={styles.voucherRight}><i className="iconfont icon-gou" style={{ color: value.memberVouchersId == selectedId ? '#2784e1' : '#8a8a8a', fontSize: '20px' }} /></span>
                </div>,
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { allOrder = [], evaluationTypes = [] } = state.MyOrder || {};
  return {
    allOrder,
    evaluationTypes,
    loading: state.loading,
  };
}

export default connect(mapStateToProps)(withRouter(AddComment));
