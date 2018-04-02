import React from 'react';
import { Tabs, Badge, WhiteSpace, SwipeAction, List } from 'antd-mobile';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import moment from 'moment';
// import {  List } from 'antd-mobile';
// import enUs from 'antd-mobile/lib/date-picker/locale/en_US';
import styles from './Notice.less';

const pageTitle = '消息';
class Index extends React.Component {
  state = {
    isRead: true,
  }


  componentWillReceiveProps(nextProps) {
    const { message } = nextProps;
    let { isRead } = this.state;
    isRead = true;
    message.map((data) => {
      if (!data.isRead) {
        isRead = false;
      }
    });
    this.setState({
      isRead,
    });
  }

  see =(id) => {
    this.props.history.push(`/Notice/Content/${id}`);
  }

  messageTap = (informId, informType, projectId) => {
    this.props.dispatch({ type: 'Notice/modifyIsReadByInformId', payload: { informId } });
    if (informType == 'VIOLATION') {
      this.props.history.push('/Order/AddOrder');
    }
    if (informType == 'ORDER') {
      location.href = `/MyOrder/DataOrder/${projectId}`;
      // this.props.history.push(`/MyOrder/DataOrder/${projectId}`);
    }
    if (informType == 'MEMBER') {
      this.props.history.push('/PersonalInfo');
    }
  }

  delTap = (informId) => {
    this.props.dispatch({ type: 'Notice/deleteInformByInformId', payload: { informId } });
  }

  render() {
    const { message, notice, tabIndex, dispatch } = this.props;
    const tabs = [
      { title: !this.state.isRead ? <Badge dot>通知</Badge> : '通知',
        type: 'message',
      },
      { title: '公告',
        type: 'notice',
      },
    ];
    // this.props.listCategory.map((value) => {
    //   tabs.push({
    //     title: value.categoryName,
    //     ...value,
    //   });
    // });
    const messageList = message.map((data, i) =>
        (data.informType == 'VIOLATION' ?
          <SwipeAction
            key={i}
            style={{ backgroundColor: 'gray' }}
            autoClose
            right={[{
              text: '删除',
              onPress: () => this.delTap(data.informId),
              style: { backgroundColor: '#ff0000', color: 'white', width: 80 },
            }]}
          >
            <List.Item
              onClick={() => this.messageTap(data.informId, data.informType, data.projectId)}
              extra={data.informTime && moment(data.informTime).format('YYYY-MM-DD')}
              align="top"
              className={styles.BadgeWaring}
              thumb={data.isRead ? <i className="icon iconfont icon-jinggao2" /> : <Badge dot><i className="icon iconfont icon-jinggao2" /></Badge>}
              multipleLine
            >
              {data.informContent} <List.Item.Brief>订单号：{data.projectCode}</List.Item.Brief>
            </List.Item>
          </SwipeAction> :
           (data.informType == 'ORDER' ?
             <SwipeAction
               key={i}
               style={{ backgroundColor: 'gray' }}
               autoClose
               right={[{
                 text: '删除',
                 onPress: () => this.delTap(data.informId),
                 style: { backgroundColor: '#ff0000', color: 'white', width: 80 },
               }]}
             >
               <List.Item
                 onClick={() => this.messageTap(data.informId, data.informType, data.projectId)}
                 extra={data.informTime && moment(data.informTime).format('YYYY-MM-DD')}
                 align="top"
                 className={styles.Badge}
                 thumb={data.isRead ? <i className="icon iconfont icon-dingdan1" /> : <Badge dot><i className="icon iconfont icon-dingdan1" /></Badge>}
                 multipleLine
               >
                 {data.informContent} <List.Item.Brief>订单号：{data.projectCode}</List.Item.Brief>
               </List.Item>
             </SwipeAction>
             :
             <SwipeAction
               key={i}
               style={{ backgroundColor: 'gray' }}
               autoClose
               right={[
                 {
                   text: '删除',
                   onPress: () => this.delTap(data.informId),
                   style: { backgroundColor: '#ff0000', color: 'white', width: 80 },
                 },
               ]}
             >
               <List.Item
                 onClick={() => this.messageTap(data.informId, data.informType, data.projectId)}
                 extra={data.informTime && moment(data.informTime).format('YYYY-MM-DD')}
                 align="top"
                 className={styles.Badge}
                 thumb={data.isRead ? <i className="icon iconfont icon-zuanshi2" /> : <Badge dot><i className="icon iconfont icon-zuanshi2" /></Badge>}
                 multipleLine
               >
                 {data.informContent}
               </List.Item>
             </SwipeAction>)
              ),
              );
    const noticeList = notice.map((data, i) =>
      <List key={i} renderHeader={() => data.pubTime && moment(data.pubTime).format('YYYY-MM-DD')} className={styles.cardList}>
        <List.Item multipleLine onClick={() => { this.see(data.noticeId); }}>
          {data.noticeTitle} <List.Item.Brief>{data.noticeImgUrl && <img alt="" src={data.noticeImgUrl} style={{ width: '100%', height: '100%' }} />}<br /> { data.noticeContent.replace(/<\/?[^>]*>/g, '').substr(0, 50)}</List.Item.Brief>
        </List.Item>
        <List.Item
          arrow="horizontal"
          onClick={() => { this.see(data.noticeId); }}
          platform="android"
        >
            查看详情
            </List.Item>
      </List>,
    );

    const tabDivs =
      (<div style={{ width: '100%', background: '#F7F5F6' }}>
        <WhiteSpace />
        <List>
          {messageList.length > 0 ? messageList : <List.Item>暂无内容！</List.Item>}
        </List>
      </div>);
    console.log(this.props.tabIndex);
    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>
        <div className={styles.InfoTap}>
          <Tabs
            tabs={tabs}
            className={styles.InfoTap}
            initialPage={tabIndex || 0}
            prerenderingSiblingsNumber={0}
            swipeable={false}
            onChange={() => {}}
            onTabClick={(tab, index) => {
              dispatch({ type: 'Notice/changeTabIndex', payload: index });
              console.log('cur', index);
              if (tab.type === 'message') {
                dispatch({ type: 'Notice/queryInformList', payload: {} });
              } else {
                dispatch({ type: 'Notice/queryNoticeForPub', payload: {} });
              }
            }
            }
          >
            {tabDivs}
            <div style={{ width: '100%', background: '#F7F5F6' }}>
              {noticeList.length > 0 ? noticeList : <List><List.Item>暂无内容！</List.Item></List>}
            </div>
          </Tabs>
        </div>
      </div>
    );
  }


    }


function mapStateToProps(state) {
  const { message = [], notice = [], isRead = false, tabIndex = 0 } = state.Notice || {};
  return {
    loading: state.loading.models.Notice,
    message,
    notice,
    isRead,
    tabIndex,
  };
}

export default connect(mapStateToProps)(withRouter(Index));
