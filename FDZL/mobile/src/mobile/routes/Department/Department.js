import React from 'react';
import { connect } from 'dva';
import { WhiteSpace } from 'antd-mobile';
import Helmet from 'react-helmet';
import MainLayout from '../../components/MainLayout/MainLayout';
import LogoTopBar from '../../components/MainLayout/LogoTopBar';
// import Navigation from '../../components/MainLayout/Navigation';
import DepartmentInfoIndex from './DepartmentInfoIndex';
import DoctorListIndex from './DoctorListIndex';
import ScienceNewsIndex from '../ScienceNews/ScienceNewsIndex';
// import DoctorList from './DoctorList';
// import ScienceNews from './ScienceNews';

const pageTitle = '科室风采';
function Department({ location }) {
  return (
    <MainLayout location={location}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageTitle} />
      </Helmet>
      <LogoTopBar />
      <DepartmentInfoIndex />
      <WhiteSpace />
      <DoctorListIndex />
      <ScienceNewsIndex />
      {/* <DoctorListIndex />
      <ScienceNewsIndex /> */}
      {/* <Navigation /> */}
    </MainLayout>
  );
}

Department.propTypes = {
};

export default connect()(Department);
