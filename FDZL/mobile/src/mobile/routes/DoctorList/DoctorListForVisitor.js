import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { withRouter } from 'dva/router';
import Helmet from 'react-helmet';
import styles from './DoctorList.less';
import DoctorItem from './DoctorItem';
import Navigation from '../../components/MainLayout/Navigation';

const pageTitle = '医生团队';
class DoctorListForVisitor extends React.Component {

  render() {
    return (
      <div>
        <div style={{ height: 20, backgroundColor: '#DCEAF0' }} />
        <div className={styles.WorkShopIndex}>
          <Helmet>
            <title>{pageTitle}</title>
            <meta name="description" content={pageTitle} />
          </Helmet>
          <div className={styles.Underline}>
            {/* {withRouter(renderList({ list: this.props.list }))} */}
            {this.props.list.map((value) => {
              return <DoctorItem value={value} key={value.name} forViewOnly={true} />;
            })
        }
          </div>
          <Navigation />
        </div>
      </div>
    );
  }
}

DoctorListForVisitor.PropTypes = {
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


export default connect(mapStateToProps)(withRouter(DoctorListForVisitor));
