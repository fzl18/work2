import React from 'react';
import Helmet from 'react-helmet';
import { SearchBar } from 'antd-mobile';
import { connect } from 'dva';
import WorkShopShare from './WorkShopShare';
import Navigation from '../../components/MainLayout/Navigation';

function search(e, dispatch) {
  dispatch({ type: 'WorkShop/query', payload: { meetingTitle: e } });
}
const pageTitle = '学术会议';

class WorkShopList extends React.Component {

  state={
    value: this.props.meetingTitle,
  }

  componentDidMount() {
    window.scrollTo(0, 0);
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
          onSubmit={e => search(e, this.props.dispatch)}
          value={this.state.value}
          onChange={(e) => {
            this.setState({ value: e }, () => {
              // search(this.state.value, this.props.dispatch);
            });
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
        />

        <WorkShopShare nextPage={true} pullRefresh={true} scrollY={true} />
        <Navigation />
      </div>

    );
  }
}

function mapStateToProps(state) {
  const { searchParmas = {} } = state.WorkShop || {};
  return {
    meetingTitle: searchParmas.meetingTitle,
  };
}
export default connect(mapStateToProps)(WorkShopList);
