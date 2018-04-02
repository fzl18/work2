import React from 'react'
import HistoryDetail from '../ConsulHistory/Detail'
import $ from '../../common/AjaxRequest'
import ScrollBar from 'react-free-scrollbar'
import { Prompt, Redirect } from 'react-router-dom'
import moment, { relativeTimeRounding } from 'moment'
import API_URL from '../../common/url'
import {Spin, Row,Avatar, Col, Popconfirm,  Card,Table, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Upload, notification  } from 'antd'
import Editor from '../common/Editor'
import '../../common/touchScroll'
import {config,uploadser} from '../common/config'
import './style.less'

const FormItem = Form.Item
const {Option}=Select
const { TextArea } = Input;
class ListBox extends React.Component {
  state={
    submitting:false,
    previewVisible: false,
    previewImage:'',
    loading:false,
    dataSource:[],
    t:0
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,      
    });
  }
  
  handleChange = (index,{ fileList }) => {
    // console.log(fileList)
    if(fileList.status=="error"){  // 
      notification['warn']({
        message: "图片操作出错，请重试！",
        description: '',
      })
    }
    // if(!fileList.response ){  // 
    //   notification['warn']({
    //     message: "图片上传出错，请重试！",
    //     description: '请查看图片服务是否能连上。',
    //   })      
    // }
    this.setState({[`fileList${index}`]:fileList},()=>{
      setTimeout(()=>{
        const {dataSource} = this.state
        dataSource[index].imgList = fileList.map(v=> v.response && v.response.data.map(d=>d.fileName)).join(';')
        dataSource[index].viewImgList = fileList.map(v=> v.response && v.response.data.map(d=>d.url).join())
        this.props.onChange(dataSource)
      },500)
    })
  }

  txtChange=(i,e)=>{
    const {dataSource} = this.state
    dataSource[i].txt = e.target.value
    this.props.onChange(dataSource)
  }

  initT=()=>{
    let {t}=this.state
    t=0
    this.setState({t})
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log(nextProps, nextState)
  //   return true
  // }
  componentDidMount(){
    const {dataSource} = this.props
    this.setState({dataSource})
    // setTimeout(()=>{let t1 = new TouchScroll({id:'hotscroll','width':5,'opacity':0.5,color:'#555',minLength:20})},200)
  }

  componentWillReceiveProps(nextprops){
    // let {t}=this.state
    // console.log(t)
    // if(nextprops.dataSource.length>0 && t == 0 ){
    //   ++t
      nextprops.dataSource.map((list,i) =>{
        const imgs = []
        const viewImgList = list.viewImgList || []
        viewImgList.map((v,j)=>{
          imgs.push({
            uid: j,
            response:{data:[{url:v,fileName:list.imgList.split(";")[j]}]},
            name: list.imgList.split(";")[j],
            status: 'done',
            url: v,
            thumbUrl: v,            
          })
        })
        this.setState({
          [`fileList${i}`]:imgs,
          // t,
        })
      })
    // }
  }

  render(){
    const {dataSource} = this.state
    const {previewImage,previewVisible}=this.state
    const aty={width:50,height:50,lineHeight:'50px',borderRadius:'50%',background:'#eee'}
    const bty={lineHeight:'50px',fontSize:35,color:'#46C883'}
    const yty={lineHeight:'50px',fontSize:35,color:'#0088D5'}
    // var xToken = { };
    //     xToken[header] = token; //X-CSRF-TOKEN
    return (
      // <div id='hotscroll' className='scrollbar'>
      <ScrollBar className='bar' tracksize='5px' style={{height:300,paddingRight:20}} autohide>
        {dataSource.length>0 && dataSource.map((list,i ) => {
          
          return (<Row type="flex" align="top" gutter={2} key={i}>
              <Col span={2} style={{textAlign:'center'}}>
              <Avatar style={aty}>
                <i className={list.type =='patient' ? "iconfont icon-ren" : "iconfont icon-shouye1"} style={list.type =='patient' ? bty:yty} />
              </Avatar><br /> {list.type =='patient' ? '患者': '医生' }</Col>
              <Col span={17}>
                  <Row>
                      <Col span={24}><TextArea placeholder="请输入内容" rows={3} value={list.txt} onChange={(value)=>{this.txtChange(i,value)}} /></Col>
                      {/* <Col span={24} style={{margin:"10px 10px 20px 0"}}>{list.viewImgList.map(img=><img src={img} width='50' height='50' />)}</Col> */}
                  </Row>
              </Col>
              <Col span={2} style={{textAlign:'right'}}>              
              <Upload
                action={uploadser}
                // key={i}
                accept={config.imgType}
                listType="picture"
                beforeUpload={config.beforeUpload}
                fileList= {this.state[`fileList${i}`] || [] } //  {imgs}
                // multiple={true}
                onPreview={this.handlePreview}
                onChange={this.handleChange.bind(this,i)}
                //headers={xToken}
              >
              <a href="javascript:;">
                <i className="iconfont icon-tianjiatupian" style={{fontSize:70,position:'relative',top:'-15px'}}/>
              </a>
              </Upload>
              </Col>
              <Col span={3} style={{textAlign:'right'}}><Popconfirm title="确定删除吗？" onConfirm={()=>{this.props.del(i)}} okText="是" cancelText="否"> <Button type='danger' size='large' style={{position:'relative',top:'20px',right:10}}><i className="iconfont icon-delete"/>删除</Button></Popconfirm></Col>
          </Row>
        )})}
        <Modal visible={previewVisible} footer={null} onCancel={()=>{this.setState({previewVisible:false})}}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </ScrollBar>
      // </div>
    )
  }
}


