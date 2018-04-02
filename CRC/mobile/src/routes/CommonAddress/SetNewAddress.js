import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import { InputItem, Button, Toast, Picker, List, TextareaItem } from 'antd-mobile';
import styles from './SetNewAddress.less';

const pageTitle = '新建地址';

class SetNewAddress extends React.Component {
  state={
    contactPerson: '',
    contactPhone: '',
    detailAddress: '',
    regionId: [],
    cols: 1,
    pickerValue: [],
    asyncValue: [],
    sValue: '',
    visible: false,
    provinceId: '',
    cityId: '',
    districtId: '',
  }
  componentDidMount() {
    // this.props.dispatch({ type: 'Setting/queryProvince', payload: { } });
    this.props.dispatch({ type: 'Setting/queryPlaceList', payload: { } });
  }
  onStateChange = (e, key) => {
    this.setState({
      [key]: e,
    });
  }
  onStateChangeArea = (e) => {
    this.setState({
      sValue: e,
    });
    const provinceId = e[0];
    const cityId = e[1];
    const districtId = e[2];
    this.setState({
      provinceId,
      cityId,
      districtId,
    });
  }
  Save=() => {
    const { contactPerson, contactPhone, detailAddress,
       provinceId, cityId, districtId } = this.state;
    if (contactPerson == '' || (contactPerson && contactPerson.trim() == '')) {
      Toast.info('请输入联系人', 1, () => {}, false);
      return;
    }
    if (contactPhone == '' || (contactPhone && contactPhone.trim() == '')) {
      Toast.info('请输入联系电话', 1, () => {}, false);
      return;
    }
    if (detailAddress == '' || (detailAddress && detailAddress.trim() == '')) {
      Toast.info('请输入详细地址', 1, () => {}, false);
      return;
    }
    if (provinceId == '' || cityId == '' || districtId == '') {
      Toast.info('请选择所在地区', 1, () => {}, false);
      return;
    }
    this.props.dispatch({ type: 'Setting/addCommonPlace',
      payload: {
        contactPerson, contactPhone, detailAddress, provinceId, cityId, districtId,
      },
      callback: (response) => {
        if (response.success) {
          Toast.info(response.success, 1, () => {}, false);
          if (this.props.fromOrder) {
            sessionStorage.showAddress = 1;
            this.props.history.push('/Order/AddOrder');
          } else {
            this.props.history.push('/SetCommonAddress');
          }
        }
      },
    });
  }
  render() {
    const AreaChoose = [

    ];
    this.props.listProvince.map((value) => {
      AreaChoose.push({
        value: value.regionId,
        label: value.regionName,
      });
    });
    const { placeList } = this.props;
    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>
        <div className={styles.SetNewAddress}>
          <InputItem
            clear
            placeholder="请输入"
            onChange={e => this.onStateChange(e, 'contactPerson')}
          >联系人</InputItem>
          <InputItem
            clear
            placeholder="请输入"
            type="phone"
            onChange={e => this.onStateChange(e, 'contactPhone')}
          >联系电话</InputItem>
          <Picker
            data={placeList}
            cols={3}
            title="所在地区"
              // cascade={false}
            className={styles.Choose}
            value={this.state.sValue}
            onPickerChange={e => this.onStateChangeArea(e)}
            onOk={(v) => { this.setState({ sValue: v }); this.onStateChangeArea(v); }}
            onDismiss={() => this.setState({ visible: false })}
          >
            <List.Item arrow="horizontal" onClick={() => this.setState({ visible: true })}>
            所在地区
          </List.Item>
          </Picker>
          <TextareaItem
            title="详细地址"
            placeholder="请输入"
            autoHeight
            onChange={e => this.onStateChange(e, 'detailAddress')}
          />
        </div>
        <div className={styles.Savebotton} >
          <Button
            className={styles.Button}
            onClick={this.Save}
          >
            <p style={{ color: 'white', fontSize: 16, position: 'relative', marginTop: 0 }}>保存</p></Button>
        </div>

      </div>
    );
  }

     }

function mapStateToProps(state) {
  const { listProvince = [], placeList = [] } = state.Setting || {};
  return {
    listProvince,
    placeList,
  };
}

export default connect(mapStateToProps)(withRouter(SetNewAddress));
