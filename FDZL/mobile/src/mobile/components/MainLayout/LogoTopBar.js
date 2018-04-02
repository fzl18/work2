import React from 'react';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import styles from './MainLayout.less';

class LogoTopBar extends React.Component {
  componentDidMount() {
    if (!this.props.info || !this.props.info.departmentLocalName) {
      this.props.dispatch({ type: 'Department/query', payload: {} });
    }
  }

  render() {
    const {
     departmentLocalName,
     logoImgUuidUrl,
 } = this.props.info;
    return (
      <div className={styles.indexlog}>
        <div className="logo_top_bar">
          <span alt="" style={{ backgroundImage: `url(${logoImgUuidUrl})` }} className="top_bar_logo" />
          {departmentLocalName}
        </div>
      </div>
    );
  }
}

LogoTopBar.propTypes = {
};

function mapStateToProps(state) {
  const { info = {} } = state.Department || {};
  return {
    loading: state.loading.models.Department,
    info,
  };
}


export default connect(mapStateToProps)(withRouter(LogoTopBar));
