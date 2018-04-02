/**
 * Created by Richie on 2017/8/2.
 */

import jquery from 'jquery';
import $ from '../../common/AjaxRequest';
import React from 'react';
import { message, Modal, Button,Switch,Icon } from 'antd';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';
import './style/setting.less';




class Setting extends React.Component {
    state = {
        pagination: {
            pageSize: 15,
            current: 1,
        },
        loading: false,
        dataList:{},
        userinfo:true,
        noticeSetting:false,
        userDetail:{},
        mailFlag:0,
    };

    loadUserData = () => {
        const options ={
            method: 'POST',
            url: API_URL.team.queryuser,
            data: {
                userId:sessionStorage.userId,
                // statusSymbol: 'NotEquals',
                // status: 'DELETED',
                // offset: 1,
                // limit: 15,
                // ...params,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {               
                    this.setState({
                        dataList: data.user,
                        userDetail:data.user.userDetail
                    });
                } else {
                    Modal.error({ title: data.error });
                }
            }
        }
        $.sendRequest(options)
    }

    loadNotice = () => {
        const options ={
            method: 'POST',
            url: API_URL.team.queryuser,
            data: {
                userId:sessionStorage.userId,
                // statusSymbol: 'NotEquals',
                // status: 'DELETED',
                // offset: 1,
                // limit: 15,
                // ...params,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {               
                    this.setState({
                        dataList: data.user,
                    });
                } else {
                    Modal.error({ title: data.error });
                }
            }
        }
        $.sendRequest(options)
    }

    reload = (params = {}) => {
        const { pagination } = this.state;
        this.loadData({
            offset: pagination.current,
            ...params,
        });
    }

    reset = () => {
        const pagination = { ...this.state.pagination, current: 1 };
        this.setState({
            pagination,
        });
        this.loadData();
    }

    del = investigationId => {
        const options ={
            method: 'POST',
            url: API_URL.investigation.del,
            data: {
                investigationId,
            },
            dataType: 'json',
            doneResult: () => {
                message.success('删除成功');
                this.reload();
            }
        }
        $.sendRequest(options)
    }

    btnChangeUserinfo = () => {
        this.setState({
            userinfo:true,
            noticeSetting:false,
        })
        this.loadEmailSet()
    }

    btnChangeNoticeSetting = () => {
        this.setState({
            userinfo:false,
            noticeSetting:true,
        })
    }
    loadEmailSet = () => {        
        const options ={
            method: 'POST',
            url: API_URL.config.queryUserEmail,
            data: {
               
            },
            dataType: 'json',
            doneResult: (data) => {
                this.setState({mailFlag:data.data.mailFlag});
            }
        }
        $.sendRequest(options)
    }
    toggle = (checked) => {        
        const options ={
            method: 'POST',
            url: API_URL.config.userIsSendEmail,
            data: {
                mailFlag: checked ? 1 : 0 ,
            },
            dataType: 'json',
            doneResult: (data) => {
                message.success(data.success);
            }
        }
        $.sendRequest(options)
    }
    save = () => {

    }
    componentDidMount() {
        this.loadUserData();
        this.loadEmailSet();
        
    }

    render() {
        const { loading, pagination,dataList,userinfo,noticeSetting,userDetail} = this.state;  
        const employeeCode = userDetail.employeeCode
        return (
            <div className="full">
                <div className="content-2">
                <div style={{color:'#3D33A9'}}><i className='icon iconfont'>&#xe65b;</i>个人设置</div>   
                    <div className='box home'>                                                 
                        <div className='change-btn'>                        
                            <a href='javascript:void(0);' onClick={this.btnChangeUserinfo} className={userinfo ? 'cur' : ''} >我的信息</a>
                            <a href='javascript:void(0);' onClick={this.btnChangeNoticeSetting} className={noticeSetting ? 'cur':''} >通知设置</a> 
                        </div>
                        {userinfo ?
                        <ul className="preview-list" style={{borderTop:'1px solid #ccc'}}>
                            <li>
                                <div className="item">
                                    <label className="ui-label">工号</label>
                                    <span className="">{employeeCode}</span>
                                </div>
                                <div className="item">
                                    <label className="ui-label">姓名</label>
                                    <span className="">{dataList.userCompellation}</span>
                                </div>
                            </li>
                            <li>
                                <div className="item">
                                    <label className="ui-label">职位</label>
                                    <span className="">{dataList.positionName}</span>
                                </div>
                                <div className="item">
                                    <label className="ui-label">部门</label>
                                    <span className="">{dataList.enterpriseDepartmentName}</span>
                                </div>
                            </li>
                            <li>
                                <div className="item">
                                    <label className="ui-label">主管</label>
                                    <span className="">{dataList.leaderName}</span>
                                </div>
                                <div className="item">
                                    <label className="ui-label">工作地点</label>
                                    <span className="">{dataList.cityName}</span>
                                </div>
                            </li>
                            <li>
                                <div className="item">
                                    <label className="ui-label">手机号码</label>
                                    <span className="">{dataList.userMobile}</span>
                                </div>
                                {/* <div className="item">
                                    <label className="ui-label">固定电话</label>
                                    <span className="">{dataList.userTelphone}</span>
                                </div> */}
                                <div className="item">
                                    <label className="ui-label">邮箱</label>
                                    <span className="">{dataList.userEmail}</span>
                                </div>
                            </li>
                        </ul>
                        :
                        <ul className="preview-list" style={{borderTop:'1px solid #ccc'}}>
                            <li className="title" style={{height:42}}></li>
                            <li>
                                <div className="item-max" style={{textAlign:'center'}}>
                                    <label className="ui-label" style={{marginRight:20}}>是否启用邮件通知方式：</label>
                                    <span className="">
                                        <Switch checkedChildren="开" unCheckedChildren="关" onChange={this.toggle} defaultChecked={this.state.mailFlag == 1 ? true : false } />
                                    </span>
                                </div>
                            </li>
                            <li className="title" style={{height:42}}></li>
                            {/* <li className="title" style={{height:42,textAlign:'center'}}><Button type='primary' onClick={this.save}><Icon type="save" />保存</Button></li> */}
                            <li className="title" style={{height:42}}></li>                                                        
                        </ul>
                        }
                    </div>
                </div>

            </div>
        );
    }
}

export default Setting;

