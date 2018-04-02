import React from 'react';
import { ListView, PullToRefresh } from 'antd-mobile';
import { connect } from 'dva';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router';
import moment from 'moment';
import styles from './WorkShop.less';


const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

class WorkShopShare extends React.Component {
  state={
    dataSource,
    height: document.documentElement.clientHeight,
    isLoadingMore: false,
  }

  componentDidMount() {
    const getRect = ReactDOM.findDOMNode(this.lv).getBoundingClientRect();
    const hei = getRect.height - getRect.top;
    const rData = this.props.list ? this.props.list : [];
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(rData),
      height: hei,
      refreshing: false,
      isLoading: false,
    });
  }

  componentWillReceiveProps() {
    const rData = this.props.list ? this.props.list : [];
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
    this.props.dispatch({ type: 'WorkShop/query', payload: {} });
  };

  onEndReached = () => {
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false

    if (this.props.loading.effects['WorkShop/nextPage'] || this.state.isLoadingMore) { // @todo hasMore
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
        this.props.dispatch({ type: 'WorkShop/nextPage', payload: { page } });
      }, 300);
    });
    this.setState({
      isLoadingMore: false,
    });
  };

  render() {
    const { list = [] } = this.props;
    const row = (rowData, sectionID, rowID) => {
      const obj = list[rowID];
      if (!obj) {
        return null;
      }
      return (
        <div
          key={rowID}
          style={{
            padding: '0 15px',
            backgroundColor: 'white',
          }}
          className="rowContent"
          onClick={() => {
            this.props.history.push(`/WorkShop/WorkShopInfo/${obj.meetingId}`);
          }}
        >
          <div className="row_style">
            <img className="row_img" src={obj.mainImgUrl} alt="" />
            <div className="row_content" style={{ paddingRight: 5 }}>
              <div className="row_detail">
                <div
                  className="row_title" style={{ marginTop: 5,
                    fontFamily: 'Microsoft YaHei',
                    color: '#333e4d',
                    // height: 33,
                    // width: 155,
                  }}
                >{obj.meetingTitle}</div>
                <div className="row_footer">
                  <span className="row_time"><i className="icon iconfont icon-riqi" />{obj.beginTime && moment(obj.beginTime).format('YYYY-MM-DD')}</span>
                  <span className="row_location">{obj.location}</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      );
    };
    const needRender = {};
    if (!this.props.scrollY) {
      needRender.renderScrollComponent = props => <div className="scrollRender">{props.children}</div>;
    } else {
      needRender.renderFooter = () => (this.props.scrollY && <div style={{ padding: 5, textAlign: 'center' }}>
        {this.props.loading.effects['WorkShop/nextPage'] ? 'Loading...' : ''}
      </div>);
      if (list.length == 0) {
        needRender.renderHeader = () => (
          <div style={{ textAlign: 'center' }}>
            暂无相关记录
          </div>
        );
      }
    }
    return (
      <div className={styles.WorkShopIndex}>
        <ListView
          ref={el => this.lv = el}
          dataSource={this.state.dataSource}
          renderRow={row}
          style={!this.props.scrollY ? {} : {
            height: this.state.height,
            margin: '5px 0',
          }}
          {...needRender}
          pullToRefresh={this.props.pullRefresh ? <PullToRefresh
            refreshing={this.props.loading.effects['WorkShop/query']}
            onRefresh={this.onRefresh}
          />
            :
            false
          }
          onEndReached={this.props.nextPage ? this.onEndReached : () => {}}
          pageSize={5}
        />

      </div>
    );
  }
}

function mapStateToProps(state) {
  if (state.WorkShop) {
    const { list, total, page, noMore } = state.WorkShop;
    return {
      loading: state.loading,
      list,
      total,
      page,
      noMore,
    };
  }
}


export default connect(mapStateToProps)(withRouter(WorkShopShare));
