import React from 'react';
import { Router, Switch, Route } from 'dva/router';
import dynamic from 'dva/dynamic';
import AuthRoute from './components/AuthRoute';
import './index.less';

function RouterConfig({ history, app }) {
  // const IndexPage = dynamic({
  //   app,
  //   models: () => [
  //     import('./models/Order/OrderModel'),
  //   ],
  //   component: () => import('./routes/IndexPage'),
  // });
  const Register = dynamic({
    app,
    models: () => [
      import('./models/Register/RegisterModel'),
    ],
    component: () => import('./routes/Register/Register'),
  });
  const RegisterNext = dynamic({
    app,
    models: () => [
      import('./models/Register/RegisterModel'),
    ],
    component: () => import('./routes/Register/RegisterNext'),
  });
  const Agreement = dynamic({
    app,
    // models: () => [
    //   import('./models/Agreement/AgreementModel'),
    // ],
    component: () => import('./routes/Register/Agreement'),
  });
  const Login = dynamic({
    app,
    models: () => [
      import('./models/Login/loginModel'),
    ],
    component: () => import('./routes/Login/Login'),
  });
  const LoginForAssistant = dynamic({
    app,
    models: () => [
      import('./models/Login/loginModel'),
    ],
    component: () => import('./routes/Login/LoginForAssistant'),
  });
  const ForgetPassword = dynamic({
    app,
    models: () => [
      import('./models/Password/ForgetPasswordModel'),
    ],
    component: () => import('./routes/Password/ForgetPassword'),
  });
  const ForgetPasswordNext = dynamic({
    app,
    models: () => [
      import('./models/Password/ForgetPasswordModel'),
    ],
    component: () => import('./routes/Password/ForgetPasswordNext'),
  });
  const SetPassword = dynamic({
    app,
    models: () => [
      import('./models/Setting/SettingModel'),
    ],
    component: () => import('./routes/Password/SetPassword'),
  });
  const MyIncome = dynamic({
    app,
    component: () => import('./routes/MyIncome/MyIncome'),
    models: () => [
      import('./models/PersonalInfo/PersonalInfoModel'),
      import('./models/Register/RegisterModel'),
    ],
  });
  const PersonalInfo = dynamic({
    app,
    models: () => [
      import('./models/PersonalInfo/PersonalInfoModel'),
      import('./models/Register/RegisterModel'),
    ],
    component: () => import('./routes/Personal/PersonalInfo'),
  });
  const GradeAndIntegralDescription = dynamic({
    app,
    component: () => import('./routes/Personal/GradeAndIntegralDescription'),
  });
  const EssentialiInformation = dynamic({
    app,
    models: () => [
      import('./models/PersonalInfo/PersonalInfoModel'),
    ],
    component: () => import('./routes/Personal/EssentialiInformation'),
  });
  const ReviseIphoneNumber = dynamic({
    app,
    models: () => [
      import('./models/PersonalInfo/PersonalInfoModel'),
    ],
    component: () => import('./routes/Personal/ReviseIphoneNumber'),
  });
  const AuditFailedToPass = dynamic({
    app,
    models: () => [
      import('./models/PersonalInfo/PersonalInfoModel'),
    ],
    component: () => import('./routes/Personal/AuditFailedToPass'),
  });
  const AuditInfomation = dynamic({
    app,
    models: () => [
      import('./models/PersonalInfo/PersonalInfoModel'),
      import('./models/Register/RegisterModel'),
    ],
    component: () => import('./routes/Personal/AuditInfomation'),
  });
  const CustomerServiceCenter = dynamic({
    app,
    component: () => import('./routes/CustomerServiceCenter/CustomerServiceCenter'),
    models: () => [
      import('./models/CustomerServiceCenter/CustomerServiceCenterModel'),
      import('./models/Register/RegisterModel'),
    ],
  });
  const Feedback = dynamic({
    app,
    component: () => import('./routes/CustomerServiceCenter/Feedback'),
    models: () => [
      import('./models/CustomerServiceCenter/CustomerServiceCenterModel'),
      import('./models/Register/RegisterModel'),
    ],
  });
  const Problem = dynamic({
    app,
    component: () => import('./routes/CustomerServiceCenter/Problem'),
    models: () => [
      import('./models/CustomerServiceCenter/CustomerServiceCenterModel'),
    ],
  });
  const ProblemDetail = dynamic({
    app,
    component: () => import('./routes/CustomerServiceCenter/ProblemDetail'),
    models: () => [
      import('./models/CustomerServiceCenter/CustomerServiceCenterModel'),
    ],
  });
  const SetCommonAddress = dynamic({
    app,
    component: () => import('./routes/CommonAddress/SetCommonAddress'),
    models: () => [
      import('./models/Setting/SettingModel'),
      import('./models/Register/RegisterModel'),
    ],
  });
  const SetNewAddress = dynamic({
    app,
    component: () => import('./routes/CommonAddress/SetNewAddress'),
    models: () => [
      import('./models/Setting/SettingModel'),
    ],
  });
  const SetNewAddressFromOrder = dynamic({
    app,
    component: () => import('./routes/CommonAddress/AddressFromOrder'),
    models: () => [
      import('./models/Setting/SettingModel'),
    ],
  });
  const ModifyAddress = dynamic({
    app,
    component: () => import('./routes/CommonAddress/ModifyAddress'),
    models: () => [
      import('./models/Setting/SettingModel'),
    ],
  });
  const SetOrder = dynamic({
    app,
    component: () => import('./routes/Order/SetOrder'),
    models: () => [
      import('./models/Setting/SettingModel'),
      import('./models/Register/RegisterModel'),
    ],
  });
  const Setting = dynamic({
    app,
    component: () => import('./routes/Setting/Setting'),
    models: () => [
      import('./models/Setting/SettingModel'),
    ],
  });
  const SetSession = dynamic({
    app,
    component: () => import('./routes/SetSession/SetSession'),
  });

  const AddOrder = dynamic({
    app,
    component: () => import('./routes/Order/AddOrder'),
    models: () => [
      import('./models/Order/OrderModel'),
      import('./models/Notice/NoticeModel'),
      import('./models/PersonalInfo/PersonalInfoModel'),
      import('./models/Register/RegisterModel'),
    ],
  });
  const RobNewOrder = dynamic({
    app,
    component: () => import('./routes/Order/RobNewOrder'),
    models: () => [
      import('./models/Order/OrderModel'),
      import('./models/MyOrder/MyOrderModel'),
      import('./models/PersonalInfo/PersonalInfoModel'),
    ],
  });
  const IllegalDetail = dynamic({
    app,
    component: () => import('./routes/Order/IllegalDetail'),
    models: () => [
      import('./models/Order/OrderModel'),
    ],
  });
  const WaitRobOrder = dynamic({
    app,
    component: () => import('./routes/Order/WaitRobOrder'),
    models: () => [
      import('./models/Order/OrderModel'),
      import('./models/MyOrder/MyOrderModel'),
      import('./models/PersonalInfo/PersonalInfoModel'),
    ],
  });
  const WaitServiceOrder = dynamic({
    app,
    component: () => import('./routes/Order/WaitServiceOrder'),
    models: () => [
      import('./models/Order/OrderModel'),
      import('./models/MyOrder/MyOrderModel'),
      import('./models/PersonalInfo/PersonalInfoModel'),
    ],
  });
  const ServicingOrder = dynamic({
    app,
    component: () => import('./routes/Order/ServicingOrder'),
    models: () => [
      import('./models/Order/OrderModel'),
      import('./models/MyOrder/MyOrderModel'),
      import('./models/PersonalInfo/PersonalInfoModel'),
    ],
  });

  const ServicePrice = dynamic({
    app,
    component: () => import('./routes/Order/ServicePrice'),
  });

  const AllOrder = dynamic({
    app,
    component: () => import('./routes/MyOrder/AllOrder'),
    models: () => [
      import('./models/Order/OrderModel'),
      import('./models/MyOrder/MyOrderModel'),
      import('./models/Register/RegisterModel'),
    ],
  });

  const DataOrder = dynamic({
    app,
    component: () => import('./routes/MyOrder/DataOrder'),
    models: () => [
      import('./models/MyOrder/MyOrderModel'),
    ],
  });

  const AddComment = dynamic({
    app,
    component: () => import('./routes/MyOrder/AddComment'),
  });
  const OrderStatus = dynamic({
    app,
    component: () => import('./routes/MyOrder/OrderStatus'),
    models: () => [
      import('./models/MyOrder/MyOrderModel'),
    ],
  });
  const SelectVoucher = dynamic({
    app,
    component: () => import('./routes/MyOrder/SelectVoucher'),
    models: () => [
      import('./models/MyOrder/MyOrderModel'),
    ],
  });
  const PaySuccess = dynamic({
    app,
    component: () => import('./routes/MyOrder/PaySuccess'),
    models: () => [
      import('./models/MyOrder/MyOrderModel'),
    ],
  });

  const Notice = dynamic({
    app,
    component: () => import('./routes/Notice/Index'),
    models: () => [
      import('./models/Notice/NoticeModel'),
    ],
  });
  const NoticeContent = dynamic({
    app,
    component: () => import('./routes/Notice/Content'),
    models: () => [
      import('./models/Notice/NoticeModel'),
    ],
  });
  const MyAssets = dynamic({
    app,
    component: () => import('./routes/MyAssets/MyAssets'),
    models: () => [
      import('./models/PersonalInfo/PersonalInfoModel'),
      import('./models/Register/RegisterModel'),
    ],
  });

   // 我的代金券
  const QueryMyVouchers = dynamic({
    app,
    component: () => import('./routes/MyAssets/QueryMyVouchers'),
    models: () => [
      import('./models/MyAssets/myAssetsModel'),
    ],
  });
  const Recharge = dynamic({
    app,
    component: () => import('./routes/MyAssets/Recharge'),
    models: () => [
      import('./models/PersonalInfo/PersonalInfoModel'),
      import('./models/MyOrder/MyOrderModel'),
    ],
  });
  const RechargeAgreement = dynamic({
    app,
    component: () => import('./routes/MyAssets/RechargeAgreement'),
    models: () => [
      import('./models/PersonalInfo/PersonalInfoModel'),
    ],
  });
  const BalanceWithdrawals = dynamic({
    app,
    component: () => import('./routes/MyAssets/BalanceWithdrawals'),
    models: () => [
      import('./models/PersonalInfo/PersonalInfoModel'),
    ],
  });
  const RechargeDetail = dynamic({
    app,
    component: () => import('./routes/MyAssets/RechargeDetail'),
    models: () => [
      import('./models/PersonalInfo/PersonalInfoModel'),
    ],
  });
  const WithdrawalsDetail = dynamic({
    app,
    component: () => import('./routes/MyAssets/WithdrawalsDetail'),
    models: () => [
      import('./models/PersonalInfo/PersonalInfoModel'),
    ],
  });
  const Subject = dynamic({
    app,
    models: () => [
      import('./models/PersonalInfo/PersonalInfoModel'),
    ],
    component: () => import('./routes/Personal/Subject'),
  });

  return (
    <Router history={history}>
      <Switch>
        <AuthRoute history={history}>
          {/* <Route path="/" exact component={IndexPage} /> */}
          {/* 注册 */}
          <Route path="/Register/Register" exact component={Register} />
          {/* 注册下一步 */}
          <Route path="/Register/RegisterNext" exact component={RegisterNext} />
          {/* 协议 */}
          <Route path="/Register/Agreement" exact component={Agreement} />
          {/* 登录 */}
          <Route path="/Login" exact component={Login} />
          {/* 登录(医助版) */}
          <Route path="/LoginForAssistant" exact component={LoginForAssistant} />
          {/* 忘记密码 */}
          <Route path="/ForgetPassword" auth="ForgetPassword" exact component={ForgetPassword} />
          {/* 忘记密码下一步 */}
          <Route path="/ForgetPasswordNext" exact component={ForgetPasswordNext} />
          {/* 密码设置 */}
          <Route path="/SetPassword" auth="SetPassword" exact component={SetPassword} />
          {/* 我的收入 */}
          <Route path="/MyIncome" auth="MyIncome" exact component={MyIncome} />
          {/* 我的资产 */}
          <Route path="/MyAssets" auth="MyAssets" exact component={MyAssets} />
          {/* 我的代金券 */}
          <Route path="/MyAssets/QueryMyVouchers" auth="QueryMyVouchers" exact component={QueryMyVouchers} />
          {/* 个人信息 */}
          <Route path="/PersonalInfo" auth="PersonalInfo" exact component={PersonalInfo} />
          {/* 会员等级|积分说明 */}
          <Route path="/GradeAndIntegralDescription" exact component={GradeAndIntegralDescription} />
          {/* 基本信息 */}
          <Route path="/EssentialiInformation" auth="EssentialiInformation" exact component={EssentialiInformation} />
          {/* 专业 */}
          <Route path="/Subject" exact component={Subject} />
          {/* 修改手机号码 */}
          <Route path="/ReviseIphoneNumber" auth="ReviseIphoneNumber" exact component={ReviseIphoneNumber} />
          {/* 审核未通过 */}
          <Route path="/AuditFailedToPass" auth="AuditFailedToPass" exact component={AuditFailedToPass} />
          {/* 认证信息 */}
          <Route path="/AuditInfomation" auth="AuditInfomation" exact component={AuditInfomation} />
          {/* 客服中心 */}
          <Route path="/CustomerServiceCenter" auth="CustomerServiceCenter" exact component={CustomerServiceCenter} />
          {/* 在线留言 */}
          <Route path="/Feedback" auth="Feedback" exact component={Feedback} />
          {/* 问题分类 */}
          <Route path="/Problem/:id" exact component={Problem} />
          {/* 问题详情 */}
          <Route path="/ProblemDetail/:id" exact component={ProblemDetail} />
          {/* 常用地址设置 */}
          <Route path="/SetCommonAddress" exact component={SetCommonAddress} />
          {/* 新建地址 */}
          <Route path="/SetNewAddress" exact component={SetNewAddress} />
          {/* 从订单页新建地址 */}
          <Route path="/SetNewAddress/AddressFromOrder" exact component={SetNewAddressFromOrder} />
          {/* 修改地址 */}
          <Route path="/ModifyAddress/:id" exact component={ModifyAddress} />
          {/* 接单设置 */}
          <Route path="/SetOrder" exact component={SetOrder} />
          {/* 设置*/}
          <Route path="/Setting" exact component={Setting} />

          {/* 下单 */}
          <Route path="/Order/AddOrder" auth="AddOrder" exact component={AddOrder} />
          <Route path="/Order/ServicePrice" exact component={ServicePrice} />
          {/* 等待抢单 */}
          <Route path="/Order/WaitRobOrder" auth="WaitRobOrder" exact component={WaitRobOrder} />
          {/* 医助抢新订单 */}
          <Route path="/Order/RobNewOrder" auth="RobNewOrder" exact component={RobNewOrder} />
          {/* 医助待服务订单 */}
          <Route path="/Order/WaitServiceOrder" auth="WaitServiceOrder" exact component={WaitServiceOrder} />
          {/* 医助服务中订单 */}
          <Route path="/Order/ServicingOrder" auth="ServicingOrder" exact component={ServicingOrder} />
          {/* 医助违规详情 */}
          <Route path="/Order/IllegalDetail" auth="IllegalDetail" exact component={IllegalDetail} />
          {/* 我的订单*/}
          <Route path="/MyOrder/AllOrder" exact component={AllOrder} />
          {/* 订单详情*/}
          <Route path="/MyOrder/DataOrder/:id" exact component={DataOrder} />
          <Route path="/MyOrder/DataOrder/fromVoucher/:id" exact component={DataOrder} />
          {/* 评价订单*/}
          <Route path="/MyOrder/AddComment/:id" exact component={AddComment} />
          {/* 订单状态*/}
          <Route path="/MyOrder/OrderStatus/:id" exact component={OrderStatus} />
          {/* 代金券选择 */}
          <Route path="/MyOrder/SelectVoucher/:id" exact component={SelectVoucher} />
          {/* 支付成功页面 */}
          <Route path="/MyOrder/PaySuccess/:id" exact component={PaySuccess} />

          {/* 设置参数页面 */}
          <Route path="/SetSession" exact component={SetSession} />
          {/* 消息 */}
          <Route path="/Notice" exact component={Notice} />
          {/* 公告详情*/}
          <Route path="/Notice/Content/:id" exact component={NoticeContent} />

          {/* 余额充值*/}
          <Route path="/WePay/Balance/Recharge" exact component={Recharge} />
          {/* 充值协议*/}
          <Route path="/RechargeAgreement" exact component={RechargeAgreement} />
          {/* 余额提现*/}
          <Route path="/BalanceWithdrawals" exact component={BalanceWithdrawals} />
          {/* 充值明细*/}
          <Route path="/RechargeDetail" exact component={RechargeDetail} />
          {/* 提现明细*/}
          <Route path="/WithdrawalsDetail" exact component={WithdrawalsDetail} />
        </AuthRoute>
      </Switch>
    </Router>
  );
}

export default RouterConfig;
