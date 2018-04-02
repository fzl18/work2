import React from 'react';
// import { SearchBar, WhiteSpace } from 'antd-mobile';
// import { connect } from 'dva';
// import Helmet from 'react-helmet';
// import InvSubjectList from './InvSubjectList';

// function search(e, dispatch) {
//   console.log(e);
//   dispatch({ type: 'InvSubject/query', payload: { page: e } });
// }

// const pageTitle = '研究课题';
class InvSubject extends React.Component {

  render() {
    // return (
    //   <div>
    //     <Helmet>
    //       <title>{pageTitle}</title>
    //       <meta name="description" content={pageTitle} />
    //       <style type="text/css">{`
    //             body,#root,.am-search{
    //                 background-color: #ddeaf0;
    //             }
    //       `}</style>
    //     </Helmet>
    //     <WhiteSpace />
    //     <div style={{ position: 'relative' }}>
    //       <SearchBar style={{ marginRight: '60px' }}
    // placeholder="关键词搜索" maxLength={50} onSubmit={e => search(e, this.props.dispatch)} />
    //       <span style={{ float: 'right',
    // position: 'absolute', right: '20px', top: '12px' }}>全部</span>
    //     </div>
    //     <InvSubjectList nextPage={true} pullRefresh={true} scrollY={true} />
    //   </div>
    // );
    return (null);
  }
}

export default InvSubject;
