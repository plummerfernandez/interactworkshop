/*
 * @name Game of Life
 * @description A basic implementation of John Conway's Game of Life CA
 * (<a href="http://natureofcode.com">natureofcode.com</a>)
 */

let w;
let columns;
let rows;
let board;
let next;
let decay;

function setup() {
  createCanvas(800, 800);
  //canvas.parent('sketch-holder');
  smooth(8);
  pixelDensity(2);
  w =8;
  decay = 220;
  noStroke();
  // Calculate columns and rows
  columns = floor(width / w +3);
  rows = floor(height / w +3);
  // Wacky way to make a 2D array is JS
  board = new Array(columns);
  for (let i = 0; i < columns; i++) {
    board[i] = new Array(rows);
  }
  // Going to use multiple 2D arrays and swap them
  next = new Array(columns);
  for (i = 0; i < columns; i++) {
    next[i] = new Array(rows);
  }
  init();
  background(colors[3]);
}

function draw() {
  //background(255);
  decay = decay +1;
  if(decay >=1000){
    //console.log('reset');
    reset(5);
    decay=0;
  }
  if(decay == 800 || decay == 500){
    reset(1);
    //console.log('little help');
  }
  
  
  generate();
  
  translate(-10,-10);
  for ( let i = 0; i < columns;i++) {
    for ( let j = 0; j < rows;j++) {
      if ((board[i][j] == 1)){
        fill(colors[2]);
      //rect(i * w+2, j * w+2, w-5, w-5);
      //fill(decay,80-random(60)+map(decay,0,255,100,0),120,70);
     //let c3 = lerpColor(color(colors[4]), color(colors[5]), random(1));
         
      let diam = random(-5,1);
      //shadow
        fill(10,10,50,100);
      ellipse(i * w+5, j * w+5, w+w/2+diam, w+w/2+diam);
        
        
      // extrahighlight
      if(random(1)>=0.6){
        fill(228,230,195,70);
        ellipse(i * w-5, j * w-5, w+w/2+diam+(random(0.3)), w+w/2+diam);
      }
      //highlight
      fill(colors[5]); //
      //fill(122+map(decay,0,255,-10,30),155+map(decay,0,255,-10,30),118+map(decay,0,255,-10,30));
      let n = 50*cos(decay*0.05)*noise(i*0.5,j*0.5)-10;
      fill(122+n,155+n,118+n);
      ellipse(i * w-4, j * w-4, w+w/2+diam, w+w/2+diam);
      
      //dark green bit on top
      //fill(33,78,52,random(150,250));
      fill(33,78+(80*noise(i*0.05,j*0.05))-60,52,random(150,250)); 
        //fill(33,78+(80*sin(i*0.01)*sin(j*0.1)-20),52,random(150,250));
      ellipse(i * w, j * w, w+1-(random(-8,0)), w+1-(random(-8,0)));
      //fill(decay,100-random(30),80,20);
       
      //fill(decay,200-random(30),40,80);
        //fill(red(colors[2]),green(colors[2]),blue(colors[2]),50);
        //fill(colors[4]);
      //diam = random(0,6);
      //ellipse(i * w+w/2+diam, j * w+w/2+diam, w-2, w-2);
      
      
        }else{
        fill(255,0);
      }
    
      //
    if(random(100000)>99999){
      //deforestation
      wid = (width-20)/6;
      
      stroke(150);
      strokeWeight(0.5);
      //fill(250,250,200,255);
      fill(colors[1]);
      rect(wid*int(random(6))+20,wid*int(random(6))+20,wid,wid);
      noStroke();
    }
      
      
      
    }
  }

}


//https://coolors.co/e26d5a-e4e6c3-efd0ca-22223b-214e34
let colors = ['#e26d5a', '#e4e6c3', '#efd0ca', '#22223b', '#214e34','#7a9b76',];

function getColor() {

  let c1 = colors[4]; 
  let c2 = colors[5]; 
  return lerpColor(c1, c2, random(1));

}         
                
// reset board when mouse is pressed
// function mousePressed() {
//   reset();
// }

// Fill board randomly
function init() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      // Lining the edges with 0s
      if (i == 0 || j == 0 || i == columns-1 || j == rows-1) board[i][j] = 0;
      // Filling the rest randomly
      
      else board[i][j] = floor(random(2));
      next[i][j] = 0;
    }
  }
}

// Fill board randomly
function reset(chance) {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      // Lining the edges with 0s
      if (i == 0 || j == 0 || i == columns-1 || j == rows-1){               board[i][j] = 0;
      // Filling the rest randomly
      }else{ 
        //let cr = red(get(i, j));
        if(random(100) >= 100-chance){
          board[i][j] = 1;
        }
        else{
          board[i][j] = board[i][j];
         //board[i][j] = floor(random(2));
        }
        next[i][j] = 0;
      }
      
    }
  }
}


// The process of creating the new generation
function generate() {

  // Loop through every spot in our 2D array and check spots neighbors
  for (let x = 1; x < columns - 1; x++) {
    for (let y = 1; y < rows - 1; y++) {
      // Add up all the states in a 3x3 surrounding grid
      let neighbors = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          neighbors += board[x+i][y+j];
        }
      }

      // A little trick to subtract the current cell's state since
      // we added it in the above loop
      neighbors -= board[x][y];
      // Rules of Life
      if      ((board[x][y] == 1) && (neighbors <  2)) next[x][y] = 0;           // Loneliness
      else if ((board[x][y] == 1) && (neighbors >  3)) next[x][y] = 0;           // Overpopulation
      else if ((board[x][y] == 0) && (neighbors == 3) && (random(1000)<=998)) next[x][y] = 1;           // Reproduction
      else                                             next[x][y] = board[x][y]; // Stasis
    }
  }

  // Swap!
  let temp = board;
  board = next;
  next = temp;
}