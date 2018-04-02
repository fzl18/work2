import React from 'react';
import { connect } from 'dva';
import { List, WingBlank, Button, Modal, WhiteSpace } from 'antd-mobile';
import Helmet from 'react-helmet';
import ElementAuth from '../../components/ElementAuth';
import styles from './MyPanel.less';

const alert = Modal.alert;
const Item = List.Item;
const pageTitle = '授权服务';
function unempower() {
  // console.log('解除授权');
}

function Empower({ detail }) {
  const { name,
    patientNo,
    mobile,
    email,
    enterprise,
    department } = detail;
  return (
    <div>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageTitle} />
      </Helmet>
      <div className={styles.sub_title}>服务者信息</div>
      <List className="my-list">
        <ElementAuth auth="empower">
          <Item extra={name} auth="name">姓名</Item>
          <Item extra={patientNo} auth="patientNo">住院号</Item>
          <Item extra={mobile} auth="mobile">手机号</Item>
          <Item extra={email} auth="email">邮箱</Item>
          <Item extra={enterprise} auth="enterprise">单位</Item>
          <Item extra={department} auth="department">部门科室</Item>
        </ElementAuth>
      </List>
      <WhiteSpace />
      <WingBlank>
        <Button
          className="empower-button"
          type="warning"
          icon="check-circle-o"
          onClick={() => alert('提示', '确定解除授权?', [
          { text: '取消', onPress: () => console.log('cancel') },
          { text: '确定', onPress: () => unempower() },
          ])}
        >解除授权</Button>
      </WingBlank>
    </div>

  );
}

Empower.propTypes = {
};

function mapStateToProps(state) {
  const { detail } = state.MyPanel;
  return {
    loading: state.loading.models.MyPanel,
    detail,
  };
}

export default connect(mapStateToProps)(Empower);
