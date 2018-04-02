import React from 'react';
import { List } from 'antd-mobile';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import moment from 'moment';
// import {  List } from 'antd-mobile';
// import enUs from 'antd-mobile/lib/date-picker/locale/en_US';
import styles from './Notice.less';


const pageTitle = '公告详情';
class Content extends React.Component {
  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch({ type: 'Notice/queryContent', payload: { noticeId: match.params.id } });
  }
  render() {
    const content = this.props.content[0];
    console.log(content);
    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>
        <div className={styles.InfoTap}>
          <div style={{ width: '100%' }}>
            <List className={styles.info} >
              <List.Item multipleLine >
                {content && content.noticeTitle}
                <List.Item.Brief >
                  <span className={styles.time}>{content && content.pubTime && moment(content.pubTime).format('YYYY-MM-DD')}</span>
                </List.Item.Brief>
              </List.Item>
              <List.Item multipleLine>
                <List.Item.Brief>
                  {/* <img alt="" src={content && content.noticeImgName}
                  style={{ width: '100%' }} /> */}
                  {<img alt="" src={content && content.noticeImgUrl} style={{ width: '100%', height: '100%' }} />}
                  <br />
                  <div className="content" dangerouslySetInnerHTML={{ __html: content && content.noticeContent }} />
                </List.Item.Brief>
              </List.Item>
            </List>
          </div>
        </div>
      </div>
    );
  }


    }


function mapStateToProps(state) {
  const { content = [] } = state.Notice || {};
  return {
    loading: state.loading.models.Notice,
    content,
  };
}

export default connect(mapStateToProps)(withRouter(Content));
