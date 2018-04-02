import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { queryCrfById } from '../../constants';

class TestCrf extends React.Component {
  static propTypes = {
        // match: PropTypes.object.isRequired, location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    crfNodes: '',
  }

  componentDidMount() {
    const { datas } = queryCrfById;
    let crfNodes = '';
    const getNode = (arrMap) => {
      arrMap.map((val) => {
        if (val.moduleDefineType === 'DIR' && val.moduleDefineIsDatas === '0') {
          // 当类型为DIR，递归
          getNode(val.children);
        } else if (val.moduleDefineType === 'LEAF') {
          const type = val.projectDefine.projectDefineWebType;
          let classStyle = '';
          if (type == 'SELECT') {
            classStyle = 'input-select';
          } else if (type == 'TEXTAREA') {
            classStyle = 'input-textarea';
          } else if (type == 'DATETIMEPICKER') {
            classStyle = 'input-time';
          } else {
            classStyle = 'input-text';
          }
          crfNodes += window.angularFunctionInput(val, classStyle, -1);
        } else if (val.moduleDefineType === 'DIR' && val.moduleDefineIsDatas == '1') {
          // 指标组中有表格 @todo
        }
      });
    };
    if (datas) {
      // 当crf不是table的时候
      if (datas[0] && datas[0].moduleDefineIsDatas == '0') {
        getNode(datas[0].children);
        this.setState({
          crfNodes: null,
        }, function () {
          this.setState({
            crfNodes,
          });
        });
      } else if (datas[0] && datas[0].moduleDefineIsDatas == '1' && datas[0].moduleDefineType == 'DIR') {
        // 当crf是table的时候
      }
      if (window.angular.element(document.querySelector('body')).injector()) {
        // window.angular.element(document.querySelector('body')).injector().invoke(($compile) => {
        //   console.log(window.angular.element(document.body));
        //   const scope = window.angular.element(document.body).scope();
        //   $compile(document.body)(scope);
        // });
        // location.reload();
      }
    }
  }

  render() {
    const { crfNodes } = this.state;
    // const crfNode = (<div
    //   is
    //   ng-model="INDICATOR_118_3T"
    //   classNameNoUse="ng-pristine ng-untouched ng-valid ng-empty"
    // >
    //   <div
    //     is
    //     classNameNoUse="crf-control-line fold-padding ng-pristine ng-untouched ng-valid ng-empty"
    //     ng-model="INDICATOR_118_6T"
    //   >
    //     <label classNameNoUse="crf-control-label">饮酒强度</label>
    //     <div classNameNoUse="crf-control-right">
    //       <span classNameNoUse="crf-right-left crf-width-whole">
    //         <span classNameNoUse="crf-right-lefttxt">
    //           <input
    //             is
    //             classNameNoUse="input-number ng-valid ng-dirty ng-empty ng-touched"
    //             my-max-number=""
    //             type="text"
    //             ng-model="INDICATOR_118_6T"
    //             is-datas="0"
    //             my-type="NUMBER"
    //             my-data-format="9999.99"
    //             step="0.01"
    //           />
    //           <span classNameNoUse="crf-control-unit">毫升/天</span>
    //         </span>
    //         <div classNameNoUse="number-tips">
    //           <span is classNameNoUse="number-tips-txt ng-binding"
    // ng-bind="INDICATOR_118_6TErrorMsg" />
    //         </div>
    //       </span>
    //     </div>
    //   </div>
    //   <div
    //     is
    //     classNameNoUse="crf-control-line fold-padding
    // ng-pristine ng-untouched ng-valid ng-not-empty"
    //     ng-model="INDICATOR_118_7T"
    //   >
    //     <label classNameNoUse="crf-control-label">常饮酒为</label>
    //     <div classNameNoUse="crf-control-right">
    //       <span classNameNoUse="crf-right-left crf-width-whole">
    //         <span classNameNoUse="crf-right-lefttxt">
    //           <div
    //             is
    //             type="checkbox"
    //             classNameNoUse="btn-choicecircle ng-pristine ng-untouched ng-valid ng-not-empty"
    //             ng-model="INDICATOR_118_7T"
    //             my-choose-checkbox="白酒//蒸酒//啤酒//米酒//果酒"
    //             my-filter={'{\'filters\':[{\'cond\':\'INDICATOR_118_6T > 10\',
    // \'reference\':[{\'isInSameGroup\':1,\'value\':\'INDICATOR_118_6T\'}],
    // \'value\':\'啤酒//米酒//果酒\'},{\'cond\':\'INDICATOR_118_6T < 8\',
    // \'reference\':[{\'isInSameGroup\':1,\'value\':\'INDICATOR_118_6T\'}]
    // ,\'value\':\'白酒//蒸酒\'}]}'}
    //             is-datas="0"
    //             filter-show-type="HIDE"
    //           >
    //             <p classNameNoUse="btn-choicebox">
    //               <input
    //                 is
    //                 type="checkbox"
    //                 is_datas="0"
    //                 my-checkbox="INDICATOR_118_7T"
    //                 current-data-value="白酒"
    //                 data-ng-value="0"
    //                 row-num="1"
    //                 value="0"
    //               />
    //               <label classNameNoUse="btn-choicetxt">白酒</label>
    //             </p>
    //             <p classNameNoUse="btn-choicebox">
    //               <input
    //                 is
    //                 type="checkbox"
    //                 is_datas="0"
    //                 my-checkbox="INDICATOR_118_7T"
    //                 current-data-value="蒸酒"
    //                 data-ng-value="1"
    //                 row-num="1"
    //                 value="1"
    //               />
    //               <label classNameNoUse="btn-choicetxt">蒸酒</label>
    //             </p>
    //             <p classNameNoUse="btn-choicebox">
    //               <input
    //                 is
    //                 type="checkbox"
    //                 is_datas="0"
    //                 my-checkbox="INDICATOR_118_7T"
    //                 current-data-value="啤酒"
    //                 data-ng-value="2"
    //                 row-num="1"
    //                 value="2"
    //               />
    //               <label classNameNoUse="btn-choicetxt">啤酒</label>
    //             </p>
    //             <p classNameNoUse="btn-choicebox">
    //               <input
    //                 is
    //                 type="checkbox"
    //                 is_datas="0"
    //                 my-checkbox="INDICATOR_118_7T"
    //                 current-data-value="米酒"
    //                 data-ng-value="3"
    //                 row-num="1"
    //                 value="3"
    //               />
    //               <label classNameNoUse="btn-choicetxt">米酒</label>
    //             </p>
    //             <p classNameNoUse="btn-choicebox">
    //               <input
    //                 is
    //                 type="checkbox"
    //                 is_datas="0"
    //                 my-checkbox="INDICATOR_118_7T"
    //                 current-data-value="果酒"
    //                 data-ng-value="4"
    //                 row-num="1"
    //                 value="4"
    //               />
    //               <label classNameNoUse="btn-choicetxt">果酒</label>
    //             </p>
    //           </div>
    //         </span>
    //         <div classNameNoUse="number-tips">
    //           <span is classNameNoUse="number-tips-t
    // xt ng-binding" ng-bind="INDICATOR_118_7TErrorMsg" />
    //         </div>
    //       </span>
    //     </div>
    //   </div>
    // </div>);
    return (
      <div dangerouslySetInnerHTML={{ __html: crfNodes }} />
    );
  }
}
TestCrf.PropTypes = { list: PropTypes.array,
  config: PropTypes.object,
};


export default withRouter(TestCrf);
