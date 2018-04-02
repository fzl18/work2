import React from 'react';
import { Menu, Icon } from 'antd';
import lodash from 'lodash'
import ScrollBar from 'react-free-scrollbar'
import auth from '../../common/Auth';
import { PAGEAUTH } from '../../common/AuthConfig';
import './style/layout.less';
import { menuList } from './Menu';

const SubMenu = Menu.SubMenu;

class Nav extends React.Component {
    state = {
        current: '#/index',
        openKeys: [],
    }
    rootSubmenuKeys = ['0','1', '2','4','5','6','7','9'];
    handleClick = e => {
        this.setState({
            current: e.key,
        });
    }

    getHashUrl = () => {
        let hashStr = location.hash.substr(1);
        return hashStr;
    }

	checkPageAuth = () => {
        const {siteId, curRole, invId} = sessionStorage;
        const hashStr = this.getHashUrl();
        let pageAuth = {};
    }

    onOpenChange = (openKeys) => {
        //   this.setState({ sub:openKeys[1] })
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.setState({ openKeys });
        } else {
        this.setState({
            openKeys: latestOpenKey ? [latestOpenKey] : [],
        });
        }
      }

    componentWillReceiveProps(){
        // this.checkPageAuth();
        // const hashStr = this.getHashUrl();
        menuList.map((levelone,index) => {
            if(levelone.children && !levelone.show){
               levelone.children.map((leveltwo,i) => {
                   if(location.hash == leveltwo.path){this.setState({openKeys:[`${index}`]});console.log(index)}
               })
           }})
        // this.setState({
        //     current: location.hash,
        // })
        
    }

    componentDidMount(){  
        menuList.map((levelone,index) => {      
            if(levelone.children && !levelone.show){
               levelone.children.map((leveltwo,i) => {
                   if(location.hash == leveltwo.path){this.setState({openKeys:[`${index}`]})}
               })
           }
        })
    }
    componentWillMount(){
        // this.checkPageAuth();
        // const hashStr = this.getHashUrl();
        menuList.map((levelone,index) => {
            if(levelone.children && !levelone.show){
               levelone.children.map((leveltwo,i) => {
                   if(location.hash == leveltwo.path){this.setState({openKeys:[`${index}`]})}
               })
           }})
        this.setState({
            current: location.hash
        })
    }

    clickMenuItem = (e) => {
        console.log(e);
    }

    getMenus = () => {
        let menuNode = 
            menuList.map((levelone,index) => {
                if(!levelone.children || levelone.show){
                    if(levelone.show){
                        return <Menu.Item key={levelone.path} ><a href={levelone.path}> { levelone.icon ? <i className={`anticon iconfont ${levelone.icon}`} /> : <Icon type='plus'/>}  <span >{levelone.name}</span></a></Menu.Item>                        
                    }
                }else if(levelone.children && !levelone.show){
                    return  <SubMenu key={index} title={ <span>{ levelone.icon ? <i className={`anticon iconfont ${levelone.icon}`} /> : <Icon type='plus'/>  } <span>{levelone.name}</span></span>}>
                    {
                        levelone.children.map((leveltwo,i) => {
                            return <Menu.Item key={leveltwo.path}><a href={leveltwo.path}>{leveltwo.name}</a></Menu.Item>;
                        })
                    }
                    </SubMenu>;

                }
            })
        return menuNode;
    }

    render() {        
        const menuItems = this.getMenus()
        
        return (

            <nav className="nav-bar" style={!this.props.collapsed ?{overflowY:'auto',height:'85vh'} :null}>
            {/* <ScrollBar className='sideBar nav-bar' tracksize='5px' style={{paddingRight:20}} autohide={this.props.collapsed ? true:false}> */}
            <Menu
                theme="dark"                     
                onSelect={this.handleClick}
                openKeys={this.state.openKeys}
                // defaultOpenKeys={this.state.openKeys}
                onOpenChange={this.onOpenChange}
                selectedKeys={[this.state.current]}
                // selectedKeys={[location.hash]}
                mode="inline"
            >
            {menuItems}
            </Menu>
             {/* </ScrollBar> */}
            </nav>  

        );
    }
}

export default Nav;
