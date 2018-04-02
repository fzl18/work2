import React, {Component} from 'react';
import $ from '../../common/AjaxRequest';
import { Prompt } from 'react-router-dom';
import moment from 'moment';
import API_URL from '../../common/url';
import { Row, Col, Popconfirm,  Card,Table, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Upload, notification  } from 'antd';
import Editor from '../common/Editor';import Ueditor from '../../common/Ueditor/Ueditor';
import {config, uploadser} from '../common/config';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const { MonthPicker, RangePicker } = DatePicker;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const dayFormat = 'YYYY-MM-DD'


class AddInput extends Component {
  constructor(props) {
    super(props);
    const value = this.props.value || {};
    this.state = {
      researchSiteId:value.researchSiteId || '',
      hospital: value.hospital || '',
      department:value.department || '',
      mainResearcher:value.mainResearcher || '',
    };
  }

  componentWillReceiveProps(nextProps) {
    // if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState(value);
    // }
  }

  handleChange = (name,e) => {
    const val= e.target.value
    this.setState({
      [name]:e.target.value,
    },()=>{this.triggerChange({val})})
  }

  triggerChange = (changedValue) => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state,changedValue));
    }
  }
  render(){
    const {researchSiteId,hospital,department,mainResearcher }=this.state
    return(      
      <InputGroup style={this.props.style} size='large'>
        <Col>
          <Input value={researchSiteId} style={{display:'none'}} />
        </Col>
        <Col>
          <Input value={hospital} style={{width:220,}} placeholder="请输入医院" onChange={this.handleChange.bind(this,'hospital')}/>
        </Col>
        <Col >
          <Input value={department} style={{width:200,marginLeft:10}} placeholder="请输入科室" onChange={this.handleChange.bind(this,'department')} />
        </Col>
        <Col >
          <Input value={mainResearcher} style={{width:160,marginLeft:10}} placeholder="请输入研究者" onChange={this.handleChange.bind(this,'mainResearcher')} />
        </Col>
        <Col >
          {this.props.length > 1 ? (
            <Popconfirm title="确定要删除?" onConfirm={this.props.remove} onCancel={()=>{}} okText="是" cancelText="否">
            <Icon
              className="dynamic-delete-button"
              type="close-circle"
              style={{color:'#f04028',fontSize:20,borderRadius:'50%',position:'relative',left:'7px',top:'3px',}}
              disabled={this.props.length === 1}
            />
            </Popconfirm>
          ) : null}
        </Col>
      </InputGroup>
    )
  }
}

class FormBox extends React.Component {
    state={        
        submitting:false,
        previewVisible: false,
        previewImage:'',
        fileList:[],
        centers:[],
    }

