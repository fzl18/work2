import React from 'react';
import { Popover, NavBar } from 'antd-mobile';
import { withRouter } from 'react-router';
import styles from './Navigation.less';

// const Item = Popover.Item;


class Navigation extends React.Component {
  state = {
    visible: false,
    selected: '',
  };
  onSelect = (opt) => {
    // console.log(opt.props.value);
    this.setState({
      visible: false,
      selected: opt.props.value,
    });
  };
  handleVisibleChange = (visible) => {
    this.setState({
      visible,
    });
  };

  Index = () => {
    location.href = '/';
  }
  Consulting = () => {
    location.href = '/Chat/MyChat';
  }
  FollowUp = () => {
    const { role, openid } = sessionStorage;
    if (role == 'VISITOR' || openid == '') {
      location.href = '/BindAccount';
    } else {
      location.href = '/calendar/index.html';
    }
  }
  Close = () => {
    this.setState({
      visible: false,
      selected: '',
    });
  }


  render() {
    return (<div
      style={{ position: 'fixed',
        bottom: 30,
        zIndex: '999',

      }}
    >
      <NavBar
        mode="light"
        style={{ backgroundColor: 'rgba(98,201,150,0.6)',
          borderBottomLeftRadius: 40,
          borderTopLeftRadius: 40,
          borderBottomRightRadius: 40,
          borderTopRightRadius: 40,
          width: 39,
          height: 39,
          border: '2px solid rgba(255,255,255,0.7)' }}
        rightContent={
          <Popover

            mask
            // overlayClassName="fortest"
            // overlayStyle={{ color: 'currentColor', left: 80, top: 308 }}
            visible={this.state.visible}
            overlay={[
              <div className="quick_nav" style={{ width: 150, height: 150, position: 'fixed', left: 13.5, bottom: 30 }} onClick={this.Close}>
                <div className={styles.Navigation1} onClick={this.Index}><i className="iconfont icon-shouye1" /></div>
                <div className={styles.Navigation2} onClick={this.Consulting}><i className="iconfont icon-zixun2" /></div>
                <div className={styles.Navigation3} onClick={this.FollowUp}><i className="iconfont icon-jinrisuifang" /> </div>
                <div className={styles.Navigation4} onClick={this.Close}><i className="iconfont icon-cha1" /> </div>
              </div>,
            ]}

            onVisibleChange={this.handleVisibleChange}
            onSelect={this.onSelect}
          >
            <div
              className="quick_nav"
              style={{
                height: '100%',
                // padding: '0 15px',
                // marginRight: '-15px',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'transparent',
                position: 'absolute',
                left: 23,
              }}
            >
              <i className="iconfont icon-jia" style={{ color: 'rgba(255, 255, 255, 0.6)', height: '40px', lineHeight: '37.5px' }} />
            </div>
          </Popover>
        }
      />
    </div>);
  }
}
export default withRouter(Navigation);
