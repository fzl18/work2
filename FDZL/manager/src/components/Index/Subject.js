import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import API_URL from '../../common/url';
import { Row, Col, Popconfirm,  Card,Table, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Upload, notification  } from 'antd';
import Editor from '../common/Editor';
import Ueditor from '../../common/Ueditor/Ueditor';
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
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState(value);
      // console.log(value)
    }
  }

  handleChange = (name,e) => {
    const val= e.target.value
    this.setState({
      [name]:e.target.value,
    },()=>{this.triggerChange({val})})
    // console.log(this.state)
  }

  triggerChange = (changedValue) => {
    const onChange = this.props.onChange;

    if (onChange) {
      onChange(Object.assign({}, this.state,changedValue));

    }
  }
  render(){
    const {researchSiteId,hospital,department,mainResearcher }=this.state
    console.log(this.state)
    return(      
      <InputGroup style={this.props.style} size='large'>
        <Col>
          <Input defaultValue={researchSiteId} style={{display:'none'}} />
        </Col>
        <Col>
          <Input defaultValue={hospital} style={{width:180,}} placeholder="请输入医院" onChange={this.handleChange.bind(this,'hospital')}/>
        </Col>
        <Col >
          <Input defaultValue={department} style={{width:150,marginLeft:10}} placeholder="请输入科室" onChange={this.handleChange.bind(this,'department')} />
        </Col>
        <Col >
          <Input defaultValue={mainResearcher} style={{width:100,marginLeft:10}} placeholder="请输入研究者" onChange={this.handleChange.bind(this,'mainResearcher')} />
        </Col>
        <Col >
          {this.props.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="close-square"
              style={{color:'red',fontSize:20}}
              disabled={this.props.length === 1}
              onClick={this.props.remove}
            />
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
        if(value){
            let html = this.delHtmlTag(value.editorContent = '')
            if (html) {
                callback();
            return;
            }
        }      
        callback()
        return
    }

    remove = (k) => {
      
      const { form } = this.props;
      let centers = form.getFieldValue('centers');
      // console.log(centers,k)
      if (centers.length === 1) {
        return;
      }
      centers.splice(k,1)
      console.log(centers)
      form.setFieldsValue({
        // centers: centers.filter((key,i) => {console.log(key,i,k) ; return i !== k}),
        centers
      });
    }

    add = () => {
      let uuid={department:"",hospital:"",mainResearcher:"",researchSiteId:''}
      const { form } = this.props;
      const centers = form.getFieldValue('centers');
      const nextKeys = centers.concat(uuid);
      form.setFieldsValue({
        centers: nextKeys,
      });
    }
    
    componentDidMount(){
      const  { getFieldValue} = this.props.form;
      const imgUrl= getFieldValue('mainImgNameUrl')
      const fileList = getFieldValue('mainImgNameUrl') ? [{
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
      // console.log(typeof value)
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
        const { previewVisible, previewImage, submitting, fileList} = this.state;
        const uploadButton = (
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">上传图片</div>
          </div>
        );
        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 7 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 12 },
            md: { span: 10 },
          },
        };
    
        const submitFormLayout = {
          wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 12, offset: 7 },
            md: { span: 10, offset: 7 },
          },
        };

        getFieldDecorator('centers',{initialValue: [{department:"",hospital:"",mainResearcher:"",researchSiteId:''}]})
        const centers = getFieldValue('centers')
        console.log(centers)        
        const site = centers &&
        centers.map((k, index) =>{
         return(
           <FormItem
             {...(index === 0 ? formItemLayout : submitFormLayout)}
             label={index === 0 ? '研究中心' : ''}              
             key={index}
           >
             {getFieldDecorator(`researchSiteList[${index}]`,{initialValue: k})(
               <AddInput remove={()=>{ this.remove(index) }} length={centers.length} style={{ width: '150%',display:'inline-block' ,marginRight: 8 }} />
             )}
           </FormItem>
        )})
        return(
            <div>
            <Form onSubmit={this.props.handleSubmit} style={{ marginTop: 8 }}
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
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>              
                )}
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
                        <Option value='NON-INTERVENTION'>非干预</Option>
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
                {getFieldDecorator('subjecgtTime', {
                  
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
                  提交
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.props.closeModalView.bind(this,'modalVisible','close')}>取消</Button>
              </FormItem>
            </Form>
            <Modal visible={previewVisible} footer={null} onCancel={()=>{this.setState({previewVisible:false})}}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
           </div>
          
        )
    }
}

