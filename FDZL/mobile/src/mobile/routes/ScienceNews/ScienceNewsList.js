import React from 'react';
import Helmet from 'react-helmet';
import { SearchBar, WhiteSpace, Tabs } from 'antd-mobile';
import { connect } from 'dva';
import ScienceNewsShare from './ScienceNewsShare';
import Navigation from '../../components/MainLayout/Navigation';

function search(e, dispatch, listIndex) {
  dispatch({ type: 'ScienceNews/query', payload: { popularScienceTitle: e, popularScienceCategoryId: (listIndex.tab && listIndex.tab.popularScienceCategoryId) || 'ALL' } });
}
const pageTitle = '科普宣教';

class ScienceNewsList extends React.Component {

  state={
    show: true,
    value: this.props.searchParmas.popularScienceTitle,
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    window.dispatchEvent(new Event('load'));
  }
  render() {
    const tabs = [
      { title: '全部',
        popularScienceCategoryId: 'ALL',
      },
    ];
    this.props.listCategory.map((value) => {
      tabs.push({
        title: value.categoryName,
        ...value,
      });
    });
    const tabDivs = tabs.map(value =>
      <div style={{ width: '100%', marginLeft: '0px', marginRight: '0px' }}>
        <ScienceNewsShare
          popularScienceCategoryId={value.popularScienceCategoryId}
          nextPage={true} pullRefresh={true} scrollY={true}
        />
      </div>,
    );
    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>
        <WhiteSpace />
        {
          this.state.show ?
            <SearchBar
              placeholder="关键词搜索"
              maxLength={50}
              value={this.state.value}
              onChange={(e) => {
                this.setState({ value: e });
              }}
              onBlur={() => search(this.state.value, this.props.dispatch, this.props.listIndex)}
              onClear={() => {
                this.setState({ value: '' });
              }}
              onCancel={() => {
                this.setState({
                  value: '',
                });
                search('', this.props.dispatch, this.props.listIndex);
              }}
              onSubmit={e => search(e, this.props.dispatch, this.props.listIndex)}
            />
        :
        null
        }


        <WhiteSpace />

        <Tabs
          tabs={tabs}
          initialPage={this.props.listIndex ? (this.props.listIndex.index || 0) : 0}
          prerenderingSiblingsNumber={0}
          swipeable={true}
          onChange={(tab, index) => { this.props.dispatch({ type: 'ScienceNews/tabIndex', payload: { listIndex: { index, tab } } }); }}
          onTabClick={(tab, index) => {
            const { searchParmas = {} } = this.props.ScienceNews[(tab && tab.popularScienceCategoryId) || 'ALL'] || {};
            this.setState({
              value: searchParmas.popularScienceTitle,
              show: false,
            }, () => {
              this.setState({
                show: true,
              });
            });
            this.props.dispatch({ type: 'ScienceNews/tabIndex', payload: { listIndex: { index, tab } } });
          }

             }
        >
          {tabDivs}
        </Tabs>
        <Navigation />
      </div>
    );
  }
}

function mapStateToProps(state) {
  if (state.ScienceNews) {
    const { ScienceNews = {} } = state || {};
    const { listCategory = [], listIndex = {} } = state.ScienceNews || {};
    const { searchParmas = {} } = state.ScienceNews[(listIndex.tab && listIndex.tab.popularScienceCategoryId) || 'ALL'] || {};
    return {
      loading: state.loading.models.ScienceNews,
      listCategory,
      searchParmas,
      listIndex,
      ScienceNews,
    };
  }
}
export default connect(mapStateToProps)(ScienceNewsList);
