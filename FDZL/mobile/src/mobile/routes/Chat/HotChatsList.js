import React from 'react';
import { ListView, PullToRefresh, Card } from 'antd-mobile';
import { connect } from 'dva';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router';

import styles from './Chat.less';

const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

class HotChatsList extends React.Component {
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
    this.props.dispatch({ type: 'HotChatsList/query', payload: {} });
  };

  onEndReached = () => {
    if (this.props.loading.effects['HotChatsList/nextPage'] || this.state.isLoadingMore) {
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
    }, () => {
      this.props.dispatch({ type: 'HotChatsList/nextPage', payload: { page } });
      this.setState({
        isLoadingMore: false,
      });
    });
  };

  toChatPage = (id, conversationId) => { // 根据聊天ID获取到相关的信息(热门咨询id为hotChat)
    location.href = `/Chat/ChatBox/${id}/${conversationId}`;
  }

  render() {
    const { list } = this.props;
    const row = (rowData, sectionID, rowID) => {
      const obj = list[rowID];
      if (!obj) {
        return null;
      }
      return (
        <div style={{ marginTop: '10px' }} className="chat_card">
          <Card
            full
            onClick={() => {
              this.toChatPage('hotChat', obj.conversationId);
            }}
          >
            <Card.Header
              title={<span className="chat_header"><i className="icon iconfont icon-huidawenti" /><span className="chat_title">{obj.title}</span></span>}
            />
            <Card.Body>
              <div className="card_body">{obj.general}</div>
            </Card.Body>
          </Card>
        </div>
      );
    };
    const needRender = {};
    if (!this.props.scrollY) {
      needRender.renderScrollComponent = props => <div className="scrollRender">{props.children}</div>;
    } else {
      needRender.renderFooter = () => (this.props.scrollY && <div style={{ padding: 5, textAlign: 'center' }}>
        {this.props.loading.effects['HotChatsList/nextPage'] ? 'Loading...' : ''}
      </div>);
    }
    return (
      <div className={styles.HotChatsList}>
        <ListView
          ref={el => this.lv = el}
          dataSource={this.state.dataSource}
          renderRow={row}
          style={!this.props.scrollY ? {} : {
            height: this.state.height - 34,
            margin: '5px 0',
          }}
          {...needRender}
          pullToRefresh={this.props.pullRefresh ? <PullToRefresh
            refreshing={this.props.loading.effects['HotChatsList/query']}
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
  const { list, total, page, noMore } = state.HotChatsList || {};
  return {
    loading: state.loading,
    list,
    total,
    page,
    noMore,
  };
}


export default connect(mapStateToProps)(withRouter(HotChatsList));
