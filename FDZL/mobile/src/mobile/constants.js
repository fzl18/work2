export const PAGE_SIZE = 15;
export const curRole = 'PATIENT';
const ENV = window.configs || {};
export const API_URL = {
  department: {
    queryLastTendencyList: `${ENV.ADMIN_URL}/department/queryLastTendencyList.do`, // 最新动态
    queryCarrouselImgList: `${ENV.ADMIN_URL}/department/queryCarrouselImgList.do`, // 轮播图
    queryMeetingList: `${ENV.ADMIN_URL}/department/queryMeetingList.do`, // 学术会议
    queryResearchSubjectList: `${ENV.ADMIN_URL}/department/queryResearchSubjectList.do`, // 热门课题
    queryPopularScienceCategoryList: `${ENV.ADMIN_URL}/department/queryPopularScienceCategoryList.do`, // 科普宣教分类
    queryDepartment: `${ENV.ADMIN_URL}/department/queryDepartment.do`, // 科室介绍
    queryPopularScienceList: `${ENV.ADMIN_URL}/department/queryPopularScienceList.do`, // 科普宣教
    queryDepartmentDoctor: `${ENV.ADMIN_URL}/department/queryDepartmentDoctor.do`, // 医生团队
  },
  user: {
    doctorAndAssistantBind: `${ENV.ADMIN_URL}/user/doctorAndAssistantBind.do`, // 医生医助绑定
    patientBind: `${ENV.ADMIN_URL}/user/patientBind.do`, // 病人绑定
    queryPersonalNotice: `${ENV.ADMIN_URL}/user/queryPersonalNotice.do`, // 消息列表
    queryNoticeInfo: `${ENV.ADMIN_URL}/user/queryNoticeInfo.do`, // 消息详情
    applyOrReject: `${ENV.ADMIN_URL}/user/applyOrReject.do`, // 授权拒绝or同意
    deleteNoticeById: `${ENV.ADMIN_URL}/user/deleteNoticeById.do`, // 授权拒绝or同意
    deleteAllNotice: `${ENV.ADMIN_URL}/user/deleteAllNotice.do`, // 清空消息
    initiateApplicationByDocAss: `${ENV.ADMIN_URL}/user/initiateApplicationByDocAss.do`, // 医助发起服务申请
    queryAccountSimpleInfoById: `${ENV.ADMIN_URL}/user/queryAccountSimpleInfoById.do`, // 获取当前用户头像and名称
    queryAuthInfo: `${ENV.ADMIN_URL}/user/queryAuthInfo.do`, // 授权服务,解除授权
    relieveAuthInfo: `${ENV.ADMIN_URL}/user/relieveAuthInfo.do`, // 解除授权
    unbindAccount: `${ENV.ADMIN_URL}/user/unbindAccount.do`, // 解除账号绑定
    modifyUserPassword: `${ENV.ADMIN_URL}/user/modifyUserPassword.do`, // 设置密码
    verifyCode: `${ENV.ADMIN_URL}/user/verifyCode.do`, // 发送验证码

  },
  conversation: {
    generateChat: `${ENV.ADMIN_URL}/conversation/generateChat.do`, // 获取创建房间的配置信息
    queryChatList: `${ENV.ADMIN_URL}/conversation/queryChatList.do`, // 获取我的咨询列表
    deleteConversation: `${ENV.ADMIN_URL}/conversation/deleteConversation.do`, // 获取我的咨询列表
    queryHotConversation: `${ENV.ADMIN_URL}/conversation/queryHotConversation.do`, // 获取热门咨询列表
    generateInfo: `${ENV.ADMIN_URL}/conversation/generateInfo.do`, // 获取通用Websocket的配置信息
    queryHotConversationDetailForWx: `${ENV.ADMIN_URL}/conversation/queryHotConversationDetailForWx.do`, // 获取热门资讯详情
  },
};
export const AUTH = {
  PATIENT: {
      // 个人中心权限配置
    account: {
      access: true,
      dataAuth: {
        name: true,
        patientNo: true,
        mobile: true,
      },
    },
    pwd: {
      access: false,
    },
    authInfo: {
      access: false,
    },
    notice: {// 页面权限
      access: false,
      dataAuth: {
        // 页面元素
        noticeList: false,
      },
    },
    doctorInfo: {
      access: true,
      dataAuth: {
        authStatus: false,
        Request: false, // 请求
        Consultation: true, // 咨询
      },
    },
    DoctorItem: {
      access: true,
      dataAuth: {
        chat: true,
        auth: false,
        nothing: false,
      },
    },
    empowerApply: {
      access: false,
      dataAuth: {
        name: false,
        mobile: false,
        department: false,
        email: false,
        company: false,
      },
    },
    MyPanel: {
      access: true,
      dataAuth: {


      },
    },

  },
  ASSISTANT: {
    // 医学助理中心权限配置
    account: {
      access: true,
      dataAuth: {
        name: true,
        patientNo: false,
        mobile: true,
        email: true,
        enterprise: true,
        department: true,
      },
    },
    pwd: {
      access: true,
    },
    authInfo: {
      access: false,
      dataAuth: {
        authStatus: true,
      },
    },
    notice: {
      access: true,
      dataAuth: {
        noticeList: true,
      },
    },
    doctorInfo: {
      access: true,
      dataAuth: {
        authStatus: true,
        Request: true,
        Consultation: false,
      },
    },
    DoctorItem: {
      access: true,
      dataAuth: {
        chat: false,
        auth: true,
        nothing: false,
      },
    },
    empowerApply: {
      access: true,
      dataAuth: {
        name: true,
        mobile: true,
        department: true,
        email: true,
        company: true,
      },
    },
    MyPanel: {
      access: true,
      dataAuth: {


      },
    },
  },
  DOCTOR: {
    // 医生中心权限配置
    account: {
      access: true,
      dataAuth: {
        name: true,
        patientNo: false,
        mobile: true,
        email: true,
        enterprise: true,
        department: true,
      },
    },
    pwd: {
      access: true,
    },
    authInfo: {
      access: true,
      dataAuth: {
        authStatus: false,
      },
    },
    notice: {
      access: true,
      dataAuth: {
        noticeList: true,
      },
    },
    doctorInfo: {
      access: true,
      dataAuth: {
        authStatus: false,
        Request: false,
        Consultation: false,
      },
    },
    DoctorItem: {
      access: true,
      dataAuth: {
        chat: false,
        auth: false,
        nothing: true,

      },
    },
    MyPanel: {
      access: true,
      dataAuth: {


      },
    },
    empowerApply: {
      access: true,
      dataAuth: {
        name: true,
        mobile: true,
        department: true,
        email: true,
        company: true,
      },
    },
  },
  VISITOR: {
    account: {
      access: false,
    },
    pwd: {
      access: false,
    },
    authInfo: {
      access: false,
    },
    notice: {
      access: false,
    },
    doctorInfo: {
      access: false,
    },
    DoctorItem: {
      access: true,
      dataAuth: {
        chat: false,
        auth: false,
        nothing: false,
        visitor: true,
      },
    },
    empower: {
      access: false,
    },
    Chat: {
      access: false,
    },
    empowerApply: {
      access: false,
    },
    myPanel: {
      access: false,
    },
    doctorList: {
      access: false,
    },
    chat: {
      access: false,
    },
  },
};
