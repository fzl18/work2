import React, {Component} from 'react';
import {Route, Redirect, Link} from "react-router-dom";
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import API_URL from '../../common/url';
import { Row, Col, Radio, Popconfirm,TreeSelect, Cascader, Card,Table, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Upload, notification,Pagination  } from 'antd';
import Editor from '../common/Editor';
import Ueditor from '../../common/Ueditor/Ueditor';
import {config,uploadser} from '../common/config';


const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const dayFormat = 'YYYY-MM-DD'

class FormBox extends React.Component {
    state={        
        submitting:false,
        previewVisible: false,
        previewImage:'',
        fileList:[],
        cityType:'CONCRETE',
    }

    delHtmlTag = (str)=>{
      return str.replace(/<[^>]+>/g,"");
    }

    validCity=(rule, value, callback)=>{
      const { getFieldDecorator, getFieldValue,setFieldsValue} = this.props.form;
      const selectCity = getFieldValue('selectCity') || []
      const {cityType,cityId} = this.state
      if(value !=='CONCRETE' || cityId && cityId.length>0){
        callback()
        return
      }else{
        if(!cityId || cityId.length==0){
          console.log(cityId)
          callback('请选择城市!')
          return
        }
      }
    }    
    
    componentDidMount(){
      const { getFieldDecorator, getFieldValue,setFieldsValue} = this.props.form;
      const cityType = getFieldValue('cityType') || 'CONCRETE'
      const cityTypeList = getFieldValue('cityTypeList')
      this.setState({cityType})
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

    handleRadio = (e) => {
      this.setState({
        cityType: e.target.value,
      });
    }

    render(){
        const { getFieldDecorator, getFieldsValue, getFieldValue,setFieldsValue} = this.props.form;
        const { previewVisible, previewImage, submitting, fileList, order} = this.state;
        const formItemLayout = config.formItemLayout    
        const submitFormLayout = config.submitFormLayout
        const type = getFieldValue('type')
        const level = getFieldValue('level')
        const city = getFieldValue('city')
        const cityId = getFieldValue('cityId') && getFieldValue('cityId').split(',')
        const cityTypeList = getFieldValue('cityTypeList')||[]
        const typeOptions = type && type.map((v) => <Option key={v.serviceParameterId} value={`${v.serviceParameterId}`}>{v.serviceParameterName}</Option>)
        const levelOptions = level && level.map((v) => <Option key={v.serviceStaffTypeId} value={`${v.serviceStaffTypeId}`}>{v.serviceStaffTypeName}</Option>)
        // const cityOptions = city && city.map((v) => <Option key={v.memberLevelTypeId} value={`${v.memberLevelTypeId}`}>{v.memberLevelTypeName}</Option>)
        return(            
          <Form onSubmit={this.props.handleSubmit} style={{ marginTop: 8 }}
          >
            <FormItem {...formItemLayout} label="项目类型">
              {getFieldDecorator('serviceParameterId',{
                  rules: [{
                    required: true, message: '请选择',
                  }],
                })(
                  <Select placeholder='请选择' style={{minWidth:120}}>
                    {typeOptions}
                  </Select>
              )}
              </FormItem>
              <FormItem {...formItemLayout} label="服务人员类型">
              {getFieldDecorator('serviceStaffTypeId',{
                  rules: [{
                    required: true,
                    message: '请选择',
                  }],
                })(
                  <Select placeholder='请选择' style={{minWidth:120}}>
                    {levelOptions}
                  </Select>
              )}
              </FormItem>              
              <FormItem {...formItemLayout} label="城市">
              {getFieldDecorator('cityType',{
                  initialValue:'CONCRETE',
                  rules: [{
                    required: true,                    
                    // validator:this.validCity
                  }],
                })(
                  <RadioGroup name="radiogroup" onChange={this.handleRadio} style={{minWidth:120}}>
                    <Radio value='CONCRETE'>具体城市</Radio>
                    <Radio value='OTHERS'>其他城市</Radio>
                  </RadioGroup>
              )}
              </FormItem>
              {this.state.cityType == 'CONCRETE' ?
              <FormItem {...formItemLayout} label="已选城市">
              {getFieldDecorator('selectCity',{
                initialValue:cityId && cityId.map(d => `${d}`),
                rules: [{
                  required: true,                    
                  message:'请选择'
                }],
              })(
                  <TreeSelect dropdownStyle={{overflow:'auto',marginLeft:5,maxHeight:'28vh'}} allowClear treeData={city} multiple placeholder='请选择' treeCheckable onChange={this.treeChange} getPopupContainer={() => document.getElementById('city')} />
              )}<div id='city'/>
              </FormItem> :null }
              <FormItem {...formItemLayout} label="服务单价">
              {getFieldDecorator('servicePrice',{
                  rules: [{
                    required: true,
                    message:'请输入服务单价'
                  }],
                })(
                  <InputNumber min={1} precision={0} max={10000000}/>
              )} 元/小时
              </FormItem>

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.props.closeModalView.bind(this,'modalVisible','close')}>取消</Button>
            </FormItem>
          </Form>          
        )
    }
}

