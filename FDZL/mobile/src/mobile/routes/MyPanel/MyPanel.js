import React from 'react';
import { connect } from 'dva';
import { Grid } from 'antd-mobile';
import Helmet from 'react-helmet';
import MainLayout from '../../components/MainLayout/MainLayout';
// import styles from './IndexPage.less';
import styles from './MyPanel.less';
// import { locale } from '../../../../node_modules/_moment@2.19.4@moment';

const List = [
    { title: '个人中心', href: '/MyPanel/PersonCentral', iconClass: ' iconfont icon-iconfontgerenzhongxin ', auth: ['DOCTOR', 'PATIENT', 'ASSISTANT'] },
    { title: '我的咨询', href: '/Chat/MyChat', iconClass: 'iconfont icon-duanxin', auth: ['PATIENT'] },
    { title: '我的档案', href: '/crf/pdmsApp/patient/patientDetail.html', iconClass: 'iconfont icon-hua', auth: ['PATIENT'] },
    { title: '咨询记录', href: '/Chat/MyChat', iconClass: 'iconfont icon-duanxin', auth: ['DOCTOR'] },
    { title: '我的服务', href: '/Chat/MyChat', iconClass: 'iconfont icon-aixin1', auth: ['ASSISTANT'] },
    { title: '我的病例', href: '/crf/pdmsApp/patient/patientList.html', iconClass: 'iconfont icon-dangan-copy', auth: ['DOCTOR', 'ASSISTANT'] },
    { title: '我的课题', href: '/crf/pdmsApp/patient/patientList.html', iconClass: 'iconfont icon-lingdang', auth: ['DOCTOR'] },
    // { title: '日历测试', href: '/calendar/index.html', iconClass:
    //'iconfont icon-duanxin', auth: ['DOCTOR', 'PATIENT', 'ASSISTANT'] },

];


const pageTitle = '我的';


function getAuth() {
  const authList = [];
  List.map((_val) => {
   // console.log(_val.auth.includes('pat') )
    if (_val.auth && _val.auth.includes(sessionStorage.role)) {
      authList.push(_val);
    }
    // if (_val.auth && _val.auth.includes('doc')) {
    //   authList.push(_val);
    // }
    // if (_val.auth && _val.auth.includes('crc')) {
    //   authList.push(_val);
    // }
  });
  return authList;
}

const data = Array.from(getAuth()).map(_val => ({
  text: (<p><i className={_val.iconClass} style={{ fontSize: 24, left: 28, position: 'relative', top: -25 }} />
    <span style={{ left: -9, top: 4, position: 'relative', color: 'rgb(102,122,131)', fontSize: 12 }} >{_val.title}</span></p>),
  href: _val.href,
}));

function redirect(el, index, { history }) {
  const role = sessionStorage.getItem('role');
  if (el.href == '/crf/pdmsApp/patient/patientList.html') {
    if (index == 2) {
      if (role == 'PATIENT') {
        sessionStorage.setItem('scientificFlag', '-1');
      } else {
        sessionStorage.setItem('scientificFlag', '1');
      }
    } else {
      sessionStorage.setItem('scientificFlag', '');
    }
    sessionStorage.setItem('roleFlag', 'MyPanel');
    location.href = '/crf/pdmsApp/patient/patientList.html';
  } else if (el.href == '/crf/pdmsApp/patient/patientDetail.html') {
    if (role == 'PATIENT') {
      sessionStorage.setItem('scientificFlag', '-1');
    } else {
      sessionStorage.setItem('scientificFlag', '1');
    }
    sessionStorage.setItem('roleFlag', 'MyPanel');
    location.href = '/crf/pdmsApp/patient/patientDetail.html';
  } else {
    history.push(el.href);
  }
}
class MyPanel extends React.Component {
  render() {
    const { role } = sessionStorage;
    const location = this.props.location;
    const history = this.props.history;
    const { headimgurl } = this.props.acct.wxUser || {};
    const { userCompellation } = (this.props.userInfo.datas && this.props.userInfo.datas[0]) || {};
    const { ydataAccountCompellation } = this.props.acct.ydataAccount || {};

    return (
      <MainLayout location={location}>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>
        <div >
          {/* <div className="sub-title">Always square grid item 111</div> */}
          { (role == 'PATIENT') ?
            <div className={styles.heading}>
              <div className={styles.circle1} />
              <div className={styles.circle2} />
              <div className={styles.circle3}>
                <img src={headimgurl} alt="" />
              </div>
              <p style={{ color: 'white', textAlign: 'center', marginTop: 20, fontSize: 15 }}>
                {ydataAccountCompellation}<span style={{ marginLeft: 5 }}>, 欢迎你</span>
              </p>
            </div>
          :
            <div className={styles.heading}>
              <div className={styles.circle1} />
              <div className={styles.circle2} />
              <div className={styles.circle3}>
                <img src={headimgurl} alt="" />
              </div>
              <p style={{ color: 'white', textAlign: 'center', marginTop: 20, fontSize: 15 }}>
                {userCompellation}<span style={{ marginLeft: 5 }}>, 欢迎你</span>
              </p>
            </div>
          }
          <div className={styles.gridconnet}>
            <Grid
              data={data} activeStyle={false}
              columnNum={3}
              className={styles.mine}
              onClick={(el, index) => redirect(el, index, { history })}
            />
          </div>
          <div className={styles.zzz} />
        </div>
      </MainLayout>
    );
  }
}

MyPanel.propTypes = {
};

function mapStateToProps(state) {
  const { PersonCentral = {} } = state.MyPanel || {};
  const { acct = {}, userInfo = {} } = PersonCentral;

  return {
    loading: state.loading.models.MyPanel,
    acct,
    userInfo,
  };
}

export default connect(mapStateToProps)(MyPanel);
