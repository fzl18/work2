import $ from '../../common/XDomainJquery';
import React from 'react';
import { Button, Input, Modal, message,Icon } from 'antd';
import API_URL from '../../common/url';
import StringUtil from '../../common/StringUtil';


export default class Setting extends React.Component {
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
			beforeSend: function(xhr){
                xhr.setRequestHeader(header, token);
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
        const boxStyle = {top:'50%',
        background:'#fff url(../../../images/footer_bg.jpg) center bottom repeat-x',
        width:'97%',
        position: 'inherit',
        height: '80%',
        margin: 'auto',
        marginTop:'20px',
        float:'inherit',
        borderRadius:5}
        const bottomStyle={lineHeight:'40px',height:'40px',marginBottom:20}
        const formStyle={display:'inline-block', float:'right',boxShadow:'inherit',width:500,marginLeft:-220,marginTop:20}
        return (
            <div className="index-login" style={{background:'#F1F2F6'}}>
             <div className='head' style={{background:'#fff',height:70,lineHeight:'70px'}}>
                <div style={{marginLeft:'50px',fontSize:18}}><img src="../../images/logo.png" width='40' style={{marginRight:10}}/>微信应用管理系统</div>
                <div style={{float:'right',marginRight:50,}}></div>
             </div>
             <div className="wrap-login" style={boxStyle}>
                <div className='login form-signin' style={formStyle} >   
                    <div style={{color:'#188FFF',fontSize:18,textAlign:'center',marginBottom:20}}><i className="iconfont icon-mima" style={{fontSize:30,marginRight:10}}/> 修改密码</div>
                    <Input style={bottomStyle} size="large" prefix={<Icon type="unlock" style={{ color:'rgba(0, 110, 249,.7)',fontSize:17}} />}  id="username" onBlur={this.nameInput} placeholder="原密码" />
                    <Input style={bottomStyle} size="large" prefix={<Icon type="lock" style={{ color:'rgba(0, 110, 249,.7)',fontSize:17 }} />}  id="password" onBlur={this.passInput} placeholder="新密码" />
                    <Input style={bottomStyle} size="large" prefix={<Icon type="lock" style={{ color:'rgba(0, 110, 249,.7)',fontSize:17 }} />}  id="password" onBlur={this.passInput} placeholder="确认密码" />
                    <div style={{textAlign:'center'}}>
                        <Button className="btn btn-lg" id="loginBtn" type="primary" onClick={this.login} style={{width:'45%'}}>登录</Button>
                        <Button className="btn btn-lg" onClick={()=>{this.props.history.goBack()}} style={{width:'45%',marginLeft:10,background:'#555'}}>返回</Button>
                    </div>
                </div>
                
                </div>
                 <div className="footer" style={{height:'40px',lineHeight:'40px',background:'none',color:'#333',padding:0}}>
					版权所有&copy; 复旦大学附属肿瘤医院大肠外科    技术支持:无锡慧方科技有限公司				
			    </div>
		    </div>
        );
    }
}


