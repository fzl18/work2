import React, { Component } from 'react';
import moment from 'moment';
import { Button, Input, Select, DatePicker } from 'antd';
import store from '../../../store';
import { setSearchParams } from '../../../actions/executeActions';

const InputGroup = Input.Group;
const Option = Select.Option;
const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD';

class SearchGroup extends Component {

    constructor(props) {
        super(props);
        const { searchItem } = props;
        const { moduleDefineCode, moduleDefineName, criteriaDataType, projectDefineWebType } = searchItem;
        this.state = {
            moduleDefineCode,
            moduleDefineName,
            criteriaDataType,
            projectDefineWebType,
            searchValue: '',
        };
    }

    handleChangeInput = e => {
        if(this.state){
            this.loadInterval && this.setState({
                searchValue: e.target.value,
            });
        }
    };

    handleChangeDatePicker = (date, dateString) => {
        if(dateString[0] == "" && dateString[1] == ""){
            dateString = '';
        }
        if(this.state){
            this.loadInterval && this.setState({
                searchValue: dateString,
            }, () => {
                this.setSearchParams();
            });
        }
    };

    handleChangeSelect = value => {
        if(this.state){
            this.loadInterval && this.setState({
                searchValue: value,
            });
        }
    };

    handleBlur = () => {
        this.setSearchParams();
    };

    setSearchParams = () => {
        const {
            moduleDefineCode,
        } = this.state;
        store.dispatch(setSearchParams(moduleDefineCode, { ...this.state }));
    };

    

    // search = () => {
    //     this.setSearchParams();
    //     this.props.search();
    // };
    //
    // enterSearch = e => {
    //     if (e.charCode === 13) {
    //         this.search();
    //     }
    // };

    getOwnState = () => {
        if(store.getState()){
            if(store.getState().executeState){
                if(store.getState().executeState.searchParams){
                    if(store.getState().executeState.searchParams[this.state.moduleDefineCode]){
                        return {
                            searchValue: store.getState().executeState.searchParams[this.state.moduleDefineCode]['searchValue']
                        }
                    }
                }
            }
        }
        return null;
        
    }

    onStoreChange = () => {
        if(this.getOwnState()){
            if(this.state){
                this.loadInterval && this.setState(this.getOwnState());
            }
        }else{
            if(this.state){
                this.loadInterval && this.setState({
                    searchValue: ''
                })
            }
            
        }
    }

    componentDidMount= () => {
        store.subscribe(this.onStoreChange);
        this.loadInterval = setInterval(this.loadSearches, this.props.pollInterval);
    }

    componentWillUnmount = () => {
        store.subscribe(this.onStoreChange);
        this.loadInterval && clearInterval(this.loadInterval);
        this.loadInterval = false;
    }

    render() {
        const {
            moduleDefineName,
            projectDefineWebType,
            searchValue,
        } = this.state;
        let rangepicker;
        if(projectDefineWebType === 'DATETIMEPICKER'){
            let startTime;
            let endTime;
            if(searchValue !== ''){
                startTime = searchValue[0]
                endTime = searchValue[1]
            }
            rangepicker = searchValue !== '' ?
            <RangePicker
                format={dateFormat}
                onChange={this.handleChangeDatePicker}
                value={[moment(startTime, dateFormat), moment(endTime, dateFormat)]}
            />
            :
            <RangePicker
            format={dateFormat}
            onChange={this.handleChangeDatePicker}
            value={[,] }

            />
        }
        

        return (
            
            <div className="form-item">
                <label htmlFor="" className="ui-label">{moduleDefineName}</label>
                {
                    projectDefineWebType === 'INPUT' &&
                    <Input
                        className="ui-input"
                        placeholder={`请输入${moduleDefineName}`}
                        value={searchValue}
                        onChange={this.handleChangeInput}
                        onBlur={this.handleBlur}
                    />
                }

                {
                    projectDefineWebType === 'DATETIMEPICKER' &&
                    rangepicker
                }
            </div>
            
        );
    }
}

export default SearchGroup;

