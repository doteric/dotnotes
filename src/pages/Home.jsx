import React, { Component } from 'react';
import './home.css';
const ipcRenderer = window.require('electron').ipcRenderer;
const Datastore = require('nedb');
let db = new Datastore({ filename: 'storage.db' });
db.loadDatabase(function (err) {
  console.log("Database loaded.");
});

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: []
    };

    this.newCategory = this.newCategory.bind(this);
    this.testNotif = this.testNotif.bind(this);
    this.openCat = this.openCat.bind(this);
    this.removeCat = this.removeCat.bind(this);
  }
  componentDidMount(event) {
    ipcRenderer.on('receiveCats', (event, docs) => {
      let categories = [];
      for (let i = 0; i < docs.length; i++) {
        categories.push({
          id: docs[i]._id,
          name: docs[i].catname,
          date: docs[i].date,
          notesCount: 3,
          alarmsCount: 1
        });
      }
      this.setState({categories: categories});
    });

    ipcRenderer.send('getCategories');
  }

  newCategory(event) {
    ipcRenderer.send('newCat');
  }
  testNotif(event) {
    ipcRenderer.send('testNotif');
  }
  openCat(catid) {
    ipcRenderer.send('openCategory', catid);
  }
  removeCat(catid, key) {
    let confirm = window.confirm("Are you sure you want to delete this category?");
    if (confirm) {
      ipcRenderer.send('removeCategory', catid);
      let categories = this.state.categories;
      categories.splice(key, 1);
      this.setState({categories: categories});
    }
  }

  render() {
    return (
      <div className="home">
        <div className="hcol stretch">
          <h3>Categories</h3>
          <div className="catlist">
          {
            this.state.categories.map((object, key) => {
              return (
                <div className="catbox">
                  <div className="catcol">
                    <div className="catname">{object.name}</div>
                    <div className="catdate">{object.date}</div>
                  </div>
                  <div className="colright">
                    <div className="catcol">
                      <div className="catoption" onClick={() => this.openCat(object.id)}><i class="far fa-folder-open"></i></div>
                    </div>
                    <div className="catcol">
                      <div className="catoption catremove" onClick={() => this.removeCat(object.id, key)}><i class="far fa-trash-alt"></i></div>
                    </div>
                    <div className="catcol">
                      <div className="catcount"><i class="far fa-sticky-note"></i> {object.notesCount}</div>
                      <div className="catcount"><i class="far fa-clock"></i> {object.alarmsCount}</div>
                    </div>
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
