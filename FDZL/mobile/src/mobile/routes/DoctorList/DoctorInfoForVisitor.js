import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { WingBlank } from 'antd-mobile';
import styles from './DoctorInfo.less';
// import ElementAuth from '../../components/ElementAuth';

class DoctorInfoForVisitor extends React.Component {

  state = {
    modal1: false,
  };

  componentDidMount() {
    this.props.dispatch({ type: 'DoctorList/getInfo', payload: { ydataAccountId: this.props.match.params.id } });
  }


  render() {
    const { // applicantAccountStatus,consultState, ydataAccountId
      doctorPosition, userCompellation, htmlText, doctorImgUrl, doctorAdept,
      } = this.props.info;
    // const applicationStatus = 'underApplicating';
    // const applicationStatus = 'applicated';
    // const applicationStatus = 'applicatedOthers';

    return (

      <div className={styles.connent}>
        <Helmet>
          <title>医生资料</title>
          <meta name="description" content={userCompellation} />
        </Helmet>

        {!this.props.loading.effects['DoctorList/getInfo'] ?
          <div>
            <div className={styles.heading}>
              <div className={styles.circle1} />
              <div className={styles.circle2} />
              <div className={styles.circle3}>
                <img src={doctorImgUrl} alt="" />
              </div>
              {/* {curRole == 'crc'?
         (applicationStatus =='underApplicating'?
         <a className={styles.Applicationstatus1}>授权申请中</a>
         :applicationStatus =='applicated'?
         <a className={styles.Applicationstatus2}>已授权</a>
         :applicationStatus =='applicatedOthers'?
          <a className={styles.Applicationstatus3}>已授权他人</a>
         :applicationStatus ==''?
          <a className={styles.Applicationstatus4}></a>
         :'')
         :''} */}

              {/* <a className={styles.doctorInfo}>蔡三军</a>
            <a className={styles.doctorposition}>主任医师</a> */}
              {/* <p style={{ color: 'white', textAlign: 'center', marginTop: 5 }}>
            蔡三军<span style={{ marginLeft: 5 }}>主任医师</span> */}

              {/* {applicantAccountStatus == '授权申请中' &&
          <ElementAuth auth="doctorInfo">
            <p className={styles.Applicationstatus1} auth="authStatus">授权申请中</p>
          </ElementAuth>
         }
          {applicantAccountStatus == '已授权' &&
          <ElementAuth auth="doctorInfo">
            <p className={styles.Applicationstatus2} auth="authStatus">已授权</p>
          </ElementAuth>
         }
          {applicantAccountStatus == '已授权他人' &&
          <ElementAuth auth="doctorInfo">
            <p className={styles.Applicationstatus3} auth="authStatus">已授权他人</p>
          </ElementAuth>
         }
          {applicantAccountStatus == '' &&
          <ElementAuth auth="doctorInfo">
            <p className={styles.Applicationstatus4} auth="authStatus" />
          </ElementAuth>
         } */}
              <p style={{ color: 'white', textAlign: 'center', marginTop: 25 }}>
                <span style={{ fontWeight: 550, fontSize: 15 }}>{userCompellation}</span>
                <span style={{ marginLeft: 5 }}>{doctorPosition}</span>
              </p>
            </div>
            {/* <div style={{height: 15,backgroundColor:"#ececff"}}></div> */}

            <div className={styles.bdconnnet}>
              <div style={{ borderBottom: '20px solid #ececff' }}>
                <p
                  style={{ fontSize: 14,
                    textAlign: 'left',
                      // marginTop: 175,
                    paddingBottom: 5,
                    marginLeft: 15,
                    marginRight: 15,
                  }}
                >
                  <span style={{ marginRight: 10, color: 'rgb(98,207,150)' }}><i className="icon iconfont icon-shanchang" /></span>
                  <span style={{ color: '#5B646C' }}>擅长：</span><span style={{ marginLeft: 5, color: '#5B646C' }}>{doctorAdept}</span>
                </p>
              </div>
              <WingBlank>
                <div
                  className="dangerousHtml" dangerouslySetInnerHTML={{
                    __html: htmlText,
                  }}
                />
              </WingBlank>
            </div>

            {/* <div style={{ height: 45, bottom: 0, position: 'fixed', width: '100%' }}>

          {!applicantAccountStatus &&
          <ElementAuth auth="doctorInfo">
            <Button onClick={() => { this.showModal('modal1'); }}
              style={{ backgroundColor: 'rgb(98, 207, 150)', width: '100%' }} auth="Request">
              <p style={{ color: 'white', margin: '0 auto', fontSize: 15 }} >
                <i className="icon iconfont icon-author"
                style={{ color: 'white', left: -15, top: 3, position: 'relative', fontSize: 24 }} />
                向TA发起服务申请</p></Button>
          </ElementAuth>
         }
          {consultState &&
          <ElementAuth auth="doctorInfo">
            <Button onClick={() => { this.toChat(ydataAccountId); }}
               style={{ backgroundColor: 'rgb(98, 207, 150)', width: '100%' }} auth="Consultation">
              <p style={{ color: 'white', margin: '0 auto', fontSize: 15 }} >
                <i className="icon iconfont icon-zixun"
                style={{ color: 'white', left: -15, top: 3, position: 'relative', fontSize: 24 }} />
                向 TA 咨 询</p></Button>
          </ElementAuth>
         }

          <Modal
            visible={this.props.modal1}
            transparent
            maskClosable={false}
            onClose={() => { this.onClose('modal1'); }}
            title=""
            style={{ width: 220 }}
            footer={[{ text: '知道了', onPress: () => { this.onClose('modal1')(); } }]}
            wrapProps={{ onTouchStart: this.onWrapTouchStart }}
          >
            <div style={{ height: 30 }}>
            申请发送成功,请等待其授权
          </div>
          </Modal>
        </div> */}
          </div>
      :
      null
      }
      </div>

    );
  }
}

function mapStateToProps(state) {
  const { info = {}, modal1 } = state.DoctorList || {};
  return {
    loading: state.loading,
    info,
    modal1,
  };
}

export default connect(mapStateToProps)(DoctorInfoForVisitor);
