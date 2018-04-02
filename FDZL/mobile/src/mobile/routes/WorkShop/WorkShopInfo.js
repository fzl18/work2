import React from 'react';
// import { SearchBar, WhiteSpace, List } from 'antd-mobile';
import { connect } from 'dva';
import Helmet from 'react-helmet';
import Article from '../Article/Article';
import Navigation from '../../components/MainLayout/Navigation';

class WorkShopInfo extends React.Component {

  componentDidMount() {
    this.props.dispatch({ type: 'WorkShop/getInfo', payload: { meetingId: this.props.match.params.id } });
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>学术会议</title>
          <meta name="description" content="学术会议" />
        </Helmet>
        {!this.props.loading && <Article atricleData={this.props.info} />}
        <Navigation />
      </div>
    );
  }
}

function mapStateToProps(state) {
  if (state.WorkShop) {
    const { info } = state.WorkShop;
    return {
      loading: state.loading.models.WorkShop,
      info,
    };
  }
}

export default connect(mapStateToProps)(WorkShopInfo);
