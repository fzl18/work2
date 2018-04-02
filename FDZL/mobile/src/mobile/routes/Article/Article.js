import React from 'react';
// import { SearchBar, WhiteSpace, List } from 'antd-mobile';
import { connect } from 'dva';
import moment from 'moment';
// import Helmet from 'react-helmet';
import { WingBlank } from 'antd-mobile';


class Article extends React.Component {


  render() {
    const { meetingTitle, publishDay,
       htmlText, location, lastTendencyTitle, popularScienceTitle, createTime }
     = this.props.atricleData || {};
    return (
      <WingBlank size="sm">
        {/* <Helmet>
          <title>{meetingTitle || lastTendencyTitle || popularScienceTitle}</title>
          <meta name="description"
           content={meetingTitle || lastTendencyTitle || popularScienceTitle} />
        </Helmet> */}
        <div className="art_main">
          <h2 style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-block' }}>
              <span className="art_title" >
                {meetingTitle || lastTendencyTitle || popularScienceTitle}
              </span>
            </div>
          </h2>
          <p className="art_time">
            {
              publishDay ?
              publishDay && moment(publishDay).format('YYYY-MM-DD')
              :
              createTime && moment(createTime).format('YYYY-MM-DD')
            }
            {location && <span className="location_title">{location}</span>}
          </p>
          <div className="art_content">
            <div
              className="dangerousHtml" style={{ width: '100%' }} dangerouslySetInnerHTML={{
                __html: htmlText,
              }}
            />
          </div>
        </div>
      </WingBlank>
    );
  }
}

export default connect()(Article);
