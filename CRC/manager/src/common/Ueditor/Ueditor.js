import React, { Component } from 'react';
import {config,uploadser} from '../../components/common/config';
import '../../../lib/ueditor/ueditor.config.js';
import '../../../lib/ueditor/ueditor.all.min.js';       
import '../../../lib/ueditor/lang/zh-cn/zh-cn.js';

class Ueditor extends Component{
  constructor(props){
    super(props);
    const values = this.props.value || '';
    this.state = {value:values};
  }
 componentDidMount(){
  this.props.id &&　setTimeout(()=>{this.initEditor()},500)
 }

 componentWillUnmount() {
  //  组件卸载后，清除放入库的id
  this.props.id && UE.delEditor(this.props.id)
  // setTimeout(()=>{UE.delEditor(this.props.id)},1000)
 }

 
 initEditor = () =>{
  const {initialFrameHeight,initialFrameWidth} = config;
  const {value}=this.state
  const {id} = this.props;
  const ueEditor = this.props.id && UE.getEditor(this.props.id, {initialFrameHeight: initialFrameHeight || '300', initialFrameWidth: initialFrameWidth || '600',autoFloatEnabled:false})
  const self = this; 
  ueEditor.ready((ueditor) => {
    if (!ueditor) {
      UE.delEditor(id);
      self.initEditor();
    }
    if(ueditor){
      if(this.props.value){
        ueEditor.setContent(value)
      }
      ueEditor.addListener("contentChange",function(){       
        let value =UE.getEditor(id).getContent()
        self.setState({
            value
        },()=>{
            const onChange = self.props.onChange;
            if (onChange) {
              onChange(value);
            }
        });
      })
    }
  })
 }

 componentWillReceiveProps(nextProps){
  if ('value' in nextProps) {
    const value = nextProps.value;
    this.setState({value});
  }
 }

 render(){
   return (
     <div id={this.props.id} name="content" type="text/plain"></div>
   )
 }
}
export default Ueditor;