class SearchForm extends Component {  
    render(){
        const { getFieldDecorator,getFieldValue } = this.props.form;
        const type = getFieldValue('type')
        const level = getFieldValue('level')
        const city = getFieldValue('city')
        const typeOptions = type && type.map((v) => <Option key={v.serviceParameterId} value={`${v.serviceParameterId}`}>{v.serviceParameterName}</Option>)
        const levelOptions = level && level.map((v) => <Option key={v.serviceStaffTypeId} value={`${v.serviceStaffTypeId}`}>{v.serviceStaffTypeName}</Option>)
        // const cityOptions = city && city.map((v,i) => <Option key={i} value={`${v.regionName}`}>{v.regionName}</Option>)
        return (
            <Form onSubmit={this.props.handleSearch} layout="inline">
                <FormItem label="项目类型">
                {getFieldDecorator('serviceParameterId')(
                    <Select placeholder='请选择' allowClear style={{minWidth:120}}>
                      {typeOptions}
                    </Select>
                )}
                </FormItem>
                <FormItem label="服务人员类型">
                {getFieldDecorator('serviceStaffTypeId')(
                    <Select placeholder='请选择' allowClear style={{minWidth:120}}>
                      {levelOptions}
                    </Select>
                )}
                </FormItem>
                <FormItem label="城市">
                {getFieldDecorator('regionName')(
                    <Cascader options={city}
                    placeholder='请选择' 
                    style={{minWidth:120}}
                    allowClear
                    />
                )}
                </FormItem>
                <Button icon="search" type="primary" htmlType="submit">搜索</Button>
                <Button icon="plus" type="primary" onClick={this.props.create} style={{marginLeft:17}}>添加</Button>
            </Form>
        );
    }
}

export default class ServicePrice extends Component {
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
        url: API_URL.serive.queryRuleServicePrice,
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

  queryProjectType=()=>{
    const options ={
        method: 'POST',
        url: API_URL.serive.queryProjectType,
        data: {
          limit:999
        },
        dataType: 'json',
        doneResult: data => {
            if (!data.error) {
                this.setState({
                  memberType: data.datas || data.data,
                });
            } else {
                Modal.error({ title: data.error });
            }
        }
    }
    $.sendRequest(options)    
  }

  queryStaffType=()=>{
    const options ={
        method: 'POST',
        url: API_URL.serive.queryStaffType,
        data: {
          limit:999
        },
        dataType: 'json',
        doneResult: data => {
            if (!data.error) {
                this.setState({
                  memberLevel: data.datas || data.data,
                });
            } else {
                Modal.error({ title: data.error });
            }
        }
    }
    $.sendRequest(options)    
  }
  queryCity=()=>{
    const options ={
        method: 'POST',
        url: API_URL.serive.queryCity,
        data: {

        },
        dataType: 'json',
        doneResult: data => {
            if (!data.error) {
              const options = []
              const options2 = []
              data.datas.map((d,i)=>{
                let children = []
                let children2 = []
                d.children.map((v,j)=>{
                  children.push({
                    value:`${v.regionId}`,
                    label:v.regionName,
                    key:`1-${i}-${j}`
                  })
                  children2.push({
                    value:v.regionName,
                    label:v.regionName,
                    key:`1-${i}-${j}`
                  })
                })                
                options.push({
                  value:`${d.regionId}`,
                  label:d.regionName,
                  children:children,
                  key:`0-${i}-0`
                })
                options2.push({
                  value:d.regionName,
                  label:d.regionName,
                  children:children2,
                  key:`0-${i}-0`
                })
              })
              options2.push({
                value:`0`,
                label:`其它`,
                key:`9-9-9`
              })
              this.setState({
                city:options,
                city2:options2,
              });
            } else {
                Modal.error({ title: data.error });
            }
        }
    }
    $.sendRequest(options)    
  }
  
