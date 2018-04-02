import React from 'react';
// import { SearchBar, WhiteSpace, List } from 'antd-mobile';
import { connect } from 'dva';
import Helmet from 'react-helmet';
import Article from '../Article/Article';
import Navigation from '../../components/MainLayout/Navigation';

class LatestNewsInfo extends React.Component {

  componentDidMount() {
    this.props.dispatch({ type: 'LatestNews/getInfo', payload: { lastTendencyId: this.props.match.params.id } });
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>最新动态</title>
          <meta name="description" content="最新动态" />
        </Helmet>
        {!this.props.loading && <Article atricleData={this.props.info} />}
        <Navigation />
      </div>
    );
  }
}

function mapStateToProps(state) {
  if (state.LatestNews) {
    const { info } = state.LatestNews;
    return {
      loading: state.loading.models.LatestNews,
      info,
    };
  }
}

export default connect(mapStateToProps)(LatestNewsInfo);
