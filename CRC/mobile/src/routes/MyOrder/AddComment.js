import React from 'react';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router';
import { Button, WhiteSpace, WingBlank, Toast } from 'antd-mobile';
import { connect } from 'dva';
import StarRate from '../../common/StarRate';
import styles from './DataOrderDetail.less';
// import DataOrderFooter from './DataOrderFooter';

const pageTitle = '发表评价';

class AddComment extends React.Component {

  state={
    evaluationTypes: [],
  }

  componentDidMount() {
    // @todo 加loading，当请求当前project非待评价状态时跳转到该项目的项目详情页
    const projectId = this.props.match.params.id;
    this.props.dispatch({
      type: 'MyOrder/evaluationProject',
      payload: {
        projectId,
      },
    });
    this.setState({
      evaluationTypes: this.props.evaluationTypes,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      evaluationTypes: nextProps.evaluationTypes,
    });
  }

  changeRate = (value, type = {}) => {
    const { evaluationTypes } = this.state;
    evaluationTypes.map((v, index) => {
      if (v.evaluationTypeId == type.evaluationTypeId) {
        evaluationTypes[index].evaluationScore = value;
      }
    });
    this.setState({
      evaluationTypes,
    });
  }

  publishEvaluation = () => {
    const { evaluationTypes } = this.state;
    let needSetScore = false;
    const params = {};
    evaluationTypes.map((v, index) => {
      if (!v.evaluationScore) {
        needSetScore = true;
      }
      params[`projectAppraisals[${index}].evaluationScore`] = v.evaluationScore;
      params[`projectAppraisals[${index}].evaluationTypeId`] = v.evaluationTypeId;
    });
    if (needSetScore) {
      Toast.info('请选择评分', 2);
      return;
    }
    const projectId = this.props.match.params.id;
    Toast.loading('加载中...', 0);
    this.props.dispatch({
      type: 'MyOrder/publishEvaluation',
      payload: {
        ...params,
        projectId,
      },
      callback: (response = {}) => {
        if (response.error) {
          Toast.info(response.error, 1.8);
          return;
        }
        this.props.dispatch({
          type: 'MyOrder/queryProjectContent',
          payload: { projectId },
          callback: () => {
            Toast.hide();
            this.props.history.push(`/MyOrder/DataOrder/${projectId}`);
          },
        });
      },
    });
  }

  render() {
    const isAssistant = sessionStorage.role == 'INSIDE_ASSISTANT';
    const isDoctor = sessionStorage.role == 'DOCTOR' || sessionStorage.role == 'NOTDOCTOR';
    const { evaluationTypes } = this.props;
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
        <div style={{ backgroundColor: '#fff', paddingBottom: '20px' }}>
          <div style={{ padding: '10px 15px' }}>
            <i className="icon iconfont icon-pingfen" style={{ fontSize: '20px', marginRight: '15px' }} />
            {
                  isAssistant && <span>医生评分</span>
                }
            {
                  isDoctor && <span>医助评分</span>
                }
          </div>
          {
            evaluationTypes.map(type =>
              <div className={styles.starDiv} key={type.evaluationTypeId}>
                <p className={styles.starInfo}>
                  {type.evaluationTypeName}
                </p>
                <p className={styles.stars}>
                  <StarRate
                    count={5} value={type.evaluationScore}
                    onChange={(value) => { this.changeRate(value, type); }}
                  />
                </p>
              </div>,
            )
          }
        </div>
        <WhiteSpace size="lg" />
        <WingBlank size="lg">
          <Button
            style={{
              backgroundColor: '#fe8260',
              color: '#fff',
            }}
            onClick={() => {
              this.publishEvaluation();
            }}
          >
                发表
        </Button>
        </WingBlank>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { allOrder = [], evaluationTypes = [] } = state.MyOrder || {};
  return {
    allOrder,
    evaluationTypes,
  };
}

export default connect(mapStateToProps)(withRouter(AddComment));
