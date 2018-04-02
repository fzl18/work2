import React, {Component} from 'react';
import Doctors from './Doctors';

export default class NoDoctors extends Component {
  render() {    
    return (
      <Doctors assistants={true}/>
    );
  }
}
