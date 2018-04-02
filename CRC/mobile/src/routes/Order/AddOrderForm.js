import React from 'react';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import { List, Toast, WingBlank, TextareaItem, Button, Picker, DatePicker, Checkbox, Radio, Modal } from 'antd-mobile';
import moment from 'moment';
import styles from './Order.less';


const Item = List.Item;
const CheckboxItem = Checkbox.CheckboxItem;
const RadioItem = Radio.RadioItem;

class AddOrderForm extends React.Component {
  state = {
    value: 1,
    showCheckPop: 'none',
    showPlacePop: 'none',
    jobTypeIds: [],
    jobTypeLabels: [],
    jobTypeIdsChked: [],
    jobTypeLabelsChked: [],
    selectedPlace: {},
    disabledSubmit: true,
    pageSubTitle: '服务地址',
  }

  componentWillMount() {
    const { jobTypeIdsChked,
      jobTypeLabelsChked, selectedPlace } = this.props;
    const showPlacePop = sessionStorage.showAddress == '1' ? 'block' : 'none';
    sessionStorage.showAddress = '0';
    this.setState({
      jobTypeIdsChked,
      jobTypeLabelsChked,
      selectedPlace,
      jobTypeIds: jobTypeIdsChked,
      jobTypeLabels: jobTypeIdsChked,
      showPlacePop,
    });
    this.checkCanSubmit();
  }

  componentWillReceiveProps(nextProps) {
    const { jobTypeIdsChked,
      jobTypeLabelsChked, selectedPlace } = nextProps;
    this.setState({
      jobTypeIdsChked,
      jobTypeLabelsChked,
      selectedPlace,
    });
    this.checkCanSubmit(nextProps);
  }


