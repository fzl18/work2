import React from 'react';
import { connect } from 'dva';
// import DataOrderFooter from './DataOrderFooter';


class MinuteTimer extends React.Component {

  state={
    second: null,
  }

  componentDidMount() {
    this.setState({
      second: this.props.second,
    }, function () {
      this.addSecond();
    });
  }

  componentWillReceiveProps(nextProps) {
    clearInterval(this.interval);
    this.setState({
      second: nextProps.second,
    }, function () {
      this.addSecond();
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  addSecond = () => {
    this.interval = setInterval(() => {
      const { second } = this.state;
      this.setState({
        second: second + 1,
      });
    }, 1000);
  }

  addZero = (value) => {
    if (value < 10) {
      return `0${value}`;
    } else {
      return value;
    }
  }

  render() {
    const { second } = this.state;
    const hourPre = Math.floor(Number(second) / 3600);
    const MinutePre = Math.floor((Number(second) % 3600) / 60);
    const showTime = `${this.addZero(hourPre)}:${this.addZero(MinutePre)}`;
    return (
      <span>
        {
          second === null ?
          null :
          showTime
        }
      </span>
    );
  }
}


export default connect()(MinuteTimer);
