import React from 'react';
import { List, WingBlank, WhiteSpace } from 'antd-mobile';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import { Link } from 'dva/router';
// import styles from './WorkShop.less';
import styles from './Department.less';

class DepartmentInfoIndex extends React.Component {
  render() {
    const {
     mainImgUuidUrl,
     introduction,
 } = this.props.info;
    return (
      <div>
        <List
          renderHeader={() => {
            return (<div
              className="list_header_title"style={{ fontSize: '13pt',
                fontFamily: 'Microsoft YaHei' }}
            > 科室介绍<Link
              to="/Department/Departmentintroduced" className="bar_more"style={{ fontSize: '13pt',
                fontFamily: 'Microsoft YaHei',
                color: '#333e4d' }}
            >更多&gt;</Link> </div>);
          }} className="my-list"
        >
          <WhiteSpace />
          <WingBlank size="md" className="clearPrefix">
            <Link to="/Department/Departmentintroduced" >
              <div >

                <img
                  alt="" src={mainImgUuidUrl}
                  style={{ height: '80px', float: 'left', width: '107px', marginBottom: 5, marginRight: 10 }}
                />

              </div>
              <div className={styles.list_info_text} >
                {introduction}
              </div>
            </Link>
          </WingBlank>
          <WhiteSpace />
        </List>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { info = {} } = state.Department || {};
  return {
    loading: state.loading.models.Department,
    info,
  };
}

export default connect(mapStateToProps)(withRouter(DepartmentInfoIndex));
