import React from 'react';
import { connect } from 'dva';
import { List, WingBlank, Button, Modal, WhiteSpace, Toast, TextareaItem } from 'antd-mobile';
import Helmet from 'react-helmet';
import ElementAuth from '../../components/ElementAuth';
import styles from './MyPanel.less';

const alert = Modal.alert;
// const prompt = Modal.prompt;
const Item = List.Item;


class EmpowerApply extends React.Component {
  state ={
    comment: '',
    modal1: false,
  }

  componentDidMount() {
    this.props.dispatch({ type: 'MyPanel/empowerApplyDetail', payload: { assistantServiceAuthNoticeId: this.props.match.params.id } });
    // this.autoFocusInst.focus();
  }

  onClose = key => () => {
    this.setState({
      [key]: false,
    });
  }

  showModal = key => (e) => {
    e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      [key]: true,
    });
  }

  applyOrReject = (id, val) => {
    const { comment } = this.state;
    if (val == 'REJECTED') {
      if (comment == '' || comment == undefined || comment.trim() == '') {
        Toast.info('请输入拒绝原因');
        return;
      }
      this.props.dispatch({ type: 'MyPanel/applyOrReject', payload: { assistantServiceAuthId: id, status: val, comment, assistantServiceAuthNoticeId: this.props.match.params.id } });
    } else {
      this.props.dispatch({ type: 'MyPanel/applyOrReject',
        payload: {
          assistantServiceAuthId: id,
          status: val,
          assistantServiceAuthNoticeId: this.props.match.params.id,
        },
        callback: () => {
          const { assistantUserCompellation } = this.props.detail || {};
          alert('', `你已接受"${assistantUserCompellation}"的服务申请`,
            [{ text: '知道了',
              onPress: () => {
              } },
            ]);
        },
      });
    }
  }
  changeReason=(e, key) => {
    this.setState({
      [key]: e,
    });
  }


  // showModal = () => {

  // }
  startService=(doctorUserCompellation) => {
    this.props.dispatch({ type: 'Chat/createDefaultSearch', payload: { keywords: doctorUserCompellation } });
    this.props.history.push('/Chat/MyChat');
  }


  render() {
    const { assistantUserCompellation, assistantMobile,
            assistantServiceAuthId, assistentEnterprise, assistentEmail, authStatus,
            assistentDepartment, doctorUserCompellation, doctorImage,
            doctorPosition, comment } = this.props.detail || {};
    // const { clickbtn, choose } = this.state;

    return (
      <div>
        {!this.props.loading.effects['MyPanel/empowerApplyDetail'] ?
          <div>
            {authStatus == 'STOP' ?
              <div>
                <div style={{ textAlign: 'center', paddingTop: 200 }}>< img src="/images/noList.png" alt="" style={{ width: 100, height: 80 }} /><p style={{ marginTop: 10 }}>此授权服务已结束</p></div>
              </div>
        :
        (sessionStorage.role == 'DOCTOR' ?
          <div className={styles.doctor} >
            <Helmet>
              <title>授权申请</title>
              <meta name="description" content="授权申请" />
              <style type="text/css">{`
                body,#root{
                    background-color: #ddeaf0;
                }
          `}</style>
            </Helmet>

            <div className={styles.sub_title}>申请者信息</div>
            <List className="my-list">
              <ElementAuth auth="empowerApply">
                {/* TODO: 获取参数变化*/}

                <Item extra={assistantUserCompellation} auth="name">
                  <i
                    className="iconfont icon-iconfontgerenzhongxin"
                    style={{ color: '#167eb5', fontSize: 24, marginRight: '10px' }}
                  />姓名</Item>
                <Item extra={assistantMobile} auth="mobile">
                  <i
                    className="iconfont icon-shouji"
                    style={{ color: '#167eb5', fontSize: 24, marginRight: '10px' }}
                  />手机号</Item>
                <Item extra={assistentEmail} auth="email">
                  <i
                    className="iconfont icon-youxiang"
                    style={{ color: '#167eb5', fontSize: 24, marginRight: '10px' }}
                  />邮箱</Item>
                <Item extra={assistentEnterprise} auth="company" className={styles.EmpowerApply} >
                  <i
                    className="iconfont icon-iconfontyiyuan"
                    style={{ color: '#167eb5', fontSize: 24, marginRight: '10px' }}
                  />单位</Item>
                <Item extra={assistentDepartment} auth="department" className={styles.EmpowerApply}>
                  <i
                    className="iconfont icon-keshishouyaohuizhen"
                    style={{ color: '#167eb5', fontSize: 24, marginRight: '10px' }}
                  />部门（科室）</Item>
              </ElementAuth>
            </List>
            <WhiteSpace />
            <div className={styles.button} >
              {
           ((authStatus == 'APPLYING') || (authStatus == null) || (authStatus == 'INACTIVE')) ?
             <WingBlank>
               <Button
                // clickbtn={clickbtn}
                 className="btn-config"
            // icon="check-circle-o"
                 onClick={() => { this.applyOrReject(assistantServiceAuthId, 'ACTIVE'); }}
               >接受申请</Button>
               <WhiteSpace />
             </WingBlank>
          :
           null
        }


              {
           ((authStatus == 'APPLYING') || (authStatus == null) || (authStatus == 'INACTIVE')) ?
             <WingBlank>
               {/* <div className={styles.rejectbtn}>  */}

               {/* <Button
                 className="empower-button"
                 type="warning"
                 onClick={() => prompt('拒绝原因', '',
                   [
                     {
                       text: '确定',
                       onPress: () => {
                         const { reason } = this.state;
                         this.applyOrReject(assistantServiceAuthId, reason, 'REJECTED');
                       },
                     },
                    { text: '取消' },
                   ], 'default', null, ['请输入...'])}
               >拒绝申请</Button>
               {/* </div> */}
               <WhiteSpace />

               <Button
                 className="empower-button"
                 type="warning" onClick={this.showModal('modal1')}
               >拒绝申请</Button>
               <WhiteSpace />
               <div>
                 <Modal
                   visible={this.state.modal1}
                   transparent
                   maskClosable={false}
                   className={styles.rejectModel}
                   onClose={this.onClose('modal1')}
                   title="拒绝原因"
                   footer={[
                     {
                      // onPress: value => new Promise((resolve) => {
                        // setTimeout(() => {
                         //  resolve();
                         //  { this.applyOrReject(assistantServiceAuthId, value, 'REJECTED');
                         //    console.log('确定'); this.onClose('modal1')();
                          // }
                        // console.log(`value:${value}`);
                       //  }, 1000);
                      // }),
                       text: '确定',
                       onPress: () => {
                        // const { reason } = this.state;
                         this.applyOrReject(assistantServiceAuthId, 'REJECTED');
                       },
                     },
                     { text: '取消',
                       onPress: () => { console.log('取消'); this.onClose('modal1')(); } }]}
                   wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                 >
                   <div style={{ height: 120, overflow: 'auto', marginLeft: -15 }}>
                     <TextareaItem
                       placeholder="请输入..."
                       data-seed="logId"
                       style={{ backgroundColor: 'rgb(245,254,253)', height: 140, width: 270 }}
                       onChange={(e) => { this.changeReason(e, 'comment'); }}
                       autoHeight
                       ref={el => this.customFocusInst = el}
                     />
                   </div>
                 </Modal>
               </div>
             </WingBlank>
          :
          null
        }
              {
          (authStatus == 'ACTIVE') ?
            <WingBlank>
              <Button
                disabled={true}
                className="btn-config1"
              >已做接受处理</Button>
            </WingBlank>
          :
          null
        }
              {
          (authStatus == 'REJECTED') ?
            <WingBlank>
              <Button
                disabled={true}
                className="btn-config2"
              >已做拒绝处理</Button>
            </WingBlank>
          :
          null
        }
            </div>
          </div>
        :
          <div>
            <Helmet>
              <title>授权详情</title>
              <meta name="description" content="授权详情" />
              <style type="text/css">{`
                body,#root{
                    background-color: #ddeaf0;
                }
          `}</style>
            </Helmet>
            <div className={styles.head} >
              <div className={styles.circle4} />
              <div className={styles.circle5} />
              <div className={styles.profile}>
                <img src={doctorImage} alt="" />
              </div>
              <p style={{ color: 'white', textAlign: 'center', marginTop: -60, fontSize: 15 }}>
                <span style={{ fontWeight: 550 }}>{doctorUserCompellation}</span>
                <span style={{ marginLeft: 5 }}> {doctorPosition}</span>
              </p>
            </div>
            { authStatus == 'ACTIVE' ?
              <div className={styles.ActiveApply}>
                <div className={styles.apply}>
                  <p><span style={{ color: '#62cf96', marginRight: 10 }}><i className="icon iconfont icon-author" /></span>
                    <span style={{ position: 'relative', bottom: 5 }}>您向该位医生的授权申请已通过！</span></p>
                </div>
                <div className={styles.applybtn}>
                  <WingBlank>
                    <Button
                      onClick={() => { this.startService(doctorUserCompellation); }}
                      className="service"
                    ><p style={{ fontSize: 15 }}><span style={{ marginRight: 20 }}><i className="icon iconfont icon-fuwu1" /></span>
                      <span style={{ position: 'relative', bottom: 3 }}>开始服务吧!</span></p></Button>
                  </WingBlank>
                </div>
              </div>
            :
           null
            }
            { authStatus == 'REJECTED' ?
              <div>
                <div className={styles.RejectedApply}>
                  <p className={styles.Rejectedinf}><span style={{ color: 'rgb(227,80,98)', marginRight: 10 }}><i className="icon iconfont icon-shenhebutongguo" /></span>
                    <span style={{ position: 'relative', bottom: 2 }} >您向该位医生的授权申请未通过！</span></p>
                  <div className={styles.RejectedReson}>
                    <tbody>
                      <tr>
                        <th style={{ height: 35, fontSize: 14, fontWeight: 400, borderBottom: '1px solid #a7b2b9', width: 265 }}>
                  拒绝原因
                  </th>
                      </tr>
                      <tr>
                        <td style={{ height: 205, backgroundColor: 'rgb(245, 254, 253)' }}>
                          <p style={{ position: 'relative', marginTop: '-70px', fontSize: '14px', wordBreak: 'break-word' }}> {comment}</p>
                        </td>
                      </tr>
                    </tbody>
                  </div>
                </div>
              </div>
            :
            null
            }
          </div>
        )
          }
          </div>
          :
          null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { detail } = state.MyPanel;
  return {
    loading: state.loading,
    detail,
  };
}

export default connect(mapStateToProps)(EmpowerApply);
