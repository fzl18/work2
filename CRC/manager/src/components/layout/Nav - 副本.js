import React from 'react';
import { Menu, Icon } from 'antd';
import lodash from 'lodash'
import auth from '../../common/Auth';
import { PAGEAUTH } from '../../common/AuthConfig';
import './style/layout.less';
import { menuList } from './Menu';

const SubMenu = Menu.SubMenu;

class Nav extends React.Component {
    state = {
        current: '/index',
    }

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

    componentWillReceiveProps(){
        this.checkPageAuth();
        const hashStr = this.getHashUrl();
        this.setState({
            current: hashStr
        })
    }

    componentWillMount(){
        this.checkPageAuth();
        const hashStr = this.getHashUrl();
        this.setState({
            current: hashStr
        })
    }

    clickMenuItem = (e) => {
        console.log(e);
    }

    getMenus = () => {
        let menuNode = 
            menuList.map((levelone,index) => {
                if(!levelone.children || levelone.show){
                    return <Menu.Item key={levelone.path}><a href={levelone.path}> { levelone.icon ? <i className={`iconfont ${levelone.icon}`}></i> : <Icon type='plus'/>  }  <span style={ !this.props.isShowTitle ? null : {visibility:'hidden'}}>{levelone.name}</span></a></Menu.Item>
                }else if(levelone.children && !levelone.show){
                    return  <SubMenu key={index} title={ <span>{ levelone.icon ? <i className={`iconfont ${levelone.icon}`}></i> : <Icon type='plus'/>  } <span style={ !this.props.isShowTitle ? {display:'inline-block'} : {display:'none'} }>{levelone.name}</span></span>}>
                    {
                        levelone.children.map((leveltwo,index) => {
                            return <Menu.Item key={leveltwo.path}><a href={leveltwo.path}>{leveltwo.name}</a></Menu.Item>;
                        })
                    }
                    </SubMenu>;

                }
            })
        return menuNode;
    }

    render() {
        const menuItems = this.getMenus();

        return (
            <nav className="nav-bar">
                <div className="wrapper">
                <Menu
                    theme="dark" 
                    
                    
                    onSelect={this.handleClick}
                    selectedKeys={[this.state.current]}
                    mode="inline"
                >
                {menuItems}
                    </Menu>
                </div>
            </nav>
        );
    }
}

export default Nav;
