import React, { Component } from 'react';
import './App.css';
import WordList from './List.js';
import Fight from './Fight.js';
import SweetAlert from 'react-bootstrap-sweetalert';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';

class App extends Component {
  constructor(){
    super();
    this.state={
      wordsCount: 0,
      words: [],
      inputName: "Tomska",
      nameEditable: false,
      inputWord: "",
      inputMeaning: "",
      show: false,
      alert: null,
    }
    this.weburl="http://127.0.0.1:3001/";
    this.getAllList=this.getAllList.bind(this);
    this.addWord=this.addWord.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
    this.onRecieveWord = this.onRecieveWord.bind(this);
    this.onRecieveMeaning = this.onRecieveMeaning.bind(this);
    this.refreshCount = this.refreshCount.bind(this);
  }
  componentDidMount(){
    this.getAllList();
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    this.refreshCount();
    this.setState({
      inputName: S4(),
    });
  }
  refreshCount(){
    function checkStatus(response) {
      if (response.status >= 200 && response.status < 300) {
        return response;
      } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    }
    fetch(`${this.weburl}wordsCount/`)
      .then(checkStatus)
      .then(response=>response.json())
      .then(resObj=>{
        let serverWordsCount = resObj;
        this.setState({
          wordsCount: serverWordsCount,
        })
      })
      .catch(error=>{
        console.log('get count fail...')
        console.log(error);
      })
  }
  getAllList(){
    function checkStatus(response) {
      if (response.status >= 200 && response.status < 300) {
        return response;
      } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    }
    fetch(`${this.weburl}words/`)
      .then(checkStatus)
      .then(response=>response.json())
      .then(resObj=>{
        let serverWords = resObj.words.reverse();
        this.setState({
          words: serverWords,
        })
      })
      .catch(error=>{
        console.log('get list fail...')
        console.log(error);
      })
  }
  addWord(){
    this.setState({
    alert:(<SweetAlert
          input
          showCancel
          title="Enter word"
          required
          validationMsg="You must enter your word!"
          onConfirm={this.onRecieveWord}
          onCancel={this.hideAlert}
      />)
    });
  }
  hideAlert(){
		this.setState({
			alert: null
	  });
  }
  onRecieveWord(value){
    this.setState({
      inputWord: value,
      alert:(<SweetAlert
          input
          showCancel
          title="Enter Definition"
          required
          validationMsg="You must enter definition!"
          onConfirm={this.onRecieveMeaning}
          onCancel={this.hideAlert}
      >{value}</SweetAlert>)
    })
  }
  onRecieveMeaning(value){
    this.setState({
      inputMeaning: value,
      alert:(<SweetAlert
          success
          title="Finished!"
          onConfirm={this.hideAlert}
      ></SweetAlert>)
    },this.postWord.bind(this))   
  }
  onRecieveDifficulty(value){
    this.setState({
      alert:(<SweetAlert
          success
          title="Finished!"
          onConfirm={this.hideAlert}
      ></SweetAlert>)
    },this.postWord.bind(this))   
  }
  postWord(){
    let starArr = [1,0,0,0,0];
    fetch(`${this.weburl}word`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        word: this.state.inputWord,
        meaning: this.state.inputMeaning,
        stars: starArr
      }),
    });
  }
  fight(){

  }
  render() {
    let isEditable;
    if(this.state.nameEditable===true)
      isEditable='editable'
    else
      isEditable='readonly';
    let inputNameClasses = `inputName ${isEditable}`;
    return (
      <div className="App">
        <div className="header">
          <div>You are: </div>
          <input className={inputNameClasses}
            value={this.state.inputName}
            onChange={
              (e)=>{this.setState({inputName: e.target.value})
            }}
            onKeyPress={
                  (e)=>{
                  let key= e.keyCode || e.which;
                  if(key===13){
                    this.setState({nameEditable: !this.state.nameEditable})
                  }}
            }
            disabled={(this.state.nameEditable)? "" : "disabled"}
          ></input>
          <div className="changeName"
            onClick={()=>{
              this.setState({nameEditable: !this.state.nameEditable})
            }}
          >(change)</div>
        </div>
        <h1>一起背單字</h1>
        <h3>There are {this.state.wordsCount} words on this website</h3>
        {this.state.alert}
        <BrowserRouter>
          <div>
            <div className="button-area-router">
              <Link to="/fight">
                <button className="redButton" onClick={this.fight}>Fight</button>
              </Link>
              <Link to="/">
                <button className="blueButton" onClick={this.fight}>WordList</button>
              </Link>
            </div>
            <Switch>
              <Route exact path="/" 
                render={(props)=>(
                  <div>
                    <div className="button-area">
                      <button className="greenButton" onClick={this.getAllList}>show me all</button>
                      <button className="greenButton" onClick={this.addWord}>Add</button>
                    </div>
                    <WordList words={this.state.words}></WordList>
                  </div>
                  )}/>
              <Route exact path="/fight"
                render={(props=>(
                  <Fight words={this.state.words} weburl={this.weburl} id={this.state.inputName}></Fight>
                ))}
              />
            </Switch>
          </div>
        </BrowserRouter>
        <div className='footer'>
        </div>                
      </div>
    );
  }
}

export default App;
