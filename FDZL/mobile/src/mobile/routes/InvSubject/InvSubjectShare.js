import React from 'react';
import { ListView, PullToRefresh } from 'antd-mobile';
import { connect } from 'dva';
// import ReactDOM from 'react-dom';
import { withRouter } from 'react-router';
import moment from 'moment';
import styles from './InvSubject.less';


const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

class InvSubjectShare extends React.Component {
  state={
    dataSource,
    height: document.documentElement.clientHeight - 67,
    isLoadingMore: false,
  }

  componentDidMount() {
    // const getRect = ReactDOM.findDOMNode(this.lv).getBoundingClientRect();
    // const hei = getRect.height - getRect.top;
    const rData = this.props.list ? this.props.list : [];
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(rData),
      // height: hei,
      refreshing: false,
      isLoading: false,
    });
  }

  componentWillReceiveProps() {
    const rData = this.props.list ? this.props.list : [];
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(rData),
      refreshing: false,
      isLoading: false,
    });
    if (!this.props.scrollY) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }

  componentDidUpdate() {
    if (!this.props.scrollY) {
     // document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }

  componentWillUnmount() {
    document.body.style.overflow = 'auto';
  }

  onRefresh = () => {
    this.setState({ refreshing: true, isLoading: true });
    // setTimeout(() => {
    this.props.dispatch({ type: 'InvSubject/query', payload: {} });
    // }, 150);
  };

  onEndReached = () => {
    // load new data
    if (this.props.loading.effects['InvSubject/nextPage'] || this.state.isLoadingMore) { // @todo hasMore
      return;
    }
    if (this.props.noMore) {
      return;
    }

    let { page } = this.props;
    if (!page) {
      page = 2;
    } else {
      page += 1;
    }
    this.setState({
      isLoadingMore: true,
    }, function () {
      setTimeout(() => {
        this.props.dispatch({ type: 'InvSubject/nextPage', payload: { page, researchStatus: this.props.searchParmas.researchStatus } });
      }, 300);
    });
    this.setState({
      isLoadingMore: false,
    });
  };

  render() {
    const { list } = this.props;
    const row = (rowData, sectionID, rowID) => {
      const obj = list[rowID];
      if (!obj) {
        return null;
      }
      const { researchStatus } = obj;
      let status = '';
      let statusClass = styles.preparing;
      if (researchStatus === 'PREPARING') {
        status = '准备中';
        statusClass = styles.preparing;
      } else if (researchStatus === 'INTO') {
        status = '入组中';
        statusClass = styles.entering;
      } else if (researchStatus === 'IN') {
        status = '入组完成';
        statusClass = styles.entered;
      } else if (researchStatus === 'COMPLETED') {
        status = '已完成';
        statusClass = styles.completed;
      }

      return (
        <div
          key={rowID}
          style={{
            padding: '0 15px',
            backgroundColor: 'white',
          }}
          className="rowContent"
          onClick={() => {
            this.props.history.push(`/InvSubject/InvSubjectList/${obj.researchSubjectId}`);
          }}
        >
          <div className="row_style">
            <img className="row_img" style={{ width: '80px', height: '52px' }} src={obj.mainImgNameUrl} alt="" />
            <div className="row_content">
              <div className="row_detail" style={{ position: 'relative' }}>
                <div
                  className="row_title" style={{
                    fontFamily: 'Microsoft YaHei',
                   // height: 33
                  }}
                >{obj.researchSubjectTitle}</div>
                <div className="row_footer" style={{ fontSize: '12px', color: '#6a7881', marginTop: '1px', lineHeight: '18px' }}>
                  <div>研究开始时间:{obj.beginTime && moment(obj.beginTime).format('YYYY-MM-DD')}</div>
                  <div style={{ position: 'relative' }}>研究结束时间:{obj.endTime && moment(obj.endTime).format('YYYY-MM-DD')} <span className={statusClass} style={{ position: 'absolute', right: '-8px', fontSize: '14px' }}>{status}</span></div>
                </div>
              </div>
              <span style={{ position: 'absolute', right: '0px', top: '4px' }} className="right_arrow" />

            </div>
          </div>
        </div>
      );
    };
    const needRender = {};
    if (!this.props.scrollY) {
      needRender.renderScrollComponent = props => <div className="scrollRender">{props.children}</div>;
    } else {
      needRender.renderFooter = () => (this.props.scrollY && <div style={{ padding: 5, textAlign: 'center' }}>
        {(this.state.isLoadingMore || this.props.loading.effects['InvSubject/nextPage']) ? 'Loading...' : this.props.noMore ? '没有更多了' : ''}
      </div>);
    }
    return (
      <div className={styles.InvSubjectIndex}>
        <ListView
          ref={el => this.lv = el}
          dataSource={this.state.dataSource}
          renderRow={row}
          onEndReachedThreshold={500}
          style={!this.props.scrollY ? {} : {
            height: this.state.height,
            margin: '5px 0',
          }}
          {...needRender}
          pullToRefresh={this.props.pullRefresh ? <PullToRefresh
            refreshing={this.props.loading.effects['InvSubject/query']}
            onRefresh={this.onRefresh}
          />
            :
            false
          }
          onEndReached={this.props.nextPage ? this.onEndReached : () => {}}
          pageSize={5}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { list = [], total, page, noMore, searchParmas = {} } = state.InvSubject || {};
  return {
    loading: state.loading,
    list,
    total,
    page,
    noMore,
    searchParmas,
  };
}


export default connect(mapStateToProps)(withRouter(InvSubjectShare));
