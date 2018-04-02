import React from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import AuthNotice from './AuthNotice';

class Notice extends React.Component {
  render() {
    return (
      <div>
        {/* {this.props.list && this.props.list.map((value) => {
          return <AuthNotice value={value} key={value.name} />;
        })} */}
        <AuthNotice nextPage={true} pullRefresh={true} scrollY={true} />
      </div>
    );
  }
}

// 授权消息
function mapStateToProps(state) {
  const { list = [], total, page } = state.MyPanel || {};
  return {
    loading: state.loading.models.MyPanel,
    list,
    total,
    page,
  };
}

export default connect(mapStateToProps)(withRouter(Notice));
