var quakeData = [];
var months = ['January', 'February', 'March', 'April',' May',' June', 'July', 'August', 'September', 'October', 'November', 'December'];
var currentYear;
var currentMonth;
var currentDay;
var currentQuake;
var quakeSound;

var request = new XMLHttpRequest();
request.open('GET', 'https://api.geonet.org.nz/quake?MMI=5', true);
request.onload = function(){
  var data = JSON.parse(this.response);
  for(var i=0;i<data.features.length;i++){
    quakeData[i] = data.features[i].properties;
    quakeData[i].year = parseInt(quakeData[i].time.slice(0, 4));
    quakeData[i].month = parseInt(quakeData[i].time.slice(5, 7));
    quakeData[i].day = parseInt(quakeData[i].time.slice(8, 10));
  }
}
request.send();


function setup() {
  cnv = createCanvas(500, 500);
  background(255);

  for(var i=0;i<quakeData.length;i++){
    quakeData[i].xPos = random(0, 1);
    quakeData[i].yPos = random(0, 1);
  }

  quakeSound = loadSound('/assets/earthquake.wav');
  //console.log(quakeData[0]);
  currentYear = quakeData[quakeData.length-1].year;
  currentMonth = quakeData[quakeData.length-1].month;
  currentQuake = quakeData.length-1;
}

function draw(){
  background(255);
  textSize(15);
  text("The last 100 reasonably strong earthquakes in NZ (MMI > 4)", 50, height-50);
  textSize(30);
  if(currentQuake!=0){
    currentDay = ((frameCount%310)-frameCount%10)/10 + 1;
  }
  text(currentDay+" "+months[currentMonth-1]+" "+currentYear, 100, 100);
  if(frameCount%310==0&&currentQuake!=0){
    currentMonth++;
    if(currentMonth>12){
      currentMonth=1;
      currentYear++;
    }
  }
  if(quakeData[currentQuake].day == currentDay && quakeData[currentQuake].month == currentMonth){
    stroke(0);
    fill(0);
    ellipse(map(quakeData[currentQuake].xPos, 0, 1, 0, width), map(quakeData[currentQuake].yPos, 0, 1, 0, height), 50, 50);
    quakeSound.play();
    currentQuake--;
  }
}
