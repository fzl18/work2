import React from 'react';
import { SearchBar } from 'antd-mobile';
import { connect } from 'dva';
import Helmet from 'react-helmet';
import HotChatsList from './HotChatsList';
import ChatFooter from '../../components/MainLayout/ChatFooter';
import styles from './Chat.less';

function search(e, dispatch) {
  dispatch({ type: 'HotChatsList/query', payload: { msg: e } });
}


const pageTitle = '热门咨询';

class HotChats extends React.Component {

  state={
    value: this.props.msg,
  }

  render() {
    return (
      <div className={styles.HotChats}>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
          <style type="text/css">{`
                body,#root,.am-search{
                    background-color: #ddeaf0;
                }
          `}</style>

        </Helmet>
        <SearchBar
          placeholder="请输入关键字搜索"
          maxLength={50}
          onSubmit={e => search(e, this.props.dispatch)}
          value={this.state.value}
          onChange={(e) => {
            this.setState({ value: e }, () => {
              // search(this.state.value, this.props.dispatch);
            });
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
        />
        <HotChatsList nextPage={true} pullRefresh={true} scrollY={true} />

        <ChatFooter />
      </div>
    );
  }
}
function mapStateToProps(state) {
  const { searchParmas = {} } = state.HotChatsList || {};
  return {
    msg: searchParmas.msg,
  };
}

export default connect(mapStateToProps)(HotChats);
