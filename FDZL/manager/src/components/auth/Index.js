import React, {Component} from 'react';
import {Route, Redirect, Link} from "react-router-dom";
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import API_URL from '../../common/url';
import { Row, Col, Popconfirm,  Card,Table, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Upload, notification  } from 'antd';
import Editor from '../common/Editor';import Ueditor from '../../common/Ueditor/Ueditor';
import SearchSelect from '../common/SearchSelect';
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
        doctorList:[],
        doctorNames:[],
        curDoctor:{},
        rerender:false
    }
    del=(index)=>{
      const {doctorNames} = this.state
      doctorNames.splice(index,1)
      this.setState({doctorNames})
    }
    add=()=>{
      const {doctorNames,curDoctor} = this.state
      if(Object.keys(curDoctor).length>0){
        let has = false
        doctorNames.map(d=>{
          if(d.ydataAccountId == curDoctor.ydataAccountId){
            has = true
          }
        })
        if(has){message.warn('已存在'); return}
        doctorNames.push({
          ...curDoctor
        })
        this.setState({
          rerender: true,
        },function(){
          this.setState({
            rerender: false
          })
        })
      }
      this.setState({doctorNames});
    }
    doctorValidator=(rule, value, callback)=>{
      const ok = this.state.doctorNames && this.state.doctorNames.length || 0
      if(ok>0){
          callback();
          return;
      }      
      callback('请添加医生！');
    }

    handleSelect=(v)=>{
      this.state.sourceData.map(data => {
        if(data.ydataAccountId == v.key){
          this.setState({
            curDoctor:{ ydataAccountCompellation: v.ydataAccountCompellation,ydataAccountId:v.ydataAccountId},
          })
        }
      })    
    }

    selectChange=(value)=>{
      if(!value.key){  
        this.setState({
          curDoctor:{}
        })
      }
      else{
        const {sourceData} = this.state;
        if(sourceData){
          sourceData.map((s, index) =>{
            if(s.ydataAccountId == value.key){
               this.setState({
                curDoctor:{ ydataAccountCompellation: s.ydataAccountCompellation,ydataAccountId:s.ydataAccountId},
              })
              return;
            }
          } )
        }
      }
    }
  
    parserDataDoctor = dt => {
      if ((dt.data || dt.datas) ) {
          const sourceData = dt.data ? dt.data : dt.datas
          // console.log(sourceData)
          const data = sourceData.map(r => ({
              text: r.ydataAccountCompellation+"["+r.ydataAccountUserMobile+"]",
              value: r.ydataAccountId,
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

    componentDidMount(){
      const {getFieldValue , setFieldsValue} = this.props.form;
      const doctorNames = getFieldValue('doctorNames') || []
      this.setState({doctorNames})
    }
    render(){
        const { getFieldDecorator, getFieldsValue, setFieldsValue,getFieldValue} = this.props.form;
        const { previewVisible, previewImage, submitting, fileList, doctorList,doctorNames, rerender} = this.state;
        const scientificResearchLibraryName = getFieldValue('scientificResearchLibraryName')
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
            md: { span: 16 },
          },
        };
    
        const submitFormLayout = {
          wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 10, offset: 7 },
          },
        };        
        return(
            <div>
            <Form onSubmit={ (e)=>{this.props.handleSubmit(e,this.state.doctorNames)} } style={{ marginTop: 8 }}
            >
              <FormItem
                {...formItemLayout}
                label="科研库名称"
              >
                {scientificResearchLibraryName}
              </FormItem>
              {!rerender &&
              <FormItem
                {...formItemLayout}
                label="可访问医生"

              >
                {getFieldDecorator('doctorNames', {
                  rules: [{
                    required: true,
                    validator:this.doctorValidator,
                  }],
                })(
                <div>
                  
                  <SearchSelect 
                  url={API_URL.auth.queryDoctorByKeyword}
                  sourceData={doctorList}
                  searchKey = 'keywords'
                  parserData={this.parserDataDoctor}
                  handleSelect={this.handleSelect}
                  onChange={this.selectChange}
                  placeholder={ "请输入姓名或手机号" }
                  style={{width:160}} 
                  /><Button type="primary" style={{ position:'relative',top:-1,left:-1 }} onClick={()=>{this.add()}}>添加</Button>
                </div>
                )}
              </FormItem>
              }
              <FormItem {...submitFormLayout}>
                {doctorNames && doctorNames.map((v,i)=> <div key={i}> {v.ydataAccountCompellation}
                  <Popconfirm title="确定要删除吗？" onConfirm={()=>{this.del(i)}} okText="是" cancelText="否">
                <a href='javascript:;' style={{marginLeft:10}}><Icon type="close-circle" style={{color:'red'}}/></a>
                </Popconfirm>
                </div>)   }
              </FormItem>              
              <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                <Button type="primary" htmlType="submit" loading={submitting}>
                {this.props.isEdit ? '保存':'添加'}
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.props.closeModalView.bind(this,'modalVisible','close')}>取消</Button>
              </FormItem>
            </Form>
           </div>
          
        )
    }
}

