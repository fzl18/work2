import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import { List, ListView, PullToRefresh } from 'antd-mobile';
import Helmet from 'react-helmet';
// import ElementAuth from '../../components/ElementAuth';
import styles from './Recharge.less';

const Item = List.Item;
const Brief = Item.Brief;


const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

class RechargeDetailInfo extends React.Component {
  state={
    dataSource,
    height: document.documentElement.clientHeight,
    isLoadingMore: false,
  }

  componentDidMount() {
    if (ReactDOM.findDOMNode(this.lv) != null) {
      const getRect = ReactDOM.findDOMNode(this.lv).getBoundingClientRect();
      const hei = getRect.height - getRect.top;
      const rData = this.props.RechargeDetaillist ? this.props.RechargeDetaillist : [];
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(rData),
        height: hei,
        refreshing: false,
        isLoading: false,
      });
    }
  }

  componentWillReceiveProps() {
    if (ReactDOM.findDOMNode(this.lv) != null) {
      const hei = document.documentElement.clientHeight
    - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
      const rData = this.props.RechargeDetaillist ? this.props.RechargeDetaillist : [];
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(rData),
        height: hei,
        refreshing: false,
        isLoading: false,
      });
      if (!this.props.scrollY) {
        document.body.style.overflow = 'auto';
      } else {
        document.body.style.overflow = 'hidden';
      }
    }
  }

  componentDidUpdate() {
    if (!this.props.scrollY) {
     // document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }

  componentWillUnmount() {
    document.body.style.overflow = 'auto';
  }

  onRefresh = () => {
    setTimeout(() => {
      this.setState({ refreshing: true, isLoading: true });
      this.props.dispatch({ type: 'PersonalInfo/RechargeDetail', payload: {} });
    }, 1000);
  };

  onEndReached = () => {
    if (this.props.loading.effects['PersonalInfo/RechargeDetailnextPage'] || this.state.isLoadingMore) {
      return;
    }
    if (this.props.noMore) {
      return;
    }
    let { page } = this.props;
    if (!page) {
      page = 2;
    } else {
      page += 1;
    }
    this.setState({
      isLoadingMore: true,
    }, function () {
      setTimeout(() => {
        this.props.dispatch({ type: 'PersonalInfo/RechargeDetailnextPage', payload: { page } });
      }, 1000);
    });
    this.setState({
      isLoadingMore: false,
    });
  };

  // Problem=() => {
  //   this.props.history.push('/ProblemDetail/:id');
  // }

  render() {
    const { RechargeDetaillist = [] } = this.props || {};
    const row = (rowData, sectionID, rowID) => {
      const obj = RechargeDetaillist[rowID];
      if (!obj) {
        return null;
      }
      return (
        <List className="my-list">
          <Item
            className={styles.Record}
            extra={`¥${obj.depositAmount}`}
          >余额充值
                <Brief style={{ position: 'relative', fontSize: 15 }} >{obj.completeTime}</Brief>
          </Item>
        </List>
      );
    };
    const needRender = {};
    if (!this.props.scrollY) {
      needRender.renderScrollComponent = props => <div className="scrollRender">{props.children}</div>;
    } else {
      needRender.renderFooter = () => (this.props.scrollY && <div style={{ padding: 5, textAlign: 'center' }}>
        {(this.state.isLoadingMore || this.props.loading.effects['PersonalInfo/RechargeDetailnextPage']) ? 'Loading...' : this.props.noMore ? '没有更多了' : ''}
        </div>);
    }
    return (
      <div>
        <Helmet>
          {/* <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} /> */}
          {/* <style type="text/css">{`
                body,#root{
                    background-color: #ddeaf0;
                }
          `}</style> */}
        </Helmet>
        {RechargeDetaillist.length > 0 ?
          <div>
            <div className={styles.RechargeDetailInfo}>
              <ListView
                ref={el => this.lv = el}
                dataSource={this.state.dataSource}
                renderRow={row}
                onEndReachedThreshold={500}
                style={!this.props.scrollY ? {} : {
                  height: this.state.height,
                }}
                {...needRender}
                pullToRefresh={this.props.pullRefresh ? <PullToRefresh
                  refreshing={this.props.loading.effects['PersonalInfo/RechargeDetail']}
                  onRefresh={this.onRefresh}
                />
          :
          false
        }
                onEndReached={this.props.nextPage ? this.onEndReached : () => {}}
              />
            </div>
          </div>
      :
          <div>
            <div className={styles.noList}>
              {/* < img src="/images/noList.png" alt="" style={{ width: 100, height: 80 }} /> */}
              <p style={{ marginTop: 50, textAlign: 'center' }}>无记录</p>
            </div>
          </div>
      }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { RechargeDetaillist = [], total, page, noMore } = state.PersonalInfo || {};
  return {
    loading: state.loading,
    RechargeDetaillist,
    total,
    page,
    noMore,
  };
}

export default connect(mapStateToProps)(withRouter(RechargeDetailInfo));
