import React from 'react';
import { connect } from 'dva';
import Helmet from 'react-helmet';
import { WingBlank } from 'antd-mobile';
// import MainLayout from '../../components/MainLayout/MainLayout';
import { withRouter } from 'react-router';
// import LogoTopBar from '../../components/MainLayout/LogoTopBar';
import styles from './Department.less';
import Navigation from '../../components/MainLayout/Navigation';

const pageTitle = '科室介绍';


class Departmentintroduced extends React.Component {

  render() {
    const {
     htmlText,
departmentLocalName,
logoImgUuidUrl,


 } = this.props.info;

    return (
      <div>
        <div className={styles.head} />
        <div className={styles.background} >
          <Helmet>
            <title>{pageTitle}</title>
            <meta name="description" content={pageTitle} />
            <style type="text/css">{`
                #root{
                  overflow:auto;
                  background-image: url("/images/Departmentbackground.jpg");
                  background-size: 100% auto;
                  background-repeat: no-repeat;
                  background-position-y: 60%;
                  background-color: white;
                  background-attachment: fixed;
                }
            `}</style>
          </Helmet>
          <div >

            <p className={styles.introduced}>
              <div className={styles.LogoTop}>
                <div className={styles.logo_top_bar1}>
                  <span alt="" className={styles.top_bar_logo1}>
                    <img
                      alt=""
                      src={logoImgUuidUrl}
                      className={styles.top_bar_logo2}
                    /> </span>
                  <span>
                    {departmentLocalName}
                  </span>
                </div>
              </div>
              <WingBlank size="md">
                <div
                  className="dangerousHtml"
                  dangerouslySetInnerHTML={{
                    __html: htmlText,
                  }}
                />
              </WingBlank>
            </p>
          </div>
          <Navigation />
        </div>
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

export default connect(mapStateToProps)(withRouter(Departmentintroduced));
