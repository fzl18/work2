import React from 'react';
import { List, ActivityIndicator } from 'antd-mobile';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import styles from './LatestNews.less';
import LatestNewsShare from './LatestNewsShare';

class LatestNewsIndex extends React.Component {
  clickMore = () => {
    this.props.dispatch({ type: 'LatestNews/clearSearch', payload: {} });
    this.props.history.push('/LatestNews/LatestNewsList');
  }
  render() {
    return (
      <div className={styles.LatestNewsIndex}>
        <List
          renderHeader={() => {
            return (<div
              className="list_header_title"style={{ fontSize: '13pt',
                fontFamily: 'Microsoft YaHei' }}
            > 最新动态 <a
              onClick={this.clickMore} className="bar_more"style={{ fontSize: '13pt',
                fontFamily: 'Microsoft YaHei',
                color: '#333e4d' }}
            >更多&gt;</a> </div>);
          }} className="my-list"
        >
          {this.props.loading ? <ActivityIndicator className="loading_center" animating /> : <LatestNewsShare />}
        </List>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.LatestNews,
  };
}

export default connect(mapStateToProps)(withRouter(LatestNewsIndex));
