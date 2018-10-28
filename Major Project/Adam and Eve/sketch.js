var INTRODUCTION;

var SPEED = 0.5;
var DOT_SIZE = 100;
var dots = [];
var stuckDots = []; ///dots stuck to centre
var dotColours = []; // a global variable used to find each dots colours

var bpm = 120;
var looper;
var kick;
var sounds = [];

var EFFECTS = [];

var amplitude, level;

function preload(){
  soundFormats('wav', 'mp3', 'ogg');
  kick = loadSound('/assets/AdamEve/Kick0.wav');
  sounds[0] = loadSound('/assets/AdamEve/Tom1.wav');
  sounds[1] = loadSound('/assets/AdamEve/Tom2.wav');
  sounds[2] = loadSound('/assets/AdamEve/Tom3.wav');
  sounds[3] = loadSound('/assets/AdamEve/Tom4.wav');
  sounds[4] = loadSound('/assets/AdamEve/Tom5.wav');
  sounds[5] = loadSound('/assets/AdamEve/Mouth1.wav');
  sounds[6] = loadSound('/assets/AdamEve/Mouth2.wav');
  sounds[7] = loadSound('/assets/AdamEve/Mouth3.wav');
  sounds[8] = loadSound('/assets/AdamEve/Mouth4.wav');
  sounds[9] = loadSound('/assets/AdamEve/Mouth5.wav');
  sounds[10] = loadSound('/assets/AdamEve/ARP1.wav');
  sounds[11] = loadSound('/assets/AdamEve/ARP2.wav');
  sounds[12] = loadSound('/assets/AdamEve/ARP3.wav');
  sounds[13] = loadSound('/assets/AdamEve/ARP4.wav');
  sounds[14] = loadSound('/assets/AdamEve/ARP5.wav');
  sounds[15] = loadSound('/assets/AdamEve/WUB1.wav');
  sounds[16] = loadSound('/assets/AdamEve/WUB2.wav');
  sounds[17] = loadSound('/assets/AdamEve/WUB3.wav');
  sounds[18] = loadSound('/assets/AdamEve/WUB4.wav');
  sounds[19] = loadSound('/assets/AdamEve/WUB5.wav');
}

function setup() {
  createCanvas(window.innerWidth, 600);

  INTRODUCTION = true;

  EFFECTS[0] = new p5.Delay();
  EFFECTS[0].delayTime(0.375);
  EFFECTS[0].feedback(0.5);
  EFFECTS[0].setType(1);

  EFFECTS[1] = new p5.Reverb();
  EFFECTS[1].amp(1.5);

  EFFECTS[2] = new p5.Distortion();
  EFFECTS[2].amp(0.2);

  EFFECTS[3] = new p5.Filter();
  EFFECTS[3].set(300, 3);
  EFFECTS[3].amp(1.5);



  amplitude = new p5.Amplitude();

  for(var i=0; i<sounds.length; i++){
    sounds[i].setVolume(0.0);
  }

  //set looper callback
  looper = new p5.SoundLoop(function(timeFromNow){
    kick.play(timeFromNow);
    for(var j=0; j<sounds.length; j++){
        sounds[j].play(timeFromNow);
    }
  });
  looper.interval = 4*60/bpm;
  looper.start();

  dots.push(new dot(color("red"), [0, 0], [floor(random(0, 5)), floor(random(5, 10))], [])); // parents set to 0 because first dots have no parents
  dots.push(new dot(color("green"), [0, 0], [floor(random(10, 15)), floor(random(15, 20))], []));
  dots.push(new dot(color("blue"), [0, 0], [floor(random(0, 5)), floor(random(10, 15))], []));
  dots.push(new dot(color("yellow"), [0, 0], [floor(random(5, 10)), floor(random(15, 20))], []));
}

function draw() {
  background(0);
  if(INTRODUCTION){
    displayIntroScreen();
  }
  fill(255);
  noStroke();
  level = amplitude.getLevel();
  ellipse(width/2, height/2, 10+50*level, 10+50*level);

  for(var i=0;i<dots.length;i++){
    dots[i].move();
    dots[i].draw();
  }
}

