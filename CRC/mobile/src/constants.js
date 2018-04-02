export const PAGE_SIZE = 15;
export const curRole = '';
// const ENV = window.configs || {};
const ENV = window.configs || {};
// 服务地址
export const API_URL = {
  user: {
    doctorRegister: `${ENV.ADMIN_URL}/user/doctorRegister.do`, // 医生注册
    nonDoctorRegister: `${ENV.ADMIN_URL}/user/nonDoctorRegister.do`, // 非医生注册
    verifyCode: `${ENV.ADMIN_URL}/user/verifyCode.do`, // 发送验证码
    queryQuestionType: `${ENV.ADMIN_URL}/project/queryQuestionType.do`, // 客服中心问题分类
    queryQuestion: `${ENV.ADMIN_URL}/project/queryQuestion.do`, // 客服中心问题
    addMessage: `${ENV.ADMIN_URL}/message/addMessage.do`, // 在线留言
    queryMessageType: `${ENV.ADMIN_URL}/project/queryMessageType.do`, // 留言问题分类
    queryOnlineService: `${ENV.ADMIN_URL}/emplace/queryOnlineService.do`, // 联系客服
    addOrderRegion: `${ENV.ADMIN_URL}/emplace/addOrderRegion.do`, // 新增接单设置
    queryOrderRegion: `${ENV.ADMIN_URL}/emplace/queryOrderRegion.do`, // 查询接单地区
    queryCommonPlace: `${ENV.ADMIN_URL}/emplace/queryCommonPlace.do`, // 查询常用地址
    modifyCommonPlace: `${ENV.ADMIN_URL}/emplace/modifyCommonPlace.do`, // 修改常用地址
    deleteCommonPlace: `${ENV.ADMIN_URL}/emplace/deleteCommonPlace.do`, // 删除常用地址
    queryProvince: `${ENV.ADMIN_URL}/emplace/queryProvince.do`, // 查询省
    queryCity: `${ENV.ADMIN_URL}/emplace/queryCity.do`, // 查询市
    queryDistrict: `${ENV.ADMIN_URL}/emplace/queryDistrict.do`, // 查询区
    queryPlaceList: `${ENV.ADMIN_URL}/emplace/queryPlaceList.do`, // 查询省市区
    addCommonPlace: `${ENV.ADMIN_URL}/emplace/addCommonPlace.do`, // 添加常用地址
    listHospitalsByEnterpriseId: `${ENV.ADMIN_URL}/user/listHospitalsByEnterpriseId.do`, // 查询医院
    queryDepHospitalEnterpriseByHospitalId: `${ENV.ADMIN_URL}/user/queryDepHospitalEnterpriseByHospitalId.do`, // 查询科室
    // checkDoctorRegist: `${ENV.ADMIN_URL}/user/checkDoctorRegist.do`, // 注册点下一步时
    loginUser: `${ENV.ADMIN_URL}/user/loginUser.do`, // 登录
    queryIntegralDetail: `${ENV.ADMIN_URL}/project/queryIntegralDetail.do`, // 获取用户信息
    modifyUserPassword: `${ENV.ADMIN_URL}/user/modifyUserPassword.do`, // 修改密码
    checkForgetPassword: `${ENV.ADMIN_URL}/user/checkForgetPassword.do`, // 忘记密码下一步时
    forgetPassword: `${ENV.ADMIN_URL}/user/forgetPassword.do`, // 忘记密码
    queryBasicInformation: `${ENV.ADMIN_URL}/user/queryBasicInformation.do`, // 基本信息
    modifyUserMobile: `${ENV.ADMIN_URL}/user/modifyUserMobile.do`, // 修改手机号
    unbindUser: `${ENV.ADMIN_URL}/user/unbindUser.do`, // 退出登录
    ydataAccountInformation: `${ENV.ADMIN_URL}/user/ydataAccountInformation.do`, // 重新提交认证信息
    queryApproveInformation: `${ENV.ADMIN_URL}/user/queryApproveInformation.do`, // 查询提交认证信息
    selectNowAuditStatus: `${ENV.ADMIN_URL}/user/selectNowAuditStatus.do`, // 查询提交认证状态
    loginAssistant: `${ENV.ADMIN_URL}/user/loginAssistant.do`, // 医助登录
    listHospitalsAutoComplete: `${ENV.ADMIN_URL}/user/listHospitalsAutoComplete.do`, // 自动检索医院
    listDepartmentsAutoComplete: `${ENV.ADMIN_URL}/user/listDepartmentsAutoComplete.do`, // 自动检索部门
    checkRegist: `${ENV.ADMIN_URL}/user/checkRegist.do`, // 注册


  },
  project: {
    queryProjectType: `${ENV.ADMIN_URL}/project/queryProjectType.do`, // 查询项目类型
    queryJobType: `${ENV.ADMIN_URL}/project/queryJobType.do`, // 查询授权工作类型
    queryStaffType: `${ENV.ADMIN_URL}/project/queryStaffType.do`, // 查询最新服务人员类型
    queryRuleServicePrice: `${ENV.ADMIN_URL}/project/queryRuleServicePrice.do`, // 查询最新服务人员类型
    queryIntegralDetail: `${ENV.ADMIN_URL}/project/queryIntegralDetail.do`, // 查询积分明细
    queryAmountParameter: `${ENV.ADMIN_URL}/project/queryAmountParameter.do`, // 查询小费和充值金额参数
    queryCrcs: `${ENV.ADMIN_URL}/project/queryCrcs.do`, // 查询医助基本信息
    modifyCrcs: `${ENV.ADMIN_URL}/project/modifyCrcs.do`, // 修改医助基本信息
  },
  emplace: {
    queryCommonPlace: `${ENV.ADMIN_URL}/emplace/queryCommonPlace.do`, // 查询常用地址
  },
  order: {
    addProject: `${ENV.ADMIN_URL}/order/addProject.do`, // 添加项目(预约下单)
    queryProjectTitle: `${ENV.ADMIN_URL}/order/queryProjectTitle.do`, // 获取匹配标题
    queryNewProject: `${ENV.ADMIN_URL}/order/queryNewProject.do`, // 医助获取新订单
    queryProjectContent: `${ENV.ADMIN_URL}/order/queryProjectContent.do`, // 订单详情
    robProject: `${ENV.ADMIN_URL}/order/robProject.do`, // 订单详情
    listViolation: `${ENV.ADMIN_URL}/order/listViolation.do`, // 订单详情
    addProjectTip: `${ENV.ADMIN_URL}/order/addProjectTip.do`, // 订单详情
    cancelNotRobProject: `${ENV.ADMIN_URL}/order/cancelNotRobProject.do`, // 取消未抢单订单
    cancelServiceProject: `${ENV.ADMIN_URL}/order/cancelServiceProject.do`, // 取消待服务订单
    hintCancelProject: `${ENV.ADMIN_URL}/order/hintCancelProject.do`, // 取消订单提示
    modifyWorkingHours: `${ENV.ADMIN_URL}/order/modifyWorkingHours.do`, // 编辑工时
    submissionProject: `${ENV.ADMIN_URL}/order/submissionProject.do`, // 提交工时
    paymentProject: `${ENV.ADMIN_URL}/order/paymentProject.do`, // 完成支付
    publishEvaluation: `${ENV.ADMIN_URL}/order/publishEvaluation.do`, // 发表评价
    evaluationProject: `${ENV.ADMIN_URL}/order/evaluationProject.do`, // 获取订单项

    attackProject: `${ENV.ADMIN_URL}/order/attackProject.do`, // 开始工作
    completionProject: `${ENV.ADMIN_URL}/order/completionProject.do`, // 开始工作
    agreeCancelProject: `${ENV.ADMIN_URL}/order/agreeCancelProject.do`, // 同意取消订单
    anotherProject: `${ENV.ADMIN_URL}/order/anotherProject.do`, // 再来一单
    queryProjectVouchers: `${ENV.ADMIN_URL}/order/queryProjectVouchers.do`, // 获取订单可用优惠券
    preUseByProjectIdAndVoucherIds: `${ENV.ADMIN_URL}/order/preUseByProjectIdAndVoucherIds.do`, // 选中优惠券
  },
  myOrder: {
    queryProject: `${ENV.ADMIN_URL}/order/queryProject.do`, // 全部订单
    queryHistoryState: `${ENV.ADMIN_URL}/order/queryHistoryState.do`, // 订单状态
  },
  notice: {
    queryInformList: `${ENV.ADMIN_URL}/emplace/queryInformList.do`, // 通知列表
    deleteInformByInformId: `${ENV.ADMIN_URL}/emplace/deleteInformByInformId.do`, // 删除通知
    modifyIsReadByInformId: `${ENV.ADMIN_URL}/emplace/modifyIsReadByInformId.do`, // 通知标记已读
    queryNoticeForPub: `${ENV.ADMIN_URL}/emplace/queryNoticeForPub.do`, // 公告列表
    queryNoticeList: `${ENV.ADMIN_URL}/project/queryNoticeList.do`, // 公告列表
    queryUnReadInformList: `${ENV.ADMIN_URL}/emplace/queryUnReadInformList.do`, // 是否存在新的未读的通知信息
  },
  multimedia: {
    uploadImg: `${ENV.ADMIN_URL}/multimedia/uploadImg.do?thumbnail=1`, // 文件上传服务-图片
  },
  myAssets: {
    queryMyVouchers: `${ENV.ADMIN_URL}/order/queryMyVouchers.do`, // 查找我的代金券
  },
  pay: {
    balancePay: `${ENV.ADMIN_URL}/pay/balancePay.do`, // 余额支付
    generatePrepayId: `${ENV.ADMIN_URL}/pay/generatePrepayId.do`, // 微信支付参数
    wxPayComplete: `${ENV.ADMIN_URL}/pay/wxPayComplete.do`, // 微信支付成功后确认
    balanceQuery: `${ENV.ADMIN_URL}/pay/balanceQuery.do`, // 可用余额
    queryDepositList: `${ENV.ADMIN_URL}/pay/queryDepositList.do`, // 充值明细
  },
};

