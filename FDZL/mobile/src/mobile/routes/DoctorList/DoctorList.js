import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { withRouter } from 'dva/router';
import Helmet from 'react-helmet';
import styles from './DoctorList.less';
import DoctorItem from './DoctorItem';
import ChatFooter from '../../components/MainLayout/ChatFooter';

const pageTitle = '医生团队';
class DoctorList extends React.Component {

  componentDidUpdate() {
    document.body.style.overflow = 'auto';
  }

  render() {
    return (
      <div className={styles.WorkShopIndex} style={{ paddingBottom: '50px' }}>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>
        <div className={styles.Underline}>
          {/* {withRouter(renderList({ list: this.props.list }))} */}
          {this.props.list.map((value) => {
            return <DoctorItem value={value} key={value.name} />;
          })
        }
        </div>
        <ChatFooter />
      </div>
    );
  }
}

DoctorList.PropTypes = {
  list: PropTypes.array,
};

function mapStateToProps(state) {
  const { list, total, page } = state.DoctorList;
  return {
    loading: state.loading.models.DoctorList,
    list,
    total,
    page,
  };
}


export default connect(mapStateToProps)(withRouter(DoctorList));
