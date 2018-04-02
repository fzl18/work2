 import 'babel-polyfill';
// import 'es6-shim';
 import dva from 'dva';
// import './index.css';
 import { Toast } from 'antd-mobile';
 import createLoading from 'dva-loading';
 import { createLogger } from 'redux-logger';
 import createHistory from 'history/createBrowserHistory';
// import 'antd-mobile/dist/antd-mobile.less';
// import undoable from 'redux-undo';

// 1. Initialize
 const app = dva({
   history: createHistory(), // @todo
   onError(e) {
     Toast.info(e.message, 2);
    // message.error(e.message, /* duration */3);//全局错误状态处理
   },
   onAction: createLogger(), // log中间件
  // onReducer: reducer => {
  //     return (state, action) => {
  //     const undoOpts = {};
  //     const newState = undoable(reducer, undoOpts)(state, action);
  //     // 由于 dva 同步了 routing 数据，所以需要把这部分还原
  //     return { ...newState, routing: newState.present.routing };
  //     },
  // } //封装 reducer 执行。比如借助 redux-undo 实现 redo/undo ：
 });

 app.model(require('./models/users'));

// 2. Plugins
 app.use(createLoading());

// 3. Model
// app.model(require('./models/example'));

// 4. Router
 app.router(require('./mobileRouter'));

// 5. Start
 app.start('#root');
