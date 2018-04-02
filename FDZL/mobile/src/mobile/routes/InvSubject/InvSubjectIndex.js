import React from 'react';
import { List, WingBlank, Carousel, Flex, ActivityIndicator } from 'antd-mobile';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { withRouter } from 'react-router';
import styles from './InvSubject.less';
import { partitionArray } from '../../utils/jsLibs';


class InvSubjectIndex extends React.Component {
  state = {
    initialHeight: 176,
  }

  clickMore = () => {
    this.props.dispatch({ type: 'InvSubject/clearSearch', payload: {} });
    this.props.history.push('/InvSubject/InvSubjectList');
  }

  render() {
    const data = partitionArray(this.props.list, 2);
    if (this.props.list && this.props.list.length > 0) {
      return (
        <div className={styles.height160}>

          <List
            renderHeader={() => {
              return (<div
                className="list_header_title" style={{ fontSize: '13pt',
                  fontFamily: 'Microsoft YaHei' }}
              > 热门课题 <a
                onClick={this.clickMore} className="bar_more"style={{ fontSize: '13pt',
                  fontFamily: 'Microsoft YaHei',
                  color: '#333e4d' }}
              >更多&gt;</a> </div>);
            }} className="my-list"
          >

            <WingBlank size="md" className="clearPrefix">
              <Carousel
                className={styles.carousel}
                autoplay={false}
                infinite
                selectedIndex={0}
                swipeSpeed={35}
                // beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                // afterChange={index => console.log('slide to', index)}
              >
                {this.props.loading ? <ActivityIndicator className="loading_center" animating /> :
              data && data.map(value => (

                <a style={{ height: '160px', display: 'block' }}>
                  <Flex>
                    {value.map((item) => {
                      return (<Flex.Item>
                        <a
                          onClick={() => {
                            this.props.history.push(`/InvSubject/InvSubjectList/${item.researchSubjectId}`);
                          }}
                          style={{ display: 'block' }}
                        >
                          <div className={styles.doc_flex}>

                            <div className={styles.img_box}>
                              <img
                                src={item.mainImgNameUrl}
                                alt="" className={styles.doctor_img}
                              />
                            </div>

                            <p className={styles.subjectTitle}>{item.researchSubjectTitle}</p>
                          </div>
                        </a>
                      </Flex.Item>);
                    })}

                  </Flex>
                </a>


          ))
        }
              </Carousel>
            </WingBlank>
          </List>

        </div>
      );
    } else {
      return (
        <div>
          <List
            renderHeader={() => {
              return (<div
                className="list_header_title"style={{ fontSize: '13pt',
                  fontFamily: 'Microsoft YaHei' }}
              > 热门课题 <a
                onClick={this.clickMore} className="bar_more"style={{ fontSize: '13pt',
                  fontFamily: 'Microsoft YaHei',
                  color: '#333e4d' }}
              >更多&gt;</a> </div>);
            }} className="my-list"
          />
        </div>

      );
    }
  }
}

function mapStateToProps(state) {
  const { list = [] } = state.InvSubject || {};
  return {
    loading: state.loading.models.InvSubject,
    list,
  };
}


export default connect(mapStateToProps)(withRouter(InvSubjectIndex));
