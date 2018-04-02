import React from 'react';
import { Drawer, List } from 'antd-mobile';
import { withRouter } from 'react-router';
import { connect } from 'dva';
import styles from './OrderLayout.less';
import OrderHead from './OrderHead';

const Item = List.Item;
const Brief = Item.Brief;

class MainLayout extends React.Component {
  state={
    open: false,
  }
  onOpenChange = () => {
    this.setState({ open: !this.state.open });
  }

  render() {
    const { showPersonalInfoDetail = [] } = this.props;
    const memberLevelTypetoz = [];
    for (let i = 0; i < showPersonalInfoDetail.memberLevelType; i++) {
      memberLevelTypetoz.push(i);
    }
    const sidebar = (<List className={styles.orderLayout}>
      <Item
        className={styles.userInfoItem}
        arrow="horizontal"
        thumb={!showPersonalInfoDetail.headimgurl ? '/images/head-default.jpg' : showPersonalInfoDetail.headimgurl}
        onClick={() => { this.props.history.push('/PersonalInfo'); }}
      >
        <span className={styles.namestyle}>{showPersonalInfoDetail.ydataAccountCompellation}</span>
        <Brief>
          {memberLevelTypetoz.map(() => <i className="iconfont icon-zuanshi" style={{ color: '#fff' }} />)}
        </Brief>
      </Item>
      <Item
        className={styles.itemlist}
        onClick={() => {
          this.props.history.push('/MyOrder/AllOrder');
        }}
      >
        <i className="iconfont icon-dingdan" /><span className={styles.itemmenu}>我的订单</span></Item>
      <Item
        className={styles.itemlist}
        onClick={() => {
          const url = sessionStorage.role == 'DOCTOR' || sessionStorage.role == 'NOTDOCTOR' ? '/MyAssets' : '/MyIncome';
          this.props.history.push(url);
        }}
      ><i className="iconfont icon-icon" /><span className={styles.itemmenu}>{sessionStorage.role == 'DOCTOR' ? '我的资产' : '我的收入'}</span></Item>
      <Item
        className={styles.itemlist}
        onClick={() => {
          this.props.history.push('/CustomerServiceCenter');
        }}
      ><i className="iconfont icon-kefu" /><span className={styles.itemmenu}>客服中心</span></Item>
      <Item
        className={styles.itemlist}
        onClick={() => {
          this.props.history.push('/Setting');
        }}
      ><i className="iconfont icon-shezhi" /><span className={styles.itemmenu}>设置</span></Item>
    </List>);
    return (
      <div className={styles.normal}>
        <OrderHead location={this.props.location} onOpenChange={this.onOpenChange} />
        <div className={styles.header_holder} />
        <div className={styles.drawer_class}>
          <Drawer
            className="my-drawer"
            style={{ minHeight: document.documentElement.clientHeight }}
          // enableDragHandle
            contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
            sidebar={sidebar}
            open={this.state.open}
            onOpenChange={this.onOpenChange}
          >
            <div className={styles.content}>
              <div className={styles.main}>

                {this.props.children}

              </div>
            </div>
          </Drawer>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { showPersonalInfoDetail } = state.PersonalInfo || {};
  return {
    showPersonalInfoDetail,
  };
}

export default connect(mapStateToProps)(withRouter(MainLayout));

// export default withRouter(MainLayout);

