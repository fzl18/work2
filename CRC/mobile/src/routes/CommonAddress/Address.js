import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import { List, SwipeAction, Modal, ListView, PullToRefresh, Button } from 'antd-mobile';
import Helmet from 'react-helmet';
// import ElementAuth from '../../components/ElementAuth';
import styles from './Address.less';

const alert = Modal.alert;
const Item = List.Item;
const Brief = Item.Brief;
// const pageTitle = '常用地址设置';

const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

class Address extends React.Component {
  state={
    dataSource,
    height: document.documentElement.clientHeight,
    isLoadingMore: false,
  }

  componentDidMount() {
    if (ReactDOM.findDOMNode(this.lv) != null) {
      const getRect = ReactDOM.findDOMNode(this.lv).getBoundingClientRect();
      const hei = getRect.height - getRect.top;
      const rData = this.props.list ? this.props.list : [];
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(rData),
        height: hei,
        refreshing: false,
        isLoading: false,
      });
    }
  }

  componentWillReceiveProps() {
    if (ReactDOM.findDOMNode(this.lv) != null) {
      const hei = document.documentElement.clientHeight
    - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
      const rData = this.props.list ? this.props.list : [];
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(rData),
        height: hei,
        refreshing: false,
        isLoading: false,
      });
      if (!this.props.scrollY) {
        document.body.style.overflow = 'auto';
      } else {
        document.body.style.overflow = 'hidden';
      }
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
    setTimeout(() => {
      this.setState({ refreshing: true, isLoading: true });
      this.props.dispatch({ type: 'Setting/CommonAddress', payload: {} });
    }, 1000);
  };

  onEndReached = () => {
    if (this.props.loading.effects['Setting/nextPage'] || this.state.isLoadingMore) {
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
        this.props.dispatch({ type: 'Setting/nextPage', payload: { page } });
      }, 1000);
    });
    this.setState({
      isLoadingMore: false,
    });
  };

  deleteAddressById = (id) => {
    this.props.dispatch({ type: 'Setting/deleteAddressById', payload: { commonPlaceId: id } });
  }

  render() {
    const { list = [] } = this.props || {};
    const row = (rowData, sectionID, rowID) => {
      const obj = list[rowID];
      if (!obj) {
        return null;
      }
      return (
        <List className="my-list">
          <SwipeAction
            className={styles.AddressSwipe}
            autoClose
            right={[
              {
                style: { backgroundColor: '#F4333C', color: 'white' },
                text: '删除',
                onPress: () => alert('提示', '是否确定删除?', [
                    { text: '取消', onPress: () => console.log('cancel') },
                    { text: '确定', onPress: () => { this.deleteAddressById(obj.commonPlaceId); } },
                ]),
              },
            ]}
          >
            <Item
              extra={obj.contactPhone}
              align="top"
              arrow="horizontal"
              className={styles.Address}
              onClick={() => {
                this.props.history.push(`/ModifyAddress/${obj.commonPlaceId}`);
              }}
            >
              <span style={{ position: 'relative', fontSize: 15 }}>{obj.contactPerson}</span>
              <Brief style={{ position: 'absolute', fontSize: 13 }} >
                {obj.provinceName}{obj.cityName}{obj.districtName}{obj.detailAddress}</Brief>
            </Item>
          </SwipeAction>
        </List>
      );
    };
    const needRender = {};
    if (!this.props.scrollY) {
      needRender.renderScrollComponent = props => <div className="scrollRender">{props.children}</div>;
    } else {
      needRender.renderFooter = () => (this.props.scrollY && <div style={{ padding: 5, textAlign: 'center' }}>
        {(this.state.isLoadingMore || this.props.loading.effects['Setting/nextPage']) ? 'Loading...' : this.props.noMore ? '没有更多了' : ''}
        </div>);
    }
    return (
      <div>
        <Helmet>
          {/* <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} /> */}
          {/* <style type="text/css">{`
                body,#root{
                    background-color: #ddeaf0;
                }
          `}</style> */}
        </Helmet>
        {list.length > 0 ?
          <div>
            <div className={styles.CommonAddress}>
              <ListView
                ref={el => this.lv = el}
                dataSource={this.state.dataSource}
                renderRow={row}
                onEndReachedThreshold={500}
                style={!this.props.scrollY ? {} : {
                  height: this.state.height,
                }}
                {...needRender}
                pullToRefresh={this.props.pullRefresh ? <PullToRefresh
                  refreshing={this.props.loading.effects['Setting/CommonAddress']}
                  onRefresh={this.onRefresh}
                />
          :
          false
        }
                onEndReached={this.props.nextPage ? this.onEndReached : () => {}}
              />
            </div>
            <div className={styles.Feedbackbotton} >
              <Button
                className={styles.Button}
                onClick={this.NewAddress}
              >
                <p style={{ color: 'white', fontSize: 16, position: 'relative', marginTop: 0 }} onClick={() => { this.props.history.push('/SetNewAddress/AddressFromOrder'); }}>新建地址</p></Button>
            </div>
          </div>
      :
          <div className={styles.noaddress}>
            <p className={`${styles.addressico} iconfont  icon-if_gps_location_map_ `} />
            <p>沒有服务地点，<span className={styles.creatnewaddress} onClick={() => { this.props.history.push('/SetNewAddress/AddressFromOrder'); }}>赶紧创建一个吧！</span></p>
          </div>
      }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { list = [], total, page, noMore } = state.Setting || {};
  return {
    loading: state.loading,
    list,
    total,
    page,
    noMore,
  };
}

export default connect(mapStateToProps)(withRouter(Address));
