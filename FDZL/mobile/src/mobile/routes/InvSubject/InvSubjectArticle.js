import React from 'react';
import Helmet from 'react-helmet';
// import { Table } from 'antd';
import { connect } from 'dva';
import { WingBlank } from 'antd-mobile';
import moment from 'moment';
import styles from './InvSubject.less';
import Navigation from '../../components/MainLayout/Navigation';

const pageTitle = '研究课题';


class InvSubjectArticle extends React.Component {


  render() {
    const {
      // researchSubjectId,
      researchSubjectTitle,
      researchType,
      beginTime,
      endTime,
      researchStatus,
      // mainImgName,
      // mainImgUrl,
      malady,
      interveneMethod,
      sponsor,
      cro,
       reseacher,
      clinicalTrailStaging,
      // createTime,
      // modifyTime,
      htmlText,
     // hospital,
     // department,
     // mainResearcher,
      researchSiteList = [],
    } = this.props.atricleData || {};


    let status = '';
    if (researchStatus === 'PREPARING') {
      status = '准备中';
    } else if (researchStatus === 'INTO') {
      status = '入组中';
    } else if (researchStatus === 'IN') {
      status = '入组完成';
    } else if (researchStatus === 'COMPLETED') {
      status = '已完成';
    }

    let intervene = '';
    if (researchType === 'INTERVENTION') {
      intervene = '干预';
    } else if (researchType === 'NON-INTERVENTION') {
      intervene = '非干预';
    }

    let clinicalTrailStage = '';
    if (clinicalTrailStaging == '1') {
      clinicalTrailStage = 'Ⅰ期';
    } else if (clinicalTrailStaging == '2') {
      clinicalTrailStage = 'Ⅱ期';
    } else if (clinicalTrailStaging == '3') {
      clinicalTrailStage = 'Ⅲ期';
    } else if (clinicalTrailStaging == '4') {
      clinicalTrailStage = 'Ⅳ期';
    } else if (clinicalTrailStaging == '999') {
      clinicalTrailStage = '不适用';
    }


    return (
      <WingBlank size="sm">
        <div className="art_main">
          <Helmet>
            {/* <title>{researchSubjectTitle}</title> */}
            <title>{pageTitle}</title>
            <meta name="description" content={researchSubjectTitle} />
          </Helmet>
          <div
            style={{
              textAlign: 'center',
              marginTop: '10px',
              marginBottom: '10px',
            }}
          >
            <div
              style={{
                display: 'inline-block',
              }}
            >
              <span className="art_title">
                {researchSubjectTitle}
              </span>
            </div>
          </div>
          <div className="art_content">
            <p style={{ fontSize: 16, marginTop: 5 }}><b>基本信息：</b></p>
            <table border="0" width="100%" cellPadding="0" cellSpacing="0" className={styles.subject_table}>
              <tbody>
                <tr>
                  <th style={{ width: '25%', backgroundColor: 'rgb(245, 248, 255)' }}>适应症</th>
                  <th style={{ width: '25%' }}>{malady}</th>
                  <th style={{ width: '25%', backgroundColor: 'rgb(245, 248, 255)' }}>研究类型</th>
                  <th style={{ width: '25%' }}>{intervene}</th>
                </tr>
                <tr>
                  <td style={{ backgroundColor: 'rgb(245, 248, 255)' }}>干预手段</td>
                  <td>{interveneMethod}</td>
                  <td style={{ backgroundColor: 'rgb(245, 248, 255)' }}>临床试验分期</td>
                  <td>{clinicalTrailStage}</td>
                </tr>
                <tr>
                  <td style={{ backgroundColor: 'rgb(245, 248, 255)' }}>申办者</td>
                  <td>{sponsor}</td>
                  <td style={{ backgroundColor: 'rgb(245, 248, 255)' }}>CRO</td>
                  <td>{cro}</td>
                </tr>
                <tr>
                  <td style={{ backgroundColor: 'rgb(245, 248, 255)' }}>主要研究者</td>
                  <td>{reseacher}</td>

                  <td style={{ backgroundColor: 'rgb(245, 248, 255)' }}>研究状态</td>
                  <td>{status}</td>
                </tr>
                <tr>
                  <td style={{ backgroundColor: 'rgb(245, 248, 255)' }}>研究开始时间</td>
                  <td>{beginTime && moment(beginTime).format('YYYY-MM-DD')}</td>

                  <td style={{ backgroundColor: 'rgb(245, 248, 255)' }}>研究结束时间</td>
                  <td>{endTime && moment(endTime).format('YYYY-MM-DD')}</td>
                </tr>
              </tbody>
            </table>

          </div>
          <div className="art_content"style={{ marginTop: 15, width: '100%' }} >
            <p style={{ fontSize: 16, marginTop: 5 }}><b>研究方案：</b></p>
            <div
              className="dangerousHtml"
              dangerouslySetInnerHTML={{
                __html: htmlText,
              }}
            />

          </div>
          <div className={styles.researchCenter} >
            <p style={{ fontSize: 16, marginTop: 5 }}><b>研究中心：</b></p>
            <table border="0" width="100%" cellPadding="0" cellSpacing="0" className={styles.subject_table2}>
              <tbody>
                <tr>
                  <th style={{ width: '25%' }}><b>医院</b></th>
                  <th style={{ width: '25%' }}><b>科室</b></th>
                  <th style={{ width: '25%' }}><b>主要研究者</b></th>
                </tr>
                {
                  researchSiteList.map((value) => {
                    return (
                      <tr>
                        <td>{value.hospital}</td>
                        <td>{value.department}</td>
                        <td>{value.mainResearcher}</td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
        <Navigation />
      </WingBlank>
    );
  }

}

export default connect()(InvSubjectArticle);
