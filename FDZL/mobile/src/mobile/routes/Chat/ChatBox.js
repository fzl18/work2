import React from 'react';
import { connect } from 'dva';
import styles from './Chat.less';
import ChatComponent from './Chat';

class ChatBox extends React.Component {
  render() {
    return (
      <div className={styles.normal}>
        <ChatComponent
          id={this.props.match.params.id}
          conversationId={this.props.match.params.conversationId}
        />
      </div>
    );
  }
}


export default connect()(ChatBox);
