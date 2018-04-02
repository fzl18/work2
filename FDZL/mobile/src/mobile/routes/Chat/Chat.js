import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import { connect } from 'dva';
import { PullToRefresh, WingBlank, Switch, Toast } from 'antd-mobile';
import Helmet from 'react-helmet';
import Textarea from 'react-textarea-autosize';
import styles from './Chat.less';

const ENV = window.configs || {};
// const socket = io(`${ENV.WS_URL}`);

const pageTitle = '咨询详情';
class Chat extends React.Component {
  state = {
    data: [],
    hasConnected: false,
    typeMsg: '',
    img: '',
    refreshing: false,
    down: true,
    height: document.documentElement.clientHeight,
    initMsg: [
    ],
    leftTime: null,
    disableValue: false,
    checkstate: false,
    lastIndex: 0,
    firstHistory: true, // 第一次请求历史listmsg空的时候不提示
  }

  componentWillMount() {
    this.socket = io(`${ENV.WS_URL}`);
  }

  componentDidMount() {
    if (this.props.id == 'hotChat') {
      const { conversationId } = this.props;
      this.props.dispatch({
        type: 'Chat/getHotChat',
        payload: { conversationId },
      });
      this.socket.close();
      return;
    }

    const { role, acctId } = sessionStorage;
    const payload = {};
    if (role == 'PATIENT') {
      payload.doctorAccountId = this.props.id;
      payload.patientAccountId = acctId;
    } else if (role == 'DOCTOR') {
      payload.doctorAccountId = acctId;
      payload.patientAccountId = this.props.id;
    } else if (role == 'ASSISTANT') {
      payload.doctorAccountId = sessionStorage.doctorAccountId;
      payload.patientAccountId = sessionStorage.patientAccountId;
    }

    if (this.props.conversationId) {
      payload.conversationId = this.props.conversationId;
    }

    this.props.dispatch({ type: 'Chat/generateChat', payload });
    // const hei = this.state.height - ReactDOM.findDOMNode(this.ptr).offsetTop - 110;
    // console.log(hei);
    this.CountDown();
    this.socket.on('CHAT', (newMsg) => {
      const { data } = this.state;
      // 转医生的时候要重新获取leftTime
      if (newMsg.leftTime) {
        this.setState({
          leftTime: newMsg.leftTime,
        });
      }
      if (newMsg.msgType == 'Config') { // config 信息
        this.setState({
          checkstate: newMsg.allowUploadMedia,
        });
      } else if (newMsg.msgType == 'History') { // 历史消息
        const { msgList = [] } = newMsg;
        if (msgList.length == 0) {
          if (!this.state.firstHistory) {
            Toast.info('没有更多的历史消息了', 1.5);
          }

          return;
        }
        msgList.map((msg) => {
          data.unshift(msg);
        });
        this.setState({
          data,
          lastIndex: newMsg.lastIndex,
        }, () => {
          this.scrollPtrBottom();
        });
      } else { // 新聊天消息
        data.push(newMsg);
        this.setState({
          data,
        }, () => {
          const scrollNode = ReactDOM.findDOMNode(this.ptr);
          scrollNode.scrollTop = scrollNode.scrollHeight;
        });
      }
    });
    window.wx.ready(() => {
      // alert(location.href.split('#')[0]);

      // alert('weixinready');
          // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，
          // config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则
          // 须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    });
  }


  componentWillReceiveProps() {
    if (this.props.id == 'hotChat') {
      const { hotChat = [] } = this.props;
      this.setState({
        data: hotChat,
      });
      return;
    }
    const { hasConnected } = this.state;
    const { leftTime = null } = this.props.info;
    if (!hasConnected) {
      // if (this.props.info.conversationRoomUuid) {
      this.setState({
        hasConnected: true,
        leftTime,
      }, () => {
        this.socket.on('connect', () => {
          setTimeout(() => {
            this.socket.emit('JOIN', {
              roomUuid: this.props.info.conversationRoomUuid,
              conversationId: this.props.conversationId || this.props.info.conversationId,
              ydataAcctId: sessionStorage.acctId }, () => { // JOIN Callback
                this.pullHistory(true);
              });
          }, 300);
        });
      });
      // }
    } else {
      this.setState({
        leftTime,
      });
    }
  }

  componentWillUnmount() {
    this.socket.close();
  }

  getPatientDetail = (patientId) => {
    sessionStorage.setItem('chatUrl', window.location.href);
    sessionStorage.setItem('roleFlag', 'Chat');
    sessionStorage.setItem('patientId', patientId);
    location.href = '/crf/pdmsApp/patient/patientDetail.html';
  }

  CountDown = () => {
    const siv = setInterval(() => {
      this.setState(preState => ({
        disableValue: true,
        leftTime: preState.leftTime ? preState.leftTime - 1 : null,
      }), () => {
        if (this.state.leftTime == 0) {
          this.setState({
            disableValue: false,
          }, () => {
            clearInterval(siv);
          });
        }
      });
    }, 60000);
  }

  scrollPtrBottom = () => {
    const scrollNode = ReactDOM.findDOMNode(this.ptr);
    scrollNode.scrollTop = scrollNode.scrollHeight;
  }

  sendMessage = () => {
    const { typeMsg } = this.state;
    this.socket.emit('CHAT', {
      msg: typeMsg,
      roomUuid: this.props.info.conversationRoomUuid,
      msgType: 'Common',
      ydataAcctId: sessionStorage.acctId,
    });
    this.setState({
      typeMsg: '',
    });
  }

  callDoctor = () => {
    this.socket.emit('CHAT', {
      msg: '',
      roomUuid: this.props.info.conversationRoomUuid,
      msgType: 'CallDoctor',
      ydataAcctId: sessionStorage.acctId,
    });
  }

  typeMsg = (e) => {
    this.setState({
      typeMsg: e.target.value,
    });
  }
  Prompt=() => {
    Toast.info('医生未开通上传图片权限', 1);
  }

  sendPic = () => {
    const roomUuid = this.props.info.conversationRoomUuid;
    const _this = this;
    window.wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        window.wx.uploadImage({
          localId: localIds.toString(), // 需要上传的图片的本地ID，由choos eImage接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success(res1) {
            const serverId = res1.serverId; // 返回图片的服务器端ID
            _this.socket.emit('CHAT', {
              mediaId: serverId,
              roomUuid,
              msgType: 'Media',
              ydataAcctId: sessionStorage.acctId,
            });
            // window.wx.downloadImage({
            //   serverId, // 需要下载的图片的服务器端ID，由uploadImage接口获得
            //   isShowProgressTips: 1, // 默认为1，显示进度提示
            //   success(res2) {
            //     const localId = res2.localId; // 返回图片下载后的本地ID
            //     window.wx.getLocalImgData({
            //       localId, // 图片的localID
            //       // success(res3) {
            //       //   const localData = res3.localData; // localData是图片的base64数据，可以用img标签显示
            //       //   console.log(res3);
            //       // },
            //     });
            //   },
            // });
          },
        });
      },
    });
  }

  previewImg = (url, fullUrl) => {
    window.wx.previewImage({
      current: fullUrl, // 当前显示图片的http链接
      urls: [fullUrl], // 需要预览的图片http链接列表
    });
  }

  clickQuestion = (id) => {
    this.socket.emit('CHAT', {
      msg: id,
      roomUuid: this.props.info.conversationRoomUuid,
      msgType: 'Question',
      ydataAcctId: sessionStorage.acctId,
    });
  }

  checkSwitch = (checked) => {
    this.socket.emit('CHAT', {
      allowUploadMedia: checked,
      roomUuid: this.props.info.conversationRoomUuid,
      msgType: 'AllowUpload',
      ydataAcctId: sessionStorage.acctId,
      conversationId: this.props.conversationId || this.props.info.conversationId,
    });
  }

  scrollToBottom = () => {
    // this.textareaBottom.scrollIntoView({ behavior: 'smooth' });
      // document.body.scrollTop = document.body.scrollHeight;
  }

  pullHistory = (noToast) => {
    this.socket.emit('CHAT', {
      lastIndex: this.state.lastIndex,
      pageSize: 10,
      msg: '',
      roomUuid: this.props.info.conversationRoomUuid,
      msgType: 'History',
      ydataAcctId: sessionStorage.acctId,
      conversationId: this.props.conversationId || this.props.info.conversationId,
    }, () => {
      if (noToast) {
        this.setState({
          firstHistory: false,
        });
      }
    });
  }

  render() {
    const { data, typeMsg, img,
      leftTime, checkstate } = this.state;
    const { role, acctId } = sessionStorage;
    const { doctorCompellation,
      patientCompellation, patientHospitalizationNumber, status } = this.props.info;
    const { patientId } = this.props.infoPatient;
    const InfoDoctorImageUrl = this.props.infoDoctor.doctorImgUrl;
    const ChatdoctorPosition = this.props.infoDoctor.doctorPosition;
    const ChatDoctorAdept = this.props.infoDoctor.doctorAdept;
    const { userCompellation, doctorImgUrl, doctorAdept,
 } = this.props.doctor;
    const hotDoctorPosition = this.props.doctor.doctorPosition;
    return (
      <div className={styles.chatBox}>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
          <style type="text/css">{`
                body,#root{
                    background-color: #f2f2f2;
                }
                body{
                  overflow:hidden;
                }
          `}</style>
        </Helmet>

        {(this.props.id != 'hotChat') ?
        ((role == 'PATIENT') ?
         (<div className={styles.PatientBox} >
           <div className={styles.heading}>
             <div className={styles.circle1} />
             <div className={styles.circle2} />
             <div className={styles.circle3}>
               <img src={InfoDoctorImageUrl} alt="" />
             </div>
             <div className={styles.Patientinfo}>
               <p style={{ fontSize: 16, color: 'white', marginLeft: 30 }}><span style={{ fontWeight: 550 }}>{doctorCompellation}</span> <span>{ChatdoctorPosition}</span></p>
               <p style={{ color: 'white', marginTop: 15, marginLeft: 30 }}>擅长: <span className={styles.adept}>{ChatDoctorAdept}</span></p>
             </div>
             { (leftTime !== null && leftTime !== undefined) && (leftTime == 0 ?
               <div className={styles.Completed}>
                 <i className="icon iconfont icon-wancheng" style={{ fontSize: 55 }} />
               </div>
             :
               <div className={styles.Patienttime}>
                 <p style={{ margin: 2, color: 'white' }}>
                   <i className="icon iconfont icon-icon-test" style={{ margin: 2, color: 'white', fontSize: 13, fontWeight: '800' }} />
                   <span>{Math.floor(leftTime / 60)}</span>:<span>
                     {((leftTime % 60) < 10) ?
                      `0${leftTime % 60}`
                      : (leftTime % 60)
                       }</span>
                 </p>
               </div>)}
           </div>
         </div>)
          :
          (<div className={styles.DocBox} >
            <div className={styles.heading}>

              <div className={styles.docinfo}>
                <p style={{ fontSize: 14, color: 'rgb(220,220,220)', marginLeft: 0 }}>
                  <span style={{ fontWeight: 550, fontSize: 15 }}>提问者 :</span>
                  <span onClick={() => { this.getPatientDetail(patientId); }} style={{ color: 'rgb(81,243,196)', marginLeft: 5 }}>{patientCompellation}</span>
                  <span onClick={() => { this.getPatientDetail(patientId); }} style={{ color: 'rgb(81,243,196)' }}> ({patientHospitalizationNumber})</span></p>
                <WingBlank size="sm" ><hr className={styles.hr} /></WingBlank>
                <p style={{ fontSize: 14, color: 'rgb(220,220,220)', marginTop: 15, marginLeft: 0 }}>
                  <span style={{ fontWeight: 550, fontSize: 15 }}>咨询对象 :</span>
                  <span style={{ marginLeft: 5, fontWeight: 550, fontSize: 15 }}>
                    {doctorCompellation}</span>
                  <span style={{ marginLeft: 5 }}>{ChatdoctorPosition}</span></p>
                { this.state.leftTime != 0 ?
                (<div className={styles.switch} >
                  <Switch
                    checked={checkstate}
                    onClick={(checked) => {
                      this.checkSwitch(checked);
                    }
                    }
                  />
                </div>)
                    : ''
                   }

              </div>
              { this.state.leftTime == 0 ?
                <div className={styles.Completed}>
                  <i className="icon iconfont icon-wancheng" style={{ fontSize: 55 }} />
                </div>
             :
                <div className={styles.doctime}>
                  <p style={{ margin: 3, color: 'white' }}>
                    <i className="icon iconfont icon-icon-test" style={{ margin: 2, color: 'white', fontSize: 13, fontWeight: '800' }} />
                    <span>{Math.floor(leftTime / 60)}</span>:<span>
                      {((leftTime % 60) < 10) ?
                      `0${leftTime % 60}`
                      : (leftTime % 60)
                       }

                    </span>
                  </p>
                </div>}
            </div>
          </div>)
        )
        :
        null}

        {/* 热门资讯 */}
        {(this.props.id == 'hotChat') ?
        (<div className={styles.PatientBox} >
          <div className={styles.heading}>
            <div className={styles.circle1} />
            <div className={styles.circle2} />
            <div className={styles.circle3}>
              <img src={doctorImgUrl} alt="" />
            </div>
            <div className={styles.Patientinfo}>
              <p style={{ fontSize: 16, color: 'white', marginLeft: 45 }}><span style={{ fontWeight: 550 }}>{userCompellation}</span> <span>{hotDoctorPosition}</span></p>
              <p style={{ color: 'white', marginTop: 15, marginLeft: 45 }}>擅长: <span className={styles.adept}>{doctorAdept}</span></p>
            </div>
          </div>
        </div>)
             : null}

        <PullToRefresh
          ref={el => this.ptr = el}
          style={{
            height: this.state.height - 110 - ((this.props.id == 'hotChat' || status == 'CLOSE') ? 0 : 53),
            overflow: 'auto',
          }}
          indicator={this.state.down ? {} : { deactivate: '上拉可以刷新' }}
          direction={this.state.down ? 'down' : 'up'}
          refreshing={this.state.refreshing}
          onRefresh={() => {
            this.pullHistory();
          }}
        >
          <div className="chat_scroll" style={{ padding: '0px 5px' }}>
            {
            data.map((val, valIndex) => {
              if ((val.ydataAcctId == acctId && val.source === 'USER') || (this.props.id == 'hotChat' && (val.accType == 'ASSISTANT' || val.accType == 'DOCTOR'))) { // 我的消息及热门咨询医生医助的消息
                const isHotChat = this.props.id == 'hotChat';
                return (
                  <div key={`${val.time}${valIndex}`}>
                    {
                      val.showTime &&
                      <div className={styles.msg_system}>
                        <div className={`${styles.time}`}>
                          {val.showTime}
                        </div>
                      </div>
                    }
                    <div key={`${val.time}${valIndex}`} className={`${styles.clear} ${styles.chat_msg}`}>
                      <div className={`${styles.me} ${styles.message}`}>
                        <div className={styles.avatar}>
                          {/* 热门咨询显示头像 */}
                          {
                            val.accType == 'PATIENT' && isHotChat && <i className="icon iconfont icon-ren" />
                            }
                          {
                              val.accType == 'ASSISTANT' && isHotChat &&
                                <i className="icon iconfont icon-shouye" />
                            }
                          {
                              val.accType == 'DOCTOR' && isHotChat && <i className="icon iconfont icon-shouye" />
                            }
                          {
                          this.props.id == 'hotChat' ?
                            ''
                          :
                            <span>
                              {
                                role == 'PATIENT' && <i className="icon iconfont icon-ren" />
                              }
                              {
                                role == 'ASSISTANT' && <i className="icon iconfont icon-yishengzixun" />
                              }
                              {
                                role == 'DOCTOR' && <i className="icon iconfont icon-shouye" />
                              }
                            </span>
                        }

                        </div>
                        <div className={styles.content}>
                          {
                          this.props.id != 'hotChat' && role == 'ASSISTANT' && <h4 className={styles.nickname}>{val.ydataCompellation}</h4>
                        }
                          {
                          this.props.id != 'hotChat' && role == 'DOCTOR' && <h4 className={styles.nickname}>{val.ydataCompellation}</h4>
                        }
                          {
                          val.url ?
                            <div className={`${styles.bubble_primary} ${styles.right}`}>
                              <div className={styles.bubble_cont}>

                                {
                                    this.props.id != 'hotChat' ?
                                      <div className={styles.picture}>
                                        <img
                                          alt=""
                                          onClick={() => { this.previewImg(val.url, val.fullUrl); }}
                                          className={styles.msg_img} src={val.url}
                                        />
                                      </div>
                                    :
                                      <div className={styles.picture} style={{ backgroundColor: '#ccc', borderRadius: '4px', padding: '2px' }}>
                                        <img
                                          alt=""
                                          width="80"
                                          className={styles.msg_img} src="/images/hidePic.png"
                                        />
                                      </div>
                                  }

                              </div>
                            </div>
                          :
                            <div className={`${styles.bubble} ${isHotChat ? styles.bubble_default : styles.bubble_primary} ${styles.right}`}>
                              <div className={styles.bubble_cont}>
                                <div className={styles.plain}>
                                  <div className={styles.js_msg_plain}>
                                    {val.msg}
                                  </div>
                                </div>
                              </div>
                            </div>
                        }


                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else if ((val.ydataAcctId != acctId && val.source === 'USER') || (this.props.id == 'hotChat' && val.accType == 'PATIENT')) { // 别人的消息及热门咨询病人信息
                return (
                  <div key={`${val.time}${valIndex}`}>
                    {
                      val.showTime &&
                      <div className={styles.msg_system}>
                        <div className={`${styles.time}`}>
                          {val.showTime}
                        </div>
                      </div>
                    }
                    <div key={`${val.time}${valIndex}`} className={`${styles.clear} ${styles.chat_msg}`}>
                      <div className={`${styles.you} ${styles.message}`}>
                        <div className={styles.avatar}>
                          {
                          val.accType == 'PATIENT' && <i className="icon iconfont icon-ren" />
                          }
                          {// 医助头像，角色为病人时都用医生头像
                            val.accType == 'ASSISTANT' &&
                            (role == 'PATIENT' && this.props.id != 'hotChat' ?
                              <i className="icon iconfont icon-shouye" />
                            :
                              <i className="icon iconfont icon-yishengzixun" />
                            )
                          }
                          {
                            val.accType == 'DOCTOR' && <i className="icon iconfont icon-shouye" />
                          }
                        </div>
                        <div className={styles.content}>
                          {
                          this.props.id != 'hotChat' && role == 'ASSISTANT' && <h4 className={styles.nickname}>{val.ydataCompellation}</h4>
                        }
                          {
                          this.props.id != 'hotChat' && role == 'DOCTOR' && <h4 className={styles.nickname}>{val.ydataCompellation}</h4>
                        }

                          {
                          val.url ?
                            <div className={`${styles.bubble_default} ${styles.left}`}>
                              <div className={styles.bubble_cont}>

                                {
                                    this.props.id != 'hotChat' ?
                                      <div className={styles.picture}>
                                        <img
                                          alt=""
                                          onClick={() => { this.previewImg(val.url, val.fullUrl); }}
                                          className={styles.msg_img} src={val.url}
                                        />
                                      </div>
                                    :
                                      <div className={styles.picture} style={{ backgroundColor: '#ccc', borderRadius: '4px', padding: '2px' }}>
                                        <img
                                          alt=""
                                          width="80"
                                          className={styles.msg_img} src="/images/hidePic.png"
                                        />
                                      </div>
                                  }

                              </div>
                            </div>
                            :
                            <div className={`${styles.bubble} ${styles.bubble_default} ${styles.left}`}>
                              <div className={styles.bubble_cont}>
                                <div className={styles.plain}>
                                  <div className={styles.js_msg_plain}>
                                    {val.msg}
                                  </div>
                                </div>
                              </div>
                            </div>
                        }


                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else if (val.source === 'ROBOT') {
                const { structMsgList = [] } = val || {};
                return (
                  <div key={`${val.time}${valIndex}`} className={`${styles.clear} ${styles.chat_msg}`}>
                    {
                        val.showTime &&
                        <div className={styles.msg_system}>
                          <div className={`${styles.time}`}>
                            {val.showTime}
                          </div>

                        </div>
                  }
                    <div className={`${styles.you} ${styles.message}`}>
                      <div className={styles.avatar}>
                        <i className="icon iconfont icon-kefu" />

                      </div>
                      <div className={styles.content}>
                        <div className={`${styles.bubble} ${styles.bubble_default} ${styles.left}`}>
                          <div className={styles.bubble_cont}>
                            <div className={styles.plain}>
                              <div className={styles.js_msg_plain}>

                                {
                                  structMsgList.map((msgListObj = {}, msgListIndex) => {
                                    const { msgList = [] } = msgListObj;
                                    return (
                                      <p key={msgListIndex}>
                                        {msgList.map((robotMsg, roIndex) => {
                                          if (robotMsg.type == 'Common') {
                                            return (
                                              <span className={styles.span_pre} key={`${robotMsg.text}${roIndex}`} style={{ color: robotMsg.color }}>
                                                {robotMsg.text}</span>
                                            );
                                          } else if (robotMsg.type == 'CallDoctor') { // 转医生
                                            return (
                                              <span
                                                onClick={() => { this.callDoctor(); }}
                                                key={`${robotMsg.text}${roIndex}`}
                                                style={{ color: '#62cf96' }}
                                              >{robotMsg.text}</span>
                                            );
                                          } else if (robotMsg.type == 'Line') {
                                            return (
                                              <div
                                                key={`${robotMsg.text}${roIndex}`}
                                                style={{ border: '0.5px solid #bfbfbf', margin: '5px 0px' }}
                                              />
                                            );
                                          } else if (robotMsg.type == 'Question') { // 点击问题
                                            return (
                                              <span
                                                onClick={() => {
                                                  this.clickQuestion(robotMsg.remark);
                                                }}
                                                key={`${robotMsg.text}${roIndex}`}
                                                style={{ color: '#62cf96' }}
                                              >{robotMsg.text}</span>
                                            );
                                          }
                                        })}

                                      </p>
                                    );
                                  })
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else if (val.source == 'SYSTEM') {
                return (
                  <div key={`${val.time}${valIndex}`}>
                    {
                      val.showTime &&
                      <div className={styles.msg_system}>
                        <div className={`${styles.time}`}>
                          {val.showTime}
                        </div>
                      </div>
                    }
                    {
                      val.msg &&
                      <div className={styles.msg_system}>
                        <div className={`${styles.content}`}>
                          {val.msg}
                        </div>
                      </div>
                    }
                  </div>
                );
              }
            })
        }
          </div>
        </PullToRefresh>
        {
          (leftTime || this.props.info.conversationType == 'ROBOT') &&
          <div className={styles.chats_bar}>
            <div className={styles.upload_btn}>
              {
              role == 'PATIENT' ?
              (
                checkstate ?
                  <i className="icon iconfont icon-tupian1" onClick={this.sendPic} style={{ fontSize: '30px' }} />
                :
                  <i className="icon iconfont icon-tupian1" onClick={this.Prompt} style={{ fontSize: '30px', color: '#a0a0a0' }} />
              )
              :
                  <i className="icon iconfont icon-tupian1" onClick={this.sendPic} style={{ fontSize: '30px' }} />
            }


            </div>
            <Textarea
              className={styles.text_input} placeholder="请描述病情..."
              value={typeMsg}
              onChange={this.typeMsg}
              onFocus={this.scrollToBottom}
              ref={el => this.textareaBottom = el}
            />
            <button className={styles.send_btn} onClick={this.sendMessage}>发送</button>
          </div>
        }


      </div>

    );
  }
}
function mapStateToProps(state) {
  const { info = {}, hotChat = {}, infoDoctor = {}, infoPatient = {} } = state.Chat || {};
  const { detailList = [], doctor = {} } = hotChat;
  return {
    loading: state.loading.models.Chat,
    info,
    hotChat: detailList.reverse(),
    doctor,
    infoDoctor,
    infoPatient,
  };
}

export default connect(mapStateToProps)(Chat);
