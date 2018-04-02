import React from 'react'
import HistoryDetail from '../ConsulHistory/Detail'
import $ from '../../common/AjaxRequest'
import moment from 'moment'
import API_URL from '../../common/url'
import { Row, Col, Popconfirm,  Card,Table, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Upload, notification  } from 'antd'
import Editor from '../common/Editor'
import {config,uploadser} from '../common/config'


export default class Detail extends React.Component {
    render(){
        return(
            <HistoryDetail hot={true} id={this.props.match.params.id} history={this.props.history} />
        )
    }
}