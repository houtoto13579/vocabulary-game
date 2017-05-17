import React, { Component } from 'react';
import './canvas.css';
import SweetAlert from 'react-bootstrap-sweetalert';
class Fight extends Component {
  constructor(){
    super();
    this.createList = this.createList.bind(this);
    this.state={
      fighter: [],
      youHit: 0,
      win: false,
      BossHP: 1000,
      words: [],
      alert: null,
      listArrRender: null
    }
    this.rightAns=this.rightAns.bind(this);
    this.wrongAns=this.wrongAns.bind(this);
    this.hideAlert=this.hideAlert.bind(this);
    this.randomList=this.randomList.bind(this);
  }
  rightAns(starAverage){
    console.log('correct!')
    fetch(`${this.props.weburl}fighter/`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.props.id,
        hit: starAverage*20
      }),
    }).then(function(res){
       return res.json();
    }).then
    (resObj=>{
      resObj = resObj;
      if(resObj.win===true){
        this.setState({
          fighter: resObj.fighter,
          BossHP: resObj.BossHP,
          youHit: resObj.youHit,
          win: resObj.win,
          alert:(<SweetAlert
            success
            title="You kill the BOSS!"
            onConfirm={this.hideAlert}
          >
          <div className="container"><div className="hellboy"></div></div>
          </SweetAlert>)
        })
      }
      else{
        console.log(resObj)
        this.setState({
          fighter: resObj.fighter,
          BossHP: resObj.BossHP,
          youHit: resObj.youHit,
          win: resObj.win,
          alert:(<SweetAlert
            success
            title="Nice Hit"
            text={<div className="container"><div className="hellboy"></div></div>}
            onConfirm={this.hideAlert}
          >
          <h4>You dealt: {starAverage*20}</h4>
          <h5>Left: {this.state.BossHP}</h5>
          <div className="container"><div className="hellboy"></div></div></SweetAlert>)
        })
      }
    });
  }
  wrongAns(){
    console.log('wrong!')
    this.setState({
        alert:(<SweetAlert
          error
          title="Wrong!HaHa!!"
          text={<div className="container"><div className="hellboy"></div></div>}
          onConfirm={this.hideAlert}
        ><div className="container"><div className="hellboy"></div></div></SweetAlert>)
    })
  }
  hideAlert(){
		this.setState({
			alert: null
	  });
    let listArr = this.props.words;
    let listArrRender= this.randomList(listArr);
    this.setState({
      listArrRender: listArrRender,
    });
  }
  createList(wordBlock,wrongBlock){
    function shuffle(a) {
      var j, x, i;
      for (i = a.length; i; i--) {
          j = Math.floor(Math.random() * i);
          x = a[i - 1];
          a[i - 1] = a[j];
          a[j] = x;
      }
    }
    let starArray = wordBlock.stars;
    let starCount = starArray[0]+starArray[1]+starArray[2]+starArray[3]+starArray[4];
    let starSum = starArray[0]*1+starArray[1]*2+starArray[2]*3+starArray[3]*4+starArray[4]*5;
    let starAverage = Math.round(starSum/starCount*10)/10;
    let starString = "";
    var star = '\u2605';
    var white_star = '\u2606';
    for(let i=1; i<=5; i++){
      if(i<=Math.round(starAverage))
        starString+=star;
      else
        starString+=white_star;
    }
    var colorPick;
    switch(Math.round(starAverage)){
      case 1:
        colorPick='#58B2DC';
        break;
      case 2:
        colorPick='#90B44B';
        break;
      case 3:
        colorPick='#F9BF45';
        break;
      case 4:
        colorPick='#E3916E';
        break;
      case 5:
      default:
        colorPick='#CB4042';
        break;
    }
    var colorStyle={
      backgroundColor: colorPick
    }
    var answer = [];
    var a = (
      <div className="word-meaning-fight" onClick={()=>this.rightAns(Math.round(starAverage))}>
        {wordBlock.meaning}
      </div>
    )
    var b = (
      <div className="word-meaning-fight" onClick={this.wrongAns}>
        {wrongBlock.meaning}
      </div>
    )
    answer.push(a);
    answer.push(b);
    shuffle(answer);
    return (
      <div className="word-block-container" key={`word-${wordBlock.id}`}>
        <div className="word-block"> 
          <div className="word-title" style={colorStyle}>
            {wordBlock.word}
          </div>
          <div className="word-difficulty">
            {starString} {starAverage}/5
          </div>
          {answer[0]}
          {answer[1]}
        </div>
      </div>
    )
  }
  getList(){
    function checkStatus(response) {
      if (response.status >= 200 && response.status < 300) {
        return response;
      } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    }
    fetch(`${this.props.weburl}words/`)
      .then(checkStatus)
      .then(response=>response.json())
      .then(resObj=>{
        let serverWords = resObj.words.reverse();
        let wordCount = resObj.wordsCount;
        this.setState({
          words: serverWords,
          wordsCount: wordCount
        })
      })
      .catch(error=>{
        console.log('get list fail...')
        console.log(error);
      })
  }
  componentDidMount(){
    let listArr = this.props.words;
    let listArrRender= this.randomList(listArr);
    this.setState({
      listArrRender: listArrRender,
    });
  }
  randomList(listArr){
    let target;
    let wrong;
    var listArrRender;
    var arr = [];
    if(listArr.length> 2){
      while(arr.length < 2){
        var randomnumber = Math.floor(Math.random()*listArr.length)
        if(arr.indexOf(randomnumber) > -1) continue;
        arr[arr.length] = randomnumber;
        target = listArr[arr[0]];
        wrong = listArr[arr[1]];
      }
      listArrRender = this.createList(target, wrong);
    }
    else{
      target=null;
      wrong=null;
      listArrRender=null;
    }
    return listArrRender;
  }
  render() {

    return (
        <div className="wordList">
          <div>You have hit: {this.state.youHit}</div>
          {this.state.listArrRender}
          {this.state.alert}
        </div>
    );
  }
}

export default Fight;