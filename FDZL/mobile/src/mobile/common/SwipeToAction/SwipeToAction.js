import React from 'react';
import ReactDOM from 'react-dom';
import './style/SwipeToAction.less';
import Swipe from './Swipe';
import { mobilecheck } from '../../utils/jsLibs';

class SwipeToAction extends React.Component {
  state={
    contentLeftMove: 0,
    direction: 'none',
    disabled: false,
  }

  componentWillMount() {
    // add event listener for clicks
    document.addEventListener('click', this.onClickOut, false);
  }

  componentDidMount() {
    if (this.props.disabled) {
      this.setState({
        disabled: true,
      });
    }
  }

  componentWillUnmount() {
    // make sure you remove the listener when the component is destroyed
    document.removeEventListener('click', this.onClickOut, false);
  }

  onClickOut = (e) => {
    if (!ReactDOM.findDOMNode(this).contains(e.target)) {
      // the click was outside your component, so handle closing here
      this.setState({
        direction: 'none',
        contentLeftMove: 0,
      });
    }
  }

  onSwipeLeftListener = () => {
    if (this.state.disabled) {
      return;
    }
    this.setState({
      contentLeftMove: -55,
      direction: 'left',
    });
  }

  onSwipeRightListener = () => {
    if (this.state.disabled) {
      return;
    }
    this.setState({
      contentLeftMove: 0,
      direction: 'right',
    }, () => {
      setTimeout(function () {
        this.setState({
          direction: 'none',
        });
      }, 200);
    });
  }

  onSwipeDownListener = () => {
    if (this.state.disabled) {
      return;
    }
    this.setState({
      contentLeftMove: 0,
      direction: 'none',
    });
  }

  onSwipeUpListener = () => {
    if (this.state.disabled) {
      return;
    }
    this.setState({
      contentLeftMove: 0,
      direction: 'none',
    });
  }

  handleMouseUp = (event) => {
    if (this.state.direction != 'none') {
      if (!mobilecheck()) {
        event.stopPropagation();
        const newState = { direction: 'none' };
        // newState.contentLeftMove = 0;
        this.setState(newState);
      }
    }
  }

  handleTouch = () => {
    // this.setState({
    //   direction: 'none',
    // });
  }

  render() {
    const { right = [] } = this.props;
    const { contentLeftMove } = this.state;
    return (
      <Swipe
        nodeName="div"
        className="swipe-node"
        preventDefaultEvent={false}
        mouseSwipe={true}
        onSwipedLeft={(v, event) => this.onSwipeLeftListener(v, event)}
        onSwipedRight={this.onSwipeRightListener}
        // onSwipedDown={this.onSwipeDownListener}
        // onSwipedUp={this.onSwipeUpListener}
        // onSwipeMove={this.onSwipeMove}
        // onSwipe={this.onSwipeListener}
        // onSwipeEnd={e => e.stopPropagation()}
        style={{ touchAction: 'auto !important', display: 'block' }}
      >
        <div className="si-swipe">
          <div className="si-swipe-cover" />
          <div className="si-swipe-right" style={{ width: `${contentLeftMove * -1}px` }}>
            {
                  right.map((value) => {
                    return (
                      <div
                        className="si-swipe-btn"
                        style={value.style}
                        onClick={() => { value.onPress(); }}
                      >
                        <div className="si-swipe-btn-text">{value.text}</div>
                      </div>
                    );
                  })
              }
          </div>
          <div onClickCapture={e => this.handleMouseUp(e)} className="si-swipe-content" style={{ left: `${contentLeftMove}px` }}>
            {this.props.children}
          </div>
        </div>
      </Swipe>
    );
  }

}

export default SwipeToAction;
