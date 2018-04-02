import React from 'react';
import { SearchBar, Tabs } from 'antd-mobile';
import { connect } from 'dva';
import Helmet from 'react-helmet';
import MyChatList from './MyChatList';
import styles from './Chat.less';
import ChatFooter from '../../components/MainLayout/ChatFooter';

function search(e, dispatch, listIndex) {
  dispatch({ type: 'Chat/query', payload: { keywords: e, searchType: (listIndex.tab && listIndex.tab.searchType) || 'ALL' } });
}

let pageTitle = '咨询记录';

class MyChat extends React.Component {

  state={
    show: true,
    value: this.props.searchParmas.keywords,
  }

  render() {
    const { role } = sessionStorage;
    if (role == 'ASSISTANT') {
      pageTitle = '我的服务';
    } else if (role == 'PATIENT') {
      pageTitle = '我的咨询';
    }
    let tabs = [
      { title: '待回复',
        searchType: 'REPLYING',
      }, { title: '已回复',
        searchType: 'REPLIED',
      }, { title: '已完成',
        searchType: 'COMPLETED',
      }, { title: '全部',
        searchType: 'ALL',
      },
    ];

    if (role == 'PATIENT') {
      tabs = [
        { title: '已回复',
          searchType: 'REPLIED',
        },
        { title: '待回复',
          searchType: 'REPLYING',
        }, { title: '已完成',
          searchType: 'COMPLETED',
        }, { title: '全部',
          searchType: 'ALL',
        },
      ];
    }

    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
          <style type="text/css">{`
                body,#root,.am-search{
                    background-color: #ddeaf0;
                }
          `}</style>
        </Helmet>
        {
          this.state.show ?
            <SearchBar
              placeholder="请输入问题\医生\患者搜索"
              maxLength={50}
              value={this.state.value}
              onChange={(e) => {
                this.setState({ value: e });
              }}
              onBlur={() => search(this.state.value, this.props.dispatch, this.props.listIndex)}
              onClear={() => {
                this.setState({ value: '' });
              }}
              onCancel={() => {
                this.setState({
                  value: '',
                });
                search('', this.props.dispatch, this.props.listIndex);
              }}
              onSubmit={e => search(e, this.props.dispatch, this.props.listIndex)}
            />
        :
        null
        }
        <div className={styles.chat_types}>

          <Tabs
            tabs={tabs}
            // initialPage={this.props.listIndex ?
            //  (this.props.listIndex.index || (Number(sessionStorage.ChatTabIndex) || 0))
            //  :
            //  (Number(sessionStorage.ChatTabIndex) || 0)
            // }
            initialPage={Number(sessionStorage.ChatTabIndex) ?
            Number(sessionStorage.ChatTabIndex) : (this.props.listIndex ?
              (this.props.listIndex.index || 0) : 0)}
            prerenderingSiblingsNumber={0}
            swipeable={false}
            onChange={(tab, index) => { this.props.dispatch({ type: 'Chat/tabIndex', payload: { listIndex: { index, tab } } }); }}
            onTabClick={(tab, index) => {
              const { searchParmas = {} } = this.props.Chat[(tab && tab.searchType) || 'ALL'] || {};
              this.setState({
                value: searchParmas.keywords,
                show: false,
              }, () => {
                this.setState({
                  show: true,
                });
              });
              this.props.dispatch({ type: 'Chat/tabIndex', payload: { listIndex: { index, tab } } });
              sessionStorage.ChatTabIndex = index;
            }

   }
          >
            <div style={{ width: '100%', marginLeft: '0px', marginRight: '0px' }}>
              <MyChatList
                type={tabs[0].searchType}
                nextPage={true} pullRefresh={true} scrollY={true}
              />
            </div>
            <div style={{ width: '100%', marginLeft: '0px', marginRight: '0px' }}>
              <MyChatList
                type={tabs[1].searchType}
                nextPage={true} pullRefresh={true} scrollY={true}
              />
            </div>
            <div style={{ width: '100%', marginLeft: '0px', marginRight: '0px' }}>
              <MyChatList
                type={tabs[2].searchType}
                nextPage={true} pullRefresh={true} scrollY={true}
              />
            </div>
            <div style={{ width: '100%', marginLeft: '0px', marginRight: '0px' }}>
              <MyChatList
                type={tabs[3].searchType}
                nextPage={true} pullRefresh={true} scrollY={true}
              />
            </div>
          </Tabs>
        </div>
        <ChatFooter />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { Chat = {} } = state || {};
  const { listIndex = {} } = Chat;
  const { searchParmas = {} } = Chat[(listIndex.tab && listIndex.tab.searchType) || 'ALL'] || {};
  return {
    loading: state.loading.models.Chat,
    searchParmas,
    listIndex,
    Chat,
  };
}
export default connect(mapStateToProps)(MyChat);
