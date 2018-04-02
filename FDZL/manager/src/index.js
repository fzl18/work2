import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter, Route } from 'react-router-dom';
import store from './store';
import routes from './router';
import PrivateRoute from './components/auth/PrivateRoute';
import App from './components/App';
import Login from './components/home/Login';
import Setting from './components/home/Setting';
import './style/antd.min.css';

//TODO:https-saml
//import Home from './components/home/Home';
//import './style/antd.min.css';
import './style/main.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'babel-polyfill';
import Highcharts from 'react-highcharts';
import HighchartsExporting from 'highcharts-exporting';

HighchartsExporting(Highcharts.Highcharts);
moment.locale('zh-cn');

ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            <div className="router-index">
            <Route path="/login" component={Login} isLogin={true} />
            <Route path="/setting" component={(props)=> <Setting {...props}/>} />
            <App location={location}>
                
                {
                    routes.map((route, index) => (
                        <PrivateRoute
                            key={index}
                            path={route.path}
                            exact={route.exact}
                            component={route.render}
                        />))
                }
            </App>
            </div>
        </HashRouter>
    </Provider>,
    document.getElementById('contentApp'),
);
