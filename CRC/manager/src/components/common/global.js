import $ from '../../common/AjaxRequest'
import {config} from '../common/config'
import {Row, Col, Modal, message, Upload, notification,Pagination  } from 'antd';

export const command = {
    api: (options={},callback=()=>{})=>{
        const url = options.url ? options.url : '#'
        const pagination = options.pagination ? options.pagination : {}
        const params = options.params ? options.params : {}
        const opt ={
            method: 'POST',
            url: url,
            data: {
                offset: pagination.current || 1,
                limit: pagination.pageSize || config.pageSize,
                ...params,
            },
            dataType: 'json',
            doneResult: data => {
                callback &&　callback(data)               
            }
        }
        $.sendRequest(opt)
    },

    handleTableChange : (searchFormValues, callback=()=>{}, pagination, filtersArg, sorter) => {
        const filters = Object.keys(filtersArg).reduce((obj, key) => {
          const newObj = { ...obj };
          newObj[key] = getValue(filtersArg[key]);
          return newObj;
        }, {})    
        const params = {
          currentPage: pagination.current,
          pageSize: pagination.pageSize,
          ...searchFormValues,
          ...filters,
          offset:pagination.current,
        }
        if (sorter.field) {
          params.sort = sorter.field
          params.direction = sorter.order == "descend" ? "DESC" :  "ASC"    
        }        
        this.setState({pagination},callback && callback(params))
    },    
    
}