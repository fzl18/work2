import React from 'react';
import { Tabs, List } from 'antd-mobile';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import moment from 'moment';
// import {  List } from 'antd-mobile';
// import enUs from 'antd-mobile/lib/date-picker/locale/en_US';
import styles from './PersonalInfo.less';

const pageTitle = '个人信息';
const Item = List.Item;
const Brief = Item.Brief;
const { acctId, role } = sessionStorage;
class PersonalInfo extends React.Component {

  state={
    datas: [],
  }

  componentDidMount() {
    this.props.dispatch({ type: 'PersonalInfo/PersonalInfo', payload: { acctId } });
    if ((!sessionStorage.acctId) || (role == 'INSIDE_ASSISTANT')) {
      return;
    }
    this.props.dispatch({ type: 'Register/NowAuditStatus',
      payload: {},
      callback: (response) => {
        if (response.success && response.success.auditStatus == 'no_audit') {
          this.props.history.push('/Register/RegisterNext');
        }
      },
    });
  }   // 医助角色待修改时

  componentWillReceiveProps() {
    this.setState({
      datas: this.props.PersonalInfoList.datas,
    });
  }


  description =() => {
    location.href = '/GradeAndIntegralDescription';
  }
  EssentialiInformation=() => {
    location.href = '/EssentialiInformation';
  }
  AuditFailedToPass=() => {
    location.href = '/AuditFailedToPass';
  }

