import React from 'react';
// import { SearchBar, WhiteSpace, List } from 'antd-mobile';
import { connect } from 'dva';
import Helmet from 'react-helmet';
import Article from '../Article/Article';
import Navigation from '../../components/MainLayout/Navigation';


class ScienceNewsInfo extends React.Component {

  componentDidMount() {
    this.props.dispatch({ type: 'ScienceNews/getInfo', payload: { popularScienceId: this.props.match.params.id } });
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>科普宣教</title>
          <meta name="description" content="科普宣教" />
        </Helmet>
        {!this.props.loading && <Article atricleData={this.props.info} />}
        <Navigation />
      </div>
    );
  }
}

function mapStateToProps(state) {
  if (state.ScienceNews) {
    const { info } = state.ScienceNews;
    return {
      loading: state.loading.models.ScienceNews,
      info,
    };
  }
}

export default connect(mapStateToProps)(ScienceNewsInfo);
