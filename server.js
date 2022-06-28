const express = require( 'express');
const app = express();

const nlp = require('compromise');

app.use(express.urlencoded());

app.post('/summarized', (req, res) => {
  let text = req.body.input;
  let result = '<h3>The Summary is</h3>' + summarize(text);
  let original = '</br><h3> Your Original Input Was: </h3></br>' + text;
  res.send(result + original);
});

app.listen(8080, () => {
  console.log(`Server running on port 8080`);
});

var total=0;
var slength =0;

function summarize(text) {
  text = text.toLowerCase();
  let tokens = wordSplitter(text);
  let wfreq = wordFrequency(tokens);
  let sentences = sentenceSplitter(text);
  let sscore = senScore(wfreq,sentences);
  let avgscore = total/slength;
  let result = finalize(sscore,avgscore);
  return result;
}

function wordSplitter(text) {
    return text.split(/[\s "," "." "\"]+/);
}

function wordFrequency(text){
  let frequencyMap = {};
  for (let i = 0; i < text.length; i++) {
    let temp = text[i];
    frequencyMap[temp] = frequencyMap[temp] + 1 || 1;
  }
  return frequencyMap;
}

function sentenceSplitter(text) {
  return text.split(/[.!?\r\n]+/);
}

function senScore(wfreq,sentences){
let sentencesscore = {};

for (var i = 0; i < sentences.length; i++) {
  let tempscore = 0;
  let tempwords = wordSplitter(sentences[i]);

  for (var j = 0; j < tempwords.length; j++) {
    var tmpnum = wfreq[tempwords[j]] || 0;
    tempscore += tmpnum;
    console.log(tempscore + " " + wfreq[tempwords[j]] + " " + tempwords[j]);
  }
  sentencesscore[sentences[i]] = tempscore;
  total += tempscore;
  slength++;
}

return sentencesscore;
}

function finalize(sscore,avgscore) {
  let result = "";

  for (var score in sscore) {
    if(sscore[score]> 1.4 * avgscore){
      let tmp = "";
      if(score[0] == " ")
        tmp = score[1].toUpperCase() + score.slice(2);
      else
        tmp = score[0].toUpperCase() + score.slice(1);
      result += " " + tmp + ".";
    }
  }

  return result;
}
