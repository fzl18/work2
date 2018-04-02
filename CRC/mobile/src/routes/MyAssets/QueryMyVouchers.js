import React from 'react';
import Helmet from 'react-helmet';
import { List } from 'antd-mobile';
import { connect } from 'dva';
import moment from 'moment';
import { withRouter } from 'react-router';
import styles from './MyAssets.less';

const pageTitle = '我的代金券';
const Item = List.Item;
const Brief = Item.Brief;
class QueryMyVouchers extends React.Component {

  componentDidMount() {
    // 获取我的代金券信息信息
    this.props.dispatch({ type: 'MyAssets/queryMyVouchers', payload: { } });
  }
  // 是否过期
  isOverdue=(value) => {
    if (value == 'OVERDUE') {
      return true;
    } else { return false; }
  }

  render() {
    const { myVouchers = [] } = this.props;
    // console.log(queryMyVouchers);
    return (
      <div
        className={styles.myVouchers}
      >
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>
        <div>
          {
            myVouchers.length == 0 ?
              <div className={styles.nodata}>
                <p><i className={`${styles.nodataico} icon iconfont icon-zanwuyouhuiquan`} /></p>
                <p>您当前暂无代金券</p>
              </div>
            :
            myVouchers.map(value => <List
              className={this.isOverdue(value.status) ?
             styles.vouchers_list_overdue :
             styles.vouchers_list}
            >
              <Item
                className={styles.overdue}
                wrap
                extra={<p><span className={styles.fortime}>{value.quantity}小时</span><br />免费服务</p>}
                align="middle"
                thumb={<i className={`${styles.reset_title_icon_size} icon iconfont icon-wodedaijinquan`} />}
                multipleLine
              >
              通用券
              <Brief>有效期至{moment(value.expirationTime).format('YYYY-MM-DD')}</Brief>
              </Item>
              <Item>*满2小时使用，每个订单只能使用一张券，不找零</Item>
              <i className={`${styles.reset_overdue_icon_size} icon iconfont icon-guoqi`} style={{ position: 'absolute', zIndex: '999', top: 8, left: '60%', color: '#b5b5b5' }} />
            </List>)
          }
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  const { myVouchers = [] } = state.MyAssets || {};
  return {
    // loading: state.loading,
    myVouchers,
  };
}

export default connect(mapStateToProps)(withRouter(QueryMyVouchers));
