/// <reference path="./p5.global-mode.d.ts" />

let topMargin = 0.3; // band lenght as 70% of screen height
let sideMargin = 0.4; // margine from page borders
let band_n = 22; // number of band divisions

let w = 1000;
let h = 800;

let leftStart = -sideMargin*w;
let rightEnd = sideMargin*w;

let lowerBoarder = -h*topMargin;
let upperBoarder = h*topMargin;

let bar = (rightEnd)/band_n*2

let specSize = bar*band_n

let bands = [];

let max_ci;

 if(band_n % 2 == 0){
     max_ci = ((band_n)**2 - 2*band_n)/8;
  }
  else {
     max_ci = ((band_n + 1)**2 - 2*(band_n + 1))/8;
  }

class Band {

  constructor(freq, color){
    this.freq = freq;
    this.busy = random([true,false]);
    this.color = color;
    this.bw = bar;
  }

  show(){
    colorMode(HSB, 255);
    if (this.busy) {
      stroke(255);
      noStroke();
      strokeWeight(0.5);
      fill(this.color,255,150);
      rect(this.freq, upperBoarder,bar,lowerBoarder*2);
    } else {
      noFill();
      stroke(255);
      strokeWeight(0.5);
      rect(this.freq, upperBoarder,bar,lowerBoarder*2);
    }
  }

  mouseHover(){
    if(((mouseX - w/2 >= this.freq) && (mouseX -w/2 <= this.freq + bar)) && 
    (((mouseY - h/2 >= lowerBoarder) && (mouseY -h/2 <= upperBoarder)))){
      return true;
    } else {
      return false;
    }
  }
}

function setup() {
  createCanvas(w,h);  
  for (let i = leftStart; i < rightEnd; i+= bar){
    bands.push(new Band(i, map(i,leftStart,rightEnd,150,255)));
  }
}

function draw() {
  background(40);
  translate(width/2,height/2);

  
  let gaps = [];
  let gapCounter = 0;

  let notGaps = [];
  let notGapsLoc = [];
  let notGapCounter = 0;
  
  
  for (let i = 0; i < bands.length; i+= 1){
    
    bands[i].show();
    

    // draw graph axsis
    
    stroke(255);
    line(bands[i].freq,upperBoarder * 1.1,bands[i].freq,upperBoarder);
    fill(255);
    textSize(15);
    textAlign(CENTER);
    text(i*5 + 30, bands[i].freq,upperBoarder * 1.18);

    

    if (!bands[i].busy){
        gapCounter += 1;
      } else if (bands[i].busy && gapCounter != 0) {
        gaps.push(gapCounter);
        gapCounter = 0;
      } 

      if (bands[i].busy){
        notGapCounter += 1;
      } else if (!bands[i].busy && notGapCounter != 0) {
        notGaps.push(notGapCounter);
        notGapsLoc.push(i);
        notGapCounter = 0;
      }
  }

  if (gapCounter != 0){
    gaps.push(gapCounter);
  }

  if (notGapCounter != 0){
    notGaps.push(notGapCounter);
    notGapsLoc.push(band_n);
  }



  line(rightEnd,upperBoarder * 1.1,rightEnd,upperBoarder);
  text(band_n*5 + + 30, rightEnd,upperBoarder * 1.18);
  textSize(20);
  text("Mhz", 0,upperBoarder * 1.34);
  

  // draw licenses boxes
  for (let j = 0; j < notGaps.length; j++){
    stroke(255);
    noFill();
    rect(leftStart + (notGapsLoc[j] - notGaps[j])*bar,lowerBoarder,bar * notGaps[j], upperBoarder*2);
    fill(255);
    text("L" + (j+1), leftStart + (notGapsLoc[j] - notGaps[j]/2)*bar,0);
  }
 
  gaps.sort((a,b)=>b-a);

  var ci = 0;
    for (let i = 0; i < gaps.length; i++) {
        ci += gaps[i]*i;
    }

    var cap = 0;
    for (let i = 0; i < gaps.length; i++) {
        cap += gaps[i];
    }
  
  fill(255);
  textSize(20);
  textAlign(LEFT);
  
  //text(notGaps,0,upperBoarder*1.5);
  //text(gaps,0,upperBoarder*1.6);

  if (gaps.length == 1 && gaps[0] == band_n){
    text("No Licenses Allocated", leftStart ,(-topMargin*1.25)*height);
    
  } else if (gaps.length == 1 && notGaps.length == 2 ){
    text("Gaps | " + gaps.length, leftStart ,(-topMargin*1.25)*height);
    text("Continuity: "+((0)*100).toFixed(0)+"%", leftStart ,(-topMargin*1.4)*height);
  } else if (notGaps.length == 1){
    text("Perfect Continuity", leftStart ,(-topMargin*1.25)*height);
    text("Continuity: "+((1)*100).toFixed(0)+"%", leftStart ,(-topMargin*1.4)*height);
  } 
  else {
    text("Continuity: "+((1-(ci/max_ci))*100).toFixed(0)+"%", leftStart ,(-topMargin*1.4)*height);
    text("Gaps | " + gaps.length, leftStart ,(-topMargin*1.25)*height);
  }

   text("Capacity | " + cap*5 + " Mhz",leftStart ,(-topMargin*1.1)*height);
  
}

function mouseClicked(){
for (let i = 0; i <= bands.length; i+= 1){
  if (bands[i].mouseHover()){
    if (bands[i].busy){
      bands[i].busy = false;
      break
    }else{
      bands[i].busy = true;
      break
    }
  }
}
  redraw();
}


