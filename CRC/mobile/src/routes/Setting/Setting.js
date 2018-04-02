import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import { Button, List, WingBlank, Modal, Toast } from 'antd-mobile';
import styles from './Setting.less';


const pageTitle = '设置';
const Item = List.Item;
const alert = Modal.alert;
const Brief = Item.Brief;
const { openId } = sessionStorage;
class Setting extends React.Component {
  unbindUser = () => {
    this.props.dispatch({ type: 'Setting/unbindUser',
      payload: { openId },
      callback: () => {
        Toast.info('退出成功', 1);
        sessionStorage.openId = '';
        sessionStorage.role = 'VISITOR';
        sessionStorage.acctId = '';
        sessionStorage.auditStatus = '';
        setTimeout(() => {
          this.props.history.push('/Login');
        }, 1500);
      },
    });
  };
  render() {
    const { role } = sessionStorage;
    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
          <style type="text/css">{`
                #root{
                  background-color: #f6f6f6;
                 
                }
            `}</style>
        </Helmet>
        <div className={styles.Set}>
          { role == 'INSIDE_ASSISTANT' ?
            <Item
              onClick={() => {
                this.props.history.push('/SetOrder');
              }}
              className={styles.SetAddress}
              arrow="horizontal"
            >
              <Brief style={{ marginLeft: 5, position: 'relative', fontSize: 15, color: '#333e4d' }} >
                <span style={{ color: 'rgb(126,186,88)', marginRight: 10 }}><i className="iconfont icon-shouzhi" style={{ fontSize: 19 }} /></span>接单设置</Brief>
            </Item>
          :
            <div>
              <Item
                onClick={() => {
                  this.props.history.push('/SetCommonAddress');
                }}
                className={styles.SetAddress}
                arrow="horizontal"
              >
                <Brief style={{ marginLeft: 5, position: 'relative', fontSize: 15, color: '#333e4d' }} >
                  <span style={{ color: 'rgb(126,186,88)', marginRight: 10 }}><i className="iconfont icon-site-copy" style={{ fontSize: 19 }} /></span>常用地址设置</Brief>
              </Item>
              <Item
                onClick={() => {
                  this.props.history.push('/SetPassword');
                }}
                className={styles.SetPassword}
                arrow="horizontal"
              >
                <Brief style={{ marginLeft: 5, position: 'relative', fontSize: 15, color: '#333e4d' }} >
                  <span style={{ color: 'rgb(59, 159, 230)', marginRight: 10 }}><i className="iconfont icon-icon_pw" style={{ fontSize: 19 }} /></span>密码设置</Brief>
              </Item>
            </div>
          }

        </div>
        <div className={styles.QuitBotton} >
          <WingBlank>
            <Button
              type="warning" onClick={() => alert('', '是否退出登录？',
                [{ text: '确定',
                  onPress: () => {
                    this.unbindUser(openId);
                  } },
              { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
                ])}
            >退出</Button>
          </WingBlank>
        </div>
      </div>

    );
  }

    }

function mapStateToProps(state) {
  const { info = {} } = state.Setting || {};
  return {
    info,
  };
}

export default connect(mapStateToProps)(withRouter(Setting));
