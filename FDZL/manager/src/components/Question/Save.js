import React, {Component} from 'react';
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import { Prompt } from 'react-router-dom';
import API_URL from '../../common/url';
import { Row, Col, Popconfirm,  Card,Table, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Upload, notification  } from 'antd';
import Editor from '../common/Editor';import Ueditor from '../../common/Ueditor/Ueditor';
import {config,uploadser} from '../common/config';
import './style.less'

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const dayFormat = 'YYYY-MM-DD'

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
      if(fileList.status=="error"){
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

    validateKeys=(rule, value, callback)=>{
      if(!value){
        callback('关键词不能为空');
      }else{
        const k = []
        value.map(data =>{
          if(!data.keyword){
            callback('关键词不能有空');
          }else{
            k.push('true')
          }
          if(k.length == value.length){
            callback()
            return
          }           
        })
      }
    }

    remove = (k) => {
      const { form } = this.props;
      const questionStoreKeywordList = form.getFieldValue('questionStoreKeywordList');
      if (questionStoreKeywordList.length === 1) {
        return
      }
      questionStoreKeywordList.splice(k,1)
      form.setFieldsValue({
        questionStoreKeywordList,
      })
    }

    add = () => {      
      const { form } = this.props;
      const questionStoreKeywordList = form.getFieldValue('questionStoreKeywordList') || []
      questionStoreKeywordList.push({keyword:'',questionStoreId:'',questionStoreKeywordId:''})
      form.setFieldsValue({
        questionStoreKeywordList,
      });
      // console.log(questionStoreKeywordList)
    }

    txtChange=(index,e)=>{
      const { form } = this.props;
      const questionStoreKeywordList = form.getFieldValue('questionStoreKeywordList');
      questionStoreKeywordList[index].keyword = e.target.value
      form.setFieldsValue({
        questionStoreKeywordList,
      });
      // console.log(index,e.target.value)
    }

    deleteQuestionStoreKeyword =(id)=>{
      const options ={
        method: 'POST',
        url: API_URL.question.deleteQuestionStoreKeyword,
        data: {            
          questionStoreKeywordId:id,
        },
        dataType: 'json',
        doneResult: data => {
          if (!data.error) {
            message.success(data.success)
          } else {
            Modal.error({ title: data.error });
          }            
        }
      }
      $.sendRequest(options)
    }
    
    componentDidMount(){

    }

    render(){
        const { getFieldDecorator, getFieldValue, setFieldsValue} = this.props.form;
        const { previewVisible, previewImage, submitting, fileList} = this.state;        
        const {formItemLayout,submitFormLayout} = config  
        const questionStoreKeywordList = getFieldValue('questionStoreKeywordList') || []
        const key = []
        const formItems = questionStoreKeywordList.map((k, index) => 
            <FormItem              
              required={false}
              key={index}
            >
              <Input value={k.keyword} onChange={this.txtChange.bind(this,index)} style={{width:90,background:'#eee',marginBottom:10}} size='large'/>                  
              {questionStoreKeywordList.length > 1 ? (
                  <i
                    className="iconfont icon-cha"
                    style={{color:'blue',fontSize:22,position: 'relative',top:-8,right:16,cursor:'pointer'}}
                    disabled={questionStoreKeywordList.length === 1}
                    onClick={() => this.remove(index)}
                  />
                ) : null }
            </FormItem>
          );
        return(
            <div>
            <Form onSubmit={this.props.handleSubmit} style={{ marginTop: 8 }}
            >
              <FormItem
                {...formItemLayout}
                label="问题标题"
              >
                {getFieldDecorator('question', {
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
                label="关键字"
              >
              {getFieldDecorator('questionStoreKeywordList', {
                  rules: [{
                    required: true, message: '关键字不能为空',
                    validator: this.validateKeys,
                    whitespace: true
                  }],
                })(
                  <Button type="primary" onClick={this.add} style={{ width:90}}>
                    <Icon type="plus" /> 添加
                  </Button>
                )}                
              </FormItem>
              { questionStoreKeywordList.length > 0 ?
              <FormItem
                {...submitFormLayout}
                label=""
              >
                <div id="item" style={{width:'110%',display:'flex',flexWrap:'wrap'}}>{formItems}</div>
              </FormItem>
              : null
              }            
              <FormItem
                {...formItemLayout}
                label="答案"
              >
                {getFieldDecorator('answer', {
                  rules: [{
                    required: true,
                    whitespace: true,
                    message: '请输入内容!',
                    validator: this.validateHtml,
                  }],
                })(
                  // <Ueditor/> //<Editor style={{width:460}}/>
                  <TextArea rows={8} />
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

export default class Save extends React.Component {
    state={
        isEdit:false,
        editId:'',
        isSaved:false,
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.formboxref.validateFieldsAndScroll((err, values) => {
          if (!err) {
            values.publishDay = moment(values.publishDay).format(dayFormat)
            values.questionStoreKeywordList.map((v,i)=> values[`keywords[${i}]`] = v.keyword)
            values.questionStoreKeywordList=null
            this.save(values)
          }
        });
      }
    
      save = (params) => {
        const {isEdit,editId}=this.state
        const options ={
            method: 'POST',
            url: isEdit ? API_URL.question.modifyQuestionStore :  API_URL.question.addQuestionStore,
            data: {
                ...params,
                questionStoreId:isEdit ? editId : null,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    notification['success']({
                        message: data.success,
                        description: '',
                      })
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
            url: API_URL.question.queryQuestionStoreList,
            data: {
                offset: 1,
                limit: 1,
                questionStoreId:id,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    const detail = data.datas[0] || data.data[0];
                    this.setState({
                        isEdit:true,
                        detail,
                        editId:id,
                    });
                } else {
                    Modal.error({ title: data.error });
                }
            }
        }
        $.sendRequest(options)
      }
    
    
      del = (id) => {
        const options ={
            method: 'POST',
            url: API_URL.question.deleteLastTendency,
            data: {
                offset: 1,
                limit: 1,
                questionStoreId:id,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    notification['success']({
                        message: data.success,
                        description: '',
                      })
                    this.loadListData()
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

    render(){
        const {isEdit, detail, isSaved}=this.state
        const mapPropsToFields = () => (        
            isEdit ?        
              { 
                  question:{value:detail.question},
                  questionStoreKeywordList:{value:detail.questionStoreKeywordList},
                  answer:{value:detail.answer},
              } : null
            )
          FormBox=Form.create({mapPropsToFields})(FormBox)
        return( 
          <div>
        <Prompt when={!isSaved} message="是否确认离开当前编辑页?" />
        <FormBox isEdit={isEdit} ref={el=>{this.formboxref = el}} goback={this.props.history.goBack} handleSubmit={this.handleSubmit}/>
        </div>)
    }
}