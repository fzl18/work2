import React from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import { ListView, PullToRefresh, List, ActivityIndicator } from 'antd-mobile';
import moment from 'moment';
import styles from './DetailOrder.less';
import OperateOrder from './OperateOrder';


// const alert = Modal.alert;
const Item = List.Item;
const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

class DetailOrder extends React.Component {
  state={
    dataSource,
    height: document.documentElement.clientHeight,
    isLoadingMore: false,
  }


  componentDidMount() {
    const payLoadParam = {
      searchType: this.props.type,
    };
    if (this.props.limit) {
      payLoadParam.limit = this.props.limit;
    }
    this.props.dispatch({ type: this.gettype(), payload: { ...payLoadParam } });
    const rData = this.props.list ? this.props.list : [];
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(rData),
    });
  }

  componentWillReceiveProps(nextProps) {
    const rData = nextProps.list ? nextProps.list : [];
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(rData),
      refreshing: false,
      isLoading: false,
    });
    if (!this.props.scrollY) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
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
    this.setState({ refreshing: true, isLoading: true });
    this.props.dispatch({ type: this.gettype(), payload: { searchType: this.props.type } });
  };

  onEndReached = () => {
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false

    if (this.props.loading.effects[this.getNext()] || this.state.isLoadingMore) { // @todo hasMore
      return;
    }
    if (this.props.noMore) {
      // Toast.info('沒有更多数据了', 1);
      return;
    }
    let { page } = this.props;
    // if(PAGE_SIZE * page > total){//@todo lastpage define
    //     Toast.info("没有更多了")
    // }
    if (!page) {
      page = 2;
    } else {
      page += 1;
    }
    this.setState({
      isLoadingMore: true,
    }, function () {
      setTimeout(() => {
        this.props.dispatch({ type: this.getNext(),
          payload: { page, searchType: this.props.type } });
      }, 300);
    });
    this.setState({
      isLoadingMore: false,
    });
  };

  gettype = () => {
    const { type } = this.props;
    if (type == 'newProjectList') {
      return 'Order/queryNewProject';
    } else {
      return 'MyOrder/queryProject';
    }
  }

  getNext = () => {
    const { type } = this.props;
    if (type == 'newProjectList') {
      return 'Order/nextPage';
    } else {
      return 'MyOrder/nextPage';
    }
  }

  getOrderStatus = (value) => {
    const DoctorMap = {
      GRAB: '等待抢单',
      SERVICE: '待服务',
      CANCEL: '已取消',
      CANCELLATION: '请求取消',
      ATTACK: '服务中',
      COMPLETION: '等待提交',
      SUBMISSION: '等待支付',
      PAYMENT: '已完成支付',
      APPRAISAL: '已评价',
    };
    const AssistantMap = {
      SERVICE: '待服务',
      CANCEL: '已取消',
      CANCELLATION: '请求取消',
      ATTACK: '服务中',
      COMPLETION: '等待提交',
      SUBMISSION: '等待支付',
      PAYMENT: '已完成支付',
      APPRAISAL: '已评价',
    };
    const { role } = sessionStorage;
    if (role == 'DOCTOR' || role == 'NOTDOCTOR') {
      return DoctorMap[value.orderStatus];
    } else if (role == 'INSIDE_ASSISTANT' && this.props.type == 'newProjectList') {
      return '等待抢单';
    } else if (role == 'INSIDE_ASSISTANT') {
      return AssistantMap[value.serviceStatus];
    }
  }

 //  zlee 是否存在数据
  isOrderExist=(num) => {
    if (num > 0) {
      return true;
    } else { return false; }
  }

  render() {
    const { list } = this.props;
    const listCounts = this.isOrderExist(list.length);
    const row = (rowData, sectionID, rowID) => {
      const value = list[rowID];
      if (!value) {
        return null;
      }
      if (!listCounts) {
        return null;
      }
      return (
        <div style={{ backgroundColor: '#f6f6f6', paddingBottom: '5px' }}>
          <List
            className="my-list"
            onClick={() => {
              location.href = `/MyOrder/DataOrder/${value.projectId}`;
              // this.props.history.push(`/MyOrder/DataOrder/${value.projectId}`);
            }}
          >
            {/* s */}
            <Item
              wrap
              extra={this.getOrderStatus(value)}
              className={styles.detailOrderTitle}
            >
              <i className="icon iconfont icon-wenjian" style={{ marginRight: '10px' }} />
              {value.projectContract && value.projectContract.jobTypeNames}</Item>
            <Item wrap className={styles.detailName}>
              <i className="iconfont icon-project" style={{ marginRight: '10px' }} />
              {value.projectTitle}</Item>
            <Item wrap className={styles.detailName}>
              <i className="iconfont icon-shalou" style={{ marginRight: '10px' }} />
              {moment(value.serviceTime).format('YYYY-MM-DD HH:mm')}~
                  {moment(value.serviceTime).add('hours', value.planServiceHours).format('YYYY-MM-DD HH:mm')}</Item>
            <Item wrap className={styles.detailName}>
              <i className="iconfont icon-weizhi" style={{ marginRight: '10px' }} />
              {value.projectContract && value.projectContract.detailAddress}</Item>
          </List>
          <OperateOrder operateOrderDatas={value} />
        </div>
      );
    };

    const needRender = {};
    if (!this.props.scrollY) {
      needRender.renderScrollComponent = props => <div className="scrollRender">{props.children}</div>;
    } else {
      needRender.renderFooter = () => (this.props.scrollY && <div style={{ padding: 5, textAlign: 'center' }}>
        {this.props.loading.effects[this.getNext()] ? 'Loading...' : ''}
      </div>);
      if (!listCounts) {
        needRender.renderHeader = () => {
          if (!this.props.loading.effects['MyOrder/queryProject']) {
            return (<div
              className={styles.nodata}
            >
              <p className={`${styles.nodataico} iconfont  ${this.props.icoTyle} `} />
              <p>{this.props.nodatamsg }</p>
            </div>);
          } else {
            return null;
          }
        }
       ;
      }
    }
    return (
      <div className={styles.Chat}>
        <ListView
          ref={el => this.lv = el}
          className={list.length == 0 ? 'chat_list_none' : ''}
          dataSource={this.state.dataSource}
          renderRow={row}
          style={!this.props.scrollY ? {} : {
            height: this.state.height - 65,
            marginBottom: '0px 0',
          }}
          {...needRender}
          pullToRefresh={this.props.pullRefresh ? <PullToRefresh
            refreshing={this.props.loading.effects[this.gettype()]}
            onRefresh={this.onRefresh}
          />
            :
            false
          }
          onEndReached={this.props.nextPage ? this.onEndReached : () => {}}
          pageSize={5}
        />
        <ActivityIndicator
          toast
          text="Loading..."
          animating={this.props.loading.effects['MyOrder/deleteConversation'] || false}
        />
      </div>
    );
  }
}


function mapStateToProps(state, ownProps) {
  const { newProjectList = {} } = state.Order || {};
  const {
      list = [], total, page, noMore,
    } = (state.MyOrder && state.MyOrder[ownProps.type]) || {};
  return {
    loading: state.loading,
    list: ownProps.type == 'newProjectList' ? (newProjectList.list || []) : list,
    total,
    page,
    noMore,
    newProjectList: newProjectList.list || [],
  };
}


export default connect(mapStateToProps)(withRouter(DetailOrder));
