import React from 'react';
import { TabBar } from 'antd-mobile';
import io from 'socket.io-client';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'dva';
import styles from './MainLayout.less';

let tabTitle = '咨询记录';
const ENV = window.configs || {};
// const socket = io(`${ENV.WS_URL}`);

class ChatFooter extends React.Component {

  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    hasConnected: false,
    hasNewMsg: false,
  }

  componentWillMount() {
    this.socket = io(`${ENV.WS_URL}`);
  }

  componentDidMount() {
    this.props.dispatch({ type: 'Chat/generateInfo', payload: { userId: this.props.match.params.id } });

    this.socket.on('INFO', (newMsg = {}) => {
      // if (newMsg.source == 'SYSTEM') {
      const { hasNewMsg } = newMsg;
      this.props.dispatch({ type: 'Chat/saveHasNewMsg', payload: { hasNewMsg } });
      // }
    });
    this.socket.on('INFO', (newMsg = {}) => {
      if (newMsg.source == 'USER') {
        this.props.dispatch({ type: 'Chat/query', payload: { searchType: 'ALL' } });
        this.props.dispatch({ type: 'Chat/query', payload: { searchType: 'COMPLETED' } });
        this.props.dispatch({ type: 'Chat/query', payload: { searchType: 'REPLIED' } });
        this.props.dispatch({ type: 'Chat/query', payload: { searchType: 'REPLYING' } });
      }
      // const { data } = this.state;
      // if (newMsg.msgType == 'Config') { // config 信息
      //   this.setState({
      //     checkstate: newMsg.allowUploadMedia,
      //   });
      //   if (newMsg.leftTime) {
      //     this.setState({
      //       leftTime: newMsg.leftTime,
      //     });
      //   }
      // } else if (newMsg.msgType == 'History') { // 历史消息
      //   const { msgList = [] } = newMsg;
      //   if (msgList.length == 0) {
      //     if (!this.state.firstHistory) {
      //       Toast.info('没有更多的历史消息了', 1.5);
      //     }
      //     return;
      //   }
      //   msgList.map((msg) => {
      //     data.unshift(msg);
      //   });
      //   this.setState({
      //     data,
      //     lastIndex: newMsg.lastIndex,
      //   }, () => {
      //     // const scrollNode = ReactDOM.findDOMNode(this.ptr);
      //     // scrollNode.scrollTop = scrollNode.scrollHeight;
      //   });
      // } else { // 新聊天消息
      //   data.push(newMsg);
      //   this.setState({
      //     data,
      //   }, () => {
      //     const scrollNode = ReactDOM.findDOMNode(this.ptr);
      //     scrollNode.scrollTop = scrollNode.scrollHeight;
      //   });
      // }
    });
  }

  componentWillReceiveProps() {
    // const { hasConnected } = this.state;
    // if (!hasConnected) {
    //   // if (this.props.info.conversationRoomUuid) {
    //   this.setState({
    //     hasConnected: true,
    //   }, () => {

    this.socket.on('connect', () => {
      setTimeout(() => {
        this.socket.emit('JOIN', {
          roomUuid: this.props.commonCfg.conversationRoomUuid,
          ydataAcctId: sessionStorage.acctId }, () => { // JOIN Callback
          });
      }, 300);
    });
    //   });
    //   // }
    // }
  }

  componentWillUnmount() {
    this.socket.close();
  }

  render() {
    const { location, history, hasNewMsg } = this.props;
    const { role } = sessionStorage;
    if (role == 'ASSISTANT') {
      tabTitle = '我的服务';
    } else if (role == 'PATIENT') {
      tabTitle = '我的咨询';
    }
    return (

      <div id={styles.footTab}>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          style={{ height: '100px' }}
        >
          <TabBar.Item
            title="医生团队"
            key="DoctorList"
            selected={location.pathname === '/Chat/DoctorList'}
            onPress={() => {
              history.push('/Chat/DoctorList');
            }}
            icon={<i />}
            selectedIcon={<i />}
            style={{
              borderRight: '1px solid #ccc',
            }}
          >
            {/* {this.renderContent('Life')} */}
          </TabBar.Item>
          <TabBar.Item
            title="热门咨询"
            key="HotChats"
            selected={location.pathname === '/Chat/HotChats'}
            onPress={() => {
              history.push('/Chat/HotChats');
            }}
            icon={<i />}
            selectedIcon={<i />}
          >
            {/* {this.renderContent('Koubei')} */}
          </TabBar.Item>
          <TabBar.Item
            title={tabTitle}
            key="MyChat"
            dot={hasNewMsg}
            onPress={() => {
              history.push('/Chat/MyChat');
            }}
            selected={location.pathname === '/Chat/MyChat'}
            icon={<i />}
            selectedIcon={<i />}
          >
            {/* {this.renderContent('Friend')} */}
          </TabBar.Item>
        </TabBar>
      </div>

    );
  }
}

function mapStateToProps(state) {
  const { commonCfg = {}, hasNewMsg } = state.Chat || {};
  return {
    loading: state.loading.models.Chat,
    commonCfg,
    hasNewMsg,
  };
}

export default connect(mapStateToProps)(withRouter(ChatFooter));
