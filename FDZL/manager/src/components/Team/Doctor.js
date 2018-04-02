import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import API_URL from '../../common/url';
import { Row, Col, Popconfirm,  Card,Table, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Upload, notification  } from 'antd';
import Editor from '../common/Editor';import Ueditor from '../../common/Ueditor/Ueditor';
import {config,uploadser} from '../common/config';
import SortList from '../common/SortList';
import SearchSelect from '../common/SearchSelect'


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
      sourceData:[],
      doctorList:[],
      doctorName:'',
  }

  handlePreview = (file) => {
      this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,      
      });
    }
  
  handleChange = ({ fileList }) => {
    // console.log(fileList)
    if(fileList.response){
      if(fileList.response.error){
        console.log(fileList.response.error)
        message.warn("图片上传出错了，请重试！")
        fileList = []
      }
      this.setState({fileList})
    }
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
    const userCompellation = getFieldValue('userCompellation')
    this.setState({
      doctorName:userCompellation || this.state.userCompellation
    })
    console.log(userCompellation)
    const imgUrl= getFieldValue('doctorImgUrl')
    const fileList = getFieldValue('doctorImgUrl') ? [{
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

  handleSelect=(v)=>{    
    this.state.sourceData.map(data => {
      if(data.userId == v.key){
        this.setState({
          doctorName:data.userCompellation
        })
      }
    })    
  }

  parserDataDoctor = dt => {
    if ((dt.data || dt.datas) ) {
        const sourceData = dt.data ? dt.data : dt.datas
        // console.log(sourceData)
        const data = sourceData.map(r => ({
            text: r.userName+"["+r.userCompellation+"]",
            value: r.userId,
        }));
        this.setState({
          doctorList:data,
          sourceData
        });
    } else {
        this.setState({
          doctorList: [],
        });
    }
  };


  render(){
      const { getFieldDecorator, getFieldValue, setFieldsValue} = this.props.form;
      const { previewVisible, previewImage, submitting, fileList,doctorList,doctorName} = this.state;
      const userName = getFieldValue('userName') 
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
          sm: { span: 10, offset: 7 },
        },
      };        
      console.log(doctorName)
      return(
          <div>
          <Form onSubmit={this.props.handleSubmit} style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="医生账号"
            >
              {getFieldDecorator('userId', {
                rules: [{
                  required: true, message: '请选择',
                  whitespace: true
                }],
              })(
                <SearchSelect url={API_URL.usermanager.queryDoctorByHospitalDepartmentId} sourceData={doctorList}
                  searchParam={{departmentStatus:'INACTIVE'}}
                  searchKey = 'userMobile'
                  parserData={this.parserDataDoctor}
                  handleSelect={this.handleSelect}
                  disabled = {this.props.disabled}
                  placeholder={ userName || " 输入手机号码" }/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="医生姓名"
            >
              {doctorName}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="医生头像"
            >
              {getFieldDecorator('doctorImgName', {
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
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="医生职称"
            >
              {getFieldDecorator('doctorPosition', {
                rules: [{
                  required: true, message: '请选择',
                }],
              })(
                <Select placeholder="请选择" allowClear>
                  <Option value = "主任医师">主任医师</Option>
                  <Option value = "副主任医师">副主任医师</Option>
                  <Option value = "主治医师">主治医师</Option>
                  <Option value = "住院医师">住院医师</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="擅长"
            >
              {getFieldDecorator('doctorAdept', {
                rules: [{
                  required: true, message: '请输入擅长',
                  whitespace: true
                }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="内容"
            >
              {getFieldDecorator('htmlText', {
                rules: [{
                  required: true,
                  validator: this.validateHtml,
                }],
              })(
                <Ueditor/> //<Editor style={{width:460}}/>
              )}
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
                <FormItem label="医生账号">
                {getFieldDecorator('userName')(
                    <Input placeholder="请输入账号" />
                )}
                </FormItem>
                <FormItem label="医生姓名">
                {getFieldDecorator('userCompellation')(
                    <Input placeholder="请输入姓名" />
                )}
                </FormItem>
                <FormItem label="医生职称">
                {getFieldDecorator('doctorPosition')(
                    <Select placeholder="请选择" style={{width:120}} allowClear placeholder="请选择">
                      <Option value = "主任医师">主任医师</Option>
                      <Option value = "副主任医师">副主任医师</Option>
                      <Option value = "主治医师">主治医师</Option>
                      <Option value = "住院医师">住院医师</Option>
                    </Select>
                )}
                </FormItem>                
                <Button icon="search" type="primary" htmlType="submit">搜索</Button>
            </Form>
        );
    }
}

export default class Doctor extends Component {
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
    sortModalVisible:false,
    bindModalVisible:false,
    showStyle:"block",
  };

  loadListData = (params) => {
    const {pagination}=this.state
    this.setState({
        loading: true,
    });
    const options ={
        method: 'POST',
        url: API_URL.index.queryDepartmentDoctor,
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
    this.loadListData();
  }

  componentWillReceiveProps(nextProps) {
    this.checkShowTable();
    // clean state
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
    if(urlHash.startsWith("#/team/doctor/save")){
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

  }


  handleMenuClick = (e) => {

    const { selectedRows } = this.state;
    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
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
      fieldsValue.userName = fieldsValue.userName && fieldsValue.userName.trim()
      fieldsValue.userCompellation = fieldsValue.userCompellation && fieldsValue.userCompellation.trim()
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
      userName:{value:searchFormValues.userName},
      doctorPosition:{value:searchFormValues.doctorPosition},
      userCompellation:{value:searchFormValues.userCompellation},
    })
    SearchForm = Form.create({mapPropsToFields})(SearchForm)    
    return (
        <Row gutter={2}>
            <Col md={20} sm={24} >
                <SearchForm handleSearch={this.handleSearch} ref = { el => {this.searchFormRef = el}}/>
            </Col>
            <Col md={4} sm={4} style={{textAlign:'right'}}>            
            {
                selectedRows.length > 0 &&
                <Popconfirm title="确定要删除吗？" onConfirm={()=>{this.del(this.state.selectedRows)}} okText="是" cancelText="否">
                    <Button type="danger" style={{marginRight:10}}> 批量删除</Button>
                </Popconfirm>
            }            
                <Link to="/team/doctor/save"><Button icon="plus" type="primary">添加</Button></Link>
                <Button style={{marginLeft:10}}  type="primary" onClick={this.sort}><span><i className="iconfont icon-paixu"
                style={{marginRight:5,fontSize:15}}/></span>排序</Button>
            </Col>
        </Row>
    );
  }


     /**
     * 排序调整
     */
    sort = () => {
      const options ={
        method: 'POST',
        url: API_URL.index.queryDepartmentDoctor,
        data: {
            offset: 1,
            limit: 999999,
        },
        dataType: 'json',
        doneResult: data => {
            if (!data.error) {
                const listData = data.datas || data.data;
                const sortList = [];
                listData.map(item => {
                    // if (item.moduleDefineName != '录入者'){
                        sortList.push({
                            key: item.ydataAccountId,
                            name: item.userCompellation,
                        });
                    // }
                });
                this.sortListRef.show(sortList)
            } else {
                Modal.error({ title: data.error });
            }
        }
      }
      $.sendRequest(options)
    }

  handleSubmit = (e) => {
    e.preventDefault();
    this.formboxref.validateFieldsAndScroll((err, values) => {      
      if (!err) {
         
        values.doctorImgName = values.doctorImgName.file ? values.doctorImgName.file.response.data[0].fileName : values.doctorImgName
        // values.doctorImgName = "ddds.png"
        values.ydataAccountId = values.userId.key || values.userId
        console.log(values)
        this.save(values)
      }
    });
  }

  save = (params) => {
    const {isEdit,editId}=this.state
    const options ={
        method: 'POST',
        url: isEdit ? API_URL.index.modifyDepartmentDoctor :  API_URL.index.addDepartmentDoctor,
        data: {
            ...params,
            ydataUuid: isEdit ? editId : null
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
        url: API_URL.index.queryDepartmentDoctor,
        data: {
            offset: 1,
            limit: 1,
            userId:id,
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
        url: API_URL.index.removeDepartmentDoctor,
        data: {
            offset: 1,
            limit: 1,
            ydataAccountId:id,
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

    handleBindOk =()=>{

    }
  render() {
    const {loading, listData, detail, selectedRows, addInputValue, isEdit, selectedRowKeys, totalCallNo, modalVisible, sortModalVisible, pagination,bindModalVisible, showStyle } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width:60,
      },
      {
        title: '医生账号',
        dataIndex: 'userName',
        width:130,
      },
      {
        title: '医生姓名',
        dataIndex: 'userCompellation',
        width:120,
      },
      {
        title: '医生职称',
        dataIndex: 'doctorPosition',
        width:130,
      },
      {
        title: '擅长',
        dataIndex: 'doctorAdept',
        width:200,
      },
      {
        title: '操作',
        width:120,
        render: (text,record,index) => (
          <div>
            {/* {!record.isbind ?
            <a href="javascript:;" onClick={()=>{this.changeModalView('bindModalVisible','open','edit',()=>{ this.edit(record.id) })}}>绑定账号</a> :
            <a href="javascript:;" onClick={()=>{}} disabled>重新绑定</a>
            } */}
            {/* <span className="ant-divider" /> */}
             <Link to={`/team/doctor/save/${record.id}`}>修改</Link> 
            {/* <a onClick={() => {
                  //location.href = `#/team/doctor/save/${record.id}`;
                 history.push('/Department');
                  }}>修改</a> */}
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
            // id:d.ydataUuid,
            id:d.ydataAccountId,
            ...d,
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
            userCompellation:{value:detail.userCompellation},
            userId:{value:detail.userId},
            userName:{value:detail.userName},
            doctorImgName:{value:detail.doctorImgName},
            doctorImgUrl:{value:detail.doctorImgUrl},
            doctorPosition:{value:detail.doctorPosition},
            doctorAdept:{value:detail.doctorAdept},
             htmlText:{value:detail.htmlText},
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
                title={isEdit ? '修改医生':'添加医生'}
                visible={modalVisible}
                width={800}
                onOk={this.handleAdd}
                onCancel={this.changeModalView.bind(this,'modalVisible','close')}
                footer={null}
            >
               <FormBox disabled={isEdit} ref={el=>{this.formboxref = el}} closeModalView={this.changeModalView} handleSubmit={this.handleSubmit}/>
            </Modal>
            <SortList ref={el => { this.sortListRef = el; }}
                            reload={this.loadListData}
                            sortUrl={API_URL.index.sortDepartmentDoctor}
                            title={"医生排序"}
                            // data={{typeName,}}
                            data={{}}
            />
            <Modal
                title={'绑定医生账号'}
                visible={bindModalVisible}
                width={500}
                onOk={this.handleBindOk}
                onCancel={this.changeModalView.bind(this,'bindModalVisible','close')}
            >
              <div style={{padding:'20px 40px'}}>
               <Row>
                 <Col span={8} style={{textAlign:'right'}}>选择医生账号：</Col>
                 <Col span={16}> 
                  <SearchSelect url='dfew' sourceData={[]} style={{width:'100%'}}
                    onChange={()=>{}}
                    placeholder="输入手机号码"
                    handleSelect={()=>{}}
                  />
                 </Col>
               </Row>
               <Row>
                 <Col span={8} style={{textAlign:'right'}}>姓名：</Col>
                 <Col span={16}></Col>
               </Row>
               <Row>
                 <Col span={8} style={{textAlign:'right'}}>手机号码：</Col>
                 <Col span={16}></Col>
               </Row>
               <Row>
                 <Col span={8} style={{textAlign:'right'}}>所在医院：</Col>
                 <Col span={16}></Col>
               </Row>
               <Row>
                 <Col span={8} style={{textAlign:'right'}}>所在科室：</Col>
                 <Col span={16}></Col>
               </Row>
              </div>
            </Modal>
      </div>
    );
  }
}