// 页面元素权限
// DOCTOR 医生 NOTDOCTOR 非医生 INSIDE_ASSISTANT 内部医助（一期）
// OUTSITE_ASSISTANT 外部医助（二期）
export const AUTH = {
    // 内部医助
  INSIDE_ASSISTANT: {
    order: {
      access: true,
      dataAuth: {
        name: true,
        patientNo: true,
        mobile: true,
      },
    },
    myOrder: {
      access: true,
      dataAuth: {
        doctorContact: true,
        RobOrderBtn: true,
        RobOrder: true,
      },
    },
    AddOrder: {
      access: false,
    },
    RobNewOrder: {
      access: true,
      dataAuth: {
        assistantTab: true,
      },
    },
    MyAssets: {
      access: false,
    },
    MyIncome: {
      access: true,
    },
    CustomerServiceCenter: {
      access: true,
    },
    PersonalInfo: {
      access: true,
    },
  },

    // 医生
  DOCTOR: {
    myOrder: {
      access: true,
      dataAuth: {
        addFee: true,
      },
    },
    AddOrder: {
      access: true,
      dataAuth: {
        doctorTab: true,
      },
    },
    RobNewOrder: {
      access: false,
    },
    WaitServiceOrder: {
      access: false,
    },
    ServicingOrder: {
      access: false,
    },
    CustomerServiceCenter: {
      access: true,
    },
    PersonalInfo: {
      access: true,
    },
    ForgetPassword: {
      access: true,
    },
    SetPassword: {
      access: true,
    },
    MyIncome: {
      access: false,
    },
    EssentialiInformation: {
      access: true,
    },
    ReviseIphoneNumber: {
      access: true,
    },
    AuditFailedToPass: {
      access: true,
    },
    AuditInfomation: {
      access: true,
    },
    Feedback: {
      access: true,
    },
    SetCommonAddress: {
      access: true,
    },
    SetNewAddress: {
      access: true,
    },
    SetOrder: {
      access: true,
    },
    Setting: {
      access: true,
    },
    MyAssets: {
      access: true,
    },
  },
    // 非医生
  NOTDOCTOR: {
    myOrder: {
      access: true,
      dataAuth: {
        addFee: true,
      },
    },
    AddOrder: {
      access: true,
      dataAuth: {
        doctorTab: true,
      },
    },
    RobNewOrder: {
      access: false,
    },
    WaitServiceOrder: {
      access: false,
    },
    ServicingOrder: {
      access: false,
    },
    CustomerServiceCenter: {
      access: true,
    },
    PersonalInfo: {
      access: true,
    },
    ForgetPassword: {
      access: true,
    },
    SetPassword: {
      access: true,
    },
    MyIncome: {
      access: false,
    },
    EssentialiInformation: {
      access: true,
    },
    ReviseIphoneNumber: {
      access: true,
    },
    AuditFailedToPass: {
      access: true,
    },
    AuditInfomation: {
      access: true,
    },
    Feedback: {
      access: true,
    },
    SetCommonAddress: {
      access: true,
    },
    SetNewAddress: {
      access: true,
    },
    SetOrder: {
      access: true,
    },
    Setting: {
      access: true,
    },
    MyAssets: {
      access: true,
    },
  },
  // 访客
  VISITOR: {
    myOrder: {
      access: false,
    },
    AddOrder: {
      access: false,
    },
    RobNewOrder: {
      access: false,
    },
    CustomerServiceCenter: {
      access: false,
    },
    PersonalInfo: {
      access: false,
    },
    ForgetPassword: {
      access: true,
    },
    SetPassword: {
      access: false,
    },
    MyIncome: {
      access: false,
    },
    EssentialiInformation: {
      access: false,
    },
    ReviseIphoneNumber: {
      access: false,
    },
    AuditFailedToPass: {
      access: false,
    },
    AuditInfomation: {
      access: false,
    },
    Feedback: {
      access: false,
    },
    SetCommonAddress: {
      access: false,
    },
    SetNewAddress: {
      access: false,
    },
    SetOrder: {
      access: false,
    },
    Setting: {
      access: false,
    },
    MyAssets: {
      accsee: false,
    },

  },
};

