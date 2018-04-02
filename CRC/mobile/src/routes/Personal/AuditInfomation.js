import React from 'react';
// import { Tabs } from 'antd-mobile';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { List, Button, InputItem, Picker, Modal, ImagePicker, Toast
, TextareaItem, Radio } from 'antd-mobile';
import { withRouter } from 'react-router';
import styles from './PersonalInfo.less';
import { convertBase64UrlToBlob } from '../../utils/jsLibs';

const pageTitle = '认证信息';
// const data = [];
// const positiveSidedata = [];
// const reverseSidedata = [];
const alert = Modal.alert;
const RadioItem = Radio.RadioItem;
// const prompt = Modal.prompt;
// const Item = List.Item;
const DoctorPosition = [
  [
    {
      label: '主任医师',
      value: '主任医师',
    },
    {
      label: '副主任医师',
      value: '副主任医师',
    },
    {
      label: '主治医师',
      value: '主治医师',
    },
    {
      label: '住院医师',
      value: '住院医师',
    },
  ],
];

class AuditInfomation extends React.Component {
  state = {
    // role: 'doctor',
    // selectedIndex: 1,
    // userCompellation: '',
    hospitalName: '',
    // hospitalIdValue: '',
    departmentLocalName: '',
    // doctorPositionValue: '',
    skilfulIllness: '',
    certificate: '',
    files: [],
    // positiveSideValue: positiveSidedata,
    // reverseSide: reverseSidedata,
    check: 'false',
    disabled: true,
    // data: [],
    cols: 1,
    pickerValue: [],
    asyncValue: [],
    sValue: '',
    sValue2: '',
    sValue3: '',
    visible: false,
    departmentType: [],
    departmentClicked: true,
    info: {},
    reverseSideValue: [],
    positiveSideValue: [],
    hospitalValue: '',
    hospitalDepNameValue: '',
    showHospital: true,
    departmentIdValue: '',
  }
  componentDidMount() {
    if (!sessionStorage.acctId) {
      return;
    }
    this.props.dispatch({ type: 'Register/NowAuditStatus',
      payload: {},
      callback: (response) => {
        if ((response.success && response.success.auditStatus == 'audit_pending')) {
          alert('', '您的认证信息已经成功提交，我们将在3个工作日内完成审核，请耐心等待！',
            [{ text: '好的',
              onPress: () => {
                this.props.history.push('/PersonalInfo');
              } },
            ]);
        }
      },
    });
    this.props.dispatch({ type: 'PersonalInfo/AuditInfomation',
      payload: { },
      callback: (response = {}) => {
        this.setState({
          files: [{
            url: response.success && response.success.certificateUrl,
            id: response.success && response.success.certificate,
          }],
        });
        this.setState({
          positiveSideValue: [{
            url: response.success && response.success.positiveSideUrl,
            id: response.success && response.success.positiveSide,
          }],
          reverseSideValue: [{
            url: response.success && response.success.reverseSideUrl,
            id: response.success && response.success.reverseSide,
          }],
        });
      },
    });
    this.setState({
      info: this.props.AuditInfo.success,
    });
  }
  componentWillReceiveProps(nextProps = {}) {
    const newDepartmentType = [];
    const { DepHospitalEnterpriseType = [] } = nextProps;
    DepHospitalEnterpriseType.map((value) => {
      newDepartmentType.push({
        value: value.hospitalDepartmentId,
        label: value.departmentLocalName,
      });
    });
    this.setState({
      departmentType: newDepartmentType,
    });
    this.setState({
      info: this.props.AuditInfo.success,
    });
  }

  onPicChange = (files, type, index) => {
    console.log(files, type, index);
    this.setState({
      files,
    });
  }
  onPositiveSidedataPicChange = (files, type, index) => {
    console.log(files, type, index);
    this.setState({
      positiveSideValue: files,
    });
  }
  onReverseSidePicChange = (files, type, index) => {
    console.log(files, type, index);
    this.setState({
      reverseSide: files,
    });
  }


  onStateChange = (e, key) => {
    const { info } = this.state;
    info[key] = e;
    this.setState({
      info,
    });
  }

