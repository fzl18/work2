import $ from '../../common/XDomainJquery';
import React from 'react';
import { Button, Input, Modal, message,Icon } from 'antd';
import API_URL from '../../common/url';
import StringUtil from '../../common/StringUtil';


class Login extends React.Component {
    state = {
        employeeCode: '',
        passCode: '',
    };

    login = () => {
        const { employeeCode, passCode } = this.state;
        if (StringUtil.isNull(employeeCode) || StringUtil.isNull(passCode)){
            Modal.error({title:"错误", content:"登录名或密码不能为空"});
            return;
        }
        if(employeeCode != passCode){
            Modal.error({title:"错误", content:'登录名或密码错误'});
            return;
        }
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
                   location.href = `./#/invList`;
                } 
                else{
                    location.href = `./#/home`;
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

    passInput = e => {
        this.setState({
            passCode: e.target.value,
        });
    }

    componentDidMount() {
    }

    render() {
        sessionStorage.invId = 0;
        sessionStorage.siteId = 0;
        sessionStorage.curRole = '';
        return (
            <div className="index-login" >                  
             <div className="wrap-login">
                <div style={{textAlign:'center',fontSize:30}}><img src='/images/login_logo.png' style={{marginRight:20}}/>CRC随心呼管理系统</div>
                <div className="con-bg"><p>账号<br/>登录</p></div>
                <div className='login form-signin' style={{display:'inline-block', float:'right'}} >   
                    {/* <div className="form-signin-heading">医院科室微信公众号管理系统</div> */}
                    账号：<Input style={{lineHeight:'30px',height:'30px',marginBottom:20,width:'86%'}}  id="username" onBlur={this.nameInput} placeholder="请输入账号" /><br/>
                    密码：<Input style={{lineHeight:'30px',height:'30px',marginBottom:20,width:'86%'}}  id="password" onBlur={this.passInput} placeholder="请输入密码" type='password'/>
                    <Button className="btn btn-lg btn-block" id="loginBtn" style={{background:'#ce4847',width:"86%", float:'right', height:30,lineHeight:'30px'}} onClick={this.login}>登录</Button>
                </div>
                
                </div>
                 <div className="footer">
				 <div className="footerWrap">
					<p>版权所有&copy; CRC随心呼管理系统   <span style={{marginLeft:10}}>技术支持：无锡慧方科技有限公司</span></p>
				</div>
			 </div>
		    </div>
        );
    }
}

export default Login;
