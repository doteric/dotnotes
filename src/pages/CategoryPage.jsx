import React, { Component } from 'react'
import './catcreation.css';
const ipcRenderer = window.require('electron').ipcRenderer;

export default class CategoryPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h2>{this.props.match.params.catid}</h2>
      </div>
    )
  }
}
