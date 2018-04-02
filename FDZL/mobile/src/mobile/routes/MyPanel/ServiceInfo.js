import React from 'react';
import { connect } from 'dva';
import { List, WingBlank, Button, Modal, WhiteSpace } from 'antd-mobile';
import Helmet from 'react-helmet';
// import ElementAuth from '../../components/ElementAuth';
import styles from './PersonCentral.less';

const alert = Modal.alert;
// const prompt = Modal.prompt;
const Item = List.Item;


class ServiceInfo extends React.Component {
  // state = {
  //   Relievebtn: 'unclick',

  // };

  componentDidMount() {
    this.props.dispatch({ type: 'MyPanel/serviceInfoDetail', payload: { assistantServiceAuthId: this.props.match.params.id } });
  }
  relieveAuth = (id) => {
    this.props.dispatch({ type: 'MyPanel/relieveAuth',
      payload: { assistantServiceAuthId: id } });
  }

  render() {
    const { doctorAccUserCompellation, doctorAccUserMobile, doctorAccUserEmail,
      doctorAccEnterprise, doctorAccDepartment, assistantServiceAuthId,
             } = this.props.detail || {};
    // const { Relievebtn } = this.state;
    const detailKey = Object.keys(this.props.detail) || [];
    return (
      <div>
        <Helmet>
          <title>授权服务</title>
          <meta name="description" content="授权服务" />
          <style type="text/css">{`
                body,#root{
                    background-color: #ddeaf0;
                }
          `}</style>
        </Helmet>
        {!this.props.loading.effects['MyPanel/serviceInfoDetail'] ?
          <div>
            {(detailKey.length > 0) ?
              <div>
                <div className={styles.sub_title}>服务者信息</div>
                <List className="my-list">

                  <Item extra={doctorAccUserCompellation} auth="name">
                    <i
                      className="iconfont icon-iconfontgerenzhongxin"
                      style={{ color: '#167eb5', fontSize: 24, marginRight: '10px' }}
                    />姓名</Item>
                  <Item extra={doctorAccUserMobile} auth="mobile">
                    <i
                      className="iconfont icon-shouji"
                      style={{ color: '#167eb5', fontSize: 24, marginRight: '10px' }}
                    />手机号</Item>
                  <Item extra={doctorAccUserEmail} auth="email">
                    <i
                      className="iconfont icon-youxiang"
                      style={{ color: '#167eb5', fontSize: 24, marginRight: '10px' }}
                    />邮箱</Item>
                  <Item extra={doctorAccEnterprise} auth="company" className={styles.Department}>
                    <i
                      className="iconfont icon-iconfontyiyuan"
                      style={{ color: '#167eb5', fontSize: 24, marginRight: '10px' }}
                    />单位</Item>
                  <Item extra={doctorAccDepartment} auth="department" className={styles.Department}>
                    <i
                      className="iconfont icon-keshishouyaohuizhen"
                      style={{ color: '#167eb5', fontSize: 24, marginRight: '10px' }}
                    />部门（科室）</Item>

                </List>
                <div style={{ marginTop: 120 }}>
                  <WingBlank>
                    <Button
                      type="warning"
                      className="empower-button"
            // icon="check-circle-o"
                      onClick={() => alert('确认解除授权', '',
                        [{ text: '确定',
                          onPress: () => {
                            this.relieveAuth(assistantServiceAuthId);
                        // this.setState({ Relievebtn: 'clicked' });
                          } },
                  { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
                        ])}
                    ><i className="iconfont icon-jiechubangding" style={{ marginRight: 15, fontSize: 23 }} />
                      <span style={{ fontSize: 15 }}>解除授权</span></Button>
                    <WhiteSpace />
                  </WingBlank>
                </div>
              </div>
        : <div>
          <div className={styles.noRelieve}>< img src="/images/noList.png" alt="" style={{ width: 100, height: 80 }} /><p style={{ marginTop: 10 }}>无记录</p></div>
        </div>
        }
          </div>
        :
        null}
      </div>
    );
  }
    }

function mapStateToProps(state) {
  const { detail = {} } = state.MyPanel || {};
  return {
    loading: state.loading,
    detail: detail || {},
  };
}

export default connect(mapStateToProps)(ServiceInfo);
