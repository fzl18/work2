import React from 'react';
// import Helmet from 'react-helmet';
import { connect } from 'dva';
import MainLayout from '../components/MainLayout/MainLayout';
import AddOrder from '../routes/Order/AddOrder';

// const pageTitle = '首页';

function IndexPage({ location }) {
  return (
    <MainLayout location={location}>
      {/* <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageTitle} />
      </Helmet> */}
      <AddOrder />
    </MainLayout>
  );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
