// import React from 'react';
// import { Menu, Icon } from 'antd';
// import { Link } from 'dva/router';
import React from 'react';
import { Flex } from 'antd-mobile';
import { withRouter } from 'react-router';
import { connect } from 'dva';
import styles from './OrderLayout.less';
import ElementAuth from '../../components/ElementAuth';

class OrderHead extends React.Component {


  componentDidMount() {
    // 获取是否存在新的未读信息
    this.props.dispatch({ type: 'Notice/queryUnReadInformList', payload: {} });
    this.props.dispatch({ type: 'PersonalInfo/queryIntegralDetail', payload: {} });
  }
  goUrl = (url) => {
    this.props.history.push(url);
  }
  selectdTab = (path) => {
    const { location } = this.props;
    if (location.pathname == path) {
      return true;
    } else {
      return false;
    }
  }
  render() {
    return (
      <div className={styles.header}>
        <i onClick={() => { this.props.onOpenChange(); }} className="icon iconfont icon-gengduo" style={{ position: 'absolute', left: '20px' }} />
        <i onClick={() => { this.props.history.push('/Notice'); }} className="icon iconfont icon-xinxi" style={{ position: 'absolute', right: '10px' }}>
          <span className={this.props.markRead ? styles.dotxinxi : ''} />
        </i>
        <ElementAuth auth="AddOrder">
          <Flex auth="doctorTab">
            <Flex.Item><span
              className={this.selectdTab('/Order/AddOrder') ? styles.tabSelected : ''}
              onClick={() => {
                this.goUrl('/Order/AddOrder');
              }}
            >预约下单</span></Flex.Item>
            <Flex.Item><span
              className={this.selectdTab('/Order/WaitRobOrder') ? styles.tabSelected : ''}
              onClick={() => {
                this.goUrl('/Order/WaitRobOrder');
              }}
            >等待抢单</span></Flex.Item>
          </Flex>

        </ElementAuth>
        <ElementAuth auth="RobNewOrder">
          <Flex auth="assistantTab">
            <Flex.Item><span
              className={this.selectdTab('/Order/RobNewOrder') ? styles.tabSelected : ''}
              onClick={() => {
                this.goUrl('/Order/RobNewOrder');
              }}
            >新任务</span></Flex.Item>
            <Flex.Item><span
              className={this.selectdTab('/Order/WaitServiceOrder') ? styles.tabSelected : ''}
              onClick={() => {
                this.goUrl('/Order/WaitServiceOrder');
              }}
            >待服务</span></Flex.Item>
            <Flex.Item><span
              className={this.selectdTab('/Order/ServicingOrder') ? styles.tabSelected : ''}
              onClick={() => {
                this.goUrl('/Order/ServicingOrder');
              }}
            >服务中</span></Flex.Item>

          </Flex>
        </ElementAuth>
        {/* <Flex>
          <Flex.Item>新任务</Flex.Item>
          <Flex.Item>待服务</Flex.Item>
          <Flex.Item>服务中</Flex.Item>
        </Flex> */}
      </div>

    );
  }

  // return (
  //   <Menu
  //     selectedKeys={[location.pathname]}
  //     mode="horizontal"
  //     theme="dark"
  //   >
  //     <Menu.Item key="/users">
  //       <Link to="/users"><Icon type="bars" />Users</Link>
  //     </Menu.Item>
  //     <Menu.Item key="/">
  //       <Link to="/"><Icon type="home" />Home</Link>
  //     </Menu.Item>
  //     <Menu.Item key="/404">
  //       <Link to="/page-you-dont-know"><Icon type="frown-circle" />404</Link>
  //     </Menu.Item>
  //     <Menu.Item key="/antd">
  //       <a href="https://github.com/dvajs/dva" target="_blank">dva</a>
  //     </Menu.Item>
  //   </Menu>
  // );
}
function mapStateToProps(state) {
  const { markRead } = state.Notice || {};
  // const { info = {} } = state.PersonalInfo || {};
  return {
    markRead,
    // info,
  };
}

export default connect(mapStateToProps)(withRouter(OrderHead));

