import React, { Component } from 'react'
import './catpage.css';
const ipcRenderer = window.require('electron').ipcRenderer;

export default class CategoryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      catid: this.props.match.params.catid,
      catnmame: "xxx",
      date: "xx.xx.xxxx",
      notes: []
    }

    this.addNote = this.addNote.bind(this);
    this.removeNote = this.removeNote.bind(this);
    this.editNoteTitle = this.editNoteTitle.bind(this);
    this.changeNoteTitle = this.changeNoteTitle.bind(this);
    this.confirmNoteTitle = this.confirmNoteTitle.bind(this);
    this.editNoteContent = this.editNoteContent.bind(this);
    this.changeNoteContent = this.changeNoteContent.bind(this);
    this.confirmNoteContent = this.confirmNoteContent.bind(this);
  }
  componentDidMount() {
    ipcRenderer.on('receiveCategory', (event, docs) => {
      console.log(docs);
      this.setState({
        catname: docs.catname,
        date: docs.date,
        notes: docs.notes
      })
    });

    ipcRenderer.send('getCategory', this.state.catid);
  }

  addNote() {
    let notes = this.state.notes;
    notes.push({title:"New note", content:"Content of new note."});
    this.setState({notes});
    ipcRenderer.send('addNote', this.state.catid);
  }
  removeNote(notekey) {
    let notes = this.state.notes;
    notes.splice(notekey, 1);
    this.setState({notes});
    ipcRenderer.send('removeNote', this.state.catid, notekey);
  }
  editNoteTitle(note) {
    note.editingTitle = true;
    let notes = this.state.notes;
    this.setState({notes});
  }
  changeNoteTitle(event, note) {
    note.title = event.target.value;
    let notes = this.state.notes;
    this.setState({notes});
  }
  confirmNoteTitle(event, note, notekey) {
    if (note.title != "") {
      note.editingTitle = false;
      let notes = this.state.notes;
      this.setState({notes});
      ipcRenderer.send('updateNoteTitle', this.state.catid, notekey, note.title);
    }
  }
  editNoteContent(note) {
    note.editingContent = true;
    let notes = this.state.notes;
    this.setState({notes});
  }
  changeNoteContent(event, note) {
    note.content = event.target.value;
    let notes = this.state.notes;
    this.setState({notes});
  }
  confirmNoteContent(event, note, notekey) {
    if (note.content != "") {
      note.editingContent = false;
      let notes = this.state.notes;
      this.setState({notes});
      ipcRenderer.send('updateNoteContent', this.state.catid, notekey, note.content);
    }
  }

  render() {
    return (
      <div className="catpage">
        <div className="topbar">
          <div className="catinfo">{this.state.catname} ({this.state.date})</div>
          <div className="catoptions">
            <div className="actionbox" onClick={this.addNote}>
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
          {
            this.state.notes.map((object, key) => {
              return (
                <div className="notebox" key={key}>
                  <div className="notetop">
                    <div className="notetitle" onClick={() => this.editNoteTitle(object)}>
                      <p class={object.editingTitle ? "hidden" : ""}>{object.title}</p>
                      <input type="text" class={object.editingTitle ? "" : "hidden"} value={object.title} onChange={(event) => this.changeNoteTitle(event,object)} onBlur={(event) => this.confirmNoteTitle(event,object,key)} />
                    </div>
                    <div className="noteoptions">
                      <div className="noteaction"><i class="far fa-window-minimize"></i></div>
                      <div className="noteaction noteremove" onClick={() => this.removeNote(key)}><i class="far fa-trash-alt"></i></div>
                    </div>
                  </div>
                  <div className="notecontent" onClick={() => this.editNoteContent(object)}>
                    <p className={object.editingContent ? "hidden" : ""}>{object.content}</p>
                    <textarea className={object.editingContent ? "" : "hidden"} value={object.content} onChange={(event) => this.changeNoteContent(event,object)} onBlur={(event) => this.confirmNoteContent(event,object,key)}></textarea>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}
