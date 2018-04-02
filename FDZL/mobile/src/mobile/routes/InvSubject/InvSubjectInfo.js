import React from 'react';
import { connect } from 'dva';
import Article from './InvSubjectArticle';

class InvSubjectInfo extends React.Component {

  componentDidMount() {
    this.props.dispatch({ type: 'InvSubject/getInfo', payload: { researchSubjectId: this.props.match.params.id } });
  }

  render() {
    return (
      <div>
        {!this.props.loading && <Article atricleData={this.props.info} />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  if (state.InvSubject) {
    const { info = {} } = state.InvSubject || {};
    return {
      loading: state.loading.models.InvSubject,
      info,
    };
  }
}

export default connect(mapStateToProps)(InvSubjectInfo);
