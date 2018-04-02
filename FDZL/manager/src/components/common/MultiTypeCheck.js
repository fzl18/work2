import React, { Component } from 'react';
import { Modal, Button, Icon } from 'antd';
import './style/MultiTypeCheck.less';

class MultiTypeCheck extends Component {
    
    state = {
        index: this.props.index,
        type: this.props.type,//TYPE_OK：选中 TYPE_CANCEL：叉 TYPE_NONE: 未选中
        types: ["TYPE_OK","TYPE_CANCEL","TYPE_NONE"],
        disabled: this.props.disabled || false,
    }

    onClick = () => {
        if(this.state.disabled){
            return;
        }
        let {type} = this.state;
        const {index, types} = this.state;
        let arrIndex = types.indexOf(type) + 1;
        if(arrIndex >= types.length){
            arrIndex = 0;
        }
        type = types[arrIndex];
        this.setState({
            type: type,
        })
        this.props.changeCheck(index, type);
    }

    render() {
        const {type, disabled} = this.state;
        let checkClass = "";
        if(type == "TYPE_OK"){
            checkClass = "ant-checkbox-inner right";
        }else if(type == "TYPE_CANCEL"){
            checkClass = "ant-checkbox-inner wrong";
        }else if(type == "TYPE_NONE"){
            checkClass = "ant-checkbox-inner unselected";
        }
        if(disabled){
            checkClass += " ant-checkbox-disabled";
        }
        return (
            <div>
                <span className={checkClass} onClick={this.onClick}></span>
            </div>
        )
    }

}

export default MultiTypeCheck;