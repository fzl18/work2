import React, {Component} from 'react';
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import API_URL from '../../common/url';
import { Prompt } from 'react-router-dom';
import { Row, Col, Popconfirm,  Card,Table, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Upload, notification  } from 'antd';
import Editor from '../common/Editor';import Ueditor from '../../common/Ueditor/Ueditor';
import {config,uploadser} from '../common/config';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const dayFormat = 'YYYY-MM-DD'

class FormBox extends React.Component {
    state={        
        submitting:false,
        previewVisible: false,
        previewImage:'',
        fileList:[],
        listData:[],
    }

    loadClass=(params)=>{
      const options ={
        method: 'POST',
        url: API_URL.education.queryPopularScienceCategoryList,
        data: {
            offset: 1,
            limit: 999,
            ...params,
        },
        dataType: 'json',
        doneResult: data => {
            if (!data.error) {
                const listData = data.datas || data.data;
                this.setState({
                    loading: false,
                    listData,
                });
            } else {
                Modal.error({ title: data.error });
            }
            this.setState({loading:false})
        }
    }
    $.sendRequest(options)
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
      this.loadClass()
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
        const { getFieldDecorator, getFieldsValue, setFieldsValue} = this.props.form;
        const { previewVisible, previewImage, submitting, fileList, listData} = this.state;
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
                label="文章标题"
              >
                {getFieldDecorator('popularScienceTitle', {
                  rules: [{
                    required: true, message: '请输入标题',
                    whitespace:true,
                  }],
                })(
                  <Input placeholder="请输入标题" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="文章主图"
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
                    //headers={xToken}
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>              
                )}<div style={{color:'#ddd'}}>（图片小于5M，最佳尺寸174*116px）</div>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="文章分类"
              >
                {getFieldDecorator('popularScienceCategoryId', {
                  rules: [{
                    required: true, message: '请选择文章分类',
                  }],
                })(
                    <Select>
                      {listData && listData.map( v => <Option key={v.popularScienceCategoryId} value = {`${v.popularScienceCategoryId}`} >{v.categoryName}</Option> )} 
                    </Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="发布时间"
              >
                {getFieldDecorator('publishTime', {
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
                  <Ueditor/> //<Editor style={{width:460}}/>
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

export default class DetailSave extends React.Component {
    state={
        isEdit:false,
        editId:'',
        isSaved:false,
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.formboxref.validateFieldsAndScroll((err, values) => {      
          if (!err) {
            console.log(values)
            values.publishTime = moment(values.publishTime).format(dayFormat)
            values.mainImgName = values.mainImgName.file ? values.mainImgName.file.response.data[0].fileName : values.mainImgName        
             
            this.save(values)
          }
        });
      }
    
      save = (params) => {
        const {isEdit,editId}=this.state
        const options ={
            method: 'POST',
            url: isEdit ? API_URL.education.modifyPopularScience :  API_URL.education.addPopularScience,
            data: {
                ...params,
                popularScienceId:isEdit ? editId : null,
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
            url: API_URL.education.queryPopularScienceList,
            data: {
                offset: 1,
                limit: 1,
                popularScienceId:id,
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
            url: API_URL.education.deletePopularScience,
            data: {
                offset: 1,
                limit: 1,
                popularScienceId:id,
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
                  popularScienceTitle:{value:detail.popularScienceTitle},
                  mainImgName:{value:detail.mainImgName},
                  mainImgUrl:{value:detail.mainImgUrl},
                  popularScienceCategoryId:{value:`${detail.popularScienceCategoryId}`},
                  publishTime:{value:moment(detail.publishTime)},            
                   htmlText:{value:detail.htmlText},
              } : null
            )
          FormBox=Form.create({mapPropsToFields})(FormBox)
        return( <div>
          <Prompt when={!isSaved} message="是否确认离开当前编辑页?" />
        <FormBox isEdit={isEdit} ref={el=>{this.formboxref = el}} goback={this.props.history.goBack} handleSubmit={this.handleSubmit}/> 
        </div>)
    }
}