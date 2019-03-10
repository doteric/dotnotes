import React, { Component } from 'react';
import './catcreation.css';
const ipcRenderer = window.require('electron').ipcRenderer;

export default class CategoryCreation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      catname: ""
    }

    this.handleChange = this.handleChange.bind(this);
    this.addCategory = this.addCategory.bind(this);
  }
  
  handleChange(event) {
    this.setState({catname: event.target.value});
  }
  addCategory(event) {
    ipcRenderer.send('addCategory', this.state.catname);
  }

  render() {
    return (
      <div className="catcreation">
        <div className="inputrow">
          <p>Category name</p>
          <input type="text" value={this.state.catname} onChange={this.handleChange}/>
        </div>
        <div className="inputrow">
          <button onClick={this.addCategory}>+</button>
        </div>
      </div>
    )
  }
}
