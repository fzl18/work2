import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import { List, SwipeAction, Modal, ListView, PullToRefresh } from 'antd-mobile';
import Helmet from 'react-helmet';
import moment from 'moment';
import ElementAuth from '../../components/ElementAuth';
import styles from './MyPanel.less';

const alert = Modal.alert;
const Item = List.Item;
const Brief = Item.Brief;
const pageTitle = '消息';

const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

class AuthNotice extends React.Component {
  state={
    dataSource,
    height: document.documentElement.clientHeight,
    isLoadingMore: false,
  }

  componentDidMount() {
    if (ReactDOM.findDOMNode(this.lv) != null) {
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
  }

  componentWillReceiveProps() {
    if (ReactDOM.findDOMNode(this.lv) != null) {
      const hei = document.documentElement.clientHeight
    - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
      const rData = this.props.list ? this.props.list : [];
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
      this.props.dispatch({ type: 'MyPanel/notice', payload: {} });
    }, 1000);
  };

  onEndReached = () => {
    if (this.props.loading.effects['MyPanel/nextPage'] || this.state.isLoadingMore) {
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
        this.props.dispatch({ type: 'MyPanel/nextPage', payload: { page } });
      }, 1000);
    });
    this.setState({
      isLoadingMore: false,
    });
  };

  deleteNoticeById = (id) => {
    this.props.dispatch({ type: 'MyPanel/deleteNoticeById', payload: { assistantServiceAuthNoticeId: id } });
  }

  deleteAllNotice =() => {
    this.props.dispatch({ type: 'MyPanel/deleteAllNotice', payload: { } });
  }

  render() {
    const { list = [] } = this.props || {};
    const row = (rowData, sectionID, rowID) => {
      const obj = list[rowID];
      if (!obj) {
        return null;
      }
      return (
        <List className="my-list">
          <ElementAuth auth="notice">
            <SwipeAction
              style={{ backgroundColor: 'gray' }}
              autoClose
              right={[
                {
                  style: { backgroundColor: '#F4333C', color: 'white' },
                  text: '删除',
                  onPress: () => alert('提示', '是否确定删除?', [
                    { text: '取消', onPress: () => console.log('cancel') },
                    { text: '确定', onPress: () => { this.deleteNoticeById(obj.assistantServiceAuthNoticeId); } },
                  ]),
                },
              ]}
            >
              <Item
                onClick={() => {
                  this.props.history.push(`/MyPanel/EmpowerApply/${obj.assistantServiceAuthNoticeId}`);
                }}
                extra={obj.createTime && moment(obj.createTime).format('YYYY-MM-DD HH:mm')}
                className={styles.Notice}
                align="top"
              >
                <i
                  className="iconfont icon-shouquanzh-"
                  style={{ color: '#62cf96', fontSize: 32, marginRight: '10px', marginTop: 5, position: 'absolute' }}
                />
                {
                  obj.status == 'UNREAD' ?
                    <span style={{ position: 'absolute', borderRadius: '6px', border: '5px solid #f00', left: 30, top: 15 }} />
                    :
                    null
                }
                <span style={{ marginLeft: 42, position: 'relative', fontSize: 15 }}>授权通知</span>
                <Brief style={{ marginLeft: 40, position: 'relative', fontSize: 15 }} >{obj.noticeInfo}</Brief>
              </Item>
            </SwipeAction>
          </ElementAuth>
        </List>
      );
    };
    const needRender = {};
    if (!this.props.scrollY) {
      needRender.renderScrollComponent = props => <div className="scrollRender">{props.children}</div>;
    } else {
      needRender.renderFooter = () => (this.props.scrollY && <div style={{ padding: 5, textAlign: 'center' }}>
        {(this.state.isLoadingMore || this.props.loading.effects['MyPanel/nextPage']) ? 'Loading...' : this.props.noMore ? '没有更多了' : ''}
        </div>);
    }
    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
          <style type="text/css">{`
                body,#root{
                    background-color: #ddeaf0;
                }
          `}</style>
        </Helmet>
        {list.length > 0 ?
          <div>
            <div
              className={styles.sub_delete}
              onClick={() => alert('确认清空消息', '', [
          { text: '确定', onPress: () => { this.deleteAllNotice(); } },
          { text: '取消', onPress: () => console.log('cancel') },
              ])}
            >
              <i
                className="iconfont icon-qingkong"
                style={{ color: '#62cf96', fontSize: 24, marginRight: '10px', position: 'absolute', marginTop: '11px', marginLeft: '13px' }}
              />
            </div>
            <div className={styles.AuthNoticeLess}>
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
                  refreshing={this.props.loading.effects['MyPanel/notice']}
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
            <div className={styles.noRelieve}>
              < img src="/images/noList.png" alt="" style={{ width: 100, height: 80 }} />
              <p style={{ marginTop: 10 }}>无记录</p>
            </div>
          </div>
      }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { list = [], total, page, noMore } = state.MyPanel || {};
  return {
    loading: state.loading,
    list,
    total,
    page,
    noMore,
  };
}

export default connect(mapStateToProps)(withRouter(AuthNotice));
