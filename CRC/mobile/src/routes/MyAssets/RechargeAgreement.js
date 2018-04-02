import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import { WingBlank } from 'antd-mobile';
import styles from './Recharge.less';

const pageTitle = '充值协议';
class RechargeAgreement extends React.Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
          {/* <style type="text/css">{`
                #root{
                  background-color: white;
                }
            `}</style> */}
        </Helmet>
        <div className={styles.Description}>
          <p style={{ marginTop: 15, lineHeight: 1.5, paddingBottom: 20, backgroundColor: 'white', paddingTop: 15 }}>
            <span style={{ textAlign: 'left', paddingLeft: 15, paddingRight: 15 }}> 欢迎您使用CRC随心呼平台及服务！</span><br /><br />
            <WingBlank>
              <span style={{ paddingLeft: 15, paddingRight: 15 }}>
            为使用CRC随心呼平台及服务，您应当阅读并遵守CRC随心呼平台《充值协议》
（以下简称“本协议”），为保障您的合法权益，请您在充值前务必审慎阅读、
充分理解各条款内容，特别是免除或者限制本公司责任的条款，以及相关业
务规则说明，限制、免责条款可能以加粗形式提示您注意。<br /><br />
                <span style={{ paddingLeft: 15, paddingRight: 15 }}>当您在充值页面
继续点击“立即充值”按钮，即视为您已阅读、理解本协议，并同意按本协议
规定执行，本协议的内容对您具有法律约束力。</span><br /><br />
                <span style={{ paddingLeft: 15, paddingRight: 15 }}>
如果您未满18周岁，请在法
定监护人的陪同下阅读本协议所有条款，并特别注意未成年人使用条款。
您同意并认可，药明康德有权随时对本协议内容进行单方面的变更，并以在
CRC随心呼平台《充值协议》公告的方式予以公布，无需另行单独通知您；若
您在本条款内容公告变更后继续使用本服务，即表示您已充分阅读、理解并接
受修改后的条款内容，也将遵循修改后的条款内容使用本服务；若您不同意修
改后的条款内容，您有权停止使用本服务。</span><br /><br />
1 账户说明<br />
                <span style={{ paddingLeft: 15, paddingRight: 15 }}>
           1.1 余额账户：即您在CRC随心呼平台账户中的“余额”，余额通过充值方
式获得；您可以使用CRC随心呼平台中的“余额”在本软件平台已接入的业务中进
行消费，</span>
              </span>
            </WingBlank>
          </p>
        </div>

      </div>
    );
  }

    }


function mapStateToProps(state) {
  const { info = {} } = state.PersonalInfo || {};
  return {
    loading: state.loading,
    info,
  };
}

export default connect(mapStateToProps)(withRouter(RechargeAgreement));
