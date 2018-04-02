import React from 'react';
import { List } from 'antd-mobile';
import { withRouter } from 'react-router';
import styles from './DoctorList.less';
import ElementAuth from '../../components/ElementAuth';

const Item = List.Item;
const Brief = Item.Brief;

class DoctorItem extends React.Component {

  render() {
    const value = this.props.value;
    let authDOM = (<div />);
    if (value.applicantAccountStatus === '已授权') {
      authDOM = (<span className={styles.btn_green} style={{ position: 'absolute', right: 15, top: 15 }}>
        已授权
      </span>);
    } else if (value.applicantAccountStatus === '授权申请中') {
      authDOM = (<span className={styles.btn_orange} style={{ position: 'absolute', right: 15, top: 15 }}>
        授权申请中
      </span>);
    } else if (value.applicantAccountStatus === '已授权他人') {
      authDOM = (<span className={styles.btn_grey} style={{ position: 'absolute', right: 15, top: 15 }}>
        已授权他人
      </span>);
    }
    return (
      <div className={styles.doctor_list}>
        {this.props.forViewOnly ?
          <Item // {/* 访客 */}
            thumb={value.doctorImgUrl}
            multipleLine
            onClick={() => {
              this.props.history.push(`/Chat/DoctorListForVisitor/${value.ydataAccountId}`);
            }}
            auth="visitor"
          >
            <span style={{ marginRight: 10, color: 'rgb(246,172,101)' }}><i className="icon iconfont icon-xunzhang1" /></span>
            <span
              style={{ fontSize: '13pt',
                fontFamily: 'Microsoft YaHei',
                color: '#333e4d',
                fontWeight: 550 }}
            >
              {value.userCompellation}
            </span> <span className={styles.position}>{value.doctorPosition}</span>
            <Brief>
              <span style={{ marginRight: 10, color: 'rgb(191,234,214)' }}><i className="icon iconfont icon-shanchang" /></span>
                擅长：{value.doctorAdept}<br />
              {this.props.forViewOnly ?
                <p className={styles.chat_number} />
                  :
                <p className={styles.chat_number}>
                  <i className="icon iconfont icon-zixun" style={{ fontSize: '17px', marginRight: 10 }} />
                咨询量: {value.inquiries == null ? '0' : value.inquiries}
                </p>
                }
            </Brief>
          </Item>
          :
          <ElementAuth auth="DoctorItem">
            {/* 病人角色 */}
            <Item
              thumb={value.doctorImgUrl}
              multipleLine
              onClick={() => {
                this.props.history.push(`/Chat/DoctorList/${value.ydataAccountId}`);
              }}
              auth="chat"
              extra={(value.consultState && <span className={styles.btn_green} style={{ position: 'absolute', right: 15, top: 15 }} >
                可咨询
              </span>)}
            >
              <span
                style={{ fontSize: '13pt',
                  fontFamily: 'Microsoft YaHei',
                  color: '#333e4d',
                  fontWeight: 550 }}
              >
                {value.userCompellation}
              </span>
              <span className={styles.position}>{value.doctorPosition}</span>
              <Brief>
                擅长：{value.doctorAdept}<br />
                {this.props.forViewOnly ?
                  <p className={styles.chat_number} />
                  :
                  <p className={styles.chat_number}>
                    <i className="icon iconfont icon-zixun" style={{ fontSize: '17px', marginRight: 10 }} />
                咨询量: {value.inquiries == null ? '0' : value.inquiries}
                  </p>
                }
              </Brief>
            </Item>
            {/* 医助角色 */}
            <Item
              thumb={value.doctorImgUrl}
              multipleLine
              onClick={() => {
                this.props.history.push(`/Chat/DoctorList/${value.ydataAccountId}`);
              }}
              auth="auth"
              extra={authDOM}
            >
              <span
                style={{ fontSize: '13pt',
                  fontFamily: 'Microsoft YaHei',
                  color: '#333e4d',
                  fontWeight: 550 }}
              >
                {value.userCompellation}
              </span>
              <span className={styles.position}>{value.doctorPosition}</span>
              <Brief>
                擅长：{value.doctorAdept}<br />
                {this.props.forViewOnly ?
                  <p className={styles.chat_number} />
                  :
                  <p className={styles.chat_number}>
                    <i className="icon iconfont icon-zixun" style={{ fontSize: '17px', marginRight: 10 }} />
                咨询量: {value.inquiries == null ? '0' : value.inquiries}
                  </p>
                }
              </Brief>
            </Item>
            {/* 医生角色 */}
            <Item
              thumb={value.doctorImgUrl}
              multipleLine
              onClick={() => {
                this.props.history.push(`/Chat/DoctorList/${value.ydataAccountId}`);
              }}
              auth="nothing"
            >
              <span
                style={{ fontSize: '13pt',
                  fontFamily: 'Microsoft YaHei',
                  color: '#333e4d',
                  fontWeight: 550 }}
              >
                {value.userCompellation}
              </span>
              <span className={styles.position}>{value.doctorPosition}</span>
              <Brief>
                擅长：{value.doctorAdept}<br />
                {this.props.forViewOnly ?
                  <p className={styles.chat_number} />
                  :
                  <p className={styles.chat_number}>
                    <i className="icon iconfont icon-zixun" style={{ fontSize: '17px', marginRight: 10 }} />
                咨询量: {value.inquiries == null ? '0' : value.inquiries}
                  </p>
                }
              </Brief>
            </Item>


          </ElementAuth>

        }

      </div>
    );
  }
}

export default withRouter(DoctorItem);

