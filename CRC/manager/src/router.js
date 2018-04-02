import React, {Component} from "react";
import {Route, Redirect} from "react-router-dom";
import Login from "./components/home/Login";
// import Doctor from "./components/Team/Doctor"
// import DoctorSave from "./components/Team/DoctorSave"
import Question from "./components/Question/QuestionClass"
import QuestionList from "./components/Question/QuestionList"
import QuestionSave from "./components/Question/Save"
import Doctors from "./components/usermanager/Doctors"
import NoDoctors from "./components/usermanager/NoDoctors"
import Assistants from "./components/usermanager/Assistants"
import AssistantsOut from "./components/usermanager/AssistantsOut"
// import Patients from "./components/usermanager/Patients"
import Auth from "./components/Auth"

import Job from "./components/serive/Job"
import Type from "./components/serive/Type"
import Staff from "./components/serive/Staff"
import MemberLevel from "./components/Rule/MemberLevel"
import MemberProfit from "./components/Rule/MemberProfit"
import SericeMemberProfit from "./components/Rule/SericeMemberProfit"
import ServicePrice from "./components/TariffManager/ServicePrice"
import CapitalRatio from "./components/TariffManager/CapitalRatio"
import ServiceFeeRatio from "./components/TariffManager/ServiceFeeRatio"
import MessagesClass from "./components/Messages/MessagesClass"
import MessagesList from "./components/Messages/MessagesList"
import NoticeList from "./components/Notice"
import NoticeSave from "./components/Notice/Save"
import Order from "./components/Integral/Order"
import Serivce from "./components/Integral/Serivce"
import Recharge from "./components/Money/Recharge"
import Revenue from "./components/Money/Revenue"
import OrderLog from "./components/Money/Order"
import Cash from "./components/Money/Cash"
import Account from "./components/Money/Account"
import MyOrder from "./components/Order/MyOrder"
import OrderDetail from "./components/Order/Detail"
import Setting from './components/home/Setting';

const routes = [{
    path: '/',
    exact: true,
    render: () => 1 ? <Redirect to="UserManager/Doctors"/> : <Redirect to="/login"/>,
}, {
    path: '/index',
    exact: true,
    render: () => <Doctors />,
}, {
    path: '/serive/type',
    exact: true,
    render: () => <Type />,
}, {
    path: '/serive/job',
    exact: true,
    render: () => <Job />,
}, {
    path: '/serive/staff',
    exact: true,
    render: () => <Staff />,
}, {
    path: '/question',
    exact: true,
    render: () => <Question />,
}, {
    path: '/question/QuestionList',
    exact: true,
    render: () => <QuestionList />,
}, {
    path: '/question/Save',
    exact: true,
    render: (props) => <QuestionSave {...props}/>,
}, {
    path: '/question/Save/:id',
    exact: true,
    render: (props) => <QuestionSave {...props}/>,
}, {
    path: '/usermanager/assistants',
    exact: true,
    render: () => <Assistants />,
}, {
    path: '/usermanager/doctors',
    exact: true,
    render: () => <Doctors />,
}, {
    path: '/usermanager/nodoctors',
    exact: true,
    render: () => <NoDoctors />,
}, {
    path: '/usermanager/assistantsout',
    exact: true,
    render: () => <AssistantsOut />,
}, {
    path: '/Rule/MemberLevel',
    exact: true,
    render: () => <MemberLevel />,
},
{
    path: '/Rule/MemberProfit',
    exact: true,
    render: () => <MemberProfit />,
},
{
    path: '/Rule/SericeMemberProfit',
    exact: true,
    render: () => <SericeMemberProfit />,
},
{
    path: '/TariffManager/ServicePrice',
    exact: true,
    render: () => <ServicePrice />,
},
{
    path: '/TariffManager/CapitalRatio',
    exact: true,
    render: () => <CapitalRatio />,
},
{
    path: '/TariffManager/ServiceFeeRatio',
    exact: true,
    render: () => <ServiceFeeRatio />,
},
{
    path: '/Messages/MessagesClass',
    exact: true,
    render: () => <MessagesClass />,
},
{
    path: '/Messages/MessagesList',
    exact: true,
    render: () => <MessagesList />,
},
{
    path: '/Notice',
    exact: true,
    render: () => <NoticeList />,
},
{
    path: '/Notice/Save',
    exact: true,
    render: () => <NoticeSave />,
},
{
    path: '/Notice/Save/:id',
    exact: true,
    render: (props) => <NoticeSave {...props}/>,
},
{
    path: '/Integral/Order',
    exact: true,
    render: () => <Order />,
},
{
    path: '/Integral/Serivce',
    exact: true,
    render: () => <Serivce />,
},
{
    path: '/Money/Recharge',
    exact: true,
    render: () => <Recharge />,
},
{
    path: '/Money/Revenue',
    exact: true,
    render: () => <Revenue />,
},
{
    path: '/Money/Cash',
    exact: true,
    render: () => <Cash />,
},
{
    path: '/Money/Account',
    exact: true,
    render: () => <Account />,
},
{
    path: '/Money/Order',
    exact: true,
    render: () => <OrderLog />,
},
{
    path: '/Order',
    exact: true,
    render: () => <MyOrder />,
},
{
    path: '/OrderDetail/:id',
    exact: true,
    render: (props) => <OrderDetail {...props} />,
},
{
    path: '/setting',
    exact: true,
    render: (props) => <Setting {...props} />,
},
];

export default routes;
