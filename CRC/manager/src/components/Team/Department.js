import React, {Component} from 'react';
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import API_URL from '../../common/url';
import { Row, Col, Popconfirm,  Card,Table, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Upload, notification  } from 'antd';
import Editor from '../common/Editor';import Ueditor from '../../common/Ueditor/Ueditor';
import {config,uploadser} from '../common/config';

const { TextArea } = Input;
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
        fileLogo:[],
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
      this.setState({fileLogo:fileList})
    }
    handleChange2= ({fileList}) => {
      if(fileList.status=="error"){
        message.warn("图片上传出错了，请重试！")
        fileList = []
      }
      this.setState({fileList})
    }

   
    componentDidMount(){
      const  { getFieldValue} = this.props.form;
      const departmentMainImg= getFieldValue('departmentMainImgUrl')
      const departmentLogoImg= getFieldValue('departmentLogoImgUrl')
      console.log(departmentLogoImg)
      const fileList = getFieldValue('departmentMainImg') ? [{
        uid: -1,
        name: 'main.png',
        status: 'done',
        url: departmentMainImg
      }]: []
      const fileLogo = getFieldValue('departmentLogoImg') ? [{
        uid: -2,
        name: 'logo.png',
        status: 'done',
        url: departmentLogoImg
      }]: []
      this.setState({
        fileList,
        fileLogo,
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
        const { getFieldDecorator, getFieldsValue, setFieldsValue} = this.props.form;
        const { previewVisible, previewImage, submitting, fileList, fileLogo} = this.state;
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
                label="科室名称"
              >
                {getFieldDecorator('departmentName', {
                  rules: [{
                    required: true, message: '请输入名称',
                  }],
                })(
                  <Input placeholder="请输入名称" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="Logo图"
              >
                {getFieldDecorator('departmentLogoImg', {
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
                    fileList={fileLogo}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    onRemove={config.imgRemove}
                  >
                    {fileLogo.length >= 1 ? null : uploadButton}
                  </Upload>              
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="主图"
              >
                {getFieldDecorator('departmentMainImg', {
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
                    onChange={this.handleChange2}
                    onRemove={config.imgRemove}
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>              
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="简介"
              >
                {getFieldDecorator('introduction', {
                  rules: [{
                    required: true,message:'请输入简介'
                  }],
                })(
                  <TextArea rows={4}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="介绍"
              >
                {getFieldDecorator('htmlText', {
                  rules: [{
                    required: true,
                    validator: config.validateHtml,
                  }],
                })(
                  <Ueditor/> //<Editor style={{width:460}}/>
                )}
              </FormItem>
              <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  保存
                </Button>
                {/* <Button style={{ marginLeft: 8 }} onClick={this.props.closeModalView.bind(this,'modalVisible','close')}>取消</Button> */}
              </FormItem>
            </Form>
            <Modal visible={previewVisible} footer={null} onCancel={()=>{this.setState({previewVisible:false})}}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
           </div>
          
        )
    }
}



export default class Department extends Component {
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
  };

  loadListData = (params) => {
    const {pagination,searchFormValues}=this.state
    this.setState({
        loading: true,
    });
    const options ={
        method: 'POST',
        url: API_URL.index.queryDepartment,
        data: {
            offset: pagination.current || 1,
            limit: pagination.pageSize,
            ...searchFormValues,
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
    this.edit()
  }

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows && nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
        totalCallNo: 0,
      });
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
            departmentName:{value:searchFormValues.departmentName},
          })
    SearchForm = Form.create({mapPropsToFields})(SearchForm)    
    return (
        <Row gutter={2}>
            <Col md={22} sm={24} >
                <SearchForm handleSearch={this.handleSearch} ref = { el => {this.searchFormRef = el}}/>
            </Col>
            <Col md={2} sm={8} style={{textAlign:'right'}}>            
            {
                selectedRows.length > 0 &&
                <Popconfirm title="确定要删除吗？" onConfirm={()=>{this.del(this.state.selectedRows)}} okText="是" cancelText="否">
                    <Button type="danger" style={{marginRight:10}}> 批量删除</Button>
                </Popconfirm>
            }            
                <Button icon="plus" type="primary" onClick={()=>{this.changeModalView('modalVisible','open','new')}}>添加</Button>
            </Col>
        </Row>
    );
  }


  handleSubmit = (e) => {
    e.preventDefault();
    this.formboxref.validateFieldsAndScroll((err, values) => {      
      if (!err) {
        values.departmentName = values.departmentName;
        values.departmentLogoImg = values.departmentLogoImg.file ? values.departmentLogoImg.file.response.data[0].fileName : values.departmentLogoImg
        values.departmentMainImg = values.departmentMainImg.file ? values.departmentMainImg.file.response.data[0].fileName : values.departmentMainImg
        this.save(values)
      }
    });
  }

  save = (params) => {
    const {isEdit,editId}=this.state
    const options ={
        method: 'POST',
        url: API_URL.index.modifyDepartment,
        data: {
            ...params,
        },
        dataType: 'json',
        doneResult: data => {
            if (!data.error) {
                notification['success']({
                    message: data.success,
                    description: '',
                  })
                this.edit()
            } else {
                Modal.error({ title: data.error});
            }            
        }
    }
    $.sendRequest(options)
  }

  edit=()=>{
    const options ={
        method: 'POST',
        url: API_URL.index.queryDepartment,
        data: {
        },
        dataType: 'json',
        doneResult: data => {
            if (!data.error) {
                const detail = data.department;
                this.setState({
                    detail,
                });
            } else {
                Modal.error({ title: data.error });
            }
        }
    }
    $.sendRequest(options)
  }


  // del = (id) => {
  //   const options ={
  //       method: 'POST',
  //       url: API_URL.index.deleteLastTendency,
  //       data: {
  //           offset: 1,
  //           limit: 1,
  //           lastTendencyId:id,
  //       },
  //       dataType: 'json',
  //       doneResult: data => {
  //           if (!data.error) {
  //               notification['success']({
  //                   message: data.success,
  //                   description: '',
  //                 })
  //               this.loadListData()
  //           } else {
  //               Modal.error({ title: data.error });
  //           }            
  //       }
  //   }
  //   $.sendRequest(options)
  // }

  // changeModalView = (modalName,isShow,type,callback) => {    
  //   this.setState({
  //     [modalName]: isShow==='open' ? true : isShow==='close' ? false : false,
  //   })
  //   if(type=='new'){
  //     this.setState({
  //       isEdit:false,
  //     })
  //   }
  //   if(type=='edit'){
  //     this.setState({
  //       isEdit:true,
  //     })
  //   }    
  //   callback && callback()
  //   }


  render() {
    const {loading, listData, detail, selectedRows, addInputValue, isEdit, selectedRowKeys, totalCallNo, modalVisible, pagination } = this.state;
    
    const mapPropsToFields = () => (
        { 
            departmentName:{value:detail.departmentLocalName},
            departmentLogoImg:{value:detail.logoImgUuid},
            departmentMainImg:{value:detail.mainImgUuid},
            departmentLogoImgUrl:{value:detail.logoImgUuidUrl},
            departmentMainImgUrl:{value:detail.mainImgUuidUrl},
            introduction:{value:detail.introduction},
             htmlText:{value:detail.htmlText},
        } 
      ) 
    FormBox=Form.create({mapPropsToFields})(FormBox)
    return (
      <div>
            <FormBox ref={el=>{this.formboxref = el}} closeModalView={this.changeModalView} handleSubmit={this.handleSubmit}/>
      </div>
    );
  }
}
