import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import { InputItem, Button, Toast, Picker, List, TextareaItem } from 'antd-mobile';
import styles from './ModifyAddress.less';

const pageTitle = '修改地址';


class ModifyAddress extends React.Component {
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
    info: {},
    provinceId: '',
    cityId: '',
    districtId: '',

  }
  componentDidMount() {
    this.props.dispatch({ type: 'Setting/getInfo', payload: { commonPlaceId: this.props.match.params.id } });
    // this.props.dispatch({ type: 'Setting/queryProvince', payload: { } });
    this.props.dispatch({ type: 'Setting/queryPlaceList', payload: { } });
    this.setState({
      info: this.props.info,
      provinceId: this.props.info.provinceId,
      cityId: this.props.info.cityId,
      districtId: this.props.info.districtId,
    });
  }

  componentWillReceiveProps() {
    this.setState({
      info: this.props.info,
      provinceId: this.props.info.provinceId,
      cityId: this.props.info.cityId,
      districtId: this.props.info.districtId,
    });
  }

  onStateChange = (e, key) => {
    const { info } = this.state;
    info[key] = e;
    this.setState({
      info,
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
    // let { regionId } = this.state;
    // let regionIdValue = '';

    // regionId.map((value) => {
    //   regionIdValue = value;
    // });
    // regionId = regionIdValue;
    // this.setState({
    //   provinceId: regionId,
    // });// 将当前所选，代表为省的regionId 赋值给所要传的provinceId
    // this.props.dispatch({ type: 'Setting/queryCity', payload: { regionId } });// 选择省时查询市
    // this.props.dispatch({ type: 'Setting/queryDistrict', payload: { regionId: 39 } });
    // 查询区   河北 3 39 416
  }
  Save=() => {
    const { contactPerson, contactPhone, detailAddress, commonPlaceId } = this.state.info || {};
    // let { regionId = [] } = this.state;
    // let regionIdValue = '';

    // regionId.map((value) => {
    //   regionIdValue = value;
    // });
    // regionId = regionIdValue;
    const { provinceId, cityId, districtId } = this.state;
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
    this.props.dispatch({ type: 'Setting/modifyCommonPlace',
      payload: {
        contactPerson, contactPhone, detailAddress, commonPlaceId, provinceId, cityId, districtId,
      },
      callback: (response) => {
        Toast.info(response.success, 1, () => {}, false);
        this.props.history.push('/SetCommonAddress');
      },
    });
  }
  render() {
    const { contactPerson, contactPhone,
       provinceName, cityName, districtName,
        detailAddress } = this.state.info || {};
    const Area = provinceName + cityName + districtName;
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
        <div className={styles.ModifyAddress}>
          <InputItem
            clear
            value={contactPerson}
            onChange={e => this.onStateChange(e, 'contactPerson')}
          >联系人</InputItem>
          <InputItem
            clear
            value={contactPhone}
            type="phone"
            onChange={e => this.onStateChange(e, 'contactPhone')}
          >联系电话</InputItem>
          <Picker
            data={placeList}
           // data={areaArray}
            cols={3}
            title="所在地区"
              // cascade={false}
            // cascade={true}
            className={styles.Choose}
            extra={Area}
            value={this.state.sValue}
            onPickerChange={e => this.onStateChangeArea(e)}
            onOk={v => this.setState({ sValue: v })}
            onDismiss={() => this.setState({ visible: false })}
          >
            <List.Item arrow="horizontal" onClick={() => this.setState({ visible: true })}>
            所在地区
          </List.Item>
          </Picker>
          <TextareaItem
            title="详细地址"
            autoHeight
            value={detailAddress}
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
  const { info = {}, listProvince = [], listCity = [],
   listDistrict = [], placeList = [] } = state.Setting || {};
  return {
    info,
    listProvince,
    listCity,
    listDistrict,
    placeList,
  };
}

export default connect(mapStateToProps)(withRouter(ModifyAddress));
