import React from 'react';
import { connect } from 'dva';
import { Carousel } from 'antd-mobile';
import styles from './IndexPage.less';

class RollGraph extends React.Component {
  state = {
    initialHeight: 176,
  }


// click = () => {
//     location.href = {value.uri};
//   }

// onClick={this.click}

  render() {
    const hProp = this.state.initialHeight ? { height: this.state.initialHeight } : {};
    if (this.props.list && this.props.list.length > 0) {
      return (
        <Carousel
          className={styles.carousel}
          autoplay
          infinite
          selectedIndex={0}
          swipeSpeed={35}
          autoplayInterval={5000}
          resetAutoplay={false}
          // beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
          // afterChange={index => console.log('slide to', index)}
        >
          {this.props.list.map(value => (

            <a
              onClick={() => {
                if (value.uri) { location.href = (value.uri); }
              }
           }


              key={value.item} style={hProp}
            >
              <img
                src={value.mainImgUrl}
                alt=""
                onLoad={() => {
                // fire window resize event to change height
                  window.dispatchEvent(new Event('resize'));
                  this.setState({
                    initialHeight: null,
                  });
                }}
              />
            </a>

        ))}
        </Carousel>
      );
    } else {
      return (null);
    }
  }
}

function mapStateToProps(state) {
  if (state.RollGraph) {
    const { list } = state.RollGraph;
    return {
      loading: state.loading,
      list,
    };
  }
}

export default connect(mapStateToProps)(RollGraph);
