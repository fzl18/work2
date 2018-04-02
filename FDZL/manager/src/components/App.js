import React from 'react';
import {Link} from 'react-router-dom';
import pathTtoRegexp from 'path-to-regexp';
import { Layout, Menu, Icon, Breadcrumb, Dropdown, Avatar, Col,Row } from 'antd';
//import Header from './layout/Header';
//import Footer from './layout/Footer';
import Nav from './layout/Nav';
import Jquery from '../common/XDomainJquery';
import API_URL from '../common/url';
import { Spin, Modal } from 'antd';
import ENV from '../common/env.js';
import { menuList } from './layout/Menu';


const { Header, Sider, Content, Footer } = Layout;
const SubMenu = Menu.SubMenu;
const sty={fontSize:16,color:'#333',padding:6,background:'#DFEDF9',borderRadius:5,marginLeft:12}
class App extends React.Component {
    state = {
        collapsed: false,
        showBack:'none',
        rerender:true,
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
            rerender: false,
        },()=>{
          this.setState({
            rerender: true,
          })
        });
    } 

    getBreadcrumb = () => {
      const hashUrl = location.hash;
      const breadArr = [];      
      let parent=[], over = false
      const pushMap = (list) => {        
        list.map((data,index) => {
          if(over){ return }
          if(data.level == 0){
            parent=[]
          }
          let re = data.path && pathTtoRegexp(data.path)
          if(data.path == hashUrl || re && re.exec(hashUrl)){
            if(parent.length>0){
              parent.map(data=>{
                breadArr.push({
                  ...data
                })
              })
            }
            breadArr.push({
              ...data
            })
            over = true
            return
          }else{
            if(data.children){
              parent.push({
                ...data
              })
              pushMap(data.children)
            }else{
              if(data.level == 0){
                parent=[]
              }else{
                if(parent.length>1){
                  parent.splice( data.name =='添加' ? data.level : data.level-1  ,1)
                }                
              }
            }
          }
        })}

      pushMap(menuList);
      return breadArr
    }

    componentDidMount(){
      const breadArr = this.getBreadcrumb()
      if(breadArr.length > 0 && breadArr[breadArr.length-1].back){
        this.setState({showBack:'block'})
      }else{
        this.setState({showBack:'none'})
      }
    }

    componentWillReceiveProps(nextprops){
      const breadArr = this.getBreadcrumb()
      if(breadArr.length > 0 && breadArr[breadArr.length-1].back){
        this.setState({showBack:'block'})
      }else{
        this.setState({showBack:'none'})
      }      
    }

    render() {
        const { showBack,collapsed,rerender } = this.state;
        const menu = (
          <Menu className="config_menu" selectedKeys={[]} onClick={this.onMenuClick}>
            <Menu.Item disabled><Icon type="setting" />设置</Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
          </Menu>
        );
        const breadList = this.getBreadcrumb().map( (list,i)=> <Breadcrumb.Item key={i}> {list.path ? <a href={`${location.pathname}${list.path}`}>{list.name}</a> : list.name }  </Breadcrumb.Item>)
        return (
            <Layout>
              {rerender ? 
                <Sider
                  trigger={null}
                  collapsible
                  collapsed={collapsed}
                  style={{width:"200px",overflow: collapsed ? "block" : "hidden"}}
                >
                  <div className="logo">
                    <span className="min-logo"></span>
                    <span className="title">微信应用管理系统</span>
                  </div>              
                    <Nav collapsed={this.state.collapsed}/>
                </Sider>
                :
                null
              }
            
            <Layout>
              <Header style={{ background: '#fff', padding: 0 }}>
                <Icon
                  className="trigger"
                  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={this.toggle}
                />
                {/* <Dropdown overlay={menu}> */}
                {/* <Dropdown> */}
                
                <span className="action account">
                <Link to='/setting'><i className="iconfont icon-shezhi" style={sty} /></Link>
                <Link to='/login'><i className="iconfont icon-quit" style={sty} /></Link>
                </span>
                
                  <span className="action account">
                    <Avatar size="small" className="avatar" />
                    你好，管理员
                  </span>
                  
                {/* </Dropdown> */}
              </Header>
              <Row style={{padding:'10px 16px 0 0',borderTop:'2px solid #eee',background:'#fff'}}>
                <Col span={20}>
                <Breadcrumb>
                  {breadList}
                </Breadcrumb>
                </Col>
                <Col span={4} style={{textAlign:'right'}}>
                  <a href="javascript:history.back()" style={{color:'#333',display:showBack }}><i style={{fontSize:16,marginRight:10,}} className="iconfont icon-fanhui" /> 返回 </a>
                </Col>
              </Row>
              
              <Content style={{margin:'20px 16px 0 16px', padding: 20, background:'#fff',height:'50%',overflowY:'auto'}}>
              { this.props.children }
              </Content>
              <Footer style={{textAlign: 'center' }}>
                Copyright © 2017 无锡慧方科技有限公司
              </Footer>
            </Layout>
          </Layout>
        //     show ?
        //         <div>
        //             <Header />
        //             <Nav />
        //             <Pin />
        //             <div className="container">
        //                 <div className="wrapper">
        //                     { this.props.children }
        //                 </div>
        //             </div>
        //             <Footer />
        //         </div>
        //     :
        //         <Spin tip="加载用户数据..." style={{ position: 'fixed', top: '50%', left: '50%' }} />
         );
    }
}

export { App as default };
