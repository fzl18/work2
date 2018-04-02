import React from 'react';
import Helmet from 'react-helmet';
import { SearchBar } from 'antd-mobile';
import { connect } from 'dva';
import LatestNewsShare from './LatestNewsShare';
import Navigation from '../../components/MainLayout/Navigation';

function search(e, dispatch) {
  dispatch({ type: 'LatestNews/query', payload: { lastTendencyTitle: e } });
}

const pageTitle = '最新动态';
class LatestNewsList extends React.Component {

  state={
    value: this.props.lastTendencyTitle,
  }

  componentDidMount() {
    if (this.props.previous != 'LatestNewsInfo') {
      this.props.dispatch({ type: 'LatestNews/query', payload: { } });
    }

    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'LatestNews/setPrevious', payload: { previous: '' } });
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>

        <SearchBar
          placeholder="关键词搜索"
          maxLength={50}
          value={this.state.value}
          onChange={(e) => {
            this.setState({ value: e });
          }}
          onBlur={() => search(this.state.value, this.props.dispatch)}
          onClear={() => {
            this.setState({ value: '' });
          }}
          onCancel={() => {
            this.setState({
              value: '',
            });
            search('', this.props.dispatch);
          }}
          onSubmit={e => search(e, this.props.dispatch)}
        />

        <LatestNewsShare nextPage={true} pullRefresh={true} scrollY={true} />
        <Navigation />
      </div>
    );
  }
}


function mapStateToProps(state) {
  if (state.LatestNews) {
    const { searchParmas = {}, previous = '' } = state.LatestNews;
    return {
      lastTendencyTitle: searchParmas.lastTendencyTitle,
      previous,
    };
  }
}
export default connect(mapStateToProps)(LatestNewsList);
