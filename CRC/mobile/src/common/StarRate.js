import React from 'react';
import { connect } from 'dva';
// import DataOrderFooter from './DataOrderFooter';


class MinuteTimer extends React.Component {

  state={
    value: 0,
    count: 5,
  }

  componentDidMount() {
    this.setState({
      value: this.props.value,
      count: this.props.count,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
      count: nextProps.count,
    });
  }

  clickStar = (value) => {
    if (this.props.disabled) {
      return;
    }
    this.setState({
      value,
    });
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  render() {
    const { count = 5, value = 0 } = this.state;
    const starsLi = [];
    for (let i = 0; i < count; i++) {
      if (i < value) {
        starsLi.push(
          <li
            onClick={() => {
              this.clickStar(i + 1);
            }} style={{ display: 'inline-block' }}
          ><i className="icon iconfont icon-xing" style={{ color: '#f9b452', marginLeft: '5px' }} /></li>,
        );
      } else {
        starsLi.push(
          <li
            onClick={() => {
              this.clickStar(i + 1);
            }} style={{ display: 'inline-block' }}
          ><i className="icon iconfont icon-xing1" style={{ color: '#989898', marginLeft: '5px' }} /></li>,
        );
      }
    }
    return (
      <ul style={{ fontSize: '18px', display: 'inline-block' }}>
        {
          starsLi.map((node) => {
            return node;
          })
        }
      </ul>
    );
  }
}


export default connect()(MinuteTimer);
