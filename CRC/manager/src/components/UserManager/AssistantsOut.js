import React, {Component} from 'react';
import Assistants from './Assistants';

export default class AssistantsOut extends Component {
  render() {    
    return (
      <Assistants isout={true}/>
    );
  }
}
