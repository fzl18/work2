import React from 'react';
import { List, WingBlank, Carousel, Flex, ActivityIndicator } from 'antd-mobile';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { withRouter } from 'react-router';
import styles from './Department.less';
import { partitionArray } from '../../utils/jsLibs';

// const PlaceHolder = props => (
//   <div
//     style={{
//       backgroundColor: '#ebebef',
//       color: '#bbb',
//       textAlign: 'center',
//       height: '30px',
//       lineHeight: '30px',
//       width: '100%',
//     }}
//     {...props}
//   >Item</div>
// );

class DoctorListIndex extends React.Component {
  state = {
    // data: ['', '', ''],
    initialHeight: 176,
  }

  render() {
    const data = partitionArray(this.props.list, 4);
    if (this.props.list && this.props.list.length > 0) {
      return (
        <div className={styles.height160} >
          <List
            renderHeader={() => {
              return (<div
                className="list_header_title"style={{ fontSize: '13pt',
                  fontFamily: 'Microsoft YaHei' }}
              > 医生团队<Link
                to="/Chat/DoctorListForVisitor" className="bar_more"style={{ fontSize: '13pt',
                  fontFamily: 'Microsoft YaHei',
                  color: '#333e4d' }}
              >更多&gt;</Link> </div>);
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
                      return (<Flex.Item className={styles.flex1}>
                        <div >
                          <a
                            onClick={() => {
                              this.props.history.push(`/Chat/DoctorListForVisitor/${item.ydataAccountId}`);
                            }}
                            style={{ height: '160px', display: 'block' }}
                          >
                            <div className={styles.doc_flex}>

                              <div className={styles.img_box}>
                                <img
                                  src={item.doctorImgUrl}
                                  alt="医生头像" className={styles.doctor_img}
                                />
                              </div>

                              <p
                                style={{ fontSize: '14.5px',
                                  fontFamily: 'Microsoft YaHei',
                                  color: '#333e4d' }}
                              >{item.userCompellation}</p>
                              <p
                                style={{ fontSize: '15px',
                                  fontFamily: 'Microsoft YaHei',
                                  color: '#333e4d' }}
                              >{item.doctorPosition}</p>

                            </div>
                          </a>
                        </div>
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
              > 医生团队<Link
                to="/Chat/DoctorListForVisitor" className="bar_more"style={{ fontSize: '13pt',
                  fontFamily: 'Microsoft YaHei',
                  color: '#333e4d' }}
              >更多&gt;</Link> </div>);
            }} className="my-list"
          />
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  const { list = [] } = state.DoctorList || {};
  return {
    loading: state.loading.models.DoctorList,
    list,
  };
}

export default connect(mapStateToProps)(withRouter(DoctorListIndex));
