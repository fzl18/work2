import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import { List, WingBlank, Button, WhiteSpace, Toast } from 'antd-mobile';
import styles from './Order.less';
import OrderLayout from '../../components/OrderLayout/OrderLayout';
import DetailOrder from '../../routes/MyOrder/DetailOrder';

const pageTitle = '我要接单';
const Item = List.Item;
class RobNewOrder extends React.Component {
  state={
  }

  refreshNewRob = () => {
    this.props.dispatch({
      type: 'Order/queryNewProject',
      payload: {
      },
      callback: (response = {}) => {
        if (!response.error) {
          Toast.info('刷新成功', 1, () => {}, false);
        }
        // this.refreshAndShowOrderDetail(response);
      },
    });
  }

  render() {
    // const { OrderFormFields, dispatch } = this.props;
    const { newProjectList } = this.props;
    return (
      <OrderLayout location={location}>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>
        {
          newProjectList.error ==
          '您有服务违规情况，暂时无法接单' ?
            <List className={styles.ill_bar}>
              <Item
                arrow="horizontal" onClick={() => {
                  this.props.history.push('/Order/IllegalDetail');
                }}
              >您有服务违规情况，暂时无法接单</Item>
            </List>
        :
        null
        }

        <DetailOrder
          type="newProjectList" style={{ marginBottom: '65px' }}
          nextPage={true} pullRefresh={true} scrollY={true}
          icoTyle="icon-dingdan2" nodatamsg="您暂时没有任务"
        />
        <div className={styles.refreshRob}>
          <WingBlank size="lg">
            <WingBlank size="sm">
              <WhiteSpace />
              <Button
                style={{
                  backgroundColor: '#fff',
                  color: '#6ad29d',
                  fontSize: '16px',
                }}
                onClick={() => {
                  this.refreshNewRob();
                }}
              >
                <i className="iconfont icon-refresh" style={{ marginRight: '10px', fontSize: '22px' }} />
                刷新列表
            </Button>
              <WhiteSpace />
            </WingBlank>
          </WingBlank>
        </div>
      </OrderLayout>
    );
  }

    }

function mapStateToProps(state) {
  const { newProjectList = {} }
  = state.Order || {};
  return {
    newProjectList,
  };
}

export default connect(mapStateToProps)(withRouter(RobNewOrder));
