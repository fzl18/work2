/**
 * Created by casteloyee on 2017/7/22.
 */
import $ from 'jquery';
import React from 'react';
import {AutoComplete} from 'antd';
import StringUtil from '../../common/StringUtil';
import AjaxRequest from '../../common/AjaxRequest';
const Option = AutoComplete.Option;

class SearchSelect extends AutoComplete {
    state = {
        searchValue: '',
        suc: true,
    };

    // 搜索医院
    handleSearch = (value) => {
        let dyamicParams = {};
        if(this.props.getDynamicParams){
            dyamicParams = this.props.getDynamicParams();
            if(!dyamicParams){
                return;
            }
        }
        // 输入的是空格，不搜索
        if (value != null && StringUtil.isNull(value) && value.length > 0) {
            return null;
        }
        // 和之前内容相同，不搜索
        const {searchValue, data, suc} = this.state;
        if (!StringUtil.isNull(value) && !StringUtil.isNull(searchValue) && StringUtil.trim(value) == StringUtil.trim(searchValue)) {
            return null;
        }
        if (searchValue == '' && value == '' && data != undefined && data.length > 0) {
            return null;
        }
        if(suc == false){
            if((searchValue == undefined && value == undefined) || (searchValue == null && value == null)
                || (searchValue != undefined && searchValue != null && value != undefined && value != null && searchValue == value)){
                return null;
            }
        }

        this.setState({
            searchValue: value,
        });
        const {url, searchKey, searchParam} = this.props;
        const options = {
            url,
            data: {
                showError: 0,
                [searchKey]: value,
                ...searchParam,
                ...dyamicParams,
            },
            dataType: 'json',
            doneResult: ( dt => {
                    this.props.parserData(dt,value);
                    this.setState({suc: true});
                }
            ),
            errorResult: (() => {
                    this.setState({suc: false});
                }
            ),
        };
        AjaxRequest.sendRequest(options);
    };

    clearValue = () => {
        this.autoCompleteRef.value = {key:'', label:''};
    }

    onChange = (value) =>{
        if(this.props.onChange){
            if(value){
                this.props.onChange(value);
            }
        }
        
    }

    handleSelect = (value) => {
        const {sourceData} = this.props;
        let option = {};
        sourceData.map((dataItem, i) => {
            if (dataItem.value == value.key) {
                option = dataItem;
            }
        });
        this.props.handleSelect(value, option);
    }

    render() {
        const {sourceData} = this.props;
        return (
            <AutoComplete labelInValue style={this.props.style}
                          className={this.props.className}
                          disabled={this.props.disabled}
                          placeholder={this.props.placeholder}
                          onSearch={this.handleSearch}
                          onSelect={this.handleSelect}
                          onFocus={this.handleSearch}
                          onChange={this.onChange}
                          defaultValue={this.props.initValue}
                          ref={el => { this.autoCompleteRef = el; }}
                          dropdownClassName={this.props.dropdownClassName || null}
                          dropdownAlign = {this.props.dropdownAlign || null}
                          allowClear={this.props.allowClear}
            >
                {sourceData.map(d => <Option key={d.value}>{d.text}</Option>)}
            </AutoComplete>
        );
    }
}

export default SearchSelect;
