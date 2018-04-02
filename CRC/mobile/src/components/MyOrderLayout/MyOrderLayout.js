import React from 'react';
import { Drawer } from 'antd-mobile';
import styles from './MyOrderLayout.less';
import MyOrderHead from './MyOrderHead';
import MyOrderFilter from './MyOrderFilter';

class MyOrderLayout extends React.Component {
  state={
    open: false,
  }

  onOpenChange = () => {
    this.setState({ open: !this.state.open });
  }

  close = () => {
    this.setState({
      open: false,
    });
  }

  render() {
    return (
      <div className={styles.normal}>
        <div className={styles.header_holder} />
        <div className={styles.drawer_class}>
          <Drawer
            className="my-drawer"
            style={{ minHeight: document.documentElement.clientHeight }}
            contentStyle={{ color: '#A6A6A6', textAlign: 'center' }}
            sidebar={<MyOrderFilter closeDrawer={this.close} />}
            open={this.state.open}
            onOpenChange={this.onOpenChange}
            position="right"
          >
            <div className={styles.content}>
              <MyOrderHead location={this.props.location} onOpenChange={this.onOpenChange} />

              <div className={styles.main}>

                {this.props.children}

              </div>
            </div>
          </Drawer>
        </div>
      </div>
    );
  }
}


export default MyOrderLayout;
