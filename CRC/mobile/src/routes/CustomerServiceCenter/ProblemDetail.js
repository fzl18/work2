import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import styles from './Problem.less';

const pageTitle = '问题详情';
class ProblemDetail extends React.Component {
  componentDidMount() {
    this.props.dispatch({ type: 'CustomerServiceCenter/getInfo', payload: { questionId: this.props.match.params.id } });
  }
  render() {
    const { questionAnswer, questionTitle } = this.props.info;
    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>
        <div className={styles.ProblemDetail}>
          <div className={styles.Ask}>
            <p style={{ color: '#333e4d', marginTop: 10 }}>
              <i className="icon iconfont icon-wen" style={{ fontSize: 25, marginRight: 15, color: 'rgb(243,195,84)' }} />
              {questionTitle}</p>
          </div>
          <div className={styles.Answer}>
            <div className={styles.AnswerLeft}>
              <i
                className="icon iconfont icon-da"
                style={{ fontSize: 26, marginRight: 15, marginLeft: 15, color: 'rgb(124,186,87)' }}
              />
            </div>
            <div className={styles.AnswerRight}>
              <p
                style={{ color: '#333e4d', marginRight: 15 }} className="dangerousHtml" dangerouslySetInnerHTML={{
                  __html: questionAnswer,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  const { info = {} } = state.CustomerServiceCenter || {};
  return {
    loading: state.loading,
    info,
  };
}

export default connect(mapStateToProps)(withRouter(ProblemDetail));
