import React, { Component } from 'react';
class WordList extends Component {
  constructor(){
    super();
    this.createList = this.createList.bind(this);
  }
  createList(wordBlock){
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
    return (
      <div className="word-block-container" key={`word-${wordBlock.id}`}>
        <div className="word-block"> 
          <div className="word-title" style={colorStyle}>
            {wordBlock.word}
          </div>
          <div className="word-difficulty">
            {starString} {starAverage}/5
          </div>
          <div className="word-meaning">
            {wordBlock.meaning}
          </div>
        </div>
      </div>
    )
  }

  render() {
    let listArr = this.props.words;
    var listArrRender = listArr.map(this.createList);
    return (
        <div className="wordList">
          {listArrRender}
        </div>
    );
  }
}

export default WordList;