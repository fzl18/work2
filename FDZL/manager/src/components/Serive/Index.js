import React, {Component} from 'react';
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import API_URL from '../../common/url';
import { Row, Col, Popconfirm,  Card,Table, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Upload, notification  } from 'antd';
import {config} from '../common/config';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const dayFormat = 'YYYY-MM-DD'



class SearchForm extends Component {
    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.props.handleSearch} layout="inline">
                <FormItem label="医生姓名">
                {getFieldDecorator('doctorUserCompellation')(
                    <Input placeholder="请输入姓名" />
                )}
                </FormItem>
                <FormItem label="医生手机号">
                {getFieldDecorator('doctorUserMobile')(
                    <Input placeholder="请输入手机号" />
                )}
                </FormItem>
                <FormItem label="医学助理姓名">
                {getFieldDecorator('doctorAccUserCompellation')(
                    <Input placeholder="请输入姓名" />
                )}
                </FormItem>
                <FormItem label="医学助理手机号">
                {getFieldDecorator('doctorAccUserMobile')(
                    <Input placeholder="请输入手机号" />
                )}
                </FormItem>
                <FormItem label="服务状态">
                {getFieldDecorator('status')(
                    <Select allowClear style={{width:120}} placeholder="请选择">
                        <Option value="ACTIVE">正常</Option>
                        <Option value="STOP">结束</Option>
                    </Select>
                )}
                </FormItem>
                <Button icon="search" type="primary" htmlType="submit">搜索</Button>
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
        url: API_URL.serive.queryServiceDetail,
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
      fieldsValue.doctorUserCompellation = fieldsValue.doctorUserCompellation && fieldsValue.doctorUserCompellation.trim()
      fieldsValue.doctorUserMobile = fieldsValue.doctorUserMobile && fieldsValue.doctorUserMobile.trim()
      fieldsValue.doctorAccUserCompellation = fieldsValue.doctorAccUserCompellation && fieldsValue.doctorAccUserCompellation.trim()
      fieldsValue.doctorAccUserMobile = fieldsValue.doctorAccUserMobile && fieldsValue.doctorAccUserMobile.trim()
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
            doctorUserCompellation:{value:searchFormValues.doctorUserCompellation},
            doctorUserMobile:{value:searchFormValues.doctorUserMobile},
            doctorAccUserCompellation:{value:searchFormValues.doctorAccUserCompellation},
            doctorAccUserMobile:{value:searchFormValues.doctorAccUserMobile},
            status:{value:searchFormValues.status},
          })
    SearchForm = Form.create({mapPropsToFields})(SearchForm)    
    return (
        <Row gutter={2}>
            <Col md={24} sm={24} >
                <SearchForm handleSearch={this.handleSearch} ref = { el => {this.searchFormRef = el}}/>
            </Col>
        </Row>
    );
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
        width:60
      },
      {
        title: '医生姓名',
        dataIndex: 'doctorUserCompellation',
        width:120
      },
      {
        title: '医生手机号码',
        dataIndex: 'doctorUserMobile',
        width:120        
      },      
      {
        title: '服务开始时间',
        dataIndex: 'applicationTime',
        width:150,
        sorter: true,
        render: (text,record,index) => (
          record.applicationTime ? moment(record.applicationTime).format("YY-MM-DD") : null
        )
      },
      {
        title: '服务结束时间',
        dataIndex: 'stopTime',
        width:150,
        sorter: true,
        render: (text,record,index) => (
          record.stopTime ? moment(record.stopTime).format("YY-MM-DD") :null
        )
      },
      {
        title: '医学助理姓名',
        dataIndex: 'doctorAccUserCompellation', 
        width:120,
      },
      {
        title: '医学助理手机号码',
        dataIndex: 'doctorAccUserMobile',
        width:150, 
      },
      {
        title: '服务状态',
        dataIndex: 'status', 
        width:80,
        sorter: true,
        render:(text,record)=>(
          record.status =='ACTIVE' ? "正常" : record.status =='STOP' ? "结束" : "未知"  
        )              
      }
    ];

    const lists = []
    listData.map((d,i)=>{
        let list = {
            index: ((pagination.current - 1) || 0) * pagination.pageSize + i + 1,
            id:d.assistantServiceAuthId,
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
            lastTendencyTitle:{value:detail.lastTendencyTitle},
            mainImgName:{value:detail.mainImgName},
            publishDay:{value:moment(detail.publishDay)},
             htmlText:{value:detail.htmlText},
        } : null
      ) 
    // FormBox=Form.create({mapPropsToFields})(FormBox)
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
            {/* <Modal
                title={isEdit ? '修改动态':'添加动态'}
                visible={modalVisible}
                width={800}
                onOk={this.handleAdd}
                onCancel={this.changeModalView.bind(this,'modalVisible','close')}
                footer={null}
            >
               <FormBox ref={el=>{this.formboxref = el}} closeModalView={this.changeModalView} handleSubmit={this.handleSubmit}/>
            </Modal> */}
      </div>
    );
  }
}