function displayIntroScreen(){
  textSize(32);
  fill(255);
  text("This is Adam, Eve, Steve, and Niamh", 50, height/5);
  text("They are beings of sound and light", 50, 2*height/5);
  text("Click on them to hear their sounds", 50, 3*height/5);
  text("Drag them to the center circle to make them birth a child", 50, 4*height/5);
}

function dot(_colour, _parents, _sounds, _effects){
  this.sounds = _sounds; //An array of 2 integers representing a sound from the global sounds array
  this.parents = _parents; //An array of 2 parent dots. Initial dots _parents is [0, 0] because they have no parents.
  this.x = width/2;
  this.y = height/2;
  this.angle = random(0, 2*PI); //angle of dot movement
  this.selected = false; //Currently selected by mouse click, mouse is pressed, position is mouse position
  this.stuck = false; //Was selected and released at center of canvas. Now stuck to center.
  this.playing = false; //Is currently playing it's sounds.
  this.colour = _colour; //colour of dots. Only matters for inital dots, because all created dots after initial dots will get colours from parent colours.
  this.effects = _effects; //an aray of integers representing an effects from the global effects array. Empty array for no effects
  this.setPos = function(newX, newY){
    this.x = newX;
    this.y = _y;
  }
  this.select = function(){
    this.selected = true;
  }
  this.unSelect = function(){
    this.selected = false;
  }
  this.stick = function(){
    this.stuck = true;
  }
  this.unStick = function(){
    this.stuck = false;
  }
  this.play = function(){
    this.playing = true;
    sounds[this.sounds[0]].setVolume(1.0);
    sounds[this.sounds[1]].setVolume(1.0);
    if(this.effects.length>0){
      sounds[this.sounds[0]].disconnect();
      sounds[this.sounds[1]].disconnect();
      for(var e=0;e<this.effects.length;e++){
        sounds[this.sounds[0]].connect(EFFECTS[this.effects[e]]);
        sounds[this.sounds[1]].connect(EFFECTS[this.effects[e]]);
      }
    }
    //console.log(this.sounds[0]+", "+this.sounds[1]);
    for(var i=0;i<this.effects.length;i++){
      console.log(this.effects[i]);
    }
  }
  this.stopPlaying = function(){
    this.playing = false;
    sounds[this.sounds[0]].setVolume(0.0);
    sounds[this.sounds[1]].setVolume(0.0);
    sounds[this.sounds[0]].disconnect();
    sounds[this.sounds[1]].disconnect();
    sounds[this.sounds[0]].connect();
    sounds[this.sounds[1]].connect();
  }
  this.isSelected = function(){
    return this.selected;
  }

  this.move = function(){
    if(this.selected){
      this.x = mouseX;
      this.y = mouseY;
      if(this.x<DOT_SIZE/2)this.x = DOT_SIZE/2;
      if(this.x>width-DOT_SIZE/2)this.x = width-DOT_SIZE/2;
      if(this.y<DOT_SIZE/2)this.y = DOT_SIZE/2;
      if(this.y>height-DOT_SIZE/2)this.y = height-DOT_SIZE/2;
    }
    else if(this.stuck){
      this.x = width/2;
      this.y = height/2;
    }
    else{
      this.x = this.x + cos(this.angle)*SPEED;
      this.y = this.y + sin(this.angle)*SPEED;
      if(this.x < DOT_SIZE/2 || this.x>width-DOT_SIZE/2){
        this.angle = PI - this.angle;
      }
      if(this.y < DOT_SIZE/2 || this.y > height-DOT_SIZE/2){
        this.angle = -this.angle;
      }
    }
  }

  this.draw = function(){
    noStroke();
    //Find all ancestors colours
    dotColours = [];
    getDotColours(this);
    for(var c=0;c<dotColours.length;c++){
      if(this.playing){
        fill(red(dotColours[c]), green(dotColours[c]), blue(dotColours[c]), 200);
      }
      else{
        fill(red(dotColours[c]), green(dotColours[c]), blue(dotColours[c]), 80);
      }
      ellipse(this.x, this.y, DOT_SIZE - c*(DOT_SIZE/dotColours.length), DOT_SIZE - c*(DOT_SIZE/dotColours.length));
    }
  }
}

