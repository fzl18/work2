import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import DataOrderDetail from './DataOrderDetail';
// import DataOrderFooter from './DataOrderFooter';

const pageTitle = '订单详情';

class DataOrder extends React.Component {

  render() {
    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
          <style type="text/css">{`
                body,#root{
                    background-color: #f6f6f6;
                }
          `}</style>
        </Helmet>

        <DataOrderDetail />
        {/* <DataOrderFooter /> */}
      </div>
    );
  }
}

DataOrder.propTypes = {
};

export default connect()(DataOrder);
