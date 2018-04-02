import React, {Component} from 'react';
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import API_URL from '../../common/url';
import ExportUtil from '../../common/ExportUtil';
import { Row, Col, Popconfirm,  Card,Table, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Upload, notification  } from 'antd';
import {config} from '../common/config';

const FormItem = Form.Item;
const {RangePicker} = DatePicker
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const dayFormat = 'YYYY-MM-DD'

class FormBox extends React.Component {
  
    render(){
        const {getFieldDecorator}=this.props.form
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
        return(
            <div>
            <Form onSubmit={this.props.handleSubmit} style={{ marginTop: 8 }}
            >
              <FormItem
                {...formItemLayout}
                label="时间段"
              >
                {getFieldDecorator('exportDate', {
                  rules: [{
                    required: true, message: '选择时间段',
                  }],
                })(
                  <RangePicker />
                )}
              </FormItem>
 
              <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.props.changeModalView.bind(this,'modalVisible','close')}>取消</Button>
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
                <FormItem label="姓名">
                {getFieldDecorator('userCompellation')(
                    <Input placeholder="请输入姓名" />
                )}
                </FormItem>
                <FormItem label="手机号">
                {getFieldDecorator('userMobile')(
                    <Input placeholder="请输入手机号" />
                )}
                </FormItem>
                <FormItem label="住院号">
                {getFieldDecorator('hospitalCode')(
                    <Input placeholder="请输入住院号" />
                )}
                </FormItem>
                <FormItem label="绑定状态">
                {getFieldDecorator('bindStatus')(
                    <Select allowClear style={{width:120}} placeholder="请选择">
                        <Option value="ACTIVE">已绑定</Option>
                        <Option value="INACTIVE">已解绑</Option>
                    </Select>
                )}
                </FormItem>
                <Button icon="search" type="primary" htmlType="submit">搜索</Button>
            </Form>
        );
    }
}

export default class Patients extends Component {
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
    const {pagination}=this.state
    this.setState({
        loading: true,
    });
    const options ={
        method: 'POST',
        url: API_URL.usermanager.queryPatients,
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
      fieldsValue.userCompellation = fieldsValue.userCompellation && fieldsValue.userCompellation.trim()
      fieldsValue.userMobile = fieldsValue.userMobile && fieldsValue.userMobile.trim()
      fieldsValue.hospitalCode = fieldsValue.hospitalCode && fieldsValue.hospitalCode.trim()
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
            userCompellation:{value:searchFormValues.userCompellation},
            userMobile:{value:searchFormValues.userMobile},
            hospitalCode:{value:searchFormValues.hospitalCode},
            bindStatus:{value:searchFormValues.bindStatus},
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
                <Button icon="export" type="primary" onClick={this.exportToExl}>导出</Button>
            </Col>
        </Row>
    );
  }

  // export=()=>{
  //   this.changeModalView('modalVisible','close')
  // }

  exportToExl = (params) => {
    let url = `${API_URL.usermanager.exportPatients}`
    ExportUtil.export(params, null, url)
    // this.changeModalView('modalVisible','close')
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.formboxref.validateFieldsAndScroll((err, values) => {      
      if (!err) {
        values.start = moment(values.exportDate[0]).format(dayFormat)
        values.end = moment(values.exportDate[1]).format(dayFormat)
        values.exportDate = null
        // this.save(values)
        this.exportToExl(values)
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
    const {loading, listData, detail, selectedRows, addInputValue, isEdit, selectedRowKeys, totalCallNo, modalVisible, pagination } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width:60,
      },
      {
        title: '姓名',
        dataIndex: 'userCompellation',
        width:120,
      },
      {
        title: '手机号码',
        dataIndex: 'userMobile',
        width:150,
      },      
      {
        title: '住院号',
        dataIndex: 'hospitalCode', 
        width:120,
      },      
      {
        title: '微信号',
        dataIndex: 'openId', 
        width:120,
      },
      {
        title: '微信昵称',
        dataIndex: 'nickName', 
        width:100,
      },
      {
        title: '绑定状态',
        dataIndex: 'bindStatus', 
        width:80,
        render:(text,react)=>
          react.bindStatus == "INACTIVE" ? "已解绑" : react.bindStatus == "ACTIVE" ? "已绑定" : "未知"
      },
      {
        title: '最近一次绑定时间',
        dataIndex: 'lastBindTime', 
        width:150,
        sorter: true,        
      },
    ];

    const lists = []
    listData.map((d,i)=>{
        let list = {
            index: ((pagination.current - 1) || 0) * pagination.pageSize + i + 1,
            id:d.userId,
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
            userMobile:{value:detail.userMobile},
            lastBindTime:{value:moment(detail.lastBindTime)},
            nickName:{value:detail.nickName},
            openId:{value:detail.openId},
            bindStatus:{value: detail.bindStatus},
        } : null
      ) 
    FormBox=Form.create({mapPropsToFields})(FormBox)
    return (
      <div>
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
                title={'导出'}
                visible={modalVisible}
                width={550}
                onOk={this.exportToExl}
                onCancel={this.changeModalView.bind(this,'modalVisible','close')}
                footer={null}
            >
               <FormBox ref={el=>{this.formboxref = el}} changeModalView={this.changeModalView} handleSubmit={this.handleSubmit}/>
            </Modal>
            
      </div>
    );
  }
}