class SearchForm extends Component {
    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.props.handleSearch} layout="inline">
                <FormItem label="研究课题题目">
                {getFieldDecorator('researchSubjectTitle')(
                    <Input placeholder="请输入标题" />
                )}
                </FormItem>
                <FormItem label="研究类型">
                {getFieldDecorator('researchType')(
                    <Select allowClear style={{width:100}} placeholder="请选择">
                        <Option value='INTERVENTION'>干预</Option>
                        <Option value='NON_INTERVENTION'>非干预</Option>
                    </Select>
                )}
                </FormItem>
                <FormItem label="研究时间">
                {getFieldDecorator('subjecgtTime')(
                    <RangePicker  placeholder={['开始时间','结束时间']} format="YYYY-MM-DD" style={{width:280}} />
                )}
                </FormItem>
                <FormItem label="研究状态">
                {getFieldDecorator('researchStatus')(
                    <Select allowClear style={{width:100}} placeholder="请选择">
                        <Option value='PREPARING '>准备中</Option>
                        <Option value='INTO'>入组中</Option>
                        <Option value='IN'>入组完成</Option>
                        <Option value='COMPLETED'>已完成</Option>
                    </Select>
                )}
                </FormItem>
                <Button icon="search" type="primary" htmlType="submit" style={{float:'right'}}>搜索</Button>
            </Form>
        );
    }
}


export default class Subject extends Component {
state = {
    loading:false,
    pagination:{
        pageSize: config.pageSize,
        current: 1,
    },
    listData:[],
    detail:'',
    addInputValue: '',
    modalVisible: false,
    selectedRows: [],
    searchFormValues: {},
    isEdit:false,
    selectedRowKeys: [],
    totalCallNo: 0,
    showStyle:"block",
  };

  loadListData = (params) => {
    const {pagination}=this.state
    this.setState({
        loading: true,
    });
    const options ={
        method: 'POST',
        url: API_URL.index.queryResearchSubjectList,
        data: {
            offset: pagination.current || 1,
            limit: pagination.pageSize,
            ...params,
        },
        dataType: 'json',
        doneResult: data => {
            if (!data.error) {
                const listData = data.datas || data.data;
                pagination.total = data.totalCount;
                this.setState({
                    loading: false,
                    listData,
                    pagination,
                });
            } else {
                Modal.error({ title: data.error });
            }
            this.setState({loading:false})
        }
    }
    $.sendRequest(options)
  }

  componentDidMount() {
    this.checkShowTable();
    this.loadListData()
  }

