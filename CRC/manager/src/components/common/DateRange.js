/**
 * Created by Richie on 2017/8/2.
 */
import React from 'react';
import moment from 'moment';
import { message, Table, Popconfirm, Modal, Button,Icon, DatePicker, Row, Col,Input,Tooltip,Select ,InputNumber} from 'antd';

const dateFormat = 'YYYY-MM-DD';
const monthFormat = 'YYYY-MM';
const Option = Select.Option
const { MonthPicker, RangePicker } = DatePicker


class DateRange extends React.Component {
  state = {
    startValue: this.props.defaultValueBegin,
    endValue: this.props.defaultValueEnd,
    next:'',
    endOpen: false,
  };

  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    let k2 = moment(startValue)
    if (!endValue || !startValue) {
      return false;
    }
    // return (endValue.valueOf() <= startValue.valueOf());
    return ( endValue.valueOf() > k2.add(11,'M').valueOf()  );
    
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }

  onStartChange = (value) => {
    this.onChange('startValue', value);
    if(!value){
      this.props.clearStartDate ? this.props.clearStartDate(): null
    }
    
  }

  onEndChange = (value) => {
    //this.onChange('endValue', value);
    this.setState({
      endValue: value,
    },function(){
      const { startValue ,endValue } = this.state
      if(startValue && endValue){
        this.props.loadData(this.props.params,{begin:startValue.format(monthFormat),end:endValue.format(monthFormat)})      
      }else{
        message.warn('请选择日期！')
      }
    });
    if(!value){
      this.props.clearEndDate ? this.props.clearEndDate() :null
    }    
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });      
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });

  }

  componentWillReceiveProps(nextProps){
    if(this.state.next != nextProps.next){
      console.log(nextProps)
      this.setState({
        startValue:moment().add(-11,'M'),
        endValue:moment(),
        next:nextProps.next,
      })
    }    
  }

  render() {
    const { startValue, endValue, endOpen } = this.state;
    return (
      <span style={this.props.style}>
        <MonthPicker
          disabledDate={this.disabledStartDate}
          //showTime
          format={monthFormat}
          value={startValue}
          placeholder="选择开始月份"
          onChange={this.onStartChange}
          onOpenChange={this.handleStartOpenChange}
        />
        <span className="ant-divider" />
        <MonthPicker
          disabledDate={this.disabledEndDate}
          //showTime
          format={monthFormat}
          value={endValue}
          placeholder="结束月份"
          onChange={this.onEndChange}
          open={endOpen}
          onOpenChange={this.handleEndOpenChange}
        />
      </span>
    );
  }
}
export default DateRange;