import API_URL from '../../common/url';
import {Modal} from 'antd';
const confirm = Modal.confirm
export const config={
    pageSize:10, // 表格数据分页数
    pageSizeOptions:['5','10','15','20','25','30'],//可选表格数据分页数
    scroll:{x:1200,y:310}, //表格框大小，超出显示滚动条
    listLength:8, // 表格滚动条出现条件
    paginationProps:{ //表格分页
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions:['5','10','15','20','25','30']
    },
    imgType:'.jpg, .png, .gif',//支持上传图片格式
    beforeUpload:(file)=>{       //限制上传图片大小
      const maxSize = 5  // 允许上传最大图片大小(M)
      const size = file.size / 1024 / 1024 < maxSize;
      if (!size) {
        Modal.warning({
          title: `上传的图片必须小于${maxSize}M!`,
          content: '',
        })
      }
      return size
    },
    imgRemove:()=>{ //删除图片再次确认
      return new Promise(
        (resolve)=>{
          confirm({
            title: '确定要删除图片吗?',
            content: '',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk() {
              resolve(true)
            },
            onCancel() {
              resolve(false)
            },
          })
        }        
      )      
    },
    validateHtml:(rule, value, callback)=>{ //验证富文本输入
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
      callback('请输入内容！')
    },
    formItemLayout:{   //表单样式，响应式
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
          md: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
          md: { span: 12 },
        },
    },
    submitFormLayout:{
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 12, offset: 8 },
          md: { span: 12, offset: 8 },
        },
    },
    formItemLayout2:{   //表单样式，响应式
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
        md: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
        md: { span: 10 },
      },
  },
  submitFormLayout2:{
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 4 },
        md: { span: 10, offset: 4 },
      },
  },
    initialFrameHeight:'300',  //富文本高
    initialFrameWidth:'140%',  //富文本宽
}
export const uploadser= API_URL.common.uploadser //图片上传服务器地址 for antd upload
export const uploadimgser = API_URL.common.uploadimg //图片上传服务器地址 for Editor
export const imgpath = API_URL.common.imgpath  //回传图片需要拼的路径