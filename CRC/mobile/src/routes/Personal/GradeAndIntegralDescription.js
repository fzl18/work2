import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { withRouter } from 'react-router';
// import {  List } from 'antd-mobile';
// import enUs from 'antd-mobile/lib/date-picker/locale/en_US';
import styles from './PersonalInfo.less';

const pageTitle = '会员等级|积分说明';
class GradeAndIntegralDescription extends React.Component {
  render() {
    const { role } = sessionStorage;
    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
          <style type="text/css">{`
                #root{
                  background-color: white;
                }
            `}</style>
        </Helmet>
        <div className={styles.Description}>
          <p style={{ paddingTop: 15, lineHeight: 1.5, paddingBottom: 20 }}>
            <span style={{ fontWeight: 600 }}>一、等级说明</span>
            <br />
            <br />
          1、会员等级分为5钻会员、4钻会员、3钻会员、2钻会员、1钻会员、无钻会员；<br />
          2、会员等级根据积分量划分，等级划分规则如下：
          <table border="0" width="100%" cellPadding="0" cellSpacing="0" className={styles.subject_table}>
            <tbody>
              <tr>
                <th style={{ width: '40%', textAlign: 'center', fontWeight: 600 }}>会员等级</th>
                <th style={{ width: '60%', textAlign: 'center', fontWeight: 600 }}>积分数</th>
              </tr>
              <tr>
                <td>1钻</td>
                <td>100积分及以上，未满200积分</td>
              </tr>
              <tr>
                <td >2钻</td>
                <td>200积分及以上，未满300积分</td>
              </tr>
              <tr>
                <td >3钻</td>
                <td>300积分及以上，未满400积分</td>
              </tr>
              <tr>
                <td>4钻</td>
                <td>400积分及以上，未满500积分</td>
              </tr>
              <tr>
                <td>5钻</td>
                <td>500积分以上</td>
              </tr>
            </tbody>
          </table>
            <br />
          3、会员等级特权如下：
          { (role == 'DOCTOR') ?
            <table border="0" width="100%" cellPadding="0" cellSpacing="0" className={styles.subject_table}>
              <tbody>
                <tr>
                  <th style={{ width: '20%', textAlign: 'center', fontWeight: 600 }}>会员等级</th>
                  <th style={{ width: '30%', textAlign: 'center', fontWeight: 600 }}>订单优惠比例</th>
                  <th style={{ width: '50%', textAlign: 'center', fontWeight: 600 }}>代金券</th>
                </tr>
                <tr>
                  <td>1钻</td>
                  <td>5%</td>
                  <td />
                </tr>
                <tr>
                  <td >2钻</td>
                  <td>8%</td>
                  <td />
                </tr>
                <tr>
                  <td >3钻</td>
                  <td>11%</td>
                  <td>10小时服务通用券</td>
                </tr>
                <tr>
                  <td>4钻</td>
                  <td>13%</td>
                  <td>20小时服务通用券</td>
                </tr>
                <tr>
                  <td>5钻</td>
                  <td>15%</td>
                  <td>30小时服务通用券</td>
                </tr>
              </tbody>
            </table>
          : null}
            { (role == 'INSIDE_ASSISTANT') ?
              <table border="0" width="100%" cellPadding="0" cellSpacing="0" className={styles.subject_table}>
                <tbody>
                  <tr>
                    <th style={{ width: '20%', textAlign: 'center', fontWeight: 600 }}>会员等级</th>
                    <th style={{ width: '30%', textAlign: 'center', fontWeight: 600 }}>订单优惠比例</th>
                    <th style={{ width: '50%', textAlign: 'center', fontWeight: 600 }}>代金券</th>
                  </tr>
                  <tr>
                    <td>1钻</td>
                    <td>5%</td>
                    <td>3小时等额服务红包</td>
                  </tr>
                  <tr>
                    <td >2钻</td>
                    <td>8%</td>
                    <td>5小时等额服务红包</td>
                  </tr>
                  <tr>
                    <td >3钻</td>
                    <td>11%</td>
                    <td>7小时等额服务红包</td>
                  </tr>
                  <tr>
                    <td>4钻</td>
                    <td>13%</td>
                    <td>9小时等额服务红包</td>
                  </tr>
                  <tr>
                    <td>5钻</td>
                    <td>15%</td>
                    <td>11小时等额服务红包</td>
                  </tr>
                </tbody>
              </table>
          : null}
            <br />
          *礼券半年内有效；<br />
          *使用礼券的订单不算积分；<br />
          *礼券与订单优惠不能同享；<br />
            <br />
            <span style={{ fontWeight: 600 }}>二、积分说明</span>
            <br />
            <br />
          1、会员积分规则如下
          <br />
            <table border="0" width="100%" cellPadding="0" cellSpacing="0" className={styles.subject_table}>
              <tbody>
                <tr>
                  <th style={{ width: '60%', textAlign: 'center', fontWeight: 600 }}>会员行为</th>
                  <th style={{ width: '40%', textAlign: 'center', fontWeight: 600 }}>积分变化</th>
                </tr>
                <tr>
                  <td>登陆（每天算一次）</td>
                  <td>+1</td>
                </tr>
                <tr>
                  <td >支付完成1个订单</td>
                  <td>+10</td>
                </tr>
                <tr>
                  <td >15分钟外取消待服务订单未征得同意</td>
                  <td>-8</td>
                </tr>
                <tr>
                  <td>15分钟外取消待服务订单征得同意</td>
                  <td>-3</td>
                </tr>
                <tr>
                  <td>每单评分5分及以下</td>
                  <td>-5</td>
                </tr>
                <tr>
                  <td>每单评分6分~10分</td>
                  <td>+3</td>
                </tr>
                <tr>
                  <td>每单评分11分及以上</td>
                  <td>+6</td>
                </tr>
              </tbody>
            </table>


          </p>
        </div>
      </div>
    );
  }

    }


function mapStateToProps(state) {
  const { list = {} } = state.PersonalInfo || {};
  return {
    loading: state.loading,
    list,
  };
}

export default connect(mapStateToProps)(withRouter(GradeAndIntegralDescription));
