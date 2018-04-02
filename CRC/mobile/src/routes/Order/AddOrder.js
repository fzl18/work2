import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import { createForm } from 'rc-form';
import { Modal } from 'antd-mobile';
import styles from './Order.less';
import OrderLayout from '../../components/OrderLayout/OrderLayout';
import AddOrderForm from './AddOrderForm';

const pageTitle = '我要下单';

const AddOrderFormWrap = createForm(
  {
    onFieldsChange(props, changedFields) {
      props.onChange(changedFields);
      if (changedFields.projectTitle) {
        // props.dispatch({
        //   type: 'Order/queryProjectTitle',
        //   payload: {
        //     projectTitle: changedFields.projectTitle.value,
        //   },
        // });
      }
    },
    mapPropsToFields(props) {
      return {
        ...props,
      };
    },
    onValuesChange(_, values) {
      console.log(values);
    },
  },
)(AddOrderForm);

const alert = Modal.alert;
const { role } = sessionStorage;
class AddOrder extends React.Component {
  state={
    fields: {
      projectTitle: {
        value: 'benjycui',
      },
    },
    pageSubTitle: '',
  }
  componentDidMount() {
    if ((!sessionStorage.acctId) || (role == 'INSIDE_ASSISTANT')) {
      return;
    }
    this.props.dispatch({ type: 'Register/NowAuditStatus',
      payload: {},
      callback: (response) => {
        if (response.success && response.success.auditStatus == 'no_audit') {
          this.props.history.push('/Register/RegisterNext');
          return;
        }
        if ((response.success && response.success.auditStatus == 'audit_pending') || (response.success && response.success.auditStatus == 'audit_failed')) {
          alert((<span>很抱歉</span>), <div style={{ textAlign: 'left' }} ><span style={{ color: '#333e4d', textAlign: 'left' }}>您的信息还未通过审核，此栏目还无法浏览</span></div>,
            [{ text: (<span style={{ color: '#f5a282' }}>好的</span>),
              onPress: () => {
                this.props.history.push('/PersonalInfo');
              } },
            ]);
        }
      },
    });
  }

  getSubTitle=(value) => {
    this.setState({
      pageSubTitle: value,
    });
  }
  handleFormChange = (changedFields) => {
    this.setState({
      fields: { ...this.state.fields, ...changedFields },
    });
    this.props.dispatch({ type: 'Order/keepOrderFormFields',
      payload: {
        data: changedFields,
      } });
  }

  render() {
    const { OrderFormFields, dispatch } = this.props;
    return (
      <OrderLayout location={location}>
        <Helmet>
          <title>{this.state.pageSubTitle == '' ? pageTitle : this.state.pageSubTitle}</title>
          <meta name="description" content={pageTitle} />
        </Helmet>

        <div>
          <div className={styles.AddOrder}>
            <AddOrderFormWrap
              getSubTitle={value => this.getSubTitle(value)}
              dispatch={dispatch}
              props={this.props} {...OrderFormFields} onChange={this.handleFormChange}

            />
          </div>
        </div>

      </OrderLayout>
    );
  }

    }

function mapStateToProps(state) {
  const { jobType = [], projectType = [],
    staffType = [], CommonPlace = [], RuleServicePrice, OrderFormFields }
  = state.Order || {};
  return {
    jobType,
    projectType,
    staffType,
    CommonPlace,
    RuleServicePrice,
    OrderFormFields,
  };
}

export default connect(mapStateToProps)(withRouter(AddOrder));
