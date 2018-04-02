import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { auth2 } from '../../common/Auth';
import API_URL from '../../common/url';
import $ from '../../common/XDomainJquery';
import {Modal} from 'antd';



const PrivateRoute = ({ component: ComposedComponent, ...rest }) => {
    //let isLogin = sessionStorage.userId != undefined && sessionStorage.userId != null && sessionStorage.userId > 0;
    return (
        <Route
            {...rest} render={props => {
                return (
                    //isLogin  ?
                        //auth2(props.match.path && props.match.path !== "/login") ? (
                            <ComposedComponent {...props} name="hahehe" />
                        //) : (
                        //    <Redirect
                        //        to={{
                        //            pathname: '/permission-403',
                        //            state: { from: props.location },
                        //        }}
                        //    />
                        //) : 
                        //props.match.path !== "/login" ?
                        //    <Redirect
                        //        to={{
                        //            pathname: '/login',
                        //            state: { from: props.location },
                        //        }}
                        //    />
                        //:
                        //null
                    
                );
            }}
        />
    );
};

export default PrivateRoute;