//     normFile = (rule, value, callback) => {
//       console.log(typeof value)
//       if(typeof value =='string'){
//           callback();
//           return;
//       }else if( value && value.fileList.length){
//         callback();
//         return;
//       }
//       callback('请添加图片');
//     }


export default class Diy extends React.Component {
    state={
        loading:false,
        listData:[],
        isEdit:false,
        dataSource:[],
        doctorList:[],
        selectDocter:'',
        editId:null,
        item:[],
        isSaved:false,
        showStyle:"block",
    }

    queryHotConversationDetail =(id)=>{      
      const options ={
        method: 'POST',
        url: API_URL.consul.queryHotConversationDetail,
        data: {
          offset:1,
          conversationId: id,
        },
        dataType: 'json',
        doneResult: data => {
            if (!data.error) {              
              const {dataSource}=this.state
              data.datas.map((v,i)=>{
                dataSource.push({
                  type:!v.ydataAccount.accType ? 'patient' : 'doctor',
                  txt:v.msg,
                  imgList:v.mediaId,
                  viewImgList:v.mediaIdurl
                })
              })
              this.setState({
                dataSource,
                selectDocter:data.data.doctorAccountId,
              })
            } else {
                Modal.error({ title: data.error });
            }
        }
      }
      $.sendRequest(options)
    }
    
    addList=(name)=>{
      const {dataSource}=this.state
      dataSource.push({
        type:name,
        txt:'',
        imgList:[],
        viewImgList:[],
      })
      this.setState({
        dataSource
      })
    }

    del=(i)=>{
      const {dataSource}=this.state
      dataSource.splice(i,1)
      // this.ListBoxRef.initT()
      this.setState({dataSource})
    }

    listChange=(params)=>{
      this.setState({dataSource:params})
    }