class SearchForm extends Component {
    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.props.handleSearch} layout="inline">
                <FormItem label="动态标题">
                {getFieldDecorator('lastTendencyTitle')(
                    <Input placeholder="请输入标题" />
                )}
                </FormItem>
                <Button icon="search" type="primary" htmlType="submit" >搜索</Button>
            </Form>
        );
    }
}

export default class Index extends Component {
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
    setAuthModalVisible:false,
    selectedRows: [],
    searchFormValues: {},
    isEdit:false,
    selectedRowKeys: [],
    totalCallNo: 0,
  };

  loadListData = (params) => {
    const {pagination}=this.state
    this.setState({
        loading: true,
    });
    const options ={
        method: 'POST',
        url: API_URL.auth.queryScientificResearchLibrary,
        data: {
            offset:pagination.current || 1,
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
    this.loadListData()
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
            lastTendencyTitle:{value:searchFormValues.lastTendencyTitle},
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
                {/* <Button icon="plus" type="primary" onClick={()=>{this.changeModalView('modalVisible','open','new')}}>添加</Button> */}
                <Link to='/index/news/save'><Button icon="plus" type="primary">添加</Button></Link>
            </Col>
        </Row>
    );
  }


  handleSubmit = (e,v) => {
    e.preventDefault();
    this.formboxref.validateFieldsAndScroll((err, values) => {      
      if (!err) {
        const list = {}        
        v.map((d,i)=>{
           list[`ids[${i}]`] = d.ydataAccountId
        })
        this.save(list)
      }
    });
  }

  save = (params) => {
    const {isEdit,editId}=this.state
    const options ={
        method: 'POST',
        url:  API_URL.auth.modifyScientificResearchLibraryAuth ,
        data: {
            ...params,
            scientificResearchLibraryId:editId,
        },
        dataType: 'json',
        doneResult: data => {
            if (!data.error) {
                notification['success']({
                    message: data.success,
                    description: '',
                  })
                this.changeModalView('setAuthModalVisible','close')
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
        url: API_URL.auth.queryScientificResearchLibrary,
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
        url: API_URL.index.deleteLastTendency,
        data: {
            offset: 1,
            limit: 1,
            lastTendencyId:id,
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

  setAuth=(record)=>{
    this.changeModalView('setAuthModalVisible','open')
    this.setState({
      isEdit:true,
      editId:record.id,
      scientificResearchLibraryName:record.scientificResearchLibraryName,
      doctorNames:record.scientificResearchLibraryAuths
    })
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
    // callback && callback()
    }


  render() {
    const {loading, listData, detail, selectedRows, addInputValue, isEdit, selectedRowKeys, totalCallNo, setAuthModalVisible, pagination } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width:60
      },
      {
        title: '科研库名称',
        dataIndex: 'scientificResearchLibraryName',
        width:100
      },
      {
        title: '搜索条件',
        dataIndex: 'scientificResearchLibraryCriteria',
        width:100
      },
      {
        title: '可访问医生',
        dataIndex: 'doctorNames',
        width:200
      }, 
      {
        title: '操作',
        width:100,
        render: (text,record,index) => (
          <div>           
            <a href='javascript:;' onClick={this.setAuth.bind(this,record)}>设置权限</a>
          </div>
        ),
      },
    ];

    const lists = []
    listData.map((d,i)=>{
        let list = {
            index: ((pagination.current - 1) || 0) * pagination.pageSize + i + 1,
            id:d.scientificResearchLibraryId,
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
            scientificResearchLibraryName:{value:this.state.scientificResearchLibraryName},
            doctorNames:{value:this.state.doctorNames},
        } : null
      ) 
    FormBox=Form.create({mapPropsToFields})(FormBox)
    return (
      <div>
            <div>
              {/* {this.renderSearchForm()} */}
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
                title='设置权限'
                visible={setAuthModalVisible}
                width={500}
                onOk={this.changeModalView.bind(this,'setAuthModalVisible','close')}
                onCancel={this.changeModalView.bind(this,'setAuthModalVisible','close')}
                footer={null}
            >
               <FormBox isEdit={isEdit} ref={el=>{this.formboxref = el}} closeModalView={this.changeModalView.bind(this,'setAuthModalVisible','close')} handleSubmit={this.handleSubmit}/>
            </Modal>
      </div>
    );
  }
}
