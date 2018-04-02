import React from 'react';
import { connect } from 'dva';
import { List, WhiteSpace } from 'antd-mobile';
import styles from './MyArchiveindex.less';


const Item = List.Item;
const Brief = Item.Brief;

class MyArchive extends React.Component {
  state = {
    disabled: false,
  }

  render() {
    return (
      <div className={styles.MyArchiveindex} style={{ backgroundColor: '#ebebef' }}>
        <Item
          arrow="horizontal"
          thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
          multipleLine
          onClick={() => {}}
        >
          <a style={{ paddingLeft: '5px' }}>张阿<span>|</span> ZY17050607</a>
        </Item>

        <WhiteSpace />
        <WhiteSpace />
        <List>
          <Item
            arrow="horizontal"
            multipleLine align="top"
            onClick={() => {}}
          >
          门诊<Brief>2017-12-1</Brief>
            <a className="typing" style={{ color: '#888', position: 'absolute', fontSize: '15px', right: '16px', top: '45px' }} >录入中</a>
          </Item>
        </List>
        <WhiteSpace />
        <List>
          <Item
            arrow="horizontal"
            multipleLine align="top"
            onClick={() => {}}
          >
          随访
          {/* <hr style={{height:1,border:"none",borderTop:1,color: "#888"}}/> */}
            <Brief>2017-12-1</Brief>
            <a className="typing" style={{ color: '#FFB5B5', position: 'absolute', fontSize: '15px', right: '16px', top: '45px' }} >未录入</a>
          </Item>
        </List>
        <WhiteSpace />
        <List>
          <Item
            arrow="horizontal"
            multipleLine align="top"
            onClick={() => {}}
          >
          随访<Brief>2017-12-1</Brief>
            <a className="typing" style={{ color: '#888', position: 'absolute', fontSize: '15px', right: '16px', top: '45px' }} >录入中</a>
          </Item>
        </List>
        <div className="bottom" >
          <div className="calendar" ><a style={{ position: 'absolute', fontSize: '15px', right: '213px', top: '28px' }}>日历</a></div >
          <div className="Archive" ><a style={{ position: 'absolute', fontSize: '15px', right: '51px', top: '28px' }}>我的档案</a></div >
        </div>
      </div>);
  }
}

export default connect()(MyArchive);