/*
Recursive function returning array of all ancestor dots colours.
*/
function getDotColours(_dot){
  if(_dot.parents[0]==0){
    dotColours.push(_dot.colour);
  }
  else{
    getDotColours(_dot.parents[0]);
    getDotColours(_dot.parents[1]);
  }
}

/*
When mouse is pressed, all dots stop playing.
If the position of the mouse is over a dot, that dot is then that dot is
selected, and its sounds begin playing. If that dot is stuck to centre,
it is unstuck. Selected dot follows mouse position until mouse is released.
*/
function mousePressed(){
  for(i=0;i<dots.length;i++){
    dots[i].stopPlaying();
  }
  for(var i=dots.length-1; i>=0; i--){
    if(mouseX > dots[i].x-DOT_SIZE/2 && mouseX < dots[i].x+DOT_SIZE/2
       && mouseY > dots[i].y-DOT_SIZE/2 && mouseY < dots[i].y+DOT_SIZE/2){
         dots[i].select();
         dots[i].play();
         dots[i].unStick();
         if(stuckDots[0]==dots[i]){
           stuckDots = [];
         }
         break; // can only select one dot at a time
    }
  }
}

/*
Selected dot is unselected and no longer follows mouse position.
If selected dot was released onto center dot, it becomes stuck to center dot.
If 2 dots are stuck to center dot, a new child dot is created and all dots
become unstuck from center.
*/
function mouseReleased(){
  for(var i=0; i<dots.length; i++){
    if(dots[i].selected){
      dots[i].unSelect();
      if(dots[i].x<width/2+50&&dots[i].x>width/2-50&&
         dots[i].y<height/2+50&&dots[i].y>height/2-50){
           dots[i].stick();
           stuckDots.push(dots[i]);
           if(stuckDots.length==2){
              //Introduction screen is ended when user creates a new dot
              if(INTRODUCTION){
                INTRODUCTION = false;
              }
              //color of new dot set to 0 because colour variable only matters for initial dots.
              dots.push(new dot(0, stuckDots, getChildSounds([stuckDots[0].sounds[0], stuckDots[0].sounds[1], stuckDots[1].sounds[0], stuckDots[1].sounds[1]]), getEffects()));
              stuckDots[0].unStick();
              stuckDots[0].stopPlaying();
              stuckDots[1].unStick();
              stuckDots[1].stopPlaying();
              stuckDots = [];
              dots[dots.length-1].play();
          }
        }
    }
  }
}


/*
Returns an array of integers representing effects from the global effects bank.
When a new dot is created, this function is called to choose which effects to
apply to it.
Returns max 2 effects
*/
function getEffects(){
  var effects = [];
  var numEffects = floor(random(0, 3));
  var e;
  while(effects.length<numEffects){
    e = floor(random(0, EFFECTS.length));
    if(!effects.includes(e)){
      effects.push(e);
    }
  }
  return effects;
}

/*
_parentSounds argument is an array of the 4 sounds that the parents have.

This function determines which sounds will be passed from parent to child.
Usually, one sound from each parent will be chosen and passed on.
There is a 20% probability that a different sound from the same sound category
as the parent sound will be passed on instead.
*/
function getChildSounds(_parentSounds){
  var childSounds = [];
  var parentSound1 = _parentSounds[floor(random(0, 2))];
  var parentSound2 = _parentSounds[floor(random(2, 4))];
  if(random(0, 1)<0.2){
    childSounds.push(parentSound1-(parentSound1%5)+floor(random(0, 5)));
  }
  else{
    childSounds.push(parentSound1);
  }
  if(random(0, 1)<0.2){
    childSounds.push(parentSound2-(parentSound2%5)+floor(random(0, 5)));
  }
  else{
    childSounds.push(parentSound2);
  }
  return childSounds;
}
