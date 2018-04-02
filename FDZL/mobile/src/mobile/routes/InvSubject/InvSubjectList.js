import React from 'react';
import { SearchBar, WhiteSpace, Picker } from 'antd-mobile';
import { connect } from 'dva';
import Helmet from 'react-helmet';
import InvSubjectShare from './InvSubjectShare';
import styles from './InvSubject.less';
import Navigation from '../../components/MainLayout/Navigation';

function search(e, dispatch) {
  dispatch({ type: 'InvSubject/query', payload: { researchSubjectTitle: e } });
}

const pageTitle = '研究课题';


class InvSubjectList extends React.Component {
  state={
    PREPARING: '准备中',
    INTO: '入组中',
    IN: '入组完成',
    COMPLETED: '已完成',
    value: this.props.researchSubjectTitle,
  }

  componentDidMount() {
    this.props.dispatch({ type: 'InvSubject/query', payload: { } });
    window.scrollTo(0, 0);
  }


  selectPicker = (e) => {
    this.props.dispatch({ type: 'InvSubject/query', payload: { researchStatus: e[0] } });
  }

  render() {
    let status = '全  部';
    const { researchStatus } = this.props;
    if (researchStatus === 'PREPARING') {
      status = '准备中';
    } else if (researchStatus === 'INTO') {
      status = '入组中';
    } else if (researchStatus === 'IN') {
      status = '入组完成';
    } else if (researchStatus === 'COMPLETED') {
      status = '已完成';
    } else if (researchStatus === '') {
      status = '全  部';
    }
    //  else if (researchStatus === undefined) {
    //   status = '研究状态▼';
    // }
    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
          <style type="text/css">{`
                body,#root,.am-search{
                    background-color: #ddeaf0;
                }
          `}</style>
        </Helmet>
        {/* <WhiteSpace /> */}
        <Picker
          data={[
            {
              label: '全部',
              value: '',
            },
            {
              label: '准备中',
              value: 'PREPARING',
            },
            {
              label: '入组中',
              value: 'INTO',
            },
            {
              label: '入组完成',
              value: 'IN',
            },
            {
              label: '已完成',
              value: 'COMPLETED',
            },
          ]} cols={1}
          onOk={e => this.selectPicker(e)}
          value={[researchStatus]}
        >

          <span style={{ position: 'relative', left: '10px', top: '28px', color: '#535355' }}>
            {status}
            <i className={styles.triangle} />
          </span>
        </Picker>
        <SearchBar
          className={styles.search}
          style={{ marginLeft: '80px' }}
          placeholder="关键词搜索"
          value={this.state.value}
          onChange={(e) => {
            this.setState({ value: e });
          }}
          onBlur={() => search(this.state.value, this.props.dispatch)}
          onClear={() => {
            this.setState({ value: '' });
          }}
          onCancel={() => {
            this.setState({
              value: '',
            });
            search('', this.props.dispatch);
          }}
          maxLength={50}
          onSubmit={e => search(e, this.props.dispatch)}
        />

        <WhiteSpace />
        <InvSubjectShare nextPage={true} pullRefresh={true} scrollY={true} />
        <Navigation />
      </div>
    );
  }
}


function mapStateToProps(state) {
  if (state.InvSubject) {
    const { searchParmas = {} } = state.InvSubject;
    return {
      researchSubjectTitle: searchParmas.researchSubjectTitle,
      researchStatus: searchParmas.researchStatus,
    };
  }
}
export default connect(mapStateToProps)(InvSubjectList);
