// import React from 'react';
// import { Menu, Icon } from 'antd';
// import { Link } from 'dva/router';
import React from 'react';
import { TabBar } from 'antd-mobile';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import styles from './MainLayout.less';

class Footer extends React.Component {

  static propTypes = {
    // match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }
  render() {
    const { location, history } = this.props;
    return (
      <div id={styles.footTab}>
        {/* <Button disabled>default disabled</Button><WhiteSpace /> */}
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#62cf96"
          barTintColor="white"
          style={{ height: '100px' }}
        >
          <TabBar.Item
            title="首页"
            key="index"
            icon={<div className={`${styles.foot_icon} icon iconfont icon-shouye1`} />
            }
            selectedIcon={<div className={`${styles.foot_icon} ${styles.foot_icon_selected} icon iconfont icon-shouye1`} />
            }
            selected={location.pathname === '/'}
            onPress={() => {
              // alert('/');
              history.push('/');
            }}
          >
            {/* {this.renderContent('Life')} */}
          </TabBar.Item>
          <TabBar.Item
            icon={<div className={`${styles.foot_icon} icon iconfont icon-yuangongfengcai`} />
              }
            selectedIcon={<div className={`${styles.foot_icon} ${styles.foot_icon_selected} icon iconfont icon-yuangongfengcai`} />
              }
            title="科室风采"
            key="news"
            selected={location.pathname === '/Department'}
            onPress={() => {
              window.scrollTo(0, 0);
              history.push('/Department');
            }}
            data-seed="logId1"
          >
            {/* {this.renderContent('Koubei')} */}
          </TabBar.Item>
          <TabBar.Item
            icon={<div className={`${styles.foot_icon} icon iconfont icon-tuandui`} />
        }
            selectedIcon={<div className={`${styles.foot_icon} ${styles.foot_icon_selected} icon iconfont icon-tuandui`} />
        }
            title="医患空间"
            key="zone"
            selected={location.pathname === '/DopaSpace'}
            onPress={() => {
              window.scrollTo(0, 0);
              history.push('/DopaSpace');
            }}
          >
            {/* {this.renderContent('Friend')} */}
          </TabBar.Item>
          <TabBar.Item
            icon={<div className={`${styles.foot_icon} icon iconfont icon-geren`} />
        }
            selectedIcon={<div className={`${styles.foot_icon} ${styles.foot_icon_selected} icon iconfont icon-geren`} />
        }
            title="我的"
            key="my"
            selected={location.pathname === '/MyPanel'}
            onPress={() => {
              history.push('/MyPanel');
            }}
          >
            {/* {this.renderContent('My')} */}
          </TabBar.Item>
        </TabBar>
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

export default withRouter(Footer);