  render() {
    const tabs = [
      { title: '全部',
        integralState: '',
      },
      { title: '收入',
        integralState: ' REVENUE',
      },
      { title: '支出',
        integralState: 'EXPENSEX',
      },
    ];
    const { ydataAccountCompellation,
       // status,
        memberLevelType,
        memberIntegral, headimgurl } = this.props.data;
    let Action = '';
    const { datas = [] } = this.state;
    const { count } = this.props.PersonalInfoList;
    const { auditStatus } = sessionStorage;
    let headurl = '';
    if (headimgurl == null) {
      headurl = '/images/head-default.jpg';
    } else if (headimgurl != null) {
      headurl = headimgurl;
    }
    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>
        <div className={styles.PersonalInfoHead}>
          <div className={styles.PersonalHeadImg}>
            <img src={headurl} alt="" className={styles.HeadImg} />
          </div>
          <div className={styles.PersonalInfo}>
            <p style={{ fontSize: 16 }}>{ ydataAccountCompellation }</p>
            { auditStatus == 'audit_pending' ? <p style={{ color: 'rgb(255,244,92)' }}>待审核</p> : null}
            { auditStatus == 'audit_failed' ?
              <p style={{ color: 'rgb(229,7,57)', width: 85 }} onClick={this.AuditFailedToPass}>审核未通过&gt;</p>
            : null}
            { ((auditStatus == 'audit_passed') || (sessionStorage.auditStatus == null) || (role == 'INSIDE_ASSISTANT')) ?
            (memberLevelType == '1' ?
              <p ><i className="icon iconfont icon-zuanshi" style={{ color: 'wheat' }} />
                {/* <span style={{ marginLeft: 5 }} onClick={this.description}>
                <i className="icon iconfont icon-bangzhudisc"
                style={{ fontSize: 13, color: 'wheat' }} /></span> */}
              </p>
               : (memberLevelType == '2' ?
                 <p ><i className="icon iconfont icon-zuanshi" style={{ color: 'wheat' }} />
                   <i className="icon iconfont icon-zuanshi" style={{ color: 'wheat' }} />
                   {/* <span style={{ marginLeft: 5 }} onClick={this.description}>
                     <i className="icon iconfont icon-bangzhudisc"
                     style={{ fontSize: 13, color: 'wheat' }} /></span> */}
                 </p>
                :
                (memberLevelType == '3' ?
                  <p ><i className="icon iconfont icon-zuanshi" style={{ color: 'wheat' }} />
                    <i className="icon iconfont icon-zuanshi" style={{ color: 'wheat' }} />
                    <i className="icon iconfont icon-zuanshi" style={{ color: 'wheat' }} />
                    {/* <span style={{ marginLeft: 5 }} onClick={this.description}>
                      <i className="icon iconfont icon-bangzhudisc"
                       style={{ fontSize: 13, color: 'wheat' }} /></span> */}
                  </p>
                  :
                  (memberLevelType == '4' ?
                    <p ><i className="icon iconfont icon-zuanshi" style={{ color: 'wheat' }} />
                      <i className="icon iconfont icon-zuanshi" style={{ color: 'wheat' }} />
                      <i className="icon iconfont icon-zuanshi" style={{ color: 'wheat' }} />
                      <i className="icon iconfont icon-zuanshi" style={{ color: 'wheat' }} />
                      {/* <span style={{ marginLeft: 5 }} onClick={this.description}>
                        <i className="icon iconfont icon-bangzhudisc"
                        style={{ fontSize: 13, color: 'wheat' }} /></span> */}
                    </p>
                   :
                   (memberLevelType == '5' ?
                     <p ><i className="icon iconfont icon-zuanshi" style={{ color: 'wheat' }} />
                       <i className="icon iconfont icon-zuanshi" style={{ color: 'wheat' }} />
                       <i className="icon iconfont icon-zuanshi" style={{ color: 'wheat' }} />
                       <i className="icon iconfont icon-zuanshi" style={{ color: 'wheat' }} />
                       <i className="icon iconfont icon-zuanshi" style={{ color: 'wheat' }} />
                       {/* <span style={{ marginLeft: 5 }} onClick={this.description}>
                         <i className="icon iconfont icon-bangzhudisc"
                         style={{ fontSize: 13, color: 'wheat' }} /></span> */}
                     </p>
                    : (memberLevelType == '0' ?
                      <p><span>
                        <i className="icon iconfont icon-bangzhudisc" style={{ fontSize: 13, color: 'rgba(0, 0, 0, 0)' }} /></span></p>
                       :
                       null
                    )
                   )
                  )
                )
               )
            )
             :
             null}
            <p>积分:<span style={{ marginLeft: 5 }}>{memberIntegral}</span>
              <span style={{ marginLeft: 5 }} onClick={this.description}>
                <i className="icon iconfont icon-bangzhudisc" style={{ fontSize: 13, color: 'wheat' }} /></span></p>
          </div>
          { (auditStatus == 'audit_passed') || (role == 'INSIDE_ASSISTANT') ?
            <div className={styles.Info} onClick={this.EssentialiInformation}>
              <span><i className="icon iconfont icon-dfdfdfdfdf" style={{ fontSize: 20, position: 'absolute', top: 2, color: 'wheat' }} />
              </span><p style={{ position: 'absolute', top: 5, right: 5 }}>
            个人资料</p></div> : null}
          <div>
            <div className={styles.InfoDetail}>积分明细 ||</div>
            <div className={styles.InfoTap}>
              <Tabs
                tabs={tabs}
                className={styles.InfoTapDetail}
                initialPage={0}
                prerenderingSiblingsNumber={0}
                swipeable={true}
                onChange={(index) => {
                  this.props.dispatch({ type: 'PersonalInfo/PersonalInfo',
                    payload: { integralState: index.integralState } });
                }}
                onTabClick={(tab, index) => { console.log('onTabClick', tab, index); }}
              >
                { count != 0 ?
                  <div style={{ backgroundColor: '#fff' }}>
                    {
                   datas.map((value) => {
                     Action = value.memberBehaviorType.memberBehaviorTypeName;

                     return (
                       <List className="my-list">
                         <Item extra={value.integral > 0 ? `+${value.integral}分` : `${value.integral}分`} className={styles.Action}>{Action}<Brief>{value.createTime && moment(value.createTime).format('YYYY-MM-DD hh:mm')}</Brief></Item>
                       </List>
                     );
                   })

              }
                  </div>
                 : <div>
                   <img src="/images/nograde.png" alt="" className={styles.nograde} />
                 </div>
                   }

                { count != 0 ?
                  <div style={{ backgroundColor: '#fff' }}>
                    {
                   datas.map((value) => {
                     Action = value.memberBehaviorType.memberBehaviorTypeName;

                     return (
                       <List className="my-list">
                         <Item extra={value.integral > 0 ? `+${value.integral}分` : `${value.integral}分`} className={styles.Action}>{Action}<Brief>{value.createTime && moment(value.createTime).format('YYYY-MM-DD hh:mm')}</Brief></Item>
                       </List>
                     );
                   })

              }
                  </div>
                 : <div>
                   <img src="/images/nograde.png" alt="" className={styles.nograde} />
                 </div>
                   }

                { count == 0 ?
                  <div>
                    <img src="/images/nograde.png" alt="" className={styles.nograde} />
                  </div>
                :
                  <div style={{ backgroundColor: '#fff' }}>
                    {
                   datas.map((value) => {
                     Action = value.memberBehaviorType.memberBehaviorTypeName;

                     return (
                       <List className="my-list">
                         <Item extra={value.integral > 0 ? `+${value.integral}分` : `${value.integral}分`} className={styles.Action}>{Action}<Brief>{value.createTime && moment(value.createTime).format('YYYY-MM-DD hh:mm')}</Brief></Item>
                       </List>
                     );
                   })
              }
                  </div>
                }
              </Tabs>
            </div>
          </div>
        </div>


      </div>


    );
  }


    }


function mapStateToProps(state) {
  const { PersonalInfoList = {} } = state.PersonalInfo || {};
  const { data = {} } = PersonalInfoList;
  const { datas = [] } = PersonalInfoList;
  const { memberBehaviorType = {} } = datas;
  return {
    PersonalInfoList,
    data,
    datas,
    memberBehaviorType,
  };
}

export default connect(mapStateToProps)(withRouter(PersonalInfo));
