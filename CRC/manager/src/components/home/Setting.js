import $ from '../../common/XDomainJquery';
import React from 'react';
import { Button, Input, Modal, message,Icon } from 'antd';
import API_URL from '../../common/url';
import StringUtil from '../../common/StringUtil';


export default class Setting extends React.Component {
    state = {
        employeeCode: '',
        passCode: '',
        repassCode:''
    };

    login = () => {
        const { employeeCode, passCode, repassCode} = this.state;
        if (StringUtil.isNull(employeeCode) || StringUtil.isNull(passCode) || StringUtil.isNull(repassCode)){
            Modal.error({title:"错误", content:"原密码或新密码或确认密码不能为空"});
            return;
        }
        if(repassCode != passCode){
            Modal.error({title:"错误", content:'两次密码不一致'});
            return;
        }
        // if(employeeCode != passCode){
        //     Modal.error({title:"错误", content:'密码错误'});
        //     return;
        // }
        
        $.ajax({
            method: 'get',
            url: `${API_URL.user.getUserInfo}`,
            data: {
                employeeCode,
            },
            type: 'json',
        }).done(result => {
            if (result.error) {
                Modal.error({ title: '错误', content: result.error });
            } else if (result.data.error) {
                Modal.error({ title: '错误', content: result.data.error });
            } else {
                // SY, //系统管理员
                // EA, //企业管理员
                // BO, //总监
                // BDO, //BD总监
                // BD,
                // PA, //项目管理员
                // PM, //项目经理
                // CRCC, //CRC主管
                // CRCM, //CRC经理
                // CRC, //临床协调员
                // CPM, //客户项目经理
                // PI, //研究者
                // CRA, //监察员
                // OTH, //其它
                //sessionStorage.user = result.data.user;
                sessionStorage.curRole = result.data.positionRole != undefined && result.data.positionRole != null ? 
                        result.data.positionRole : '';
                sessionStorage.positionRole = result.data.positionRole != undefined && result.data.positionRole != null ? 
                        result.data.positionRole : '';
                sessionStorage.positionName = result.data.user.positionName != undefined && result.data.user.positionName != null ?
                        result.data.user.positionName : '';
                sessionStorage.userId = result.data.user.userId;
                sessionStorage.userName = result.data.user.userCompellation;
                sessionStorage.curEnterpriseId = result.data.user.enterpriseId;
                sessionStorage.curEmployeeCode = employeeCode;
                sessionStorage.invName = '';
                sessionStorage.invId = 0;
                sessionStorage.siteId = 0;
                if(sessionStorage.curRole == 'PA' ){
                   location.href = `./#/UserManager/Doctors`;
                } 
                else{
                    location.href = `./#/login`;
                }

                //sessionStorage.curRole = 'BO';
               
            }
        }).fail(function( jqXHR, textStatus, errorThrown ) {
            console.log(jqXHR + textStatus + errorThrown);
        });
    };

    nameInput = e => {
        this.setState({
            employeeCode: e.target.value,
        });
    }

    passInput = (name,e) => {
        this.setState({
            [name]: e.target.value,
        });
    }

    componentDidMount() {
    }

    render() {
        sessionStorage.invId = 0;
        sessionStorage.siteId = 0;
        sessionStorage.curRole = '';
        const bottomStyle={lineHeight:'30px',height:'30px',marginBottom:20,width:'75%'}
        const txtStyle={textAlign:'right',width:'20%',display:'inline-block'}
        const formStyle={boxShadow:'inherit',width:300,margin:'30px auto'}
        return (
            <div className='login form-signin' style={formStyle} >   
                <div style={{color:'#188FFF',fontSize:18,textAlign:'center',marginBottom:20}}><i className="iconfont icon-mima" style={{fontSize:30,marginRight:10}}/> 修改密码</div>
                <div><span style={{color:'red'}}>*</span><span style={txtStyle}>原 密 码：</span><Input style={bottomStyle} size="large" id="username" onBlur={this.nameInput} placeholder="原密码" /></div>
                <div><span style={{color:'red'}}>*</span><span style={txtStyle}>新 密 码：</span><Input style={bottomStyle} size="large" id="password" onBlur={this.passInput.bind(this,'passCode')} placeholder="新密码" /></div>
                <div><span style={{color:'red'}}>*</span> <span style={txtStyle}>确认密码：</span><Input style={bottomStyle} size="large" id="password" onBlur={this.passInput.bind(this,'repassCode')} placeholder="确认密码" /></div>
                <div style={{textAlign:'center'}}>
                    <Button className="btn btn-lg" id="loginBtn" onClick={this.login} style={{width:'20%',background:'#1A90FE',color:'#fff'}}>保存</Button>
                    <Button className="btn btn-lg" onClick={()=>{this.props.history.goBack()}} style={{width:'20%',marginLeft:10,background:'#FFF'}}>返回</Button>
                </div>
            </div>  
        );
    }
}


