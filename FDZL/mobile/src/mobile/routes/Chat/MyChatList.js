import React from 'react';
import { ListView, PullToRefresh, Card, Modal, ActivityIndicator } from 'antd-mobile';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import moment from 'moment';
import SwipeToAction from '../../common/SwipeToAction/SwipeToAction';
import styles from './Chat.less';

const alert = Modal.alert;
const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

class Chat extends React.Component {
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
    this.props.dispatch({ type: 'Chat/query', payload: { ...payLoadParam } });
    const rData = this.props.list ? this.props.list : [];
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(rData),
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
    this.props.dispatch({ type: 'Chat/query', payload: { searchType: this.props.type } });
  };

  onEndReached = () => {
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false

    if (this.props.loading.effects['Chat/nextPage'] || this.state.isLoadingMore) { // @todo hasMore
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
        this.props.dispatch({ type: 'Chat/nextPage', payload: { page, searchType: this.props.type } });
      }, 300);
    });
    this.setState({
      isLoadingMore: false,
    });
  };


  toChatPage = (id, conversationId) => { // 根据聊天ID获取到相关的信息(同患者同医生不同Id记录的区分)
    location.href = `/Chat/ChatBox/${id}/${conversationId}`;
    // this.props.history.push(`/Chat/ChatBox/${id}/${conversationId}`);
  }

  deleteConversation = (conversationId, searchType) => {
    alert('', '确认删除吗？', [
      { text: '取消', onPress: () => {} },
      { text: '确认',
        onPress: () => {
          this.props.dispatch({ type: 'Chat/deleteConversation', payload: { conversationId, searchType } });
        } },
    ]);
  }

  isDeleteable = (searchType) => {
    const { role } = sessionStorage;
    if (role == 'ASSISTANT') {
      if (searchType == 'COMPLETED') {
        return false;
      } else {
        return true;
      }
    } else if (role == 'PATIENT') {
      return false;
    } else if (role == 'DOCTOR') {
      if (searchType == 'COMPLETED') {
        return false;
      } else {
        return true;
      }
    }
  }

  render() {
    const { list } = this.props;
    const { role } = sessionStorage;
    const row = (rowData, sectionID, rowID) => {
      const obj = list[rowID];
      if (!obj) {
        return null;
      }
      let status = '';
      if (obj.searchType == 'REPLYING') {
        status = '待回复';
      } else if (obj.searchType == 'REPLIED') {
        status = '已回复';
      } else if (obj.searchType == 'COMPLETED') {
        status = '已完成';
      }
      let iconClass = 'icon-ren';
      if (role == 'PATIENT') {
        iconClass = 'icon-shouye';
      }
      return (
        <div style={{ marginTop: '10px' }} className="chat_card">
          <SwipeToAction
            style={{ backgroundColor: 'gray' }}
            autoClose
            disabled={this.isDeleteable(obj.searchType)}
            right={[
              // {
              //  text: 'Cancel',
              //  onPress: () => console.log('cancel'),
              //  style: { backgroundColor: '#ddd', color: 'white' },
              // },
              {
                text: '删除',
                onPress: () => { this.deleteConversation(obj.conversationId, obj.searchType); },
                style: { backgroundColor: '#F4333C', color: 'white', width: '55px' },
              },
            ]}
            // onOpen={() => console.log('global open')}
            // onClose={() => console.log('global close')}
          >
            <Card
              full onClick={() => {
                const id = (role == 'PATIENT' ? obj.doctorAccountId : obj.patientAccountId);
                if (role == 'ASSISTANT') { // 将generatechat所需参数存入session
                  sessionStorage.doctorAccountId = obj.doctorAccountId;
                  sessionStorage.patientAccountId = obj.patientAccountId;
                }
                this.toChatPage(id, obj.conversationId);
              }}
            >
              <Card.Header
                title={<span className="chat_header"><i className={`icon iconfont ${iconClass} ${obj.newMsg && styles.newMsg}`} />
                  <span className="chat_name">
                    {role == 'PATIENT' ?
                    (obj.doctorPosition ? `${obj.doctorCompellation}(${obj.doctorPosition})` : `${obj.doctorCompellation}`)
                    :
                    (obj.patientHospitalizationNumber ?
                    `${obj.patientCompellation}(${obj.patientHospitalizationNumber})`
                      :
                      obj.patientCompellation
                    )
                  }
                  </span>
                  <span className="chat_status" style={{ position: 'absolute', right: '20px', top: '15px' }}>{status}</span>
                </span>}
                // extra={}
              />
              <Card.Body>
                <div className="card_body">{obj.title}</div>
              </Card.Body>
              <Card.Footer
                style={{ marginTop: '20px' }} content={moment(obj.createTime).format('YYYY-MM-DD HH:mm')} extra={
                  <div>
                    {
                    role == 'ASSISTANT' ?
                    (obj.doctorPosition ?
                      `咨询对象:${obj.doctorCompellation}(${obj.doctorPosition || ''})`
                      :
                      `咨询对象:${obj.doctorCompellation}`
                    )
                    :
                    (
                      role == 'DOCTOR' ?
                      (obj.lastReplyCompellation ? `最近回复者:${obj.lastReplyCompellation}` : '')
                      :
                      ''
                    )
                  }
                  </div>
                }
              />
            </Card>
          </SwipeToAction>
        </div>
      );
    };
    const needRender = {};
    if (!this.props.scrollY) {
      needRender.renderScrollComponent = props => <div className="scrollRender">{props.children}</div>;
    } else {
      needRender.renderFooter = () => (this.props.scrollY && <div style={{ padding: 5, textAlign: 'center' }}>
        {this.props.loading.effects['Chat/nextPage'] ? 'Loading...' : ''}
      </div>);
      if (list.length == 0) {
        needRender.renderHeader = () => (
          <div>
            {/* 暂无相关记录 */}
          </div>
        );
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
            height: this.state.height - 44 - 50 - 44,
            margin: '0px 0',
          }}
          {...needRender}
          pullToRefresh={this.props.pullRefresh ? <PullToRefresh
            refreshing={this.props.loading.effects['Chat/query']}
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
          animating={this.props.loading.effects['Chat/deleteConversation'] || false}
        />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  if (state.Chat) {
    const {
      list = {}, total, page, noMore,
    } = state.Chat[ownProps.type] || {};
    return {
      loading: state.loading,
      list,
      total,
      page,
      noMore,
    };
  }
}


export default connect(mapStateToProps)(withRouter(Chat));
