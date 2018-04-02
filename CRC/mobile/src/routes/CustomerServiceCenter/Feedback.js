import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { Picker, List, TextareaItem, Button, Toast, ImagePicker } from 'antd-mobile';
import { withRouter } from 'react-router';
import styles from './Feedback.less';
import { convertBase64UrlToBlob } from '../../utils/jsLibs';

const pageTitle = '在线留言';


class Feedback extends React.Component {
  state = {
    // data: [],
    cols: 1,
    pickerValue: [],
    asyncValue: [],
    sValue: '',
    visible: false,
    TypeofProblem: '',
    messageContent: '',
    messageTypeId: '',
    files: [],
  };

  onStateChange=(e, key) => {
    this.setState({
      [key]: e,
    });
  }
  onPositiveSidedataPicChange = (files, type, index) => {
    console.log(index);
    if (type == 'remove') {
      const newFilesRemoved = this.state.files;
      newFilesRemoved.splice(index, 1);
      this.setState({
        files: newFilesRemoved,
      });
      return;
    }
    const image64 = files[files.length - 1] && files[files.length - 1].url;
    // const imageName = files[0] && files[0].file && files[0].file.name;
    const imageSize = files[files.length - 1] &&
    files[files.length - 1].file && files[files.length - 1].file.size;
    if (imageSize > 20 * 1024 * 1024) {
      Toast.info('图片不能超过20M', 1);
      return;
    }

    const form = new FormData();
    form.append('files', convertBase64UrlToBlob(image64));
    form.append('acctId', sessionStorage.acctId);
    Toast.loading('上传中...', 0);
    this.props.dispatch({
      type: 'Register/uploadImg',
      payload: {
        form,
        noqs: true,
      },
      callback: (response) => {
        if (!response.error) {
          const newFiles = this.state.files;
          newFiles.push({
            url: response.data && response.data[0] && response.data[0].url,
            id: response.data && response.data[0] && response.data[0].fileName,
          });
          Toast.hide();
          this.setState({
            files: newFiles,
          });
        }
      },
    });
  }

  Resubmit=() => {
    const { messageContent, sValue, files } = this.state;
    let { messageTypeId } = this.state;
    let messageTypeIdValue = '';
    // Sconst imageUrl = files && files[0].id;
    const imageUrlPre = [];
    // const imageUrlValue = '';

    files.map((value) => {
      imageUrlPre.push(value.id);
    });
    const imageUrl = imageUrlPre.join(';');
    // imageUrl = `${imageUrlValue};${imageUrlValue}`;

    if (sValue == '') {
      Toast.info('请选择留言分类', 1, () => {}, false);
      return;
    }
    messageTypeId.map((value) => {
      messageTypeIdValue = value;
    });
    messageTypeId = messageTypeIdValue;
    if (messageContent == '') {
      Toast.info('请输入留言内容', 1, () => {}, false);
      return;
    }
    console.log(`问题分类ID${messageTypeId}`);
    console.log(imageUrl);
    this.props.dispatch({ type: 'CustomerServiceCenter/feedback',
      payload: { messageContent, messageTypeId, imageUrl },
      callback: (response) => {
        if (response.success) {
          Toast.info(response.success, 1, () => {}, false);
          this.props.history.push('/CustomerServiceCenter');
        }
      },
    });
  }


  render() {
   // const { getFieldProps } = this.props.form;

    const QuestionType = [

    ];

    this.props.listmessageType.map((value) => {
      QuestionType.push({
        value: value.messageTypeId,
        label: value.messageTypeName,
      });
    });
    const { files } = this.state;
    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>
        <div>
          <List style={{ backgroundColor: 'white' }} className="picker-list">

            <Picker
              data={QuestionType}
              cols={1}
              title="问题类型"
              // cascade={false}
              className={styles.Choose}
              extra="请选择"
              value={this.state.sValue}
              onChange={e => this.onStateChange(e, 'messageTypeId')}
              onOk={v => this.setState({ sValue: v })}
              onDismiss={() => this.setState({ visible: false })}
            >
              <List.Item arrow="horizontal">问题类型</List.Item>
            </Picker>
          </List>
        </div>
        <div style={{ overflow: 'auto' }} className={styles.Feedback}>
          <TextareaItem
            placeholder="请输入您的问题(字数控制在1000字以内)"
            data-seed="logId"
            onChange={(e) => { this.onStateChange(e, 'messageContent'); }}
            maxLength={1000}
            autoHeight
            ref={el => this.customFocusInst = el}
          />
        </div>
        <div className={styles.FeedbackPic}>
          <p className={styles.FeedbackPiWords}>上传照片</p>
          <div className={styles.UpImg} >
            {/* <img src="/images/UpPic.jpg" alt="" className={styles.Img} /> */}
            <ImagePicker
              files={files}
              onChange={this.onPositiveSidedataPicChange}
              onImageClick={(index, fs) => {
                window.wx.previewImage({
                  current: fs[index].url, // 当前显示图片的http链接
                  urls: [fs[index].url], // 需要预览的图片http链接列表
                });
              }}
              selectable={files.length < 10}
              // accept="image/gif,image/jpeg,image/jpg,image/png"
            />
            {/* <p className={styles.AddImg}>添加图片</p> */}
          </div>
        </div>

        <div className={styles.Feedbackbotton} >
          <Button
            className={styles.Button}
            onClick={this.Resubmit}
          >
            <p style={{ color: 'white', fontSize: 16, position: 'relative', marginTop: 0 }}>提交</p></Button>
        </div>

      </div>
    );
  }
}

function mapStateToProps(state) {
  const { listmessageType = [] } = state.CustomerServiceCenter || {};
  return {
    listmessageType,
  };
}

export default connect(mapStateToProps)(withRouter(Feedback));
