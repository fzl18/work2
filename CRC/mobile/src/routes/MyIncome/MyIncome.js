import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import { DatePicker, List, Modal } from 'antd-mobile';
import moment from 'moment';
// import enUs from 'antd-mobile/lib/date-picker/locale/en_US';
import styles from './MyIncome.less';

const Item = List.Item;
const Brief = Item.Brief;
const pageTitle = '我的收入';
const alert = Modal.alert;
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
// const utcNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
let minDate = new Date(nowTimeStamp - 1e7);
const maxDate = new Date(nowTimeStamp + 1e7);
// console.log(minDate, maxDate);
if (minDate.getDate() !== maxDate.getDate()) {
  // set the minDate to the 0 of maxDate
  minDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
}
const { role } = sessionStorage;
class MyIncome extends React.Component {
  state = {
    date: now,
    time: now,
    // utcDate: utcNow,
    dpValue: null,
    customChildValue: null,
    visible: false,
    chooseMonth: 'YYYY-MM',
  }

  componentDidMount() {
    const { date } = this.state;
    let chooseMonth = '';
    chooseMonth = date && moment(date).format('YYYY-MM');
    this.setState({
      chooseMonth,
    });
    if ((!sessionStorage.acctId) || (role == 'INSIDE_ASSISTANT')) {
      return;
    }
    this.props.dispatch({ type: 'Register/NowAuditStatus',
      payload: {},
      callback: (response) => {
        if (response.success && response.success.auditStatus == 'no_audit') {
          this.props.history.push('/Register/RegisterNext');
          return;
        }
        if ((response.success && response.success.auditStatus == 'audit_pending') || (response.success && response.success.auditStatus == 'audit_failed')) {
          alert((<span>很抱歉</span>), <div style={{ textAlign: 'left' }} ><span style={{ color: '#333e4d', textAlign: 'left' }}>您的信息还未通过审核，此栏目还无法浏览</span></div>,
            [{ text: (<span style={{ color: '#f5a282' }}>好的</span>),
              onPress: () => {
                this.props.history.push('/PersonalInfo');
              } },
            ]);
        }
      },
    });
  }


  changeDate=(date) => {
    let chooseMonth = '';
    this.setState({
      date,
    });
    chooseMonth = date && moment(date).format('YYYY-MM');
    this.setState({
      chooseMonth,
    });
    console.log(chooseMonth);
  }


  render() {
    // const { datas = [] } = this.state;
    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>
        <div className={styles.head}>
          <div className={styles.AllIncome}>
            <span className={styles.AllIncome2}>¥1000.00</span>总收入</div>
          <div className={styles.MonthIncome}>
            <span className={styles.MonthIncome2}>¥200.00</span>本月收入</div>
        </div>
        <div className={styles.DataChoose}>
          <DatePicker
            mode="month"
            // mode="date"
            className={styles.Choose}
            title="选择时间"
            extra={this.state.chooseMonth}
            // value={this.state.date}
            onChange={this.changeDate}
          >
            <List.Item arrow="horizontal" ><span className={styles.Income}>(¥100.00)</span><span className={styles.Data}><i className="icon iconfont icon-rili" /></span></List.Item>
          </DatePicker>
        </div>
        <div style={{ backgroundColor: '#fff' }}>
          {/* {
                   datas.map((value) => {


                     return ( */}
          <List className="my-list">
            <Item extra="$100.00" className={styles.Action}>订单59814482122<Brief>2017.12.21 13:22:00</Brief></Item>
          </List>
          {/* );
                   })

              } */}
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

export default connect(mapStateToProps)(withRouter(MyIncome));
