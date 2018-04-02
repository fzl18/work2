import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import { WingBlank } from 'antd-mobile';
import styles from './Agreement.less';


const pageTitle = 'CRC随心呼平台服务协议条款';


class Agreement extends React.Component {

  render() {
//     const {
//      htmlText,
//  } = this.props.info;

    return (
      <div>
        <div className={styles.head} />
        <div className={styles.background} >
          <Helmet>
            <title>{pageTitle}</title>
            <meta name="description" content={pageTitle} />
            <style type="text/css">{`
                #root{
                  background-color: white;
                }
            `}</style>
          </Helmet>
          <div >
            <p className={styles.Agreement}>
              <WingBlank size="md">
                {/* <div
                  className="dangerousHtml"
                  dangerouslySetInnerHTML={{
                    __html: htmlText,
                  }}
                /> */}
                <p>
                  <sapn style={{ color: 'rgb(254,130,96)' }}>【协议说明】
                  </sapn>本协议是您与CRC随心呼平台所有者之间就CRC随心呼平台服务等相关事宜所订立的契约，
                  请您仔细阅读本注册协议，您点击“注册”按钮后，本协议即构成对双方有约束力的法律文件。
                <br />
                  <br />
                  <sapn style={{ color: 'rgb(254,130,96)' }}>【审慎阅读】</sapn>您在申请注册流程中点击同意本协议之前，
                 应当认真阅读本协议。请您务必审慎阅读、充分理解各条款内容，
                 特别是免除或者限制责任的条款、法律适用和争议解决条款。
                 如您对协议有任何疑问，可向医护到家客服咨询。如您未满18周岁，
                 或以其他形式被限制民事行为能力，请在监护人的陪同下阅读本协议。
                <br />
                  <br />
                  <sapn style={{ color: 'rgb(254,130,96)' }}>【词汇定义】</sapn>本文中所用词汇定义如下：<br />
                  <br />CRC随心呼平台：指药明康德推出的移动医疗服务信息平台，为全国医生提供医助上门服务。<br />
                  <br />
                用户：指阅读并同意本协议内容，经过CRC随心呼平台注册程序成为使用CRC随心呼平台各项产品/服务的个人。（以下更多称为“您”）
                <br /><br />第一条 服务条款的确认和接纳<br />
                1.1本客户端的各项电子服务的所有权和运作权归医护到家所有。用户同意所有注册协议条款并完成注册程序，
                才能成为本客户端的正式用户。用户确认：本协议条款是处理双方权利义务的契约，
                始终有效，法律另有强制性规定或双方另有特别约定的，依其规
                </p>
              </WingBlank>
            </p>
          </div>

        </div>
      </div>

    );
  }

    }

function mapStateToProps(state) {
  const { info = {} } = state.Agreement || {};
  return {
    info,
  };
}

export default connect(mapStateToProps)(withRouter(Agreement));
