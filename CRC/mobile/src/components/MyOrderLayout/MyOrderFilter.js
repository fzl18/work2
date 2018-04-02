import React from 'react';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import { List, Flex, WhiteSpace } from 'antd-mobile';
import styles from './MyOrderLayout.less';

class MyOrderFilter extends React.Component {

  state={
    stateParams: {},
    index: 0,
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'Order/queryProjectType', payload: {},
    });
    this.props.dispatch({
      type: 'Order/queryJobType', payload: {},
    });
    const { listIndex = { index: 0,
      tab: { searchType:
      'ALL' } }, MyOrder } = this.props;
    const { index } = listIndex;
    const searchType = listIndex.tab.searchType;
    this.setState({
      index,
      stateParams: (MyOrder[searchType] && MyOrder[searchType].searchParmas) || {},
    });
  }

  componentWillReceiveProps(nextProps) {
    const { MyOrder } = nextProps;
    const { listIndex = { index: 0,
      tab: { searchType:
      'ALL' } } } = MyOrder;
    const { index } = listIndex;
    const searchType = listIndex.tab.searchType;
    if (index != this.state.index) {
      this.setState({
        stateParams: (MyOrder[searchType] && MyOrder[searchType].searchParmas) || {},
        index,
      });
    }
  }

  checkParams = (value, field) => {
    // const { listIndex = { index: 0,
    //   tab: { searchType:
    //   'ALL' } } } = this.props.MyOrder;
    // const searchType = listIndex.tab.searchType;
    // this.props.dispatch({
    //   type: 'MyOrder/saveSearch',
    //   payload: {
    //     params: {
    //       [field]: value,
    //       searchType,
    //     },
    //   },
    // });
    const { stateParams } = this.state;
    stateParams[field] = value;
    this.setState({
      stateParams,
    });
  }

  submitSearch = () => {
    const { listIndex = { index: 0,
      tab: { searchType:
      'ALL' } } } = this.props.MyOrder;
    const searchType = listIndex.tab.searchType;
    this.props.dispatch({
      type: 'MyOrder/queryProject',
      payload: {
        searchType: sessionStorage.searchType || searchType,
        ...this.state.stateParams,
      },
    });
    this.props.closeDrawer();
  }

  reset = () => {
    const { listIndex = { index: 0,
      tab: { searchType:
      'ALL' } } } = this.props.MyOrder;
    const searchType = listIndex.tab.searchType;
    // this.props.dispatch({
    //   type: 'MyOrder/saveSearch',
    //   payload: {
    //     params: {
    //       jobTypeId: '',
    //       month: '',
    //       projectTypeId: '',
    //       sort: '',
    //       searchType,
    //     },
    //     callback: () => {

    //     },
    //   },
    // });
    this.props.dispatch({
      type: 'MyOrder/queryProject',
      payload: {
        jobTypeId: '',
        jobTypeName: '',
        month: '',
        projectTypeId: '',
        projectTypeName: '',
        sort: '',
        searchType: sessionStorage.searchType || searchType,
      },
    });
    this.props.closeDrawer();
    this.setState({
      stateParams: {},
    });
  }

  render() {
    const { jobType, projectType } = this.props;
    // jobType.push({
    //   serviceParameterName: '全部',
    //   serviceParameterId: '',
    // });
    // projectType.push({
    //   serviceParameterName: '全部',
    //   serviceParameterId: '',
    // });
    // const { listIndex = { index: 0,
    //   tab: { searchType:
    //   'ALL' } } } = MyOrder;
    // const searchType = listIndex.tab.searchType;
    // const { searchParmas = {} } = MyOrder[searchType] || {};
    const { jobTypeName = '', month = '', projectTypeName = '', sort = 'orderCreateTime' } = this.state.stateParams;
    return (
      <div className={styles.normal} style={{ position: 'relative', width: '300px', height: document.documentElement.clientHeight }}>
        <div style={{ height: document.documentElement.clientHeight - 50 }}>
          <List>
            <div className={styles.flex_container}>
              <div className="sub-title">
                <i className="icon iconfont icon-project" />  项目类型
        </div>
              <Flex wrap="wrap">
                {
                projectType.map((value, index) => {
                  return (<span
                    key={index} onClick={() => {
                      this.checkParams(value.serviceParameterName, 'projectTypeName');
                    }} className={value.serviceParameterName ==
                      projectTypeName ? styles.filter_spanchecked : styles.filter_span}
                  ><div className={'inline'}>{value.serviceParameterName}</div>
                  </span>);
                })
              }
                <span
                  onClick={() => {
                    this.checkParams('', 'projectTypeName');
                  }} className={projectTypeName == '' ? styles.filter_spanchecked : styles.filter_span}
                ><div className={'inline'}>全部</div>
                </span>
              </Flex>
              <WhiteSpace size="lg" />
            </div>
          </List>
          <List>
            <div className={styles.flex_container}>
              <div className="sub-title">
                <i className="icon iconfont icon-xiangmu" />  授权工作类型
        </div>
              <Flex wrap="wrap">
                {
                jobType.map((value, index) => {
                  return (<span
                    key={index} onClick={() => {
                      this.checkParams(value.serviceParameterName, 'jobTypeName');
                    }} className={value.serviceParameterName ==
                      jobTypeName ? styles.filter_spanchecked : styles.filter_span}
                  ><div className={'inline'}>{value.serviceParameterName}</div>
                  </span>);
                })
            }
                <span
                  onClick={() => {
                    this.checkParams('', 'jobTypeName');
                  }} className={jobTypeName == '' ? styles.filter_spanchecked : styles.filter_span}
                ><div className={'inline'}>全部</div>
                </span>
              </Flex>
              <WhiteSpace size="lg" />
            </div>
          </List>
          <List>
            <div className={styles.flex_container}>
              <div className="sub-title">
                <i className="icon iconfont icon-shijian" />  订单创建时间
        </div>
              <Flex wrap="wrap">
                <span
                  className={month == 1 ? styles.filter_spanchecked : styles.filter_span}
                  onClick={() => {
                    this.checkParams(1, 'month');
                  }}
                ><div className={'inline'}>近一个月</div>
                </span>
                <span
                  className={month == 3 ? styles.filter_spanchecked : styles.filter_span}
                  onClick={() => {
                    this.checkParams(3, 'month');
                  }}
                ><div className={'inline'}>近三个月</div>
                </span>
                <span
                  className={month == '' ? styles.filter_spanchecked : styles.filter_span}
                  onClick={() => {
                    this.checkParams('', 'month');
                  }}
                ><div className={'inline'}>全部</div>
                </span>
              </Flex>
              <WhiteSpace size="lg" />
            </div>
          </List>
          <List>
            <div className={styles.flex_container}>
              <div className="sub-title">
                <i className="icon iconfont icon-paixu" />  排序
        </div>
              <Flex wrap="wrap">
                <span
                  className={sort == 'orderCreateTime' ? styles.filter_spanchecked : styles.filter_span}
                  onClick={() => {
                    this.checkParams('orderCreateTime', 'sort');
                  }}
                ><div className={'inline'}>创建时间</div>
                </span>
                <span
                  className={sort == 'orderPlanMoney' ? styles.filter_spanchecked : styles.filter_span}
                  onClick={() => {
                    this.checkParams('orderPlanMoney', 'sort');
                  }}
                ><div className={'inline'}>订单预估额</div>
                </span>
                <span
                  className={sort == 'planServiceHours' ? styles.filter_spanchecked : styles.filter_span}
                  onClick={() => {
                    this.checkParams('planServiceHours', 'sort');
                  }}
                ><div className={'inline'}>订单预估工时</div>
                </span>
                <span
                  className={sort == 'orderMoney' ? styles.filter_spanchecked : styles.filter_span}
                  onClick={() => {
                    this.checkParams('orderMoney', 'sort');
                  }}
                ><div className={'inline'}>订单额</div>
                </span>
                <span
                  className={sort == 'modifyServiceHours' ? styles.filter_spanchecked : styles.filter_span}
                  onClick={() => {
                    this.checkParams('modifyServiceHours', 'sort');
                  }}
                ><div className={'inline'}>订单工时</div>
                </span>
                {
                  sessionStorage.role == 'INSIDE_ASSISTANT' ?
                    <span
                      className={sort == 'actual_receive' ? styles.filter_spanchecked : styles.filter_span}
                      onClick={() => {
                        this.checkParams('actual_receive', 'sort');
                      }}
                    ><div className={'inline'}>订单实收金额</div>
                    </span>
                :
                    <span
                      className={sort == 'actual_pay' ? styles.filter_spanchecked : styles.filter_span}
                      onClick={() => {
                        this.checkParams('actual_pay', 'sort');
                      }}
                    ><div className={'inline'}>订单实付金额</div>
                    </span>
                }
                <span
                  className={sort == 'service_time' ? styles.filter_spanchecked : styles.filter_span}
                  onClick={() => {
                    this.checkParams('service_time', 'sort');
                  }}
                ><div className={'inline'}>服务开始时间</div>
                </span>
              </Flex>
              <WhiteSpace size="lg" />
            </div>
          </List>
        </div>

        <div className={styles.buttombar}>
          <div
            className={`${styles.bottombutton} ${styles.gray}`}
            onClick={() => {
              this.reset();
            }}
          >
          重置
          </div>
          <div
            className={`${styles.bottombutton} ${styles.orange}`}
            onClick={
              () => {
                this.submitSearch();
              }
            }
          >
          确认
          </div>
        </div>

      </div>
    );
  }
}

function mapStateToProps(state) {
  const { jobType = [], projectType = [] } = state.Order || {};
  const { MyOrder = {} } = state;
  return {
    jobType,
    projectType,
    MyOrder,
  };
}

export default connect(mapStateToProps)(withRouter(MyOrderFilter));
