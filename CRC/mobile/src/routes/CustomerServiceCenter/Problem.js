import React from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import ProblemTypeInfo from './ProblemTypeInfo';

class Problem extends React.Component {
  render() {
    return (
      <div>
        <ProblemTypeInfo nextPage={true} pullRefresh={true} scrollY={true} />
      </div>
    );
  }
}

// 分类问题
function mapStateToProps(state) {
  const { list = [], total, page } = state.CustomerServiceCenter || {};
  return {
    loading: state.loading.models.CustomerServiceCenter,
    list,
    total,
    page,
  };
}

export default connect(mapStateToProps)(withRouter(Problem));
