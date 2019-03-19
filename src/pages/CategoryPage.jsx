import React, { Component } from 'react'
import './catpage.css';
const ipcRenderer = window.require('electron').ipcRenderer;

export default class CategoryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      catnmame: "xxx",
      date: "xx.xx.xxxx"
    }
  }
  componentDidMount() {
    ipcRenderer.on('receiveCategory', (event, docs) => {
      console.log(docs);
      this.setState({
        catname: docs.catname,
        date: docs.date
      })
    });

    let catid = this.props.match.params.catid;
    ipcRenderer.send('getCategory', catid);
  }

  render() {
    return (
      <div className="catpage">
        <div className="topbar">
          <div className="catinfo">{this.state.catname} ({this.state.date})</div>
          <div className="catoptions">
            <div className="actionbox">
              <i class="fas fa-plus"></i>
              <i class="far fa-sticky-note tiny"></i>
            </div>
            <div className="actionbox">
              <i class="fas fa-plus"></i>
              <i class="far fa-clock tiny"></i>
            </div>
          </div>
        </div>
        <div className="catnotes">
          <div className="notebox">
            <div className="notetop">
              <div className="notetitle">Title</div>
              <div className="noteoptions">
                <div className="noteaction"><i class="far fa-window-minimize"></i></div>
                <div className="noteaction noteremove"><i class="far fa-trash-alt"></i></div>
              </div>
            </div>
            <div className="notecontent">This is some example random text that has been saved and can be modified at any time. Just a bit longer note.</div>
          </div>
        </div>
      </div>
    )
  }
}
