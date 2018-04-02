import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { List, Picker, Toast, DatePicker } from 'antd-mobile';
import moment from 'moment';
import { withRouter } from 'react-router';
import styles from './PersonalInfo.less';

const pageTitle = '基本信息';
const Item = List.Item;
const GCPType = [
  [
    {
      label: '是',
      value: 'ACTIVE',
    },
    {
      label: '否',
      value: 'NOTACTIVE',
    },
  ],
];

class EssentialiInformation extends React.Component {
  state = {
    GCPValue: '',
    info: {},
    chooseworkBeginDate: 'YYYY-MM-DD',
    chooseGCPtime: 'YYYY-MM-DD',
  }

  componentDidMount() {
    this.setState({
      info: this.props.AssistantBaisInfo,
    });
    const workBeginTime = this.props.AssistantBaisInfo.workBeginTime;
    let chooseworkBeginDate = '';
    chooseworkBeginDate = workBeginTime && moment(workBeginTime).format('YYYY-MM-DD');
    this.setState({
      chooseworkBeginDate,
    });
    const gcpTime = this.props.AssistantBaisInfo.gcpTime;
    let chooseGCPtime = '';
    chooseGCPtime = gcpTime && moment(gcpTime).format('YYYY-MM-DD');
    this.setState({
      chooseGCPtime,
    });
  }
  componentWillReceiveProps() {
    this.setState({
      info: this.props.AssistantBaisInfo,
    });
    const workBeginTime = this.props.AssistantBaisInfo.workBeginTime;
    let chooseworkBeginDate = '';
    chooseworkBeginDate = workBeginTime && moment(workBeginTime).format('YYYY-MM-DD');
    this.setState({
      chooseworkBeginDate,
    });
    const gcpTime = this.props.AssistantBaisInfo.gcpTime;
    let chooseGCPtime = '';
    chooseGCPtime = gcpTime && moment(gcpTime).format('YYYY-MM-DD');
    this.setState({
      chooseGCPtime,
    });
  }
  onStateChange = (e, key) => {
    this.setState({
      [key]: e,
    });
  }
  GCPchange= (v, key) => {
    this.setState({ [key]: v });
    console.log(v);
    const isGcp = v && v.toString();
    const workBeginTimeValue = this.state.info.workBeginTime;
    const gcpTimeValue = this.state.info.gcpTime;
    const { subject } = this.state.info || {};
    const workBeginTime = workBeginTimeValue && moment(workBeginTimeValue).format('YYYY-MM-DD');
    const gcpTime = gcpTimeValue && moment(gcpTimeValue).format('YYYY-MM-DD');
    this.props.dispatch({ type: 'PersonalInfo/modifyAssistantInfo',
      payload: {
        isGcp, subject, workBeginTime, gcpTime,
      },
      callback: (response) => {
        Toast.info(response.success, 1, () => {}, false);
        const { acctId } = sessionStorage;
        const userId = acctId;
        this.props.dispatch({ type: 'PersonalInfo/AssistantBaisInfo',
          payload: { userId } });
      },
    });
  }
  changeworkBeginDate=(date) => {
    let chooseworkBeginDate = '';
    this.setState({
      date,
    });
    chooseworkBeginDate = date && moment(date).format('YYYY-MM-DD');
    this.setState({
      chooseworkBeginDate,
    });
    const { subject, isGcp } = this.state.info || {};
    const workBeginTime = chooseworkBeginDate;
    const gcpTimeValue = this.state.info.gcpTime;
    const gcpTime = gcpTimeValue && moment(gcpTimeValue).format('YYYY-MM-DD');
    this.props.dispatch({ type: 'PersonalInfo/modifyAssistantInfo',
      payload: {
        isGcp, subject, workBeginTime, gcpTime,
      },
      callback: (response) => {
        Toast.info(response.success, 1, () => {}, false);
        const { acctId } = sessionStorage;
        const userId = acctId;
        this.props.dispatch({ type: 'PersonalInfo/AssistantBaisInfo',
          payload: { userId } });
      },
    });
  }
  changeGCPtime=(date) => {
    let chooseGCPtime = '';
    this.setState({
      date,
    });
    chooseGCPtime = date && moment(date).format('YYYY-MM-DD');
    this.setState({
      chooseGCPtime,
    });
    const { subject, isGcp } = this.state.info || {};
    const gcpTime = chooseGCPtime;
    const workBeginTimeValue = this.state.info.workBeginTime;
    const workBeginTime = workBeginTimeValue && moment(workBeginTimeValue).format('YYYY-MM-DD');
    this.props.dispatch({ type: 'PersonalInfo/modifyAssistantInfo',
      payload: {
        isGcp, subject, workBeginTime, gcpTime,
      },
      callback: (response) => {
        Toast.info(response.success, 1, () => {}, false);
        const { acctId } = sessionStorage;
        const userId = acctId;
        this.props.dispatch({ type: 'PersonalInfo/AssistantBaisInfo',
          payload: { userId } });
      },
    });
  }
  IphoneNumber=() => {
    this.props.history.push('/ReviseIphoneNumber');
  }

