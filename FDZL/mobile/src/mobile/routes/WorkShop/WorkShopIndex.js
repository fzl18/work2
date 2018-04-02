import React from 'react';
import { List, ActivityIndicator } from 'antd-mobile';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import styles from './WorkShop.less';
import WorkShopShare from './WorkShopShare';

class WorkShopIndex extends React.Component {

  clickMore = () => {
    this.props.dispatch({ type: 'WorkShop/clearSearch', payload: {} });
    this.props.history.push('/WorkShop/WorkShopList');
  }

  render() {
    return (
      <div className={styles.WorkShopIndex}>
        <List
          renderHeader={() => {
            return (<div
              className="list_header_title" style={{ fontSize: '13pt',
                fontFamily: 'Microsoft YaHei' }}
            > 学术会议 <a
              onClick={this.clickMore} className="bar_more" style={{ fontSize: '13pt',
                fontFamily: 'Microsoft YaHei',
                color: '#333e4d' }}
            >更多&gt;</a> </div>);
          }} className="my-list"
        >
          {this.props.loading ? <ActivityIndicator className="loading_center" animating /> : <WorkShopShare />}
        </List>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.WorkShop,
  };
}

export default connect(mapStateToProps)(withRouter(WorkShopIndex));
