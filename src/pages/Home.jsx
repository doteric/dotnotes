import React, { Component } from 'react';
import './home.css';
const ipcRenderer = window.require('electron').ipcRenderer;

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.testNotif = this.testNotif.bind(this);
  }

  newCategory(event) {
    ipcRenderer.send('newCat');
  }
  testNotif(event) {
    ipcRenderer.send('testNotif');
  }

  render() {
    let categories = [
      {name: "Test", date:"10.10.2010", notesCount:3, alarmsCount:1},
      {name: "Somenote", date:"10.10.2010", notesCount:5, alarmsCount:2},
      {name: "Cool note", date:"10.10.2010", notesCount:1, alarmsCount:0}
    ];
    return (
      <div className="home">
        <div className="hcol stretch">
          <h3>Categories</h3>
          <div className="catlist">
          {
            categories.map(function(object, i) {
              return (
                <div className="catbox">
                  <div className="catcol">
                    <div className="catname">{object.name}</div>
                    <div className="catdate">{object.date}</div>
                  </div>
                  <div className="catcol">
                    <div className="catcount"><i class="far fa-sticky-note"></i> {object.notesCount}</div>
                    <div className="catcount"><i class="far fa-clock"></i> {object.alarmsCount}</div>
                  </div>
                </div>
              )
            })
          }
          </div>
        </div>
        <div className="hcol">
          <div className="actionlist">
            <div className="actionbox" onClick={this.newCategory}>
              <i class="fas fa-plus"></i>
            </div>
            <div className="actionbox">
              <i class="fas fa-edit"></i>
            </div>
            <div className="actionbox">
              <i class="fas fa-plus"></i>
              <i class="far fa-sticky-note tiny"></i>
            </div>
            <div className="actionbox" onClick={this.testNotif}>
              <i class="fas fa-plus"></i>
              <i class="far fa-clock tiny"></i>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
