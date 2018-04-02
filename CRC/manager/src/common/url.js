import ENV from './env.js';

const STATIC = false;

let API_URL = {};

if (!STATIC) {
    API_URL = {
        // SMO_PORTAL_URL: ENV.PORTAL_URL,
        config:{
            userIsSendEmail: `${ENV.ADMIN_URL}/userInfo/setMailFlag.do`,
            queryUserEmail: `${ENV.ADMIN_URL}/userInfo/getMailFlag.do`,
            logoutUrl: `${ENV.LOGOUT_URL}`,
        },
        common: {
            arealist: `${ENV.ADMIN_URL}/department/getRegionListByParentId.do`, // 获取省市接口（一级行政单位
            queryAllProvinceContainCityList: `${ENV.ADMIN_URL}/department/queryAllProvinceContainCityList.do`, // 获取省市接口
            uploadimg:`${ENV.ADMIN_URL}/multimedia/uploadEditorImg.do`,
            uploadser:`${ENV.ADMIN_URL}/multimedia/uploadImg.do`,
            imgpath:`/multimedia/editor/img/get.do?value=`,
            queryHospital: `${ENV.ADMIN_URL}/department/queryHospital.do`,
            listHospitalDepartment: `${ENV.ADMIN_URL}/department/listHospitalDepartment.do`,
            
        },
        index:{
            queryLastTendencyList: `${ENV.ADMIN_URL}/department/queryLastTendencyList.do`,
            addLastTendency: `${ENV.ADMIN_URL}/department/addLastTendency.do`,
            deleteLastTendency: `${ENV.ADMIN_URL}/department/deleteLastTendency.do`,
            modifyLastTendency: `${ENV.ADMIN_URL}/department/modifyLastTendency.do`,
            sortCarrouselImg: `${ENV.ADMIN_URL}/department/sortCarrouselImg.do`,
            //会议
            queryMeetingList: `${ENV.ADMIN_URL}/department/queryMeetingList.do`,
            addMeeting: `${ENV.ADMIN_URL}/department/addMeeting.do`,
            deleteMeeting: `${ENV.ADMIN_URL}/department/deleteMeeting.do`,
            modifyMeeting: `${ENV.ADMIN_URL}/department/modifyMeeting.do`,
            //研究课题
            queryResearchSubjectList: `${ENV.ADMIN_URL}/department/queryResearchSubjectList.do`,
            addResearchSubject: `${ENV.ADMIN_URL}/department/addResearchSubject.do`,
            deleteResearchSubjectId: `${ENV.ADMIN_URL}/department/deleteResearchSubjectId.do`,
            modifyResearchSubject: `${ENV.ADMIN_URL}/department/modifyResearchSubject.do`,
            //轮播
            queryCarrouselImgList: `${ENV.ADMIN_URL}/department/queryCarrouselImgList.do`,
            addCarrouselImg: `${ENV.ADMIN_URL}/department/addCarrouselImg.do`,
            deleteCarrouselImg: `${ENV.ADMIN_URL}/department/deleteCarrouselImg.do`,
            modifyCarrouselImg: `${ENV.ADMIN_URL}/department/modifyCarrouselImg.do`,
            //添加部门
            queryDepartment: `${ENV.ADMIN_URL}/department/queryDepartment.do`,
            addDepartment: `${ENV.ADMIN_URL}/department/modifyDepartment.do`,
            modifyDepartment: `${ENV.ADMIN_URL}/department/modifyDepartment.do`,
            //科室团队-医生
            queryDepartmentDoctor: `${ENV.ADMIN_URL}/department/queryDepartmentDoctor.do`,
            addDepartmentDoctor: `${ENV.ADMIN_URL}/department/addDepartmentDoctor.do`,
            modifyDepartmentDoctor: `${ENV.ADMIN_URL}/department/modifyDepartmentDoctor.do`,
            removeDepartmentDoctor: `${ENV.ADMIN_URL}/department/removeDepartmentDoctor.do`,
            sortDepartmentDoctor: `${ENV.ADMIN_URL}/department/sortDepartmentDoctor.do`,
            // resetUserPassword: `${ENV.ADMIN_URL}/department/resetUserPassword.do`,
        },
        education:{
            queryPopularScienceCategoryList: `${ENV.ADMIN_URL}/department/queryPopularScienceCategoryList.do`,
            addPopularScienceCategory: `${ENV.ADMIN_URL}/department/addPopularScienceCategory.do`,
            deletePopularScienceCategory: `${ENV.ADMIN_URL}/department/deletePopularScienceCategory.do`,
            modifyPopularScienceCategory: `${ENV.ADMIN_URL}/department/modifyPopularScienceCategory.do`,
            sortPopularScienceCategory: `${ENV.ADMIN_URL}/department/sortPopularScienceCategory.do`,

            queryPopularScienceList: `${ENV.ADMIN_URL}/department/queryPopularScienceList.do`,
            addPopularScience: `${ENV.ADMIN_URL}/department/addPopularScience.do`,
            deletePopularScience: `${ENV.ADMIN_URL}/department/deletePopularScience.do`,
            modifyPopularScience: `${ENV.ADMIN_URL}/department/modifyPopularScience.do`,
        },
        question:{
            queryQuestionStoreList: `${ENV.ADMIN_URL}/department/queryQuestionStoreList.do`,
            deleteQuestionStoreKeyword: `${ENV.ADMIN_URL}/department/deleteQuestionStoreKeyword.do`,
            addQuestionStore: `${ENV.ADMIN_URL}/department/addQuestionStore.do`,
            deleteQuestionStore: `${ENV.ADMIN_URL}/department/deleteQuestionStore.do`,
            modifyQuestionStore: `${ENV.ADMIN_URL}/department/modifyQuestionStore.do`,            
        },
        usermanager:{
            queryPatients: `${ENV.ADMIN_URL}/department/queryPatients.do`,
            queryDoctorByHospitalDepartmentId: `${ENV.ADMIN_URL}/department/queryDoctorByHospitalDepartmentId.do`,
            addDoctorByHospitalDepartmentId: `${ENV.ADMIN_URL}/department/addDoctorByHospitalDepartmentId.do`,
            modifyDoctorByHospitalDepartmentId: `${ENV.ADMIN_URL}/department/modifyDoctorByHospitalDepartmentId.do`,
            removeDoctorByHospitalDepartmentId: `${ENV.ADMIN_URL}/department/removeDoctorByHospitalDepartmentId.do`,
            queryAssistantByHospitalDepartmentId: `${ENV.ADMIN_URL}/department/queryAssistantByHospitalDepartmentId.do`,
            addAssisantByHospitalDepartmentId: `${ENV.ADMIN_URL}/department/addAssisantByHospitalDepartmentId.do`,
            modifyAssisantByHospitalDepartmentId: `${ENV.ADMIN_URL}/department/modifyAssisantByHospitalDepartmentId.do`,
            removeAssisantByHospitalDepartmentId: `${ENV.ADMIN_URL}/department/removeAssisantByHospitalDepartmentId.do`,
            resetUserPassword: `${ENV.ADMIN_URL}/department/resetUserPassword.do`,
            exportPatients: `${ENV.ADMIN_URL}/department/exportPatients.do`,
        },
        serive:{
            queryDoctors:`${ENV.ADMIN_URL}/project/queryDoctors.do`, //查询医生用户
            queryNonDoctors:`${ENV.ADMIN_URL}/project/queryNonDoctors.do`, //查询非医生用户
            queryCrcs:`${ENV.ADMIN_URL}/project/queryCrcs.do`, //查询临床协调员（内部）
            auditDoctorPass:`${ENV.ADMIN_URL}/project/auditDoctorPass.do`, //审核医生用户
            selectAuditHistoryByAcctId:`${ENV.ADMIN_URL}/project/selectAuditHistoryByAcctId.do`, //查审核历史
            queryProjectType:`${ENV.ADMIN_URL}/project/queryProjectType.do`, //查询项目类型
            addProjectType:`${ENV.ADMIN_URL}/project/addProjectType.do`, //添加项目类型
            deleteProjectType:`${ENV.ADMIN_URL}/project/deleteProjectType.do`, //删除项目类型
            modifyProjectType:`${ENV.ADMIN_URL}/project/modifyProjectType.do`, //修改项目类型
            queryRuleMemberLevel:`${ENV.ADMIN_URL}/project/queryRuleMemberLevel.do`, //查询等级规则
            addRuleMemberLevel:`${ENV.ADMIN_URL}/project/addRuleMemberLevel.do`, //添加等级规则
            deleteRuleMemberLevel:`${ENV.ADMIN_URL}/project/deleteRuleMemberLevel.do`, //删除等级规则
            modifyRuleMemberLevel:`${ENV.ADMIN_URL}/project/modifyRuleMemberLevel.do`, //修改等级规则
            queryOrderRuleMemberProfit:`${ENV.ADMIN_URL}/project/queryOrderRuleMemberProfit.do`, //查询下单会员权益
            addRuleMemberProfit:`${ENV.ADMIN_URL}/project/addRuleMemberProfit.do`, //添加下单会员权益
            addOrderRuleMemberProfit:`${ENV.ADMIN_URL}/project/addOrderRuleMemberProfit.do`, //添加下单会员权益
            deleteOrderRuleMemberProfit:`${ENV.ADMIN_URL}/project/deleteOrderRuleMemberProfit.do`, //删除下单会员权益
            modifyOrderRuleMemberProfit:`${ENV.ADMIN_URL}/project/modifyOrderRuleMemberProfit.do`, //修改下单会员权益
            queryMemberLevel:`${ENV.ADMIN_URL}/project/queryMemberLevel.do`, //查询等级
            queryMemberType:`${ENV.ADMIN_URL}/project/queryMemberType.do`, //查询会员类型
            queryServiceRuleMemberProfit:`${ENV.ADMIN_URL}/project/queryServiceRuleMemberProfit.do`, //查询服务会员权益
            addServiceRuleMemberProfit:`${ENV.ADMIN_URL}/project/addServiceRuleMemberProfit.do`, //添加服务会员权益
            deleteServiceRuleMemberProfit:`${ENV.ADMIN_URL}/project/deleteServiceRuleMemberProfit.do`, //删除服务会员权益
            modifyServiceRuleMemberProfit:`${ENV.ADMIN_URL}/project/modifyServiceRuleMemberProfit.do`, //修改服务会员权益
            queryJobType:`${ENV.ADMIN_URL}/project/queryJobType.do`, //查询授权工作类型（后台）
            addJobType:`${ENV.ADMIN_URL}/project/addJobType.do`, //添加授权工作类型
            deleteJobType:`${ENV.ADMIN_URL}/project/deleteJobType.do`, //删除授权工作类型
            modifyJobType:`${ENV.ADMIN_URL}/project/modifyJobType.do`, //修改授权工作类型
            queryStaffType:`${ENV.ADMIN_URL}/project/queryStaffType.do`, //查询服务人员类型（后台）
            addStaffType:`${ENV.ADMIN_URL}/project/addStaffType.do`, //添加服务人员类型
            deleteStaffType:`${ENV.ADMIN_URL}/project/deleteStaffType.do`, //删除服务人员类型
            modifyStaffType:`${ENV.ADMIN_URL}/project/modifyStaffType.do`, //修改服务人员类型
            queryCity:`${ENV.ADMIN_URL}/project/queryCity.do`, //查询所有城市
            queryRuleCapitalRatio:`${ENV.ADMIN_URL}/project/queryRuleCapitalRatio.do`, //查询保证金比例
            modifyRuleCapitalRatio:`${ENV.ADMIN_URL}/project/modifyRuleCapitalRatio.do`, //修改保证金比例
            queryPlatformServiceFeeRatio:`${ENV.ADMIN_URL}/project/queryPlatformServiceFeeRatio.do`, //查询平台服务费比例
            modifyPlatformServiceFeeRatio:`${ENV.ADMIN_URL}/project/modifyPlatformServiceFeeRatio.do`, //修改平台服务费比例
            queryRuleServicePrice:`${ENV.ADMIN_URL}/project/queryRuleServicePrice.do`, //查询服务单价
            addRuleServicePrice:`${ENV.ADMIN_URL}/project/addRuleServicePrice.do`, //添加服务单价
            deleteRuleServicePrice:`${ENV.ADMIN_URL}/project/deleteRuleServicePrice.do`, //删除服务单价
            modifyRuleServicePrice:`${ENV.ADMIN_URL}/project/modifyRuleServicePrice.do`, //修改服务单价
            queryQuestionType:`${ENV.ADMIN_URL}/project/queryQuestionType.do`, //查询问题类型
            addQuestionType:`${ENV.ADMIN_URL}/project/addQuestionType.do`, //添加问题分类
            modifyQuestionType:`${ENV.ADMIN_URL}/project/modifyQuestionType.do`, //修改问题分类
            deleteQuestionType:`${ENV.ADMIN_URL}/project/deleteQuestionType.do`, //删除问题分类
            queryMessageType:`${ENV.ADMIN_URL}/project/queryMessageType.do`, //查询留言类型
            addMessageType:`${ENV.ADMIN_URL}/project/addMessageType.do`, //添加留言类型
            modifyMessageType:`${ENV.ADMIN_URL}/project/modifyMessageType.do`, //修改留言类型
            deleteMessageType:`${ENV.ADMIN_URL}/project/deleteMessageType.do`, //删除留言类型
            
            queryQuestion:`${ENV.ADMIN_URL}/project/queryQuestion.do`, //查询问题库
            addQuestion:`${ENV.ADMIN_URL}/project/addQuestion.do`, //添加问题记录
            modifyQuestion:`${ENV.ADMIN_URL}/project/modifyQuestion.do`, //问题库修改问题记录
            deleteQuestion:`${ENV.ADMIN_URL}/project/deleteQuestion.do`, //删除问题记录

            queryRuleMemberIntegral:`${ENV.ADMIN_URL}/project/queryRuleMemberIntegral.do`, //查询会员积分制度
            addRuleMemberIntegral:`${ENV.ADMIN_URL}/project/addRuleMemberIntegral.do`, //添加会员积分制度(下单、服务会员)
            modifyRuleMemberIntegral:`${ENV.ADMIN_URL}/project/modifyRuleMemberIntegral.do`, //修改会员积分制度(下单、服务会员)
            deleteRuleMemberIntegral:`${ENV.ADMIN_URL}/project/deleteRuleMemberIntegral.do`, //删除会员积分制度(下单、服务会员)
            queryMemberBehaviorType:`${ENV.ADMIN_URL}/project/queryMemberBehaviorType.do`, //查询行为

            queryMessageList:`${ENV.ADMIN_URL}/message/queryMessageList.do`, //查询在线留言
            addMessage:`${ENV.ADMIN_URL}/message/addMessage.do`, //添加留言
            makrMessage:`${ENV.ADMIN_URL}/message/makrMessage.do`, //标记留言

            queryNoticeList:`${ENV.ADMIN_URL}/project/queryNoticeList.do`, //查询公告
            addNotice:`${ENV.ADMIN_URL}/project/addNotice.do`, //添加公告
            modifyNotice:`${ENV.ADMIN_URL}/project/modifyNotice.do`, //修改公告
            deleteNotice:`${ENV.ADMIN_URL}/project/deleteNotice.do`, //删除公告

            queryProject:`${ENV.ADMIN_URL}/order/queryProject.do`, //订单列表
            queryHistoryState:`${ENV.ADMIN_URL}/order/queryHistoryState.do`, //订单详情 订单状态
            queryProjectContent:`${ENV.ADMIN_URL}/order/queryProjectContents.do`, //订单信息

            queryDepositList:`${ENV.ADMIN_URL}/pay/queryDepositList.do`, //充值明细
            queryIncomeList:`${ENV.ADMIN_URL}/pay/queryIncomeList.do`, //收入明细
            queryProjectPaymentsInfoList:`${ENV.ADMIN_URL}/pay/queryProjectPaymentsInfoList.do`, //订单收支明细
            queryAccount:`${ENV.ADMIN_URL}/project/queryAccount.do`, //账户查询
        },  
        consul:{
            queryConversation:`${ENV.ADMIN_URL}/conversation/queryConversation.do`,
            queryHotConversation:`${ENV.ADMIN_URL}/conversation/queryHotConversation.do`,
            queryHotConversationDetail:`${ENV.ADMIN_URL}/conversation/queryHotConversationDetail.do`,
            addHotConversationUserDefined:`${ENV.ADMIN_URL}/conversation/addHotConversationUserDefined.do`,
            modifyHotConversationUserDefined:`${ENV.ADMIN_URL}/conversation/modifyHotConversationUserDefined.do`,
            topHotConversation:`${ENV.ADMIN_URL}/conversation/topHotConversation.do`,
            removeHotConversation:`${ENV.ADMIN_URL}/conversation/removeHotConversation.do`,
            addHotConversationManual:`${ENV.ADMIN_URL}/conversation/addHotConversationManual.do`,
        },
        arrangement:{
            queryDoctorGroup:`${ENV.ADMIN_URL}/department/queryDoctorGroup.do`,
            querySchedulingDetails:`${ENV.ADMIN_URL}/department/querySchedulingDetails.do`,
            enableScheduling:`${ENV.ADMIN_URL}/department/enableScheduling.do`,
            addScheduling:`${ENV.ADMIN_URL}/department/addScheduling.do`,
            removeScheduling:`${ENV.ADMIN_URL}/department/removeScheduling.do`,            
        },
        auth:{
            queryScientificResearchLibrary:`${ENV.ADMIN_URL}/department/queryScientificResearchLibrary.do`,
            modifyScientificResearchLibraryAuth:`${ENV.ADMIN_URL}/department/modifyScientificResearchLibraryAuth.do`,
            queryDoctorByKeyword:`${ENV.ADMIN_URL}/department/queryDoctorByKeyword.do`,
        }
	};
}

export {API_URL as default, STATIC};
