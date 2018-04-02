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
            queryServiceDetail:`${ENV.ADMIN_URL}/department/queryServiceDetail.do`,
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
