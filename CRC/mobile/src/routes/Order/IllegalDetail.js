import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import { List } from 'antd-mobile';
import moment from 'moment';
import styles from './Order.less';

const pageTitle = '服务违规情况说明';
const Item = List.Item;
const Brief = Item.Brief;
class IllegalDetail extends React.Component {
  state={
  }

  render() {
    // const { OrderFormFields, dispatch } = this.props;
    const { projects, ydataAccount } = this.props;
    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>
        {
          projects.length > 0 ?
            (<div>
              <div className={styles.ill_time}>
                <i className={`icon iconfont icon-jinggao2 ${styles.reset_ico_size}`} />
                <p className={styles.pfirst}>您有服务违规情况，在此期间将被限制接单</p>
                <p><p>（{moment(ydataAccount.restrictStartTime).format('YYYY-MM-DD')} 至 {moment(ydataAccount.restrictEndTime).format('YYYY-MM-DD')}）</p></p>
              </div>
              {
                projects.map(project =>
                  <div className={styles.ill_cancel_list}>
                    <List className="my-list">
                      <Item
                        extra={moment(project.projectCancelTime).format('YYYY-MM-DD')}
                        align="top"
                        thumb={<i className={`icon iconfont icon-dingdanxinxi-quxiaodingdan ${styles.reset_ico_size}`} />}
                        multipleLine
                      >
                      取消待服务订单 <Brief>订单号:{project.projectCode}</Brief>
                      </Item>
                    </List>
                  </div>,
                )
              }

            </div>)
          :
          null
        }
      </div>
    );
  }

    }

function mapStateToProps(state) {
  const { listViolation = {} }
  = state.Order || {};
  const { projects = [], ydataAccount = {} } = listViolation;
  return {
    listViolation,
    projects,
    ydataAccount,
  };
}

export default connect(mapStateToProps)(withRouter(IllegalDetail));