  componentDidMount() {
    this.loadListData()
    this.queryProjectType()
    this.queryStaffType()
    this.queryCity()
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
      },()=>{this.loadListData({...fieldsValue,regionName:fieldsValue.regionName && fieldsValue.regionName[1]})});
    });
  }


  handleAddInput = (e) => {
    this.setState({
      addInputValue: e.target.value,
    });
  }


  renderSearchForm() {
    const { selectedRows, searchFormValues,memberLevel,memberType,city2 } = this.state;
    const mapPropsToFields = () => ({ 
            serviceStaffTypeId:{value:searchFormValues.serviceStaffTypeId},
            serviceParameterId:{value:searchFormValues.serviceParameterId},
            regionName:{value:searchFormValues.regionName},
            type:{value:memberType},
            level:{value:memberLevel},
            city:{value:city2}
          })
    SearchForm = Form.create({mapPropsToFields})(SearchForm)    
    return (
        <Row gutter={2}>
            <Col md={24} sm={24} >
                <SearchForm create={this.changeModalView.bind(this,'modalVisible','open','new')} handleSearch={this.handleSearch} ref = { el => {this.searchFormRef = el}}/>
            </Col>
            <Col md={2} sm={8} style={{textAlign:'right'}}>            
            {
                selectedRows.length > 0 &&
                <Popconfirm title="确定要删除吗？" onConfirm={()=>{this.del(this.state.selectedRows)}} okText="是" cancelText="否">
                    <Button type="danger" style={{marginRight:10}}> 批量删除</Button>
                </Popconfirm>
            }            
                {/* <Button icon="plus" type="primary" onClick={()=>{this.changeModalView('modalVisible','open','new')}}>添加</Button> */}
                
            </Col>
        </Row>
    );
  }


  handleSubmit = (e) => {
    e.preventDefault();
    this.formboxref.validateFieldsAndScroll((err, values) => {  
      Object.assign(values,values.order)
      if (!err) {
        values.selectCity && values.selectCity.map((d,i) => values[`ids[${i}]`] = d)
        this.save(values)
      }
    });
  }

  save = (params) => {
    const {isEdit,editId}=this.state
    const options ={
        method: 'POST',
        url: isEdit ? API_URL.serive.modifyRuleServicePrice :  API_URL.serive.addRuleServicePrice,
        data: {
            ...params,
            ruleServicePriceId:isEdit ? editId : null,
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
        url: API_URL.serive.queryRuleServicePrice,
        data: {
            offset: 1,
            // limit: 1,
            ruleServicePriceId:id,
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
        url: API_URL.serive.deleteRuleServicePrice,
        data: {
            offset: 1,
            limit: 1,
            ruleServicePriceId:id,
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

  changeModalView = (modalName,isShow,type) => {    
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
    }


  render() {
    const {loading, listData, detail, selectedRows, isEdit, selectedRowKeys, totalCallNo, modalVisible, pagination,memberLevel,memberType,city } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width:60
      },
      {
        title: '项目类型',
        width:100,
        render:(text,record)=> record.serviceParameter.serviceParameterName
      },
      {
        title: '服务人员类型',    
        width:130,
        render:(text,record)=> record.serviceStaffType.serviceStaffTypeName     
      },      
      {
        title: '城市',
        width:160,
        render:(text,record)=> record.regionName || '其它'
      },    
      {
        title: '服务单价（元/小时）',
        width:160,
        dataIndex: 'servicePrice',
        sorter:true,
      },       
      {
        title: '操作',
        width:100,
        render: (text,record,index) => (
          <div>
            {/* <Link to={`/index/news/save/${record.id}`}>修改</Link> */}
            <a href="javascript:;" onClick={()=>{this.changeModalView('modalVisible','open','edit');this.edit(record.id)}}>修改</a>
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
            id:d.ruleServicePriceId,
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
          serviceStaffTypeId:{value:detail.serviceStaffType && `${detail.serviceStaffType.serviceStaffTypeId}`},
          serviceParameterId:{value:detail.serviceParameter && `${detail.serviceParameter.serviceParameterId}`},
          servicePrice:{value:detail.servicePrice},
          cityType:{value:detail.cityType},
          cityId:{value:detail.cityId},
          cityTypeList:{value:detail.cityTypeList},
          type:{value:memberType},
          level:{value:memberLevel},
          city:{value:city}
        } : {
          type:{value:memberType},
          level:{value:memberLevel},
          city:{value:city}
        }
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
              // rowSelection={rowSelection}
              onSelectRow={this.handleSelectRows}
              dataSource={lists}
              columns={columns}
              pagination={paginationProps}
              onChange={this.handleTableChange}
              scroll={{y:lists.length > config.listLength ? config.scroll.y : null}}
            />
            <Modal
                title={isEdit ? '修改服务单价':'添加服务单价'}
                visible={modalVisible}
                width={600}
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
