import React, { Component } from 'react';
import $ from '../../common/AjaxRequest';
import { Form, Input, Modal, Button, Select, message,Cascader} from 'antd';
import API_URL from '../../common/url';
import { config } from './config';

class SelectCitys extends React.Component {
    constructor(props) {
        super(props);
        const value = this.props.value || {};
        this.state = {
            inputValue: '',
            provinceData:[],
            value,
        };
    }
  
  //得到城市列表
    getCity = ( parentId = 0 ) => {
        const options ={
            method: 'POST',
            url: `${API_URL.common.arealist}`,
            data: {
                parentId:parentId,
            },
            dataType: 'json',
            doneResult: data => {
                if(parentId == 0 ){
                    const provinces = data.data.map(d => ({
                        value: d.regionId,
                        label: d.regionName,
                        parentId: d.parentId,
                        isLeaf: false,
                    }));
                    this.setState({
                        provinces,
                    });
                }            
            }
        }
        $.sendRequest(options)
    }


  onChange = (value, selectedOptions) => {
    //   console.log(value)

    if(value[0]){
        this.props.ChangeSelectprovinces ? this.props.ChangeSelectprovinces(value[0],selectedOptions[0]) : null
    }
    if(value[1]){
        this.props.ChangeSelect ? this.props.ChangeSelect(value[1],selectedOptions[1]) :null
        // console.log(value[1],selectedOptions[1])
        this.setState({
            value:selectedOptions[1]
        },()=>{
            const onChange = this.props.onChange;
            console.log(onChange)
            if (onChange) {
              onChange(Object.assign({}, this.state.value));
            }
        })
    }
    if(!value.length){
        // this.props.clear ? this.props.clear() : null
        this.setState({
            value:{value:'',label:''}
        },()=>{
            const onChange = this.props.onChange;
            if (onChange) {
              onChange(Object.assign({}, this.state.value));
            }
        })
    }
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState(value);
    }
  }
  
  loadData = (selectedOptions) => {
    // const label = selectedOptions[0].label
    // const value = selectedOptions[0].value
    const targetOption = selectedOptions[selectedOptions.length - 1];
    // console.log(targetOption)
    targetOption.loading = true;
    //拉城市信息列表
    const options ={
            method: 'POST',
            url: `${API_URL.common.arealist}`,
            data: {
                parentId:targetOption.value,
            },
            dataType: 'json',
            doneResult:data => {
                const cityData = data.data
                targetOption.loading = false;
                targetOption.children = cityData.map(d => ({
                    label: d.regionName,
                    value: d.regionId,
                }));
                this.setState({
                    provinces: [...this.state.provinces],
                });
            }
        }
        $.sendRequest(options)
  }

  componentDidMount(){
      this.getCity()
  }


  render() {
    const { provinces, inputValue } = this.state;
    return (
      <Cascader
        allowClear
        placeholder = { this.props.placeholder || "请选择" }
        options={provinces}
        loadData={this.loadData}
        onChange={this.onChange}
        changeOnSelect
        style={this.props.style}
      />
    );
  }
}

export default SelectCitys;