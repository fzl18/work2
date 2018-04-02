import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { List, InputItem, Button, Toast } from 'antd-mobile';
import moment from 'moment';
import { withRouter } from 'react-router';
import styles from './PersonalInfo.less';

const pageTitle = '专业';
// const Item = List.Item;

class Subject extends React.Component {
  state={
    info: {},
  }


  componentDidMount() {
    this.setState({
      info: this.props.AssistantBaisInfo,
    });
  }
  componentWillReceiveProps() {
    this.setState({
      info: this.props.AssistantBaisInfo,
    });
  }
  onStateChange = (e, key) => {
    const { info } = this.state;
    info[key] = e;
    this.setState({
      info,
    });
  }
  Modify=() => {
    const { subject } = this.state.info || {};
    const { isGcp } = this.props.AssistantBaisInfo;
    const workBeginTimeValue = this.state.info.workBeginTime;
    const gcpTimeValue = this.state.info.gcpTime;
    const workBeginTime = workBeginTimeValue && moment(workBeginTimeValue).format('YYYY-MM-DD');
    const gcpTime = gcpTimeValue && moment(gcpTimeValue).format('YYYY-MM-DD');
    if (subject == '' || (subject && subject.trim() == '') || (subject == null)) {
      Toast.info('请输入专业', 1, () => {}, false);
      return;
    }
    this.props.dispatch({ type: 'PersonalInfo/modifyAssistantInfo',
      payload: {
        subject, workBeginTime, gcpTime, isGcp,
      },
      callback: (response) => {
        Toast.info(response.success, 1, () => {}, false);
        this.props.history.push('/EssentialiInformation');
      },
    });
  }

  render() {
    const { subject } = this.state.info;
    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>

        <div className={styles.SubjectHead}>
          <List className="my-list" >

            <div>
              <InputItem
                clear
                value={subject}
                maxLength="13"
                onChange={e => this.onStateChange(e, 'subject')}
              >专业</InputItem>
            </div>
          </List>
        </div>
        <div className={styles.Modifybotton} >
          <Button
            className={styles.ModifySubjectButton}
            onClick={this.Modify}
          >
            <p style={{ color: 'white', fontSize: 16, position: 'relative', marginTop: 0 }}>修改</p></Button>
        </div>
      </div>
    );
  }

}

function mapStateToProps(state) {
  const { AssistantBaisInfo = {} } = state.PersonalInfo || {};

  return {
    loading: state.loading,
    AssistantBaisInfo,
  };
}

export default connect(mapStateToProps)(withRouter(Subject));
