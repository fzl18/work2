import React from 'react';
import { WhiteSpace, WingBlank } from 'antd-mobile';
import { connect } from 'dva';
import { Link, withRouter } from 'dva/router';
import Helmet from 'react-helmet';
import styles from './DopaSpace.less';
import MainLayout from '../../components/MainLayout/MainLayout';
import LogoTopBar from '../../components/MainLayout/LogoTopBar';

class DopaSpace extends React.Component {

  getPatientInfo = () => {
    // const role = sessionStorage.getItem('role');
    // if (role != 'PATIENT') {
    //   sessionStorage.setItem('scientificFlag', '1');
    //   sessionStorage.setItem('roleFlag', 'DopaSpace');
    //   location.href = '/crf/pdmsApp/patient/patientList.html';
    // } else {
    //   sessionStorage.setItem('scientificFlag', '-1');
    //   sessionStorage.setItem('roleFlag', 'DopaSpace');
    //   location.href = '/crf/pdmsApp/patient/patientDetail.html';
    // }
    location.href = '/calendar/index.html';
  }

  getScientific = () => {
    sessionStorage.setItem('scientificFlag', '');
    location.href = '/crf/pdmsApp/patient/patientList.html?params=';
  }

  clickInvList = () => {
    this.props.dispatch({ type: 'InvSubject/clearSearch', payload: {} });
    this.props.history.push('/InvSubject/InvSubjectList');
  }

  render() {
    return (

      <MainLayout location={location}>
        <Helmet>
          <title>医患空间</title>
          <meta name="description" content="医患空间" />
          <style type="text/css">{`
              #root {
                  background-color: #dceaf0;
              }
          `}</style>
        </Helmet>
        <LogoTopBar />
        <div className={styles.DopaSpace}>
          <WingBlank size="lg">
            <WhiteSpace size="lg" />
            {/* <Link to="/"> */}
            <a onClick={this.clickInvList}>
              <div className={`${styles.inv_box} clearPrefix`} style={{ borderRight: '5px solid #abeafd' }}>
                <div className={styles.inv_box_wrapper}>
                  <div className={styles.box_img_wrap}>
                    <img alt="" src="./images/docSpace.jpg" className={styles.box_img} />
                  </div>
                  <div className={styles.box_info}>
                    <div className={styles.box_title}>
                      <i className="icon iconfont icon-zongxiangketi" />
                      <span className={styles.model_name}>研究课题</span>
                    </div>
                    {/* <div className={styles.box_list}>
                      <ul>
                        <li><i className={styles.circle} />肠梗阻的治疗与预防有哪些...</li>
                        <li><i className={styles.circle} />肠梗阻的治疗与预防有哪些...</li>
                        <li><i className={styles.circle} />肠梗阻的治疗与预防有哪些...</li>
                      </ul>
                    </div> */}
                  </div>
                </div>
              </div>
            </a>
            {/* </Link> */}
            <WhiteSpace size="lg" />
            <a onClick={this.getScientific}>
              <div className={`${styles.inv_box} clearPrefix`} style={{ borderRight: '5px solid #9dc3ef' }}>
                <div className={styles.inv_box_wrapper}>
                  <div className={styles.box_img_wrap}>
                    <img alt="" src="./images/invLib.jpg" className={styles.box_img} />
                  </div>
                  <div className={styles.box_info}>
                    <div className={styles.box_title}>
                      <i className="icon iconfont icon-iconfontkeyan1" style={{ color: '#9dc3ef' }} />
                      <span className={styles.model_name}>科研库</span>
                    </div>
                    {/* <div className={styles.box_list} style={{ color: '#9dc3ef' }}>
                    医生进入科研库后,展示该医生可见的科研类型库
                    </div> */}
                  </div>
                </div>
              </div>
            </a>
            <WhiteSpace size="lg" />
            {/* <Link to="/"> */}
            <a onClick={this.getPatientInfo}>
              <div className={`${styles.inv_box} clearPrefix`} style={{ borderRight: '5px solid #b6b5f3' }}>
                <div className={styles.inv_box_wrapper}>
                  <div className={styles.box_img_wrap}>
                    <img alt="" src="./images/crf.jpg" className={styles.box_img} />
                  </div>
                  <div className={styles.box_info}>
                    <div className={styles.box_title}>
                      <i className="icon iconfont icon-suifang" style={{ color: '#b6b5f3' }} />
                      <span className={styles.model_name}>随 访</span>
                    </div>
                    {/* <div className={styles.box_list} style={{ color: '#b6b5f3' }}>
                    系统会按时推送病人的随访提醒
                </div> */}
                  </div>
                </div>
              </div>
            </a>
            {/* </Link> */}
            <WhiteSpace size="lg" />
            <Link to="/Chat/DoctorList">
              <div className={`${styles.inv_box} clearPrefix`} style={{ borderRight: '5px solid #a0e0ca' }}>
                <div className={styles.inv_box_wrapper}>
                  <div className={styles.box_img_wrap}>
                    <img alt="" src="./images/chat.jpg" className={styles.box_img} />
                  </div>
                  <div className={styles.box_info}>
                    <div className={styles.box_title}>
                      <i className="icon iconfont icon-zixun2" style={{ color: '#a0e0ca' }} />
                      <span className={styles.model_name}>在线咨询</span>
                    </div>
                    {/* <div className={styles.box_list} style={{ color: '#a0e0ca' }}>
                      人机随时在线解答您的疑惑
                  </div> */}
                  </div>
                </div>
              </div>
            </Link>
          </WingBlank>
        </div>
      </MainLayout>


    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.DopaSpace,
  };
}

export default connect(mapStateToProps)(withRouter(DopaSpace));