    handlePreview = (file) => {
        this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisible: true,      
        });
      }
    
    handleChange = ({fileList}) => {
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
      const maxTxtLength = 10000 //限制输入最大字数(包含图片)
      if(value){
        let imgLength = value.split('<img').length -1
        let html = value.replace(/<[^>]+>/g,"")
        if(html.length + imgLength <= maxTxtLength){          
            callback()
            return
        }else{
          callback(`内容不能超过${maxTxtLength}字符！`)
          return
        }
      }
      callback()
      return
    }

    remove = (k) => {      
      const { centers } = this.state;
      if (centers.length === 1) {
        return;
      }
      centers.splice(k,1)
      this.setState({
        centers
      })
    }

    add = () => {
      let uuid={department:"",hospital:"",mainResearcher:"",researchSiteId:''}
      const { centers } = this.state;
      centers.push(uuid);
      this.setState({
        centers,
      });
    }

    changeCenters=(index,value)=>{
      const { centers } = this.state;
      centers[index] = value
      this.setState({centers})      
    }
    
    componentDidMount(){
      const  { getFieldValue} = this.props.form;
      const centers = getFieldValue('centers') || []
      const imgUrl= getFieldValue('mainImgNameUrl')
      const fileList = getFieldValue('mainImgNameUrl') ? [{
        uid: -1,
        name: 'xxx.png',
        status: 'done',
        url: imgUrl
      }]: []
      this.setState({
        fileList,
        centers
      })
    }

    normFile = (rule, value, callback) => {
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
        const { getFieldDecorator, getFieldsValue, setFieldsValue, getFieldValue} = this.props.form;
        const { previewVisible, previewImage, submitting, fileList,centers} = this.state;
        // var xToken = { };
        // xToken[header] = token; //X-CSRF-TOKEN
        const uploadButton = (
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">上传图片</div>
          </div>
        );
        const {formItemLayout,submitFormLayout} = config
        console.log(getFieldValue('subjectTime'))
        const site = centers && centers.map((k, index) =>
        <FormItem
        {...(index === 0 ? formItemLayout : submitFormLayout)}
        label={index === 0 ? '研究中心' : ''}              
        key={index}
      >
          <AddInput onChange={this.changeCenters.bind(this,index)} value={k} remove={()=>{ this.remove(index) }} length={centers.length} style={{ width: '150%',display:'inline-block' ,marginRight: 8 }} />
        </FormItem>
        )
        return(
            <div>
            <Form onSubmit={this.props.handleSubmit.bind(this,this.state.centers)} style={{ marginTop: 8 }}
            >
              <FormItem
                {...formItemLayout}
                label="研究课题题目"
              >
                {getFieldDecorator('researchSubjectTitle', {
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
                label="课题主图"
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
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>              
                )}<div style={{color:'#bbb'}}>（图片小于5M，最佳尺寸174*116px）</div>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="适应症"
              >
                {getFieldDecorator('malady', {
                  rules: [{
                    
                  }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="研究类型"
              >
                {getFieldDecorator('researchType', {
                  rules: [{
                    
                  }],
                })(
                    <Select allowClear >
                        <Option value='INTERVENTION'>干预</Option>
                        <Option value='NON_INTERVENTION'>非干预</Option>
                    </Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="干预手段"
              >
                {getFieldDecorator('interveneMethod', {
                  rules: [{
                    
                  }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="临床试验分期"
              >
                {getFieldDecorator('clinicalTrailStaging', {
                  rules: [{
                    
                  }],
                })(
                    <Select allowClear>
                        <Option value='1'>I期</Option>
                        <Option value='2'>II期</Option>
                        <Option value='3'>III期</Option>
                        <Option value='4'>IV期</Option>
                        <Option value='999'>不适用</Option>
                    </Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="申办者"
              >
                {getFieldDecorator('sponsor', {
                  rules: [{
                    
                  }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="CRO"
              >
                {getFieldDecorator('cro', {
                  rules: [{
                    
                  }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="主要研究者"
              >
                {getFieldDecorator('reseacher', {
                  rules: [{
                    
                  }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="研究状态"
              >
                {getFieldDecorator('researchStatus', {
                  rules: [{
                    
                  }],
                })(
                    <Select allowClear>
                        <Option value='PREPARING'>准备中</Option>
                        <Option value='INTO'>入组中</Option>
                        <Option value='IN'>入组完成</Option>
                        <Option value='COMPLETED'>已完成</Option>
                    </Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="研究时间"
              >
                {getFieldDecorator('subjectTime', {
                  
                })(
                  <RangePicker/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="研究方案"
              >
                {getFieldDecorator('htmlText', {
                  rules: [{validator:this.validateHtml}],
                })(
                  <Ueditor/> //<Editor style={{width:460}}/>
                )}
              </FormItem>              
              {site}
              <FormItem {...submitFormLayout}>
                <Button type="primary" onClick={this.add} style={{ width: '60%'}}>
                  <Icon type="plus" /> 添加研究中心
                </Button>
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

export default class SubjectSave extends React.Component {
    state={
        isEdit:false,
        editId:'',
        isSaved:false,
    }

    handleSubmit = (centers,e) => {
        e.preventDefault();
        this.formboxref.validateFieldsAndScroll((err, values) => {      
          if (!err) {
            // console.log(values.subjectTime)
            values.beginTime =values.subjectTime && values.subjectTime[0].format(dayFormat)
            values.endTime = values.subjectTime && values.subjectTime[1].format(dayFormat)
            values.mainImgName = values.mainImgName.file ? values.mainImgName.file.response.data[0].fileName : values.mainImgName
            values.researchType = values.researchType == 'NON-INTERVENTION' ? 'NON_INTERVENTION' : values.researchType
            values.subjectTime = null
            values.centers = centers
            // this.setState({isSaved:true},()=>{this.save(values)})
            this.save(values)
          }
        });
      }
    
      save = (params) => {
        const {isEdit,editId}=this.state
        const {centers = []} = params;
        const siteListObj = {};
        centers.map((value, index) => {
          siteListObj[`researchSiteList[${index}].researchSiteId`] = value.researchSiteId || null;
          siteListObj[`researchSiteList[${index}].hospital`] = value.hospital;
          siteListObj[`researchSiteList[${index}].department`] = value.department;
          siteListObj[`researchSiteList[${index}].mainResearcher`] = value.mainResearcher;
        })
        params.centers = [];
        const options ={
            method: 'POST',
            url: isEdit ? API_URL.index.modifyResearchSubject :  API_URL.index.addResearchSubject,
            data: {
                ...params,
                ...siteListObj,
                researchSubjectId:isEdit ? editId : null,
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
            url: API_URL.index.queryResearchSubjectList,
            data: {
                offset: 1,
                limit: 1,
                researchSubjectId:id,
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
            url: API_URL.index.deleteResearchSubjectId,
            data: {
                offset: 1,
                limit: 1,
                researchSubjectId:id,
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
                  researchSubjectTitle:{value:detail.researchSubjectTitle},
                  researchType:{value:detail.researchType ? `${detail.researchType}` : ''},
                  researchSubjectId:{value:detail.researchSubjectId},
                  subjectTime:{value:(detail.beginTime&&detail.endTime) && [moment(moment(detail.beginTime).format("YYYY-MM-DD")),moment(moment(detail.endTime).format("YYYY-MM-DD"))]},
                  clinicalTrailStaging:{value:detail.clinicalTrailStaging ? `${detail.clinicalTrailStaging}` : ''},
                  cro:{value:detail.cro},
                  htmlText:{value:detail.htmlText},
                  interveneMethod:{value:detail.interveneMethod},
                  mainImgName:{value:detail.mainImgName},
                  mainImgNameUrl:{value:detail.mainImgNameUrl},
                  malady:{value:detail.malady},
                  reseacher:{value:detail.reseacher},
                  researchStatus:{value:detail.researchStatus ? `${detail.researchStatus}`:''},
                  sponsor:{value:detail.sponsor},
                  centers:{value:detail.researchSiteList}
              } : null
            )  
          FormBox=Form.create({mapPropsToFields})(FormBox)
        return( <div>
          <Prompt when={!isSaved} message="是否确认离开当前编辑页?" />
          {!isSaved ?<FormBox isEdit={isEdit} ref={el=>{this.formboxref = el}} goback={this.goback} handleSubmit={this.handleSubmit}/>:null } </div>)
    }
}