import React from 'react';
import { Tabs } from 'antd-mobile';
import { connect } from 'dva';
import styles from './Chat.less';
import MyChatList from './MyChatList';
// import WorkShopShare from '../WorkShop/WorkShopShare';s

class MyChatTypes extends React.Component {
  state = {
    data: ['', '', ''],
    initialHeight: 176,
  }

  render() {
    // const tabs = [
    //   { title: '待回复' },
    //   { title: '已回复' },
    //   { title: '已完成' },
    //   { title: '全部' },
    // ];
    const tabs = [
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
    return (
      <div className={styles.chat_types}>

        <Tabs
          tabs={tabs}
          initialPage={this.props.listIndex ? (this.props.listIndex.index || 0) : 0}
          prerenderingSiblingsNumber={0}
          swipeable={false}
          onChange={(tab, index) => { this.props.dispatch({ type: 'Chat/tabIndex', payload: { listIndex: { index, tab } } }); }}
          onTabClick={(tab, index) => {
            const { searchParmas = {} } = this.props.Chat[(tab && tab.searchType) || 'ALL'] || {};
            this.setState({
              value: searchParmas.searchType,
              show: false,
            }, () => {
              this.setState({
                show: true,
              });
            });
            this.props.dispatch({ type: 'Chat/tabIndex', payload: { listIndex: { index, tab } } });
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

export default connect(mapStateToProps)(MyChatTypes);
