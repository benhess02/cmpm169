let img1;
let img2;
let img;

let index = 0;

let amplitudes0 = [];
let amplitudes2 = [];

let oscillators = []
let oscillators2 = []

function preload() {
  img = loadImage("/Houses_of_Parliament.jpg");
}

function setup() {
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");

  background(0);
  
  img.loadPixels();
  noStroke();
  
  for(let i = 0; i < 256; i++) {
    amplitudes0.push(0);
    amplitudes2.push(0);
    oscillators.push(new p5.Oscillator())
    oscillators[i].pan(-1);
    oscillators[i].phase(random() * 360);
    oscillators2.push(new p5.Oscillator())
    oscillators2[i].pan(1);
    oscillators2[i].phase(random() * 360);
  }
}

function mousePressed() {
  for(let i = 0; i < 256; i++) {
    oscillators[i].start();
    oscillators2[i].start();
  }
}

function draw() {
  fill(0, 50);
  rect(0, 0, 256, 256);
  fill(255, 255, 255);
  
  for(let i = 0; i < 256; i++) {
    amplitudes0[i] = 0;
    amplitudes2[i] = 0;
  }
  
  for(let i = 0; i < 4000 && index < img.pixels.length; i += 1) {
    fill(img.pixels[index], img.pixels[index + 1], img.pixels[index + 2]);
    rect(img.pixels[index], img.pixels[index + 2] , 1, 1);
    let p_index = floor(index / 4);
    rect((p_index % img.width) * 0.3, 256 + floor(p_index / img.width) * 0.3, 1, 1);
    amplitudes0[img.pixels[index]] += 1;
    amplitudes2[img.pixels[index + 2]] += 1;
    index += 4;
  }
  
  fill(255);
  for(let i = 0; i < 256; i++) {
    if(amplitudes2[i] > 255) {
      amplitudes2[i] = 255;
    }
    oscillators[i].freq(100 + amplitudes2[i] * 2);
    rect(amplitudes2[i], i, 1, 1);
  }
  for(let i = 0; i < 256; i++) {
    if(amplitudes0[i] > 255) {
      amplitudes0[i] = 255;
    }
    oscillators2[i].freq(100 + amplitudes0[i] * 2);
    rect(i, amplitudes0[i], 1, 1);
  }
}