  onSubmit = () => {
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        const { commonPlaceId } = this.state.selectedPlace;
        if (!commonPlaceId) {
          Toast.info('请选择服务地点', 2);
          return;
        }
        const { RuleServicePrice } = this.props.props || {};
        if (!RuleServicePrice && RuleServicePrice !== 0) {
          Toast.info('未获取到工时金额', 2);
          return;
        }

        console.log(this.props.form.getFieldsValue());
        const { jobTypeIds } = this.state;
        const { jobTypeLabelsChked } = this.state;
        const orderObject = this.props.form.getFieldsValue();
        orderObject.commonPlaceId = commonPlaceId;
        orderObject.planServiceHours =
        orderObject.planServiceHours && orderObject.planServiceHours.toString();
        orderObject.projectTypeId =
        orderObject.projectTypeId && orderObject.projectTypeId.toString();
        orderObject.serviceStaffTypeId =
        orderObject.serviceStaffTypeId && orderObject.serviceStaffTypeId.toString();
        orderObject.serviceTime = moment(orderObject.serviceTime).format('YYYY-MM-DD HH:mm');
        orderObject.jobTypeIds = jobTypeIds.toString();
        orderObject.servicePrice =
        orderObject.planServiceHours && RuleServicePrice ?
        orderObject.planServiceHours * RuleServicePrice : null;
        orderObject.jobTypeNames = jobTypeLabelsChked.length > 0 ? jobTypeLabelsChked.join('|') : '';
        this.props.props.dispatch({
          type: 'Order/addProject',
          payload: {
            ...orderObject,
          },
          callback: (response) => {
            if (response.errorCode) {
              Modal.alert(
                '', <span className={styles.alert_balance_not_enough}>{response.errorMsg}</span>,
                [{ text: '去充值',
                  onPress: () => {
                    this.props.history.push('/WePay/Balance/Recharge');
                  } }],
              );
              return;
            }
            if (response.success) {
              Toast.info(response.success, 2);
              this.props.history.push('/Order/WaitRobOrder');
            }
            this.props.dispatch({
              type: 'Order/clearOrderFormFields',
            });
          },
        });
      } else {
        // alert('Validation failed');
      }
    });
  }
  onReset = () => {
    this.props.form.resetFields();
  }

  onCheckClick(e, i) {
    const { jobTypeIds = [], jobTypeLabels = [], jobTypeIdsChked = [],
      jobTypeLabelsChked = [] } = this.state;
    console.log(jobTypeIdsChked, jobTypeLabelsChked);
    if (e.target.checked) {
      if (!jobTypeIds.includes(i.value)) {
        jobTypeIds.push(i.value);
      }
      if (!jobTypeLabels.includes(i.label)) {
        jobTypeLabels.push(i.label);
      }
    } else {
      const index = jobTypeIds.indexOf(i.value);
      jobTypeIds.splice(index, 1);
      const index1 = jobTypeLabels.indexOf(i.label);
      jobTypeLabels.splice(index1, 1);
    }
    this.setState({
      jobTypeIds,
      jobTypeLabels,
    });
    // console.log(e);
    // console.log(value);
    // console.log(this.props.form.getFieldsValue());
  }

  onTitleChange = (e) => {
    this.props.dispatch({
      type: 'Order/keepOrderFormFields',
      payload: {
        data: {
          projectTitle: { value: e },
        },
      },
    });
    this.props.dispatch({
      type: 'Order/queryProjectTitle',
      payload: {
        projectTitle: e,
      },
    });
  }

  onChangeTitle = (value, e) => {
    e.stopPropagation();
    this.props.dispatch({
      type: 'Order/saveProjectTitle',
      payload: {
        data: [],
      },
    });
    this.props.dispatch({
      type: 'Order/keepOrderFormFields',
      payload: {
        data: {
          projectTitle: { value },
        },
      },
    });
  }


  getHourPrice = (selectedPlace = {}) => {
    const orderObject = this.props.form.getFieldsValue();
    const commonPlaceId = selectedPlace.commonPlaceId || this.state.selectedPlace.commonPlaceId;
    const serviceParameterId = (orderObject.projectTypeId && orderObject.projectTypeId.toString()) || '';
    const serviceStaffTypeId = (orderObject.serviceStaffTypeId && orderObject.serviceStaffTypeId.toString()) || '';
    if (commonPlaceId && serviceParameterId && serviceStaffTypeId) {
      this.props.props.dispatch({
        type: 'Order/queryRuleServicePrice',
        payload: {
          commonPlaceId,
          serviceParameterId,
          serviceStaffTypeId,
        },
      });
    }
  }

  checkCanSubmit = (nextProps = this.props) => {
    const { commonPlaceId } = this.state.selectedPlace;
    const { jobTypeIds } = this.state;
    const { RuleServicePrice } = nextProps || {};
    if (!RuleServicePrice && RuleServicePrice !== 0) {
      this.setState({
        disabledSubmit: true,
      });
      return;
    }
    const orderObject = this.props.form.getFieldsValue();
    const planServiceHours =
        orderObject.planServiceHours && orderObject.planServiceHours.toString();
    const projectTypeId =
        orderObject.projectTypeId && orderObject.projectTypeId.toString();
    const serviceStaffTypeId =
        orderObject.serviceStaffTypeId && orderObject.serviceStaffTypeId.toString();
    // const serviceTime = moment(orderObject.serviceTime).format('YYYY-MM-DD HH:mm');
    const jobTypeIdsCheck = jobTypeIds.toString();
    // const servicePrice =
    //     orderObject.planServiceHours && RuleServicePrice ?
    //     orderObject.planServiceHours * RuleServicePrice : null;
    const projectTitle = orderObject.projectTitle;
    if (!commonPlaceId || !commonPlaceId || !planServiceHours
      || !projectTypeId || !serviceStaffTypeId ||
      !orderObject.serviceTime || !jobTypeIdsCheck || !projectTitle) {
      this.setState({
        disabledSubmit: true,
      });
      return;
    }
    this.setState({
      disabledSubmit: false,
    });
    // this.props.form.validateFields({}, (error) => {
    //   if (error) {
    //     return false;
    //   } else {
    //     const { commonPlaceId } = this.state.selectedPlace;
    //     const { RuleServicePrice } = this.props.props || {};
    //     if (!commonPlaceId) {
    //       return false;
    //     }
    //     if (!RuleServicePrice && RuleServicePrice !== 0) {
    //       return false;
    //     }
    //   }
    // });
  }

  projectTitleBlur = (e) => {
    console.log(e);
    setTimeout(() => {
      this.props.dispatch({
        type: 'Order/saveProjectTitle',
        payload: {
          data: [],
        },
      });
    }, 200);
  }

  validateAccount = (rule, value, callback) => {
    if (value && value.length > 4) {
      callback();
    } else {
      callback(new Error('At least four charactors for account'));
    }
  }

  selectPlace = (selectedPlace) => {
    this.setState({
      selectedPlace,
      showPlacePop: 'none',
    }, function () {
      this.getHourPrice(selectedPlace);
      this.props.dispatch({
        type: 'Order/keepOrderFormFields',
        payload: {
          data: {
            selectedPlace,
          },
        },
      });
    });
  }


  render() {
    const { history, ProjectTitleArray = [] } = this.props;
    const { getFieldProps, getFieldError } = this.props.form;
    const { showCheckPop, showPlacePop,
      jobTypeLabelsChked, selectedPlace, disabledSubmit } = this.state;
    const { projectType = [], jobType = [], staffType = [], CommonPlace = [], RuleServicePrice }
     = this.props.props || {};
    const projectTypes = [];
    const jobTypes = [];
    const staffTypes = [];
    // const CommonPlaces = [];
    projectType.map((value) => {
      projectTypes.push({
        label: value.serviceParameterName,
        value: value.serviceParameterId,
      });
    });
    jobType.map((value) => {
      jobTypes.push({
        label: value.serviceParameterName,
        value: value.serviceParameterId,
      });
    });
    staffType.map((value) => {
      staffTypes.push({
        label: value.serviceStaffTypeName,
        value: value.serviceStaffTypeId,
      });
    });
    // CommonPlace.map((value) => {
    //   CommonPlaces.push({
    //     label: value.provinceName + value.cityName + value.districtName + value.detailAddress,
    //     value: value.commonPlaceId,
    //   });
    // });
    const planServiceHours = [];
    for (let i = 1; i <= 24; i += 0.5) {
      planServiceHours.push({
        value: i,
        label: `${i}h`,
      });
    }
    const planServiceHoursValue = this.props.form.getFieldsValue().planServiceHours;
    const jobExtra = jobTypeLabelsChked.length > 0 ? jobTypeLabelsChked.join('|') : '请选择';
    const placeExtra = selectedPlace.commonPlaceId ?
      (<span>{selectedPlace.contactPerson}&nbsp;&nbsp;&nbsp;
        {selectedPlace.contactPhone}<br />{selectedPlace.provinceName}{selectedPlace.cityName}
        {selectedPlace.districtName}{selectedPlace.detailAddress}</span>)
        : '请选择';
    return (<form className={styles.order_form}>
      <List className={styles.listshow}>
        <Picker
          title="项目类型" onOk={() => {
            this.getHourPrice();
          }} data={projectTypes} cols={1} {...getFieldProps('projectTypeId')} className="forss"
        >
          <List.Item arrow="horizontal"><div className={styles.dot1} />项目类型</List.Item>
        </Picker>
        <TextareaItem
          title="&nbsp;&nbsp;&nbsp;项目概述(标题)"
          autoHeight
          placeholder="请输入"
          {...getFieldProps('projectTitle', {
            rules: [
              { required: true, message: '请输入项目概述(标题)' },
            ],
          })}
          clear={false}
          labelNumber={8}
          error={!!getFieldError('projectTitle')}
          onErrorClick={() => {
            alert(getFieldError('projectTitle').join('、'));
          }}
          onBlur={() => {
            this.projectTitleBlur();
          }}
          onChange={(e) => {
            this.onTitleChange(e);
          }}
          count={50}
        />
      </List>
      <List>
        {ProjectTitleArray.map(i => (
          <RadioItem
            key={i.value}
            onChange={(e) => { this.onChangeTitle(i.projectTitle, e); }}
          >
            {i.projectTitle}
          </RadioItem>
        ))}
      </List>
      <List>
        <Item
          extra={jobExtra} arrow="horizontal" onClick={() => {
            const { jobTypeIdsChked } = this.state;
            this.setState({
              showCheckPop: 'block',
              jobTypeIds: [...jobTypeIdsChked],
              jobTypeLabels: [...jobTypeLabelsChked],
            });
          }}
        ><div className={styles.dot2} />授权工作类型</Item>

      </List>
      <List>
        <Picker
          title="服务人员要求" onOk={() => {
            this.getHourPrice();
          }} data={staffTypes} cols={1} {...getFieldProps('serviceStaffTypeId')} className="forss"
        >
          <List.Item arrow="horizontal" wrap><div className={styles.dot3} />服务人员要求</List.Item>
        </Picker>
      </List>
      <List>
        <DatePicker
          title="上门服务时间"
          minuteStep={5}
          minDate={moment(moment().format('YYYY-MM-DD')).toDate()}
          maxDate={moment().add(1, 'year').toDate()}
          {...getFieldProps('serviceTime', {
            rules: [
              { required: true, message: '请选择上门服务时间' },
            ],
          })}
        >
          <List.Item arrow="horizontal" wrap><div className={styles.dot4} />上门服务时间</List.Item>
        </DatePicker>
        <Picker
          title="服务时长"data={planServiceHours} cols={1} {...getFieldProps('planServiceHours')} className="forss"
        >
          <List.Item arrow="horizontal">&nbsp;&nbsp;&nbsp;服务时长</List.Item>
        </Picker>
      </List>
      <List>
        <Item
          extra={placeExtra} arrow="horizontal" onClick={() => {
            this.setState({
              showPlacePop: 'block',
            });
            this.props.getSubTitle(this.state.pageSubTitle);
          }}
          wrap
        ><div className={styles.dot5} />服务地点</Item>

      </List>

      <div className={`${styles.money_box} clearPrefix`}>
        <div className={`${styles.estimate_money} clearPrefix`}>

          {(RuleServicePrice || RuleServicePrice === 0) && planServiceHoursValue ?
            <span className={styles.totalMoney}>¥{RuleServicePrice * planServiceHoursValue}</span>
          : <span className={styles.totalMoney} />}
          <span className="clearPrefix" style={{ lineHeight: '28px' }}>
            <i
              className="icon iconfont icon-jinggao" onClick={() => {
                history.push('/Order/ServicePrice');
              }}
              style={{ marginRight: '3px' }}
            />
              预估金额：
          </span>
        </div>
        <div className={`${styles.hour_money} clearPrefix`}>
          {RuleServicePrice || RuleServicePrice === 0 ?
            <span className={styles.hourPrice}>(¥{RuleServicePrice}/时)</span>
          : <span className={styles.hourPrice} />}
          <span>(实际以发生为准)</span>
        </div>
      </div>


      <WingBlank size="lg">
        <Button
          type="primary" onClick={() => {
            this.onSubmit();
          }}
          disabled={disabledSubmit}
        >确认发布</Button>
      </WingBlank>

      <div className={styles.agreement}>
        <i
          className="icon iconfont icon-duoxuan"
          style={{ marginRight: '3px' }}
        />
        我已授权<span>该科研助理在本项目上从事所选择的工作</span>
      </div>
      <div className={styles.checkbox_pop} style={{ display: showCheckPop }} >
        <div className={`am-picker-popup-header ${styles.chenkbox_head}`}>
          <div
            onClick={() => {
              const { jobTypeIdsChked } = this.state;
              this.setState({
                showCheckPop: false,
                jobTypeIds: jobTypeIdsChked,
                jobTypeLabels: jobTypeLabelsChked,
              });
            }}
            className="am-picker-popup-item am-picker-popup-header-left"
          >
            取消
            </div>
          <div className="am-picker-popup-item am-picker-popup-title">
            授权工作类型
          </div>
          <div
            className="am-picker-popup-item am-picker-popup-header-right"
            onClick={() => {
              const { jobTypeIds, jobTypeLabels } = this.state;
              this.setState({
                showCheckPop: false,
                jobTypeIdsChked: jobTypeIds,
                jobTypeLabelsChked: jobTypeLabels,
              }, function () {
                this.props.dispatch({
                  type: 'Order/keepOrderFormFields',
                  payload: {
                    data: {
                      jobTypeIdsChked: jobTypeIds,
                      jobTypeLabelsChked: jobTypeLabels,
                    },
                  },
                });
              });
            }}
          >
            确定
          </div>
        </div>
        <div style={{ height: document.documentElement.clientHeight - 45, marginTop: '43px' }}>
          {jobTypes.map(i => (<List >
            <CheckboxItem
            // {...getFieldProps('jobTypeIds', {
            //  initialValue: false,
            //   valuePropName: 'checked',
            // })}
            // onChange={this.onCheckClick.bind(this)}
              key={i.value}
              onChange={e => this.onCheckClick(e, i)}
              checked={this.state.jobTypeIds.includes(i.value)}
              wrapLabel={true}
            >
              {i.label}
            </CheckboxItem>
          </List>
        ))}
        </div>
      </div>
      <div className={styles.checkbox_pop} style={{ display: showPlacePop }} >
        {
        CommonPlace.length == 0 ?
          <div className={styles.noaddress}>
            <p className={`${styles.addressico} iconfont  icon-if_gps_location_map_ `} />
            <p>沒有服务地点，<span className={styles.creatnewaddress} onClick={() => { this.props.history.push('/SetNewAddress/AddressFromOrder'); }}>赶紧创建一个吧！</span></p>
          </div>
      :
          <div>{
            <div style={{ maxHeight: document.documentElement.clientHeight - 80, overflow: 'scroll' }}>{
                CommonPlace.map(value =>
                  <div
                    className={styles.address_box} onClick={() => {
                      this.selectPlace(value);
                      this.props.getSubTitle('');
                    }}
                  >
                    <p className={styles.address_title}><span>{value.contactPerson}</span><span style={{ marginLeft: '25px' }}>{value.contactPhone}</span></p>
                    <p className={styles.address_detail}>
                      {value.provinceName + value.cityName +
                        value.districtName + value.detailAddress}
                    </p>
                    {
                      value.commonPlaceId == selectedPlace.commonPlaceId ?
                        <i className="icon iconfont icon-gou" />
                      :
                      null
                    }
                  </div>,
                )}
            </div>
              }
            <div className={styles.create_new_address_button} >
              <Button
                className={styles.address_Button}
                onClick={() => { this.props.history.push('/SetNewAddress/AddressFromOrder'); }}
              >
                <p style={{ color: 'white', fontSize: 16, position: 'relative', marginTop: 0 }} >新建地址</p></Button>
            </div>
          </div>
      }
      </div>
    </form>);
  }
}


function mapStateToProps(state) {
  const { ProjectTitle = [], OrderFormFields = {}, RuleServicePrice } = state.Order || {};
  const { jobTypeIdsChked = [], jobTypeLabelsChked = [], selectedPlace = {} } = OrderFormFields;
  return {
    ProjectTitleArray: ProjectTitle,
    jobTypeIdsChked,
    jobTypeLabelsChked,
    selectedPlace,
    RuleServicePrice,
  };
}

export default connect(mapStateToProps)(withRouter(AddOrderForm));