  componentWillReceiveProps(nextProps) {
    // clean state
    this.checkShowTable();
    this.loadListData();
    if (nextProps.selectedRows && nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
        totalCallNo: 0,
      });
    }
  }

  checkShowTable = () => {
    const urlHash = location.hash;
    if(urlHash.startsWith("#/index/subject/save")){
      this.setState({
        showStyle: "none",
      })
    }else{
      this.setState({
        showStyle: "block",
      })
    }
  }
  
  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const totalCallNo = selectedRows.reduce((sum, val) => {
      return sum + parseFloat(val.callNo, 10);
    }, 0);

    this.handleSelectRows(selectedRows);
    this.setState({ selectedRowKeys, totalCallNo });    
  }

  handleTableChange = (pagination, filtersArg, sorter) => {
    const { searchFormValues,} = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...searchFormValues,
      ...filters,
      offset:pagination.current,
    };
    if (sorter.field) {
      params.sort = sorter.field;
      params.direction = sorter.order == "descend" ? "DESC" :  "ASC";

    }
    
    this.setState({pagination},()=>{
      this.loadListData(params)
    })
  } 

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    // dispatch({
    //   type: 'rule/fetch',
    //   payload: {},
    // });
  }


  handleMenuClick = (e) => {

    const { selectedRows } = this.state;
    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        // dispatch({
        //   type: 'rule/remove',
        //   payload: {
        //     no: selectedRows.map(row => row.no).join(','),
        //   },
        //   callback: () => {
        //     this.setState({
        //       selectedRows: [],
        //     });
        //   },
        // });
        break;
      default:
        break;
    }
  }

  handleSelectRows = (rows) => {
    const arr=[]
    rows.map(d => {
      arr.push(d.id)
    })
    this.setState({
      selectedRows: arr,
    });
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.searchFormRef.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue)
      const rangeTimeValue = fieldsValue['subjecgtTime'] || null;
      fieldsValue.beginTime = rangeTimeValue && Object.keys(rangeTimeValue).length>0 ? rangeTimeValue[0].format('YYYY-MM-DD') :null
      fieldsValue.endTime = rangeTimeValue && Object.keys(rangeTimeValue).length>0 ? rangeTimeValue[1].format('YYYY-MM-DD') :null
      fieldsValue.subjecgtTime=''
      fieldsValue.researchSubjectTitle = fieldsValue.researchSubjectTitle && fieldsValue.researchSubjectTitle.trim()
      const {pagination}=this.state
      pagination.current = 1       
      this.setState({
        searchFormValues: fieldsValue,
        pagination
      },()=>{this.loadListData(fieldsValue)});
    });
  }


  handleAddInput = (e) => {
    this.setState({
      addInputValue: e.target.value,
    });
  }


  renderSearchForm() {
    const { selectedRows, searchFormValues } = this.state;
    const mapPropsToFields = () => ({ 
        researchSubjectTitle:{value:searchFormValues.researchSubjectTitle},
        researchType:{value:searchFormValues.researchType},
        researchStatus:{value:searchFormValues.researchStatus},
        subjecgtTime:{value:searchFormValues.beginTime && [moment(searchFormValues.beginTime),moment(searchFormValues.endTime)]},
          })
    SearchForm = Form.create({mapPropsToFields})(SearchForm)    
    return (
        <Row gutter={2}>
            <Col md={24} sm={24} >
                <SearchForm handleSearch={this.handleSearch} ref = { el => {this.searchFormRef = el}}/>
            </Col>
            <Col md={24} sm={24} style={{textAlign:'right'}}>
            {
                selectedRows.length > 0 &&
                <Popconfirm title="确定要删除吗？" onConfirm={()=>{this.del(this.state.selectedRows)}} okText="是" cancelText="否">
                    <Button type="danger" style={{marginRight:10}}> 批量删除</Button>
                </Popconfirm>
            }            
                <Link to="/index/subject/save"><Button icon="plus" type="primary">添加</Button></Link>
            </Col>
        </Row>
    );
  }


  handleSubmit = (e) => {
    e.preventDefault();
    this.formboxref.validateFieldsAndScroll((err, values) => {      
      if (!err) {
        console.log(values.researchType)
        values.beginTime =values.subjecgtTime && values.subjecgtTime[0].format(dayFormat)
        values.endTime = values.subjecgtTime && values.subjecgtTime[1].format(dayFormat)
        values.mainImgName = values.mainImgName.file ? values.mainImgName.file.response.data[0].fileName : values.mainImgName
        values.researchType = values.researchType == 'NON-INTERVENTION' ? 'NON_INTERVENTION' : values.researchType
        values.subjecgtTime = null
        values.centers=null
        this.save(values)
      }
    });
  }

  save = (params) => {
    const {isEdit,editId}=this.state
    // console.log(params);
    const {researchSiteList = []} = params;
    const siteListObj = {};
    researchSiteList.map((value, index) => {
      siteListObj[`researchSiteList[${index}].researchSiteId`] = value.researchSiteId || null;
      siteListObj[`researchSiteList[${index}].hospital`] = value.hospital;
      siteListObj[`researchSiteList[${index}].department`] = value.department;
      siteListObj[`researchSiteList[${index}].mainResearcher`] = value.mainResearcher;
    })
    params.researchSiteList = [];
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
                this.changeModalView('modalVisible','close')
                this.loadListData()
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

  changeModalView = (modalName,isShow,type,callback) => {    
    this.setState({
      [modalName]: isShow==='open' ? true : isShow==='close' ? false : false,
    })
    if(type=='new'){
      this.setState({
        isEdit:false,
      })
    }
    if(type=='edit'){
      this.setState({
        isEdit:true,
      })
    }    
    callback && callback()
    }


  render() {
    const {loading, listData, detail, selectedRows, addInputValue, isEdit, selectedRowKeys, totalCallNo, modalVisible, pagination, showStyle } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width:60,
      },
      {
        title: '研究课题题目',
        dataIndex: 'researchSubjectTitle',
        width:250,
      },
      {
        title: '研究类型',
        dataIndex: 'researchType',
        width:100,
        sorter: true,
        render: (text,record,index) => (
            record.researchType ==='INTERVENTION' ?
                <div>干预</div> :
            record.researchType ==='NON_INTERVENTION' ?  
                <div>非干预</div> : null                        
        )
      }, 
      {
        title: '研究开始时间',
        dataIndex: 'beginTime',
        width:130,
        sorter: true,
        render:(text,record)=> record.beginTime && moment(record.beginTime).format("YYYY-MM-DD")
      },      
      {
        title: '研究结束时间',
        dataIndex: 'endTime', 
        width:130,
        sorter: true,
        render:(text,record)=> record.endTime && moment(record.endTime).format("YYYY-MM-DD")
      },      
      {
        title: '研究状态',
        dataIndex: 'researchStatus', 
        width:100,
        sorter: true,
        render: (text,record,index) => {
            let con
            switch(record.researchStatus){
                case "PREPARING" :
                con = "准备中"
                break;
                case "INTO" :
                con= "入组中"
                break;
                case "IN" :
                con = "入组完成"
                break;
                case "COMPLETED" :
                con= "已完成"
                break;
            }
            return (<div>{con}</div>)
        }
      },      
      {
        title: '创建时间',
        dataIndex: 'createTime', 
        width:150,
        sorter: true,
      },      
      {
        title: '操作',
        width:100,
        render: (text,record,index) => (
          <div>
            <Link to={`/index/subject/save/${record.id}`}>修改</Link>
            <span className="ant-divider" />
            <Popconfirm title="确定要删除吗？" onConfirm={()=>{this.del(record.id)}} okText="是" cancelText="否">
            <a href="javascript:;" >删除</a>
            </Popconfirm>
          </div>
        ),
      },
    ];

    const lists = []
    listData.map((d,i)=>{
        let list = {
            index: ((pagination.current - 1) || 0) * pagination.pageSize + i + 1,
            id:d.researchSubjectId,
            ...d,
            subjectTime:`${d.beginTime} ~ ${d.endTime}`,
        }
        lists.push(list)
    })

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
    };

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions:config.pageSizeOptions,
      ...pagination,
    };

    const mapPropsToFields = () => (        
      isEdit ?        
        { 
            researchSubjectTitle:{value:detail.researchSubjectTitle},
            researchType:{value:detail.researchType ? `${detail.researchType}` : ''},
            researchSubjectId:{value:detail.researchSubjectId},
            subjectTime:{value:[moment(detail.beginTime),moment(detail.endTime)]},
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
    return (
      <div style={{display: showStyle}}>
            <div>
              {this.renderSearchForm()}
            </div>
            <Table
              loading={loading}
              rowKey={record => record.id}
            //   rowSelection={rowSelection}
              onSelectRow={this.handleSelectRows}
              dataSource={lists}
              columns={columns}
              pagination={paginationProps}
              onChange={this.handleTableChange}
              scroll={{y:lists.length > config.listLength ? config.scroll.y : null}}
            />
            <Modal
                title={isEdit ? '修改动态':'添加动态'}
                visible={modalVisible}
                width={800}
                onOk={this.handleAdd}
                onCancel={this.changeModalView.bind(this,'modalVisible','close')}
                footer={null}
            >
               <FormBox ref={el=>{this.formboxref = el}} closeModalView={this.changeModalView} handleSubmit={this.handleSubmit}/>
            </Modal>
      </div>
    );
  }
}