  onPositiveSidedataPicChange = (files, type) => {
    if (type == 'remove') {
      this.setState({
        files,
      });
      return;
    }
    const image64 = files[0] && files[0].url;
    // const imageName = files[0] && files[0].file && files[0].file.name;
    const imageSize = files[0] && files[0].file && files[0].file.size;
    if (imageSize > 20 * 1024 * 1024) {
      Toast.info('图片不能超过20M', 1);
      return;
    }

    const form = new FormData();
    form.append('files', convertBase64UrlToBlob(image64));
    form.append('acctId', sessionStorage.acctId);
    Toast.loading('上传中...', 0);
    this.props.dispatch({
      type: 'Register/uploadImg',
      payload: {
        form,
        noqs: true,
      },
      callback: (response) => {
        if (!response.error) {
          Toast.hide();
          this.setState({
            files: [{
              url: response.data && response.data[0] && response.data[0].url,
              id: response.data && response.data[0] && response.data[0].fileName,
            }],
          });
          console.log(files && files[0].url);
        }
      },
    });
  }
  onLeftPicChange = (positiveSideValue, type) => {
    if (type == 'remove') {
      this.setState({
        positiveSideValue,
      });
      return;
    }
    const image64 = positiveSideValue[0] && positiveSideValue[0].url;
    // const imageName = files[0] && files[0].file && files[0].file.name;
    const imageSize = positiveSideValue[0] &&
    positiveSideValue[0].positiveSideValue && positiveSideValue[0].positiveSideValue.size;
    if (imageSize > 20 * 1024 * 1024) {
      Toast.info('图片不能超过20M', 1);
      return;
    }

    const form = new FormData();
    form.append('positiveSideValue', convertBase64UrlToBlob(image64));
    form.append('acctId', sessionStorage.acctId);
    Toast.loading('上传中...', 0);
    this.props.dispatch({
      type: 'Register/uploadImg',
      payload: {
        form,
        noqs: true,
      },
      callback: (response) => {
        if (!response.error) {
          Toast.hide();
          this.setState({
            positiveSideValue: [{
              url: response.data && response.data[0] && response.data[0].url,
              id: response.data && response.data[0] && response.data[0].fileName,
            }],
          });
          console.log(positiveSideValue);
        }
      },
    });
  }
  onRightPicChange = (reverseSideValue, type) => {
    if (type == 'remove') {
      this.setState({
        reverseSideValue,
      });
      return;
    }
    const image64 = reverseSideValue[0] && reverseSideValue[0].url;
    // const imageName = files[0] && files[0].file && files[0].file.name;
    const imageSize = reverseSideValue[0] &&
     reverseSideValue[0].reverseSideValue && reverseSideValue[0].reverseSideValue.size;
    if (imageSize > 20 * 1024 * 1024) {
      Toast.info('图片不能超过20M', 1);
      return;
    }

    const form = new FormData();
    form.append('reverseSideValues', convertBase64UrlToBlob(image64));
    form.append('acctId', sessionStorage.acctId);
    Toast.loading('上传中...', 0);
    this.props.dispatch({
      type: 'Register/uploadImg',
      payload: {
        form,
        noqs: true,
      },
      callback: (response) => {
        if (!response.error) {
          Toast.hide();
          this.setState({
            reverseSideValue: [{
              url: response.data && response.data[0] && response.data[0].url,
              id: response.data && response.data[0] && response.data[0].fileName,
            }],
          });
        }
      },
    });
  }
  onhospitalNameChange = (e, key) => {
    const { info } = this.state;
    info[key] = e;
    this.setState({
      info,
    });
    this.setState({
      hospitalValue: e,
      showHospital: true,
    });
    if (e == '') {
      this.setState({
        showHospital: false,
      });
      return;
    }
    this.props.dispatch({
      type: 'Register/queryhospitalName',
      payload: {
        hospitalName: e,
      },
    });
  }

  onhospitalDepNameChange = (e, key) => {
    const { info } = this.state;
    info[key] = e;
    this.setState({
      info,
    });
    this.setState({
      hospitalDepNameValue: e,
      showHospital: true,
    });
    if (e == '') {
      this.setState({
        showHospital: false,
      });
      return;
    }
    this.props.dispatch({
      type: 'Register/queryhospitalDepName',
      payload: {
        hospitalDepName: e,
      },
    });
  }
  onChangeTitle = (hospitalName, hospitalId, e) => {
    const { info } = this.state;
    info.hospitalName = hospitalName;
    info.hospitalId = hospitalId;
    e.stopPropagation();
    this.props.dispatch({
      type: 'Register/savehospitalName',
      payload: {
        data: [],
      },
    });
    this.setState({
      info,
      // hospitalValue: hospitalName,
      // hospitalIdValue: hospitalId,
    });

    console.log(hospitalId);
    // this.props.dispatch({
    //   type: 'Register/keepOrderFormFields',
    //   payload: {
    //     data: {
    //       hospitalName: { value },
    //     },
    //   },
    // });
  }
  onChangeTitle2 = (departmentLocalName, hospitalDepartmentId, e) => {
    const { info } = this.state;
    info.departmentName = departmentLocalName;
    info.hospitalDepartmentId = hospitalDepartmentId;
    e.stopPropagation();
    this.props.dispatch({
      type: 'Register/savehospitalDepName',
      payload: {
        data: [],
      },
    });
    this.setState({
      info,
      // hospitalDepNameValue: departmentLocalName,
      // departmentIdValue: hospitalDepartmentId,
    });

    console.log(departmentLocalName);
    // this.props.dispatch({
    //   type: 'Register/keepOrderFormFields',
    //   payload: {
    //     data: {
    //       hospitalName: { value },
    //     },
    //   },
    // });
  }

