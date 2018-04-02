import React, {Component} from 'react';
import { Prompt, Redirect } from 'react-router-dom'
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import API_URL from '../../common/url';
import { Row, Col, Popconfirm,  Card,Table, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Upload, notification  } from 'antd';
import Editor from '../common/Editor';
import Ueditor from '../../common/Ueditor/Ueditor';
import {config,uploadser} from '../common/config';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const dayFormat = 'YYYY-MM-DD'
const confirm = Modal.confirm
class FormBox extends React.Component {
    state={        
        submitting:false,
        previewVisible: false,
        previewImage:'',
        fileList:[],
    }

    handlePreview = (file) => {
        this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisible: true,      
        });
      }
    
    handleChange = ({ fileList }) => {
      console.log(fileList)
      if(fileList.status=="error" ){
        message.warn("图片上传出错了，请重试！")
        fileList = []
      }
      this.setState({fileList})
    }

    delHtmlTag = (str)=>{
      return str.replace(/<[^>]+>/g,"");
    }

    validateHtml=(rule, value, callback)=>{
    if((value != "" )&&( value && value.trim()!="")){
        let html = this.delHtmlTag(value)
        if (html) {
          callback();
          return;
        }
      }      
      callback('请输入内容！');
    }

   
    componentDidMount(){      
      const  { getFieldValue} = this.props.form;
      const imgUrl= getFieldValue('mainImgUrl')
      const fileList = getFieldValue('mainImgUrl') ? [{
        uid: -1,
        name: 'xxx.png',
        status: 'done',
        url: imgUrl
      }]: []
      this.setState({
        fileList
      })
    }

    normFile = (rule, value, callback) => {
      console.log(typeof value)
      if(typeof value =='string'){
          callback();
          return;
      }else if( value && value.fileList.length){
        callback();
        return;
      }
      callback('请添加图片');
    }

    render(){
        const { getFieldDecorator, getFieldValue,getFieldsValue, setFieldsValue} = this.props.form;
        const { previewVisible, previewImage, submitting, fileList} = this.state;
        // var xToken = { };
        // xToken[header] = token; //X-CSRF-TOKEN
        const uploadButton = (
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">上传图片</div>
          </div>
        );
        const {formItemLayout,submitFormLayout} = config
        return(
            <div>
            <Form onSubmit={this.props.handleSubmit} style={{ marginTop: 8 }}
            >
              <FormItem
                {...formItemLayout}
                label="动态标题"
              >
                {getFieldDecorator('lastTendencyTitle', {
                  rules: [{
                    required: true, message: '请输入标题',
                    whitespace: true
                  }],
                })(
                  <Input placeholder="请输入标题" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="动态主图"
              >
                {getFieldDecorator('mainImgName', {
                  rules: [{
                    required: true, message: '请添加图片',
                    validator: this.normFile,
                  }],
                })(
                  <Upload
                    action={uploadser}
                    accept={config.imgType}
                    beforeUpload={config.beforeUpload}
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    onRemove={config.imgRemove}
                    // headers={xToken}
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>              
                )}<div style={{color:'#bbb'}}>（图片小于5M，最佳尺寸174*116px）</div>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="发布时间"
              >
                {getFieldDecorator('publishDay', {
                  rules: [{
                    required: true, message: '请选择时间',
                  }],
                })(
                  <DatePicker />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="内容"
              >
                {getFieldDecorator('htmlText', {
                  rules: [{
                    required: true,
                    validator: config.validateHtml,
                    whitespace: true
                  }],
                })(
                  <Ueditor /> //<Editor style={{width:460}}/>                  
                )}
              </FormItem>
              <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  {this.props.isEdit ? '保存':'添加'}
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.props.goback}>取消</Button>
              </FormItem>
            </Form>
            <Modal visible={previewVisible} footer={null} onCancel={()=>{this.setState({previewVisible:false})}}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
           </div>
          
        )
    }
}

export default class NewsSave extends React.Component { 
    state={
        isEdit:false,
        editId:'',
        isSaved:false,
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.formboxref.validateFieldsAndScroll((err, values) => {      
          if (!err) {
            // console.log(values.htmlText.length)
            values.publishDay = moment(values.publishDay).format(dayFormat)
            values.mainImgName = values.mainImgName.file ? values.mainImgName.file.response.data[0].fileName : values.mainImgName
            values.htmlText = values.htmlText            
            this.save(values)
            
          }
        });
      }

    save = (params) => {
        const {isEdit,editId}=this.state
        const options ={
            method: 'POST',
            url: isEdit ? API_URL.index.modifyLastTendency :  API_URL.index.addLastTendency,
            data: {
                ...params,
                lastTendencyId:isEdit ? editId : null,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    notification['success']({
                        message: data.success,
                        description: '',
                      })
                    // this.changeModalView('modalVisible','close')
                    // this.loadListData()     
                    this.setState({isSaved:true})               
                    history.back();      
                } else {
                  Modal.error({ title: data.error});
                }            
            }
        }
        $.sendRequest(options)
      }
    
      edit=(id)=>{
        const options ={
            method: 'POST',
            url: API_URL.index.queryLastTendencyList,
            data: {
                offset: 1,
                limit: 1,
                lastTendencyId:id,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    const detail = data.datas[0] || data.data[0];
                    this.setState({
                        detail,
                        isEdit:true,
                        editId:id,
                    });
                } else {
                    Modal.error({ title: data.error });
                }
            }
        }
        $.sendRequest(options)
      }

      goback=()=>{
        history.back(); 
      }

      componentDidMount(){
        const { id } = this.props.match ? this.props.match.params : ''
        if(id){
          this.edit(id)
        }
      }

      // shouldComponentUpdate(nextProps, nextState){
      //   console.log(nextProps,nextState)
      //   if(nextState.isSaved == true){
      //       return false;
      //   }
      //   return true;
      // }

      
    render(){
        const {isEdit, detail,isSaved}=this.state
        mapPropsToFields = () => (
            isEdit ? 
              { 
                  lastTendencyTitle:{value:detail.lastTendencyTitle},
                  mainImgName:{value:detail.mainImgName},
                  mainImgUrl:{value:detail.mainImgUrl},
                  publishDay:{value:moment(detail.publishDay)},
                  htmlText:{value:detail.htmlText},
              } : null
            )

        FormBox=Form.create({mapPropsToFields})(FormBox)
        return(
        <div>
        <Prompt when={!isSaved} message="是否确认离开当前编辑页?" />
        {!isSaved ? <FormBox isEdit={isEdit} ref={el=>{this.formboxref = el}} goback={this.goback} handleSubmit={this.handleSubmit}/> 
        : null}        
        </div>)
    }
}