  subject=() => {
    this.props.history.push('/Subject');
  }
  render() {
    const { role } = sessionStorage;
    const { departmentName,
      hospitalName, position,
       department, enterpriseName,
       doctorPosition, skilfulIllness,
        ydataAccountCompellation, ydataAccountUserMobile,
      certificate, positiveSide,
    reverseSide } = this.props.success;
    const { education, subject,
       workCityName, isGcp } = this.props.AssistantBaisInfo;
    const AccountCompellation = this.props.AssistantBaisInfo.ydataAccountCompellation;
    const NowenterpriseName = this.props.AssistantBaisInfo.enterpriseName;
    const Assistantposition = this.props.AssistantBaisInfo.position;
    const AccountUserMobile = this.props.AssistantBaisInfo.ydataAccountUserMobile;

    // let UserMobile = '';
    // UserMobile =
    // AccountUserMobile && AccountUserMobile.replace('(?<=[\\d]{3})\\d(?=[\\d]{4})', '*');
    // console.log(UserMobile);

    let GCP = '';
    if (isGcp == 'ACTIVE') {
      GCP = '是';
    } else if ((isGcp == null) || (isGcp == '')) {
      GCP = '否';
    }
    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>
        <div className={styles.EssentialiInformationHead}>
          <List className="my-list" >
            { (role == 'NOTDOCTOR') ?
              <div>
                <Item extra={ydataAccountCompellation}>
            姓名</Item>
                <Item extra={enterpriseName}>
            所在单位</Item>
                <Item extra={department}>
            所在部门</Item>
                <Item extra={position}>
            职位</Item>
              </div>
            :
            null
            }
            { (role == 'DOCTOR') ?
              <div>
                <Item extra={ydataAccountCompellation}>
            姓名</Item>
                <Item extra={hospitalName}>
            所在医院</Item>
                <Item extra={departmentName}>
            所在科室</Item>
                <Item extra={doctorPosition}>
            医生职称</Item>
                <Item extra={skilfulIllness}>
            擅长疾病</Item>
              </div>
            :
            null
            }
            { (role == 'INSIDE_ASSISTANT') ?
              <div>
                <Item extra={AccountCompellation}>
            姓名</Item>
                <Item extra={AccountUserMobile}>
                  {/* <Item extra={UserMobile}> */}
            手机号码</Item>
                <Item extra="暂无待提供" >
           出生日期</Item>
                <Item extra={education}>
            学历</Item>
                <Item extra={subject} arrow="horizontal" onClick={this.subject}>
            专业</Item>
                <Item extra={NowenterpriseName} >
            目前工作单位</Item>
                <Item extra={Assistantposition}>
            职位</Item>
                <Item extra={workCityName}>
            工作城市</Item>
                <DatePicker
                  mode="date"
                  className={styles.Choose}
                  title="从事临床研究起始时间"
                  extra={this.state.chooseworkBeginDate}
                  onChange={this.changeworkBeginDate}
                >
                  <List.Item arrow="horizontal" >从事临床研究起始时间</List.Item>
                </DatePicker>
                <Picker
                  data={GCPType}
                  title="有无GCP培训"
                  cascade={false}
                  className={styles.Choose}
                  extra={GCP}
                  cols={1}
                  value={this.state.GCPValue}
                  onChange={e => this.onStateChange(e, 'GCPValue')}
                  onOk={v => this.GCPchange(v, 'GCPValue')}
                  onDismiss={e => console.log('dismiss', e)}
                >
                  <List.Item arrow="horizontal">有无GCP培训</List.Item>
                </Picker>
                <DatePicker
                  mode="date"
                  className={styles.Choose}
                  title="GCP培训时间"
                  extra={this.state.chooseGCPtime}
                  onChange={this.changeGCPtime}
                >
                  <List.Item arrow="horizontal" >GCP培训时间</List.Item>
                </DatePicker>
              </div>
            :
            null
            }

          </List>
        </div>
        { (role == 'NOTDOCTOR') ?
          <div className={styles.Certificates}>
            <p>相关证件<span style={{ color: 'rgb(201,201,201)', marginLeft: 5 }}>(身份证)</span></p>

            <div className={styles.Certificates1}>
              <div className={styles.CertificatesPic1}>
                <img src={positiveSide} alt="" className={styles.CertificatesImg} />
              </div>
              <p style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginTop: 15 }}>身份证的头像面</p></div>
            <div className={styles.Certificates2}>
              <div className={styles.CertificatesPic2}>
                <img src={reverseSide} alt="" className={styles.CertificatesImg} />
              </div>
              <p style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginTop: 15 }}>身份证的国徽面</p>
            </div>
          </div>
          :
          null
           }
        { (role == 'DOCTOR') ?
          <div className={styles.Certificates}>
            <p>相关证件<span style={{ color: 'rgb(201,201,201)' }}>( 医师资格证 )</span></p>

            <div className={styles.Certificates1}>
              <div className={styles.CertificatesPic3}>
                <img src={certificate} alt="" className={styles.CertificatesImgDoctor} />
              </div>
            </div>
          </div>
          : null}
        { (role == 'NOTDOCTOR' || role == 'DOCTOR') ?
          <div className={styles.IphoneNumber}>
            <Item
              arrow="horizontal"
              onClick={this.IphoneNumber}
              extra={ydataAccountUserMobile}
            >
            手机号</Item>
          </div>
          :
        null}

      </div>

    );
  }

}

function mapStateToProps(state) {
  const { BaisInfo = {}, AssistantBaisInfo = {} } = state.PersonalInfo || {};
  const { success = {} } = BaisInfo;
  return {
    loading: state.loading,
    BaisInfo,
    success,
    AssistantBaisInfo,
  };
}

export default connect(mapStateToProps)(withRouter(EssentialiInformation));