  hospitalNameBlur = (e) => {
    console.log(e);
    setTimeout(() => {
      this.props.dispatch({
        type: 'Register/savehospitalName',
        payload: {
          data: [],
        },
      });
    }, 200);
  }
  hospitalDepNameBlur = (e) => {
    console.log(e);
    setTimeout(() => {
      this.props.dispatch({
        type: 'Register/savehospitalDepName',
        payload: {
          data: [],
        },
      });
    }, 200);
  }
  Submission=() => {
    const {
    ydataAccountCompellation,
    // hospitalIdValue,
    // departmentLocalName,
    // doctorPositionValue,
    skilfulIllness,
    // hospitalDepartmentIdValue,
    enterpriseName,
    department,
    position,
    // hospitalId,
    // hospitalDepartmentId,
    // files,
    // positiveSideValue,
   } = this.state.info || {};
    const { files,
     positiveSideValue,
     reverseSideValue,
      } = this.state;
    const { role } = sessionStorage;
    // if (userCompellation == '' || (userCompellation && userCompellation.trim() == '')) {
    //   Toast.info('请输入姓名');
    //   return;
    // }
    if (role == 'DOCTOR') {
      // const doctorPosition = doctorPositionValue && doctorPositionValue.toString();
      // const hospitalId = hospitalIdValue && hospitalIdValue.toString();
     // const hospitalDepartmentId =
      // hospitalDepartmentIdValue && hospitalDepartmentIdValue.toString();
      // const { hospitalIdValue, departmentIdValue } = this.state;
      const { hospitalId, hospitalDepartmentId, doctorPosition } = this.state.info || {};
      const certificate = files && files[0].id;
      console.log(certificate);
      const userCompellation = ydataAccountCompellation;
      // if ((hospitalIdValue == '')) {
      //   Toast.info('请选择所在医院');
      //   return;
      // }
      // if ((hospitalDepartmentId == '')) {
      //   Toast.info('请选择所在科室');
      //   return;
      // }
      // if ((doctorPositionValue == '')) {
      //   Toast.info('请选择医生职称');
      //   return;
      // }
      // if ((skilfulIllness == '' || (skilfulIllness && skilfulIllness.trim() == ''))) {
      //   Toast.info('请输入擅长疾病');
      //   return;
      // }

      this.props.dispatch({ type: 'Register/register',
        payload: {
          // ydataAccountCompellation,
          userCompellation,
          hospitalId,
          hospitalDepartmentId,
        // departmentLocalName,
          certificate,
          doctorPosition,
          skilfulIllness,
        },
        callback: () => {
          alert('', '您的认证信息已经成功提交，我们将在3个工作日内完成审核，请耐心等待！',
            [{ text: '好的',
              onPress: () => {
                this.props.history.push('/PersonalInfo');
              } },
            ]);
        },
      });
    }
    if (role == 'NOTDOCTOR') {
      // const positiveSide = positiveSideValue.toString();
      // if ((enterpriseName == '')) {
      //   Toast.info('请输入所在单位');
      //   return;
      // }
      // if ((department == '')) {
      //   Toast.info('请输入所在部门');
      //   return;
      // }
      // if ((position == '')) {
      //   Toast.info('请输入职位');
      //   return;
      // }
      const userCompellation = ydataAccountCompellation;
      const positiveSide = positiveSideValue && positiveSideValue[0].id;
      const reverseSide = reverseSideValue && reverseSideValue[0].id;
      this.props.dispatch({ type: 'Register/nonDoctorRegister',
        payload: {
          // ydataAccountCompellation,
          userCompellation,
          enterpriseName,
          department,
          positiveSide,
          reverseSide,
          position,

        },
        callback: () => {
          alert('', '您的认证信息已经成功提交，我们将在3个工作日内完成审核，请耐心等待！',
            [{ text: '好的',
              onPress: () => {
                this.props.history.push('/PersonalInfo');
              } },
            ]);
        },
      });
    }
  }
  hospital=(v) => {
    this.setState({ sValue2: v, departmentClicked: false });
    const hospitalId = v.toString();
    this.props.dispatch({ type: 'PersonalInfo/queryDepHospitalEnterpriseType',
      payload: { hospitalId } });

    // this.props.DepHospitalEnterpriseType.map((value) => {
    //   departmentType.push({
    //     value: value.hospitalDepartmentId,
    //     label: value.departmentLocalName,
    //   });
    // });
  }

