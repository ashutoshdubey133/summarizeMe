const express = require( 'express');
const app = express();

app.use(express.urlencoded());

app.use(express.static('public'));

try{
  app.post('/summarized', (req, res) => {
  let text = req.body.input;
  let averageMulti = req.body.averageMulti;
  let summarizedres = summarize(text,averageMulti);
  let result = `<p>Number of sentences in summary are ${numOfSen(summarizedres)}.<br> Number of sentences in orginal text are ${numOfSen(text)}. ` +'<br><h3>The Summary is</h3>' + summarizedres;
  let original = '</br><h3> Your Original Input Was: </h3></br>' + text;
  let button = '<br><center><button style="margin-top:5vh;background-color:#000000;height:4vh;"><a style="color:#FFFFFF;text-decoration:none" href="/index.html">Summarise another text</a></button></center>';
  res.send(result + original + button);
});}
catch(e){
  console.log(e);
}

const port = process.env.PORT || 80;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

var total=0;
var slength =0;

function summarize(text,averageMulti) {
  text = text.toLowerCase();
  let tokens = wordSplitter(text);
  let wfreq = wordFrequency(tokens);
  let sentences = sentenceSplitter(text);
  let sscore = senScore(wfreq,sentences);
  let avgscore = total/slength;
  let result = finalize(sscore,avgscore,averageMulti);

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
  }
  sentencesscore[sentences[i]] = tempscore;
  total += tempscore;
  slength++;
}

return sentencesscore;
}

function finalize(sscore,avgscore, averageMulti) {
  let result = "";

  for (var score in sscore) {
    if(sscore[score]> averageMulti * avgscore){
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

function numOfSen(text) {
  let sents = text.split(/[.!?\r\n]+/);
  return sents.length;
}
