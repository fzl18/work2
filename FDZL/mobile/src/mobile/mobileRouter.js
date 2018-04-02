import React from 'react';
import { Router, Switch, Route } from 'dva/router';
import dynamic from 'dva/dynamic';
import AuthRoute from './components/AuthRoute';
import './index.less';

function RouterConfig({ history, app }) {
  const IndexPage = dynamic({
    app,
    models: () => [
      import('./models/WorkShop/WorkShopModel'),
      import('./models/LatestNews/LatestNewsModel'),
      import('./models/RollGraph/RollGraphModel'),
      import('./models/InvSubject/InvSubjectModel'),
      import('./models/Department/DepartmentModel'),
    ],
    component: () => import('./routes/IndexPage'),
  });

  const Users = dynamic({
    app,
    models: () => [
      import('./models/users'),
    ],
    component: () => import('./routes/Users'),
  });

  // const Chat = dynamic({
  //   app,
  //   // models: () => [
  //   //   import('./models/users'),
  //   // ],
  //   component: () => import('./routes/Chat'),
  // });

  const WorkShopList = dynamic({
    app,
    models: () => [
      import('./models/WorkShop/WorkShopModel'),
    ],
    component: () => import('./routes/WorkShop/WorkShopList'),
  });

  const MyArchive = dynamic({
    app,
    // models: () => [
     // import('./models/MyArchive/MyArchiveModel'),
   // ],
    component: () => import('./routes/MyArchive/MyArchive'),
  });

  const WorkShopInfo = dynamic({
    app,
    models: () => [
      import('./models/WorkShop/WorkShopModel'),
    ],
    component: () => import('./routes/WorkShop/WorkShopInfo'),
  });
  const LatestNewsList = dynamic({
    app,
    models: () => [
      import('./models/LatestNews/LatestNewsModel'),
    ],
    component: () => import('./routes/LatestNews/LatestNewsList'),
  });
  // const InvSubject = dynamic({
  //   app,
  //   models: () => [
  //     import('./models/InvSubject/InvSubjectModel'),
  //   ],
  //   component: () => import('./routes/InvSubject/InvSubject'),
  // });
  const InvSubjectList = dynamic({
    app,
    models: () => [
      import('./models/InvSubject/InvSubjectModel'),
    ],
    component: () => import('./routes/InvSubject/InvSubjectList'),
  });
  const InvSubjectInfo = dynamic({
    app,
    models: () => [
      import('./models/InvSubject/InvSubjectModel'),
    ],
    component: () => import('./routes/InvSubject/InvSubjectInfo'),
  });


  const LatestNewsInfo = dynamic({
    app,
    models: () => [
      import('./models/LatestNews/LatestNewsModel'),
    ],
    component: () => import('./routes/LatestNews/LatestNewsInfo'),
  });

  const MyPanel = dynamic({
    app,
    models: () => [
      import('./models/MyPanel/MyPanelModel'),
    ],
    component: () => import('./routes/MyPanel/MyPanel'),
  });
  { /* //账号绑定 */ }
  const BindAccount = dynamic({
    app,
    models: () => [
      import('./models/BindAccount/BindAccountModel'),
      import('./models/BindAccount/BindAccountPatientModel'),

    ],
    component: () => import('./routes/DopaSpace/BindAccount'),
  });


  const PersonCentral = dynamic({
    app,
    models: () => [
      import('./models/MyPanel/MyPanelModel'),
      import('./models/BindAccount/UnbindAccountModel'),
    ],
    component: () => import('./routes/MyPanel/PersonCentral'),
  });

  const Account = dynamic({
    app,
    models: () => [
      import('./models/MyPanel/MyPanelModel'),
    ],
    component: () => import('./routes/MyPanel/Account'),
  });

  const DopaSpace = dynamic({
    app,
    models: () => [
      import('./models/Department/DepartmentModel'),
    ],
    component: () => import('./routes/DopaSpace/DopaSpace'),
  });

  const DoctorList = dynamic({
    app,
    models: () => [
      import('./models/DoctorList/DoctorListModel'),
      import('./models/Chat/ChatModel'),
    ],
    component: () => import('./routes/DoctorList/DoctorList'),
  });
  const DoctorListForVisitor = dynamic({
    app,
    models: () => [
      import('./models/DoctorList/DoctorListModel'),
    ],
    component: () => import('./routes/DoctorList/DoctorListForVisitor'),
  });

  const DoctorInfo = dynamic({
    app,
    models: () => [
      import('./models/DoctorList/DoctorListModel'),
    ],
    component: () => import('./routes/DoctorList/DoctorInfo'),
  });
  const DoctorInfoForVisitor = dynamic({
    app,
    models: () => [
      import('./models/DoctorList/DoctorListModel'),
    ],
    component: () => import('./routes/DoctorList/DoctorInfoForVisitor'),
  });


// 科室介绍
  const Departmentintroduced = dynamic({
    app,
    models: () => [
      import('./models/Department/DepartmentModel'),
    ],
    component: () => import('./routes/Department/Departmentintroduced'),
  });


  const ChatBox = dynamic({
    app,
    models: () => [
      import('./models/Chat/ChatModel'),
    ],
    component: () => import('./routes/Chat/ChatBox'),
  });
  const MyChat = dynamic({
    app,
    models: () => [
      import('./models/Chat/ChatModel'),
    ],
    component: () => import('./routes/Chat/MyChat'),
  });
  const HotChats = dynamic({
    app,
    models: () => [
      import('./models/Chat/HotChatsModel'),
      import('./models/Chat/ChatModel'),
    ],
    component: () => import('./routes/Chat/HotChats'),
  });

  const TestCrf = dynamic({
    app,
    // models: () => [
    //   import('./models/Chat/ChatEntery'),
    // ],
    component: () => import('./routes/Crf/TestCrf'),
  });
  const Department = dynamic({
    app,
    // models: () => [
    //   // import('./models/Department/Department'),
    //   // import('./models/WorkShop/WorkShopModel'),
    //   import('./models/ScienceNews/ScienceNewsModel'),
    // ],
    models: () => [
      import('./models/Department/DepartmentModel'),
      import('./models/ScienceNews/ScienceNewsModel'),
      import('./models/DoctorList/DoctorListModel'),
    ],
    component: () => import('./routes/Department/Department'),
  });


  // const Empower = dynamic({
  //   app,
  //   models: () => [
  //     import('./models/MyPanel/MyPanelModel'),
  //   ],
  //   component: () => import('./routes/MyPanel/Empower'),
  // });

  const Notice = dynamic({
    app,
    models: () => [
      import('./models/MyPanel/MyPanelModel'),
    ],
    component: () => import('./routes/MyPanel/Notice'),
  });
  const EmpowerApply = dynamic({
    app,
    models: () => [
      import('./models/MyPanel/MyPanelModel'),
    ],
    component: () => import('./routes/MyPanel/EmpowerApply'),
  });

  const Pwd = dynamic({
    app,
    models: () => [
      import('./models/MyPanel/MyPanelModel'),
    ],
    component: () => import('./routes/MyPanel/Pwd'),
  });
  // 授权服务
  const ServiceInfo = dynamic({
    app,
    models: () => [
      import('./models/MyPanel/MyPanelModel'),
    ],
    component: () => import('./routes/MyPanel/ServiceInfo'),
  });


  const ScienceNewsList = dynamic({
    app,
    models: () => [
      import('./models/ScienceNews/ScienceNewsModel'),
    ],
    component: () => import('./routes/ScienceNews/ScienceNewsList'),
  });

  const ScienceNewsInfo = dynamic({
    app,
    models: () => [
      import('./models/ScienceNews/ScienceNewsModel'),
    ],
    component: () => import('./routes/ScienceNews/ScienceNewsInfo'),
  });
  const SetSession = dynamic({
    app,
    component: () => import('./routes/SetSession/SetSession'),
  });

  return (
    <Router history={history}>
      <Switch>
        <AuthRoute history={history}>
          <Route path="/" exact component={IndexPage} />

          <Route path="/users" exact component={Users} />
          {/* <Route path="/chat" component={Chat} /> */}
          {/* 学术会议 */}
          <Route path="/WorkShop/WorkshopList" exact component={WorkShopList} />
          {/* 我的档案EmpowerApply*/}
          <Route path="/MyArchive/MyArchive" exact component={MyArchive} />
          {/* //科室介绍 */}
          <Route path="/Department/Departmentintroduced" exact component={Departmentintroduced} />
          <Route path="/WorkShop/WorkShopInfo/:id" exact component={WorkShopInfo} />
          {/* 最新动态 */}
          <Route path="/LatestNews/LatestNewsList" exact component={LatestNewsList} />
          <Route path="/LatestNews/LatestNewsInfo/:id" exact component={LatestNewsInfo} />
          {/* //我的 */}
          <Route path="/MyPanel" auth="myPanel" exact component={MyPanel} />

          <Route path="/MyPanel/PersonCentral" exact component={PersonCentral} />

          <Route path="/MyPanel/PersonCentral/Account" auth="account" exact component={Account} />
          <Route path="/MyPanel/PersonCentral/Pwd" auth="pwd" exact component={Pwd} />
          {/* 服务者信息 */}
          <Route path="/MyPanel/PersonCentral/ServiceInfo" exact component={ServiceInfo} />

          {/* //通知 */}
          <Route path="/MyPanel/PersonCentral/Notice" auth="notice" exact component={Notice} />
          {/* 授权服务 */}
          <Route path="/MyPanel/EmpowerApply/:id" auth="empowerApply" exact component={EmpowerApply} />


          {/* //医患空间 */}

          <Route path="/DopaSpace" exact component={DopaSpace} />
          <Route path="/Chat/DoctorList" auth="doctorList" exact component={DoctorList} />
          <Route path="/Chat/DoctorListForVisitor" exact component={DoctorListForVisitor} />
          <Route path="/Chat/DoctorList/:id" exact component={DoctorInfo} />
          <Route path="/Chat/ChatBox/:id" auth="chat" exact component={ChatBox} />
          <Route path="/Chat/ChatBox/:id/:conversationId" auth="chat" exact component={ChatBox} />
          <Route path="/Chat/DoctorListForVisitor/:id" exact component={DoctorInfoForVisitor} />
          <Route path="/Chat/MyChat" auth="Chat" exact component={MyChat} />
          <Route path="/Chat/HotChats" exact component={HotChats} />
          {/* //账号绑定 */}
          <Route path="/BindAccount" exact component={BindAccount} />


          {/* 研究课题 */}
          {/* <Route path="/InvSubject" exact component={InvSubject} /> */}
          <Route path="/InvSubject/InvSubjectList" exact component={InvSubjectList} />
          <Route path="/InvSubject/InvSubjectList/:id" exact component={InvSubjectInfo} />

          <Route path="/Crf/TestCrf" exact component={TestCrf} />
          {/* //科室风采 */}
          <Route path="/Department" exact component={Department} />
          {/* <Route path="/Department/:id" exact component={DepartmentInfo} /> */}

          <Route path="/ScienceNews/ScienceNewsList" exact component={ScienceNewsList} />
          <Route path="/ScienceNews/ScienceNewsList/:id" exact component={ScienceNewsInfo} />
          {/* <Route path="/DepartmentDetail" exact component={DepartmentDetail} />
          <Route path="/DepartmentDetail" exact component={DepartmentDetail} /> */}

          {/* 该route仅用于前期开发测试设置相关Session，后期需注释该Route */}
          <Route path="/SetSession" exact component={SetSession} />

        </AuthRoute>
        {/* {
            routes.map(({ path, ...dynamics }, key) => (
              <Route key={key}
                exact
                path={path}
                component={dynamic({
                  app,
                  ...dynamics,
                })}
              />
            ))
          } */}
      </Switch>
    </Router>
  );
}

// function check() {
//   console.log(1);
//   return false;
// }

export default RouterConfig;