  render() {
    const {
           files,
         // departmentType,
          positiveSideValue,
         reverseSideValue,
          // departmentClicked
          showHospital,
        } = this.state;
    const hospitalType = [
    ];
    const { role } = sessionStorage;
    this.props.listhospitalType.map((value) => {
      hospitalType.push({
        value: value.hospitalId,
        label: value.hospitalName,
      });
    });
    const { ydataAccountCompellation,
       skilfulIllness,
       // hospitalName,
       // departmentName,
        // doctorPosition,
       enterpriseName, department,
        position,
        hospitalName,
        // departmentLocalName,
        departmentName,
        doctorPosition,
        // positiveSide,
        // positiveSideUrl,
        // reverseSide,
        // reverseSideUrl,
      } = this.state.info || {};

    const { hospitalNameArray = [] } = this.props;
    const { hospitalDepNameArray = [] } = this.props;
    // const files = [
    // ];
    // this.state.info.map((value) => {
    //   files.push({
    //     url: value.certificateUrl,
    //     id: value.certificate,
    //   });
    // });


    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>
        <div>
          <div className={styles.Auditbody}>
            {(role == 'DOCTOR') ?
              <div>
                <InputItem
                  clear
                  value={ydataAccountCompellation}
                  placeholder=""
                  maxLength="6"
                  onChange={e => this.onStateChange(e, 'ydataAccountCompellation')}
                >姓名</InputItem>
                <TextareaItem
                  title="所在医院"
                  autoHeight
                  placeholder={hospitalName}
                  clear={false}
                  labelNumber={8}
                  onBlur={() => {
                    this.hospitalNameBlur();
                  }}
                  onChange={(e) => {
                    this.onhospitalNameChange(e, 'hospitalName');
                  }}
                  value={hospitalName}
                />
                <List>
                  {showHospital && hospitalNameArray.map(i => (
                    <RadioItem
                      key={i.value}
                      onChange={(e) => { this.onChangeTitle(i.hospitalName, i.hospitalId, e); }}
                    >
                      {i.hospitalName}
                    </RadioItem>
                    ))}
                </List>
                <TextareaItem
                  title="所在科室"
                  autoHeight
                  placeholder={departmentName}
                  clear={false}
                  labelNumber={8}
                  onBlur={() => {
                    this.hospitalDepNameBlur();
                  }}
                  onChange={(e) => {
                    this.onhospitalDepNameChange(e, 'departmentName');
                  }}
                  value={departmentName}
                />
                <List>
                  {showHospital && hospitalDepNameArray.map(i => (
                    <RadioItem
                      key={i.value}
                      onChange={(e) => {
                        this.onChangeTitle2(i.departmentLocalName, i.hospitalDepartmentId, e);
                      }}
                    >
                      {i.departmentLocalName}
                    </RadioItem>
                    ))}
                </List>
                {/* <Picker
                  data={hospitalType}
                  cols={1}
                  title="所在医院"
              // cascade={false}
                  className={styles.Choose}
                  extra={hospitalName}
                  value={this.state.sValue2}
                  onChange={e => this.onStateChange(e, 'hospitalIdValue')}
                  onOk={this.hospital}
                  onDismiss={() => this.setState({ visible: false })}
                >
                  <List.Item arrow="horizontal">所在医院</List.Item>
                </Picker> */}
                {/* <Picker
                  data={departmentType}
                  cols={1}
                  title="所在科室"
              // cascade={false}
                  disabled={departmentClicked}
                  className={styles.Choose}
                  extra={departmentName}
                  value={this.state.sValue3}
                  onChange={e => this.onStateChange(e, 'hospitalDepartmentIdValue')}
                  // onChange={this.department}
                  onOk={v => this.setState({ sValue3: v })}
                  onDismiss={() => this.setState({ visible: false })}
                >
                  <List.Item arrow="horizontal">所在科室</List.Item>
                </Picker> */}
                <div className={styles.DoctorPosition}>
                  <Picker
                    data={DoctorPosition}
                    title={'医生职称'}
                    cascade={false}
                    className={styles.Choose}
                    extra={doctorPosition}
                    cols={1}
                    value={this.state.sValue}
                    onChange={e => this.onStateChange(e, 'doctorPositionValue')}
                    onOk={v => this.setState({ sValue: v })}
                    onDismiss={e => console.log('dismiss', e)}
                  >
                    <List.Item arrow="horizontal">医生职称</List.Item>
                  </Picker>
                </div>
                <InputItem
                  clear
                  value={skilfulIllness}
                  placeholder=""
                  onChange={e => this.onStateChange(e, 'skilfulIllness')}
                >擅长疾病</InputItem>
              </div>
    : null}
            {(role == 'NOTDOCTOR') ?
              <div>
                <InputItem
                  clear
                  value={ydataAccountCompellation}
                  placeholder=""
                  maxLength="6"
                  onChange={e => this.onStateChange(e, 'ydataAccountCompellation')}
                >姓名</InputItem>
                <InputItem
                  clear
                  placeholder=""
                  value={enterpriseName}
                  onChange={e => this.onStateChange(e, 'enterpriseName')}
                >所在单位</InputItem>
                <InputItem
                  clear
                  placeholder=""
                  value={department}
                  onChange={e => this.onStateChange(e, 'department')}
                >所在部门</InputItem>
                <InputItem
                  clear
                  placeholder=""
                  value={position}
                  onChange={e => this.onStateChange(e, 'position')}
                >职位</InputItem>
              </div>
    :
    null}

          </div>
          {(role == 'DOCTOR') ?
            <div className={styles.certificate} >
              <p className={styles.certif}>相关证件<span style={{ color: 'rgb(202,202,202)', marginLeft: 5 }}>(医生职业资格证书)</span></p>
              <div>
                <ImagePicker
                  files={files}
                  onChange={this.onPositiveSidedataPicChange}
                  onImageClick={(index, fs) => {
                    window.wx.previewImage({
                      current: fs[index].url, // 当前显示图片的http链接
                      urls: [fs[index].url], // 需要预览的图片http链接列表
                    });
                  }}
                  selectable={files.length < 1}
                  // accept="image/gif,image/jpeg,image/jpg,image/png"
                />
                <p style={{ marginLeft: 15 }}>资格证的盖章页</p>
              </div>
            </div>
            : null}
          {(role == 'NOTDOCTOR') ?
            <div className={styles.certificate} >
              <p className={styles.certif}>相关证件<span style={{ color: 'rgb(202,202,202)', marginLeft: 5 }}>(身份证)</span></p>
              <div className={styles.ImagePicker1}>
                <ImagePicker
                  files={positiveSideValue}
                  onChange={this.onLeftPicChange}
                  onImageClick={(index, fs) => {
                    window.wx.previewImage({
                      current: fs[index].url, // 当前显示图片的http链接
                      urls: [fs[index].url], // 需要预览的图片http链接列表
                    });
                  }}
                  selectable={positiveSideValue.length < 1}
                  // accept="image/gif,image/jpeg,image/jpg,image/png"
                />
                <p style={{ marginLeft: 25 }}>身份证的头像面</p>
              </div>
              <div className={styles.ImagePicker2}>
                <ImagePicker
                  files={reverseSideValue}
                  onChange={this.onRightPicChange}
                  onImageClick={(index, fs) => {
                    window.wx.previewImage({
                      current: fs[index].url, // 当前显示图片的http链接
                      urls: [fs[index].url], // 需要预览的图片http链接列表
                    });
                  }}
                  selectable={reverseSideValue.length < 1}
                  // accept="image/gif,image/jpeg,image/jpg,image/png"
                />
                <p style={{ marginLeft: 25 }}>身份证的国徽面</p>
              </div>
            </div>
            : null}


          <div className={styles.RegisterBotton} >
            <Button
              className={styles.Button}
              onClick={this.Submission}
            >
              <p style={{ color: 'white', fontSize: 16, marginTop: 0 }}>提交审核</p></Button>
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  const { listhospitalType = [],
    DepHospitalEnterpriseType, AuditInfo = {} } = state.PersonalInfo || {};
  const { hospitalName = [], hospitalDepName = [] } = state.Register || {};
  const { success = {} } = AuditInfo;

  return {
    loading: state.loading,
    listhospitalType,
    DepHospitalEnterpriseType,
    AuditInfo,
    success,
    hospitalNameArray: hospitalName,
    hospitalDepNameArray: hospitalDepName,
  };
}


export default connect(mapStateToProps)(withRouter(AuditInfomation));
