import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import styles from './Order.less';

const pageTitle = '服务计费说明';

class ServicePrice extends React.Component {
  state={
    fields: {
      projectTitle: {
        value: 'benjycui',
      },
    },
  }

  render() {
    return (
      <div location={location}>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>

        <div className={styles.ServicePrice}>
            1、各项授权工作的收费按小时计费，不同项目不同服务资质不同服务城市，收费标准不同：<br />
            A、I-III期注册临床试验项目
            <br />
            1）半年及以上临床试验经验：北上广南京杭州，每小时200元；其他城市，每小时160元；<br />
            2）半年以下临床试验经验：北上广南京杭州，每小时160元；其他城市，每小时130元；
            <br />
            B、医生发起的研究项目及其他<br />
            1）半年及以上临床试验经验：北上广南京杭州，每小时150元；其他城市，每小时120元；<br />
            2）半年以下临床试验经验：北上广南京杭州，每小时120元；其他城市，每小时100元；
            <br />
          <br />
            2、为保障订单安全合规，下单需要先支付一定比例的保证金，完成支付后保证金将全部返还；<br />
            A、给自己下单，保证金比例20%；<br />
            B、给他人下单，保证金比例100%；
        </div>

      </div>
    );
  }

    }

export default connect()(withRouter(ServicePrice));
