import React, {Component} from 'react';
import {Route, Redirect, Link} from "react-router-dom";
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import API_URL from '../../common/url';
import {Avatar, Row, Col, Popconfirm, Table, Form, Input, Select, Icon, Button, InputNumber, DatePicker, Modal, message, Upload, notification, Spin} from 'antd';
import Editor from '../common/Editor';import Ueditor from '../../common/Ueditor/Ueditor';
import {config,uploadser} from '../common/config';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const dayFormat = 'YYYY-MM-DD'


export default class Detail extends Component {
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
        url: this.props.hot ? API_URL.consul.queryHotConversationDetail : API_URL.consul.queryHotConversationDetail,
        data: {
            offset: 1,
            // limit: pagination.pageSize,            
            limit: 999999,
            conversationId:this.props.hot ? this.props.id : this.props.match.params.id,
            ...params,
        },
        dataType: 'json',
        doneResult: data => {
            if (!data.error) {
                const listData = data.datas;
                const isDiy = data.data && data.data.conversationType == "USER_DEFINED" ? true : false
                pagination.total = data.totalCount;
                this.setState({
                    loading: false,
                    listData,
                    pagination,
                    isDiy,
                    isHot:data.data.isHot || null,
                    hotConversationId:data.data.hotConversationId
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
    if(urlHash.startsWith("#/consulhot/detail")){
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


  handleSubmit = (e) => {
    e.preventDefault();
    this.formboxref.validateFieldsAndScroll((err, values) => {      
      if (!err) {
        console.log(values)
        values.publishDay = moment(values.publishDay).format(dayFormat)
        values.mainImgName = values.mainImgName.file ? values.mainImgName.file.response.data[0].fileName : values.mainImgName
         
        this.save(values)
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
            conversationId:isEdit ? editId : null,
        },
        dataType: 'json',
        doneResult: data => {
            if (!data.error) {
                notification['success']({
                    message: data.success,
                    description: '',
                  })
                this.changeModalView('modalVisible','close')
                this.loadListData();
                 this.setState({isSaved:true});
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
        url: API_URL.consul.queryHotConversationDetail,
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

  removeHot=()=>{
    const options ={
      method: 'POST',
      url: API_URL.consul.removeHotConversation,
      data: {
        // conversationId:this.props.id,
        hotConversationId:this.state.hotConversationId
      },
      dataType: 'json',
      doneResult: data => {
          if (!data.error) {
              notification['success']({
                  message: data.success,
                  description: '',
                })
                this.props.history.goBack()
          } else {
              Modal.error({ title: data.error });
          }            
      }
  }
  $.sendRequest(options)
  }


  setHot=()=>{
    const options ={
      method: 'POST',
      url: API_URL.consul.addHotConversationManual,
      data: {
        conversationId:this.props.match.params.id,
      },
      dataType: 'json',
      doneResult: data => {
          if (!data.error) {
              notification['success']({
                  message: data.success,
                  description: '',
                })
                this.props.history.goBack()
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
  render() {
    const {loading, listData,isDiy, detail, selectedRows, addInputValue, isEdit, selectedRowKeys, totalCallNo, modalVisible, pagination, showStyle } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
    };
    const paginationProps = {
      // showSizeChanger: true,
      // showQuickJumper: true,
      ...pagination,
    };
    const list =listData && listData.map((v,i)=>{
        return(
            <div style={{display: showStyle}} id='ava' key={i} style={{margin:'10px 30px', padding:'15px 0',borderBottom:"1px solid #eee",borderTop: i == 0 ? "1px solid #eee":''}}>               
                <Row type="flex" align="top" gutter={2}>
                    <Col span={2}><Avatar style={{width:50,height:50,lineHeight:'50px',borderRadius:'50%',background:'#eee'}}>
                      {v.ydataAccount.accType == "DOCTOR"?
                       <i className="iconfont icon-shouye1" style={v.ydataAccount.accType == "DOCTOR" ? {lineHeight:'50px',fontSize:35,color:'#0088D5'} : null}/>
                        : 
                        ( v.ydataAccount.accType == "ASSISTANT" ?
                          <i className="iconfont icon-yishengzixun" style={{lineHeight:'56px',fontSize:35,color:'#6e66dd'}}/>
                          :
                          <i className="iconfont icon-ren" style={{lineHeight:'50px',fontSize:35,color:'#46C883'}}/>)}  </Avatar></Col>
                    <Col span={18}>
                        <Row align="top">
                            <Col span={24}>{v.ydataAccount.accType == "DOCTOR" ? v.ydataAccount.ydataAccountCompellation || "医生" : v.ydataAccount.ydataAccountCompellation || "匿名"} <span style={{marginLeft:10}}>{v.createTime}</span></Col>
                            {/* <Col span={10}></Col> */}
                            <Col span={24}>
                            {v.mediaIdurl && v.mediaIdurl.map((d,j) => <div key={j}><img src = {d} width='300'/><br/></div>)}                            
                            {v.msg}</Col>
                        </Row>
                    </Col>                    
                </Row>
            </div>
        )
    })
    return (        
        <Spin spinning={loading}>
          { !isDiy ?  this.props.hot || this.state.isHot ? <div style={{textAlign:'right'}}> <Button type='primary' size='large' onClick={()=>{this.removeHot()}}><i className="iconfont icon-quxiaoremen" />取消热门</Button></div>:<div style={{textAlign:'right'}}><Button type='primary' size='large' onClick={this.setHot}><i className="iconfont icon-remen" />设为热门</Button></div>:null}
            {list}
        </Spin>
    );
  }
}
