import React, {Component} from 'react';
import Doctors from './Doctors';

export default class Assistants extends Component {
  render() {    
    return (
      <Doctors assistants={true}/>
    );
  }
}