    save=(params)=>{
      const {isEdit,editId} = this.state      
      const options ={
        method: 'POST',
        url: isEdit ? API_URL.consul.modifyHotConversationUserDefined : API_URL.consul.addHotConversationUserDefined,
        data: {
          ...params,
          conversationId: isEdit ? editId : null
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
                Modal.error({ title: data.error });
            }
        }
      }
      $.sendRequest(options)
    }

    handleSubmit=()=>{
      // conversationDetails[0].uuid=1,
      // conversationDetails[1].uuid=2,
      // conversationDetails[0].msg=字符串,
      // conversationDetails[1].msg=字符串,
      // conversationDetails[0].mediaId=图片路径,
      // conversationDetails[1].mediaId=图片路径
      const {dataSource,selectDocter,item}=this.state
      let empty = true
      if(!selectDocter){message.warn('请选择咨询对象！');return }
      dataSource.map((data,i) =>{
        if(!data.txt){
          empty = true ;return 
          }else{
            if(data.type =="patient"){
              item[0]=1
            }else if(data.type =="doctor"){
              item[1]=1
            }
            empty = false
          }             
      })
      if(empty){message.warn('内容不能为空！');return}
      this.setState({item})
      if(item.length<2 || !item[0]){message.warn('至少添加一组！');return}
      if(!dataSource[0].txt){ message.warn('内容不能为空！');return }

      const params = {}
      dataSource.map((data,i) =>{
        params[`conversationDetails[${i}].ydataAccountId`] = data.type =="patient" ? '0' : selectDocter
        params[`conversationDetails[${i}].msg`] = data.txt
        params[`conversationDetails[${i}].mediaId`] = data.imgList
      })
      this.save(params)
    }

    loadDoctor=()=>{
      const options ={
        method: 'POST',
        url: API_URL.index.queryDepartmentDoctor,
        data: {
            offset: 1,
            limit: 999,
        },
        dataType: 'json',
        doneResult: data => {
            if (!data.error) {
                const doctorList = data.datas || data.data;
                this.setState({
                  doctorList,
                });
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
      if(this.props.match.params.id){
        const editId = this.props.match.params.id
        this.setState({
          editId,
          isEdit:true
        },()=>{this.queryHotConversationDetail(editId)})
      }
      this.loadDoctor()
    }
    render(){
        const {loading,listData,isEdit,dataSource,doctorList,selectDocter,isSaved}=this.state
        const {history}=this.props
        const hty={height:50,lineHeight:'50px'}
        const aty={width:50,height:50,lineHeight:'50px',borderRadius:'50%',background:'#eee'}
        return(
          <Spin spinning={loading}>
          <Prompt when={!isSaved} message="是否确认离开当前编辑页?" />
              <Row gutter={10} style={{borderBottom:"1px solid #eee",padding:15,marginBottom:15,}}>
                <Col md={8} sm={10} style={hty}><i style={{color:'red'}}> * </i>咨询对象（解答者）：
                <Select style={{width:120}} value={`${selectDocter}`} onChange={(v)=>{this.setState({selectDocter:v})}}>
                  {doctorList && doctorList.map(v => <Option key={`${v.ydataAccountId}`} value={`${v.ydataAccountId}`}>{v.userCompellation}</Option>)}
                </Select>
                </Col>
                <Col span={4}>
                  <a href='javascript:;' style={{marginRight:20}} onClick={()=>{this.addList('patient')}}><Avatar style={aty}><i className="iconfont icon-ren" style={{lineHeight:'50px',fontSize:35,color:'#46C883'}}/></Avatar></a>
                  <a href='javascript:;' onClick={()=>{this.addList('doctor')}}><Avatar style={aty}><i className="iconfont icon-shouye1" style={{lineHeight:'50px',fontSize:35,color:'#0088D5'}}/></Avatar></a>                  
                </Col>
                <Col span={8} style={hty}><i style={{color:'red'}}> * </i>点击患者/医生图标，新增一行</Col>
              </Row>
              <ListBox ref={(el)=>{ this.ListBoxRef = el}} dataSource={dataSource} del={this.del} onChange={this.listChange}/>
              <Row>
                <Col span={1} push={4}><Button type='primary' onClick={this.handleSubmit}>{isEdit ? '保存':'添加'}</Button></Col>
                <Col span={1} push={5}><Button onClick={history.goBack}>取消</Button></Col>
              </Row>
            </Spin>
        )
    }
}