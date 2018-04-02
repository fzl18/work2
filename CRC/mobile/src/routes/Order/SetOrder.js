import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import { Button, Tag, Modal } from 'antd-mobile';
import styles from './Order.less';


const pageTitle = '接单设置';
const alert = Modal.alert;
const { role } = sessionStorage;
class SetOrder extends React.Component {
  state={
    select: false,
    params: [],
    choose: '2',
    orderRegions: [],
  }
  componentDidMount() {
    this.props.dispatch({ type: 'Setting/OrderList', payload: { } });
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
  componentWillReceiveProps() {
    this.setState({
      orderRegions: this.props.OrderList.orderRegions,
    });
  }

  onClickAddress=(bool, index) => {
    const { orderRegions = [] } = this.state;
    if (orderRegions[index].orderRegion) {
      orderRegions[index].orderRegion.status = bool ? 'ACTIVE' : '';
    } else {
      orderRegions[index].orderRegion = {};
      orderRegions[index].orderRegion.status = bool ? 'ACTIVE' : '';
    }
    this.setState({
      orderRegions,
    });
    // orderRegions[index].orderRegion.status = bool ? 'ACTIVE' : '';
  }
  ChooseALLSelect=(bool) => {
    const { choose } = this.state;
    const { orderRegions = [] } = this.state;
    if (choose == '1') {
      orderRegions.map((value, index) => {
        if (orderRegions[index].orderRegion) {
          orderRegions[index].orderRegion.status = bool ? 'ACTIVE' : '';
        } else {
          orderRegions[index].orderRegion = {};
          orderRegions[index].orderRegion.status = bool ? 'ACTIVE' : '';
        }
      });
      this.setState({
        choose: '2',
        orderRegions,
      });
    }
    if (choose == '2') {
      this.setState({
        choose: '1',
        orderRegions,
      });
    }
  }
  Save=() => {
    const { orderRegions } = this.state;
    const paramsArray = [];
    const { choose } = this.state;
    orderRegions.map((value) => {
      if ((value.orderRegion && value.orderRegion.status == 'ACTIVE') || (choose == '1')) {
        paramsArray.push(value.regionId);
      }
    });
    const ids = paramsArray;
    this.props.dispatch({ type: 'Setting/saveOrderAddress', payload: { ids } });
  }
  render() {
    let AreaName = '';
    const { regionName } = this.props.OrderList.ydataAccount || {};
    const { choose } = this.state;
    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>
        <div className={styles.SetOrder}>
          <div className={styles.SetOrderHead}>
            <p style={{ paddingTop: 15, color: '#333e4d' }}><i
              className="icon iconfont icon-zuoyequyu"
              style={{ color: 'rgb(254,130,96)', fontSize: 23, marginLeft: 40, marginRight: 10 }}
            />
             服务区域 :<span style={{ marginLeft: 5 }}>{regionName}</span></p>
          </div>
          <div className={styles.AreaChoose}>
            {
                   this.props.orderRegions.map((value, index) => {
                     AreaName = value.regionName;

                     return (
                       <Tag onChange={(e) => { this.onClickAddress(e, index); }} selected={(value.orderRegion && value.orderRegion.status == 'ACTIVE') || (choose == '1')}>{AreaName} </Tag>
                     );
                   })

              }
            <Tag onChange={this.ChooseALLSelect} >全部 </Tag>
          </div>
        </div>
        <div className={styles.SaveBotton} >
          <Button
            className={styles.Button}
            onClick={this.Save}
          >
            <p style={{ color: 'white', fontSize: 16, position: 'relative', marginTop: 0 }}>保存</p></Button>
        </div>
      </div>

    );
  }

    }

function mapStateToProps(state) {
  const { OrderList = {} } = state.Setting || {};
  const { orderRegions = [] } = OrderList;
  const { orderRegion = {} } = orderRegions;
  return {
    OrderList,
    orderRegions,
    orderRegion,
  };
}

export default connect(mapStateToProps)(withRouter(SetOrder));
