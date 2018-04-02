import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import { List, Button, WhiteSpace, Modal, WingBlank } from 'antd-mobile';
import PageAuth from '../../components/PageAuth';
import styles from './PersonCentral.less';

// 个人中心
const Item = List.Item;
const alert = Modal.alert;
// function exit() {
//   // @todo
//   console.log('logout');
// }


const pageTitle = '个人中心';
class Account extends React.Component {
  UnBindAccount = (id) => {
    this.props.dispatch({ type: 'UnbindAccount/UnBindAccount', payload: { openid: id } });
  };

  render() {
    const { openid } = this.props.detail || {};
    const { length = [] } = this.props || {};
    return (
      <div className={styles.PersonCentral}>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
          <style type="text/css">{`
                body,#root{
                    background-color: #ddeaf0;
                }
          `}</style>
        </Helmet>
        <List>
          <PageAuth auth={'account'}>
            <Item
              thumb=""
              arrow="horizontal"
              onClick={() => {
                this.props.history.push('/MyPanel/PersonCentral/Account');
              }}
            ><span style={{ marginRight: 20, color: ' rgb(22, 126, 181)' }}><i className="iconfont icon-geren" /></span>账号信息</Item>
          </PageAuth>
          <PageAuth auth={'pwd'}>
            <Item
              thumb=""
              onClick={() => {
                this.props.history.push('/MyPanel/PersonCentral/Pwd');
              }}
              arrow="horizontal"
            >
              <span style={{ marginRight: 20, color: ' rgb(22, 126, 181)' }}><i className="iconfont icon-mima1" /></span>密码设置
      </Item>
          </PageAuth>
          <PageAuth auth={'authInfo'}>
            <Item
              thumb=""
              arrow="horizontal"
              onClick={() => {
                this.props.history.push('/MyPanel/PersonCentral/ServiceInfo');
              }}
            ><span style={{ marginRight: 20, color: ' rgb(22, 126, 181)' }}><i className="iconfont icon-fuwu" /></span>服务者信息</Item>
          </PageAuth>
        </List>
        <PageAuth auth={'notice'}>
          <WhiteSpace />
          <WhiteSpace />
          <List>
            <Item
              thumb=""
              arrow="horizontal"
              extra={(<div style={{ color: 'red' }}>{length}</div>)}
              onClick={() => {
                this.props.history.push('/MyPanel/PersonCentral/Notice');
              }}
            >
              <span style={{ marginRight: 20, color: ' rgb(22, 126, 181)' }}><i className="iconfont icon-tongzhi" /></span>通知
          </Item>
          </List>
        </PageAuth>
        <WhiteSpace />
        <WhiteSpace />
        <WingBlank>
          <Button
            type="warning" onClick={() => alert('', '是否解除账号绑定？',
              [{ text: '确定',
                onPress: () => {
                  this.UnBindAccount(openid);
                } },
              { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
              ])}
          >退出</Button>
        </WingBlank>
      </div>

    );
  }
}

// function mapStateToProps(state) {
 // const { length } = state.MyPanel;
  // console.log(`~~~${length}`);
  // return {
   // loading: state.loading.models.MyPanel,
    // length,
  // };
// }
function mapStateToProps(state) {
  const { detail } = state.UnbindAccount;
  const { length } = state.MyPanel;
  return {
    loading: state.loading.models.UnbindAccount,
    detail,
    length,
  };
}

export default connect(mapStateToProps)(withRouter(Account));
