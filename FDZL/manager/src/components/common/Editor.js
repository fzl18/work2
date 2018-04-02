/**
 * Creat by Richie Yang 
 * 2017/11
 * 接入antd Form 组件
 * 支持数据双绑，支持form验证，数据监控
 */

import React, { PureComponent } from 'react';
import {message} from 'antd';
import E from 'wangeditor'
import { config,imgpath,uploadimgser } from './config';
export default class Editor extends PureComponent {
    constructor(props) {
        super(props);
        const value = this.props.value || {};
        this.state = {
            editorContent:value.editorContent || '',
        };
    }

    componentDidMount() {
      const elem = this.editorElem
      const editor = new E(elem)      
      const path = imgpath
      editor.customConfig.zIndex = 1
      editor.customConfig.menus = this.props.menus || [
        'head',
        'bold',
        'italic',
        'underline',
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'link',  // 插入链接
        'list',  // 列表
        'justify',  // 对齐方式
        'quote',  // 引用
        'emoticon',  // 表情
        'image',  // 插入图片
        'table',  // 表格
    ]
      editor.customConfig.uploadImgServer = uploadimgser  // 上传图片到服务器
      // 将图片大小限制为 2M
      editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024
      // 将 timeout 时间改为 3s
      editor.customConfig.uploadImgTimeout = 3000 
      //自定义提示方法
      editor.customConfig.customAlert = function (info) {
        message.warn(info)
      }
      
      editor.customConfig.uploadImgHooks = {
        before: function (xhr, editor, files) {
        },
        success: function (xhr, editor, result) {
        },
        fail: function (xhr, editor, result) {
          message.warn("图片插入错误！")
        },
        error: function (xhr, editor) {
          message.warn("图片上传出错！")
        },
        timeout: function (xhr, editor) {
          message.warn("上传超时！")
        },
        customInsert: function (insertImg, result, editor){
            if(result.data.length>1){
              result.data.map(v=>{
                insertImg(path + v)
              })
            }else{
              var imgUrl = path + result.data  
              insertImg(imgUrl)
            }
          }      
        }

      editor.customConfig.onchange = html => {
        // if (!('value' in this.props)) {
            this.setState({
                editorContent: html
            },()=>{
                const onChange = this.props.onChange;
                if (onChange) {
                  onChange(Object.assign({}, this.state));
                }
            });
        // }        
      }
      editor.create()
      editor.txt.html(this.state.editorContent)
    }

    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
          const value = nextProps.value;
          this.setState(value);
        }
      }
  
    render() {
      return (             
        <div ref={el => this.editorElem = el} style={this.props.style} />
      );
    }
  }
  