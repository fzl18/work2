import React from 'react';
import { Tabs } from 'antd-mobile';
import { connect } from 'dva';
import styles from './MyOrderHead.less';
import DetailOrder from '../../routes/MyOrder/DetailOrder';


class MyOrderHead extends React.Component {

  render() {
    const doctorTabs = [
      { title: '全部', searchType: 'ALL', icoTyle: 'icon-dingdan2', nodatamsg: '没有要处理的信息' },
      { title: '待抢单', searchType: 'GRAB', icoTyle: 'icon-dingdan2', nodatamsg: '没有待抢的订单' },
      { title: '待服务', searchType: 'SERVICE', icoTyle: 'icon-dingdan2', nodatamsg: '没有待服务的信息' },
      { title: '服务中', searchType: 'ATTACK', icoTyle: 'icon-dingdan2', nodatamsg: '没有服务中的信息' },
      { title: '待提交', searchType: 'COMPLETION', icoTyle: 'icon-dingdan2', nodatamsg: '没有待提交的信息' },
      { title: '待支付', searchType: 'SUBMISSION', icoTyle: 'icon-dingdan2', nodatamsg: '没有待支付的信息' },
      { title: '待评价', searchType: 'PAYMENT', icoTyle: 'icon-dingdan2', nodatamsg: '没有待评价的信息' },
      { title: '已评价', searchType: 'APPRAISAL', icoTyle: 'icon-dingdan2', nodatamsg: '没有已评价的信息' },
    ];
    const assistantTabs = [
    { title: '全部', searchType: 'ALL', icoTyle: 'icon-dingdan2', nodatamsg: '没有要处理的信息' },
    { title: '待服务', searchType: 'SERVICE', icoTyle: 'icon-dingdan2', nodatamsg: '没有待服务的信息' },
    { title: '服务中', searchType: 'ATTACK', icoTyle: 'icon-dingdan2', nodatamsg: '没有服务中的信息' },
    { title: '待提交', searchType: 'COMPLETION', icoTyle: 'icon-dingdan2', nodatamsg: '没有待提交的信息' },
    { title: '待支付', searchType: 'SUBMISSION', icoTyle: 'icon-dingdan2', nodatamsg: '没有待支付的信息' },
    { title: '待评价', searchType: 'PAYMENT', icoTyle: 'icon-dingdan2', nodatamsg: '没有待评价的信息' },
    { title: '已评价', searchType: 'APPRAISAL', icoTyle: 'icon-dingdan2', nodatamsg: '没有已评价的信息' },
    ];
    const isAssistant = sessionStorage.role == 'INSIDE_ASSISTANT';
    const tabs = isAssistant ? assistantTabs : doctorTabs;
    return (
      <div className={styles.header}>
        <div>
          <i style={{ color: '#FFF', position: 'absolute', right: '10px', zIndex: '999' }} onClick={() => { this.props.onOpenChange(); }} className="icon iconfont icon-shaixuan" />
        </div>
        <div className={styles.headTap}>
          {
            isAssistant ?
              <Tabs
                tabs={tabs}
                initialPage={
                  Number(sessionStorage.ChatTabIndex) ?
            Number(sessionStorage.ChatTabIndex) : (this.props.listIndex ?
              (this.props.listIndex.index || 0) : 0)}
                page={
                  Number(sessionStorage.ChatTabIndex) ?
                  Number(sessionStorage.ChatTabIndex) : (this.props.listIndex ?
                (this.props.listIndex.index || 0) : 0)}
                prerenderingSiblingsNumber={0}
                swipeable={false}
                tabBarBackgroundColor="#fe8260"
                tabBarActiveTextColor="#ffffff"
                tabBarInactiveTextColor="#7f521b"
                tabBarUnderlineStyle={{ borderColor: '#fff', bottom: '5px', width: '14%', marginLeft: '3%' }}
                onChange={(tab, index) => { this.props.dispatch({ type: 'MyOrder/tabIndex', payload: { listIndex: { index, tab } } }); }}
                onTabClick={(tab, index) => {
                  { /* const { searchParmas = {} } =
              this.props.MyOrder[(tab && tab.searchType) || 'ALL'] || {};
              this.setState({
                value: searchParmas.keywords,
                show: false,
              }, () => {
                this.setState({
                  show: true,
                });
                  }); */ }
                  this.props.dispatch({ type: 'MyOrder/tabIndex', payload: { listIndex: { index, tab } } });
                  sessionStorage.ChatTabIndex = index;
                  sessionStorage.searchType = tab.searchType;
                }

              }
              >
                {/* position: 'absolute', */}
                <div style={{ width: '100%', marginLeft: '0px', marginRight: '0px' }}>
                  <DetailOrder
                    type={tabs[0].searchType}
                    nextPage={true} pullRefresh={true} scrollY={true}
                    icoTyle={tabs[0].icoTyle} nodatamsg={tabs[0].nodatamsg}
                  />
                </div>

                <div style={{ width: '100%', marginLeft: '0px', marginRight: '0px' }}>
                  <DetailOrder
                    type={tabs[isAssistant ? 1 : 2].searchType}
                    nextPage={true} pullRefresh={true} scrollY={true}
                    icoTyle={tabs[isAssistant ? 1 : 2].icoTyle}
                    nodatamsg={tabs[isAssistant ? 1 : 2].nodatamsg}
                  />
                </div>
                <div style={{ width: '100%', marginLeft: '0px', marginRight: '0px' }}>
                  <DetailOrder
                    type={tabs[isAssistant ? 2 : 3].searchType}
                    nextPage={true} pullRefresh={true} scrollY={true}
                    icoTyle={tabs[isAssistant ? 2 : 3].icoTyle}
                    nodatamsg={tabs[isAssistant ? 2 : 3].nodatamsg}
                  />
                </div>
                <div style={{ width: '100%', marginLeft: '0px', marginRight: '0px' }}>
                  <DetailOrder
                    type={tabs[isAssistant ? 3 : 4].searchType}
                    nextPage={true} pullRefresh={true} scrollY={true}
                    icoTyle={tabs[isAssistant ? 3 : 4].icoTyle}
                    nodatamsg={tabs[isAssistant ? 3 : 4].nodatamsg}
                  />
                </div>
                <div style={{ width: '100%', marginLeft: '0px', marginRight: '0px' }}>
                  <DetailOrder
                    type={tabs[isAssistant ? 4 : 5].searchType}
                    nextPage={true} pullRefresh={true} scrollY={true}
                    icoTyle={tabs[isAssistant ? 4 : 5].icoTyle}
                    nodatamsg={tabs[isAssistant ? 4 : 5].nodatamsg}
                  />
                </div>
                <div style={{ width: '100%', marginLeft: '0px', marginRight: '0px' }}>
                  <DetailOrder
                    type={tabs[isAssistant ? 5 : 6].searchType}
                    nextPage={true} pullRefresh={true} scrollY={true}
                    icoTyle={tabs[isAssistant ? 5 : 6].icoTyle}
                    nodatamsg={tabs[isAssistant ? 5 : 6].nodatamsg}
                  />
                </div>
                <div style={{ width: '100%', marginLeft: '0px', marginRight: '0px' }}>
                  <DetailOrder
                    type={tabs[isAssistant ? 6 : 7].searchType}
                    nextPage={true} pullRefresh={true} scrollY={true}
                    icoTyle={tabs[isAssistant ? 6 : 7].icoTyle}
                    nodatamsg={tabs[isAssistant ? 6 : 7].nodatamsg}
                  />
                </div>
              </Tabs>
          :
              <Tabs
                tabs={tabs}
                initialPage={
                Number(sessionStorage.ChatTabIndex) ?
                Number(sessionStorage.ChatTabIndex) : (this.props.listIndex ?
              (this.props.listIndex.index || 0) : 0)}
                page={
                  Number(sessionStorage.ChatTabIndex) ?
                  Number(sessionStorage.ChatTabIndex) : (this.props.listIndex ?
                (this.props.listIndex.index || 0) : 0)}
                prerenderingSiblingsNumber={0}
                swipeable={false}
                tabBarBackgroundColor="#fe8260"
                tabBarActiveTextColor="#ffffff"
                tabBarInactiveTextColor="#7f521b"
                tabBarUnderlineStyle={{ borderColor: '#fff', bottom: '5px', width: '14%', marginLeft: '3%' }}
                onChange={(tab, index) => { this.props.dispatch({ type: 'MyOrder/tabIndex', payload: { listIndex: { index, tab } } }); }}
                onTabClick={(tab, index) => {
                  { /* const { searchParmas = {} } =
              this.props.MyOrder[(tab && tab.searchType) || 'ALL'] || {};
              this.setState({
                value: searchParmas.keywords,
                show: false,
              }, () => {
                this.setState({
                  show: true,
                });
                  }); */ }
                  this.props.dispatch({ type: 'MyOrder/tabIndex', payload: { listIndex: { index, tab } } });
                  sessionStorage.ChatTabIndex = index;
                  sessionStorage.searchType = tab.searchType;
                }

              }
              >
                {/* position: 'absolute', */}
                <div style={{ width: '100%', marginLeft: '0px', marginRight: '0px' }}>
                  <DetailOrder
                    type={tabs[0].searchType}
                    nextPage={true} pullRefresh={true} scrollY={true}
                    icoTyle={tabs[0].icoTyle} nodatamsg={tabs[0].nodatamsg}
                  />
                </div>

                <div style={{ width: '100%', marginLeft: '0px', marginRight: '0px' }}>
                  <DetailOrder
                    type={tabs[1].searchType}
                    nextPage={true} pullRefresh={true} scrollY={true}
                    icoTyle={tabs[1].icoTyle} nodatamsg={tabs[1].nodatamsg}
                  />
                </div>
                <div style={{ width: '100%', marginLeft: '0px', marginRight: '0px' }}>
                  <DetailOrder
                    type={tabs[isAssistant ? 1 : 2].searchType}
                    nextPage={true} pullRefresh={true} scrollY={true}
                    icoTyle={tabs[isAssistant ? 1 : 2].icoTyle}
                    nodatamsg={tabs[isAssistant ? 1 : 2].nodatamsg}
                  />
                </div>
                <div style={{ width: '100%', marginLeft: '0px', marginRight: '0px' }}>
                  <DetailOrder
                    type={tabs[isAssistant ? 2 : 3].searchType}
                    nextPage={true} pullRefresh={true} scrollY={true}
                    icoTyle={tabs[isAssistant ? 2 : 3].icoTyle}
                    nodatamsg={tabs[isAssistant ? 2 : 3].nodatamsg}
                  />
                </div>
                <div style={{ width: '100%', marginLeft: '0px', marginRight: '0px' }}>
                  <DetailOrder
                    type={tabs[isAssistant ? 3 : 4].searchType}
                    nextPage={true} pullRefresh={true} scrollY={true}
                    icoTyle={tabs[isAssistant ? 3 : 4].icoTyle}
                    nodatamsg={tabs[isAssistant ? 3 : 4].nodatamsg}
                  />

                </div>
                <div style={{ width: '100%', marginLeft: '0px', marginRight: '0px' }}>
                  <DetailOrder
                    type={tabs[isAssistant ? 4 : 5].searchType}
                    nextPage={true} pullRefresh={true} scrollY={true}
                    icoTyle={tabs[isAssistant ? 4 : 5].icoTyle}
                    nodatamsg={tabs[isAssistant ? 4 : 5].nodatamsg}
                  />
                </div>
                <div style={{ width: '100%', marginLeft: '0px', marginRight: '0px' }}>
                  <DetailOrder
                    type={tabs[isAssistant ? 5 : 6].searchType}
                    nextPage={true} pullRefresh={true} scrollY={true}
                    icoTyle={tabs[isAssistant ? 5 : 6].icoTyle}
                    nodatamsg={tabs[isAssistant ? 5 : 6].nodatamsg}
                  />
                </div>
                <div style={{ width: '100%', marginLeft: '0px', marginRight: '0px' }}>
                  <DetailOrder
                    type={tabs[isAssistant ? 6 : 7].searchType}
                    nextPage={true} pullRefresh={true} scrollY={true}
                    icoTyle={tabs[isAssistant ? 6 : 7].icoTyle}
                    nodatamsg={tabs[isAssistant ? 6 : 7].nodatamsg}
                  />
                </div>
              </Tabs>
          }

        </div>
      </div>

    );
  }

}
function mapStateToProps(state) {
  const { MyOrder = {} } = state || {};
  const { listIndex = {} } = MyOrder;
  const { searchParmas = {} } = MyOrder[(listIndex.tab && listIndex.tab.searchType) || 'ALL'] || {};
  return {
    loading: state.loading.models.MyOrder,
    searchParmas,
    listIndex,
    MyOrder,
  };
}
export default connect(mapStateToProps)(MyOrderHead);

