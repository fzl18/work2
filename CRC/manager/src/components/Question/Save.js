import React, {Component} from 'react';
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import { Prompt } from 'react-router-dom';
import API_URL from '../../common/url';
import { Row, Col, Popconfirm, Checkbox, Card,Table, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Upload, notification  } from 'antd';
import Editor from '../common/Editor';import Ueditor from '../../common/Ueditor/Ueditor';
import {config,uploadser} from '../common/config';
import './style.less'

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
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
      if(value){
        let html = this.delHtmlTag(value)
        if (html) {
          callback();
          return;
        }
      }      
      callback('请输入内容！');
    }

    selectHandle = (v)=>{
      const { setFieldsValue} = this.props.form;        
      this.setState({selectTypeId:v})
      setFieldsValue({questionConductType:[]})
      // questionType && questionType.map(type=>{
      //   if(type.questionTypeId == v){
      //     conductType = type.conductType.join(";")
      //   }
      // })
      // if(conductType.length >=2 ){
      //   checkVaule = [{ label: '下单会员', value: 'ORDER' },
      //   { label: '服务会员', value: 'SERVICE' },]
      // }else if(conductType[0] == 'ORDER'){
      //   checkVaule = [{ label: '下单会员', value: 'ORDER' },
      //   ]
      // }else{
      //   checkVaule = [{ label: '服务会员', value: 'SERVICE' },]
      // }
    }

    componentDidMount(){
      const { getFieldDecorator, getFieldValue, setFieldsValue} = this.props.form;  
      const questionTypeId = getFieldValue('questionTypeId')
      this.setState({selectTypeId:questionTypeId})
    }

    render(){
        const { getFieldDecorator, getFieldValue, setFieldsValue} = this.props.form;
        const { previewVisible, previewImage, submitting, fileList, selectTypeId} = this.state;        
        const {formItemLayout2,submitFormLayout2} = config  
        const type = getFieldValue('questionType')
        const typeOption= type && type.map(d => <Option key={d.questionTypeId} value={`${d.questionTypeId}`}>{d.questionTypeName}</Option>)
        // const checkVaule = type && type.map(d => {if( selectTypeId == d.questionTypeId ){ return d.questionConductType}} )
        const checkVaule = type && type.filter( id => id.questionTypeId == selectTypeId )
        let checkBoxTxt = []
        if(checkVaule && checkVaule.length>0){
          // console.log(checkVaule )
          if(checkVaule[0].conductType == 'ORDER'){
            checkBoxTxt = [{ label: '下单会员', value: 'ORDER' }] 
          }else if(checkVaule[0].conductType == 'SERVICE'){
            checkBoxTxt = [{ label: '服务会员', value: 'SERVICE' }]
          }else if(checkVaule[0].conductType == 'ORDER;SERVICE'){
            checkBoxTxt = [{ label: '下单会员', value: 'ORDER' },{ label: '服务会员', value: 'SERVICE' }]
          }else if(checkVaule[0].conductType == 'SERVICE;ORDER'){
            checkBoxTxt = [{ label: '下单会员', value: 'ORDER' },{ label: '服务会员', value: 'SERVICE' }]
          }
        }
        
        
        return(
            <div id="quest">
            <Form onSubmit={this.props.handleSubmit} style={{ marginTop: 8 }}
            >
              <FormItem
                {...formItemLayout2}
                label="问题分类"
              >
                {getFieldDecorator('questionTypeId', {
                  rules: [{
                    required: true, message: '请选择',
                  }],
                })(
                  <Select placeholder='请选择' onChange={this.selectHandle}>
                    {typeOption}
                  </Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout2}
                label="适用对象"
              >
                {getFieldDecorator('questionConductType', {
                  rules: [{
                    required: true, message: '请至少选择一项',
                  }],
                })(
                  <CheckboxGroup options={checkBoxTxt}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout2}
                label="问题标题"
              >
              {getFieldDecorator('questionTitle', {
                  rules: [{
                    required: true, message: '问题标题不能为空',
                  },{
                    max:255,message: '限制长度255个字符',
                  }],
                })(
                  <Input placeholder='请输入' />
                )}                
              </FormItem>
                    
              <FormItem
                {...formItemLayout2}
                label="问题答案"
              >
                {getFieldDecorator('questionAnswer', {
                  rules: [{
                    required: true,
                    validator: config.validateHtml,
                  }],
                })(
                  <Ueditor /> //<Editor style={{width:460}}/>
                  // <TextArea rows={8} />
                )}
              </FormItem>
              <FormItem {...submitFormLayout2} style={{ marginTop: 32 }}>
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
            console.log(values.questionConductType)
            if(values.questionConductType.length >0 ){
              values.questionConductType = values.questionConductType.join(';')
            }
            this.save(values)
          }
        });
      }

      queryQuestionType=()=>{
        const options ={
            method: 'POST',
            url: API_URL.serive.queryQuestionType,
            data: {
              limit:999
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    this.setState({
                      questionType: data.datas || data.data,
                    });
                } else {
                    Modal.error({ title: data.error });
                }
            }
        }
        $.sendRequest(options)    
      }
    
      save = (params) => {
        const {isEdit,editId}=this.state
        const options ={
            method: 'POST',
            url: isEdit ? API_URL.serive.modifyQuestion :  API_URL.serive.addQuestion,
            data: {
                ...params,
                questionId:isEdit ? editId : null,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    notification['success']({
                        message: data.success,
                        description: '',
                      })
                    this.setState({isSaved:true})
                    this.props.history.goBack()
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
            url: API_URL.serive.queryQuestion,
            data: {
                offset: 1,
                limit: 1,
                questionId:id,
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
                questionId:id,
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

    componentDidMount(){        
        const { id } = this.props.match ? this.props.match.params : ''
        if(id){
          this.edit(id)
        }
        this.queryQuestionType()
    }

    render(){
        const {isEdit, detail, isSaved,questionType}=this.state
        const mapPropsToFields = () => (        
            isEdit ?        
              { 
                  questionTitle:{value:detail.questionTitle},
                  questionTypeId:{value:`${detail.questionTypeId}`},
                  questionConductType:{value:detail.questionConductType.split(";")},
                  questionType:{value:questionType},
                  questionAnswer:{value:detail.questionAnswer},
              } : {
                questionType:{value:questionType},
              }
            )
          FormBox=Form.create({mapPropsToFields})(FormBox)
        return( 
          <div>
        <Prompt when={!isSaved} message="是否确认离开当前编辑页?" />
        {!isSaved ?<FormBox isEdit={isEdit} ref={el=>{this.formboxref = el}} goback={this.props.history.goBack} handleSubmit={this.handleSubmit}/>
        : null} 
        </div>)
    }
}