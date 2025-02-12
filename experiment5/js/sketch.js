const SRGB_GAMMA = 2.2;

let _x;
let _y;
let _z;
let _d;
let _r;
let _g;
let _b;

let metaballs = [];

function addMetaball(r, g, b) {
  metaballs.push({
    x: random() * 40 - 20,
    y: random() * 40 - 20,
    z: random() * 40 - 20,
    vx: random() - 0.5,
    vy: random() - 0.5,
    vz: random() - 0.5,
    r: r,
    g: g,
    b: b
  });
}

function setup() {
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height(), WEBGL);
  canvas.parent("canvas-container");
  perspective(1);
  noStroke();
  addMetaball(255, 0, 0);
  addMetaball(0, 255, 0);
  addMetaball(0, 0, 255);
}

function metaball(x, y, z, radius, r, g, b) {
  let dx = x - _x;
  let dy = y - _y;
  let dz = z - _z;
  let d = radius / sqrt(dx * dx + dy * dy + dz * dz);
  _d += d;
  _r += pow(r / 255, SRGB_GAMMA) * d;
  _g += pow(g / 255, SRGB_GAMMA) * d;
  _b += pow(b / 255, SRGB_GAMMA) * d;
}

function draw() {
  for(var i = 0; i < metaballs.length; i++) {
    var m = metaballs[i];
    m.x += m.vx;
    if(m.x > 10) {
      m.x = 10;
      m.vx = -m.vx;
    } else if(m.x < -10) {
      m.x = -10;
      m.vx = -m.vx;
    }
    m.y += m.vy;
    if(m.y > 10) {
      m.y = 10;
      m.vy = -m.vy;
    } else if(m.y < -10) {
      m.y = -10;
      m.vy = -m.vy;
    }
    m.z += m.vz;
    if(m.z > 10) {
      m.z = 10;
      m.vz = -m.vz;
    } else if(m.z < -10) {
      m.z = -10;
      m.vz = -m.vz;
    }
  }
  
  
  background(0);
  
  resetMatrix();
  orbitControl();
  
  stroke(255);
  noFill();
  
  push();
  for(let i = 0; i < 4; i++) {
    rotateY(PI / 2);
    quad(
      -13 * 20,  -13 * 20,  -13 * 20,
      13 * 20,   -13 * 20,  -13 * 20,
      13 * 20,   13 * 20,  -13 * 20,
      -13 * 20,  13 * 20,  -13 * 20
    );
  }
  pop();
  
  
  fill(255);
  noStroke();
  for(_z = -20; _z < 20; _z++) {
    for(_y = -20; _y < 20; _y++) {
      for(_x = -20; _x < 20; _x++) {
        _d = 0;
        _r = 0;
        _g = 0;
        _b = 0;
        
        for(var i = 0; i < metaballs.length; i++) {
          var m = metaballs[i];
          metaball(m.x, m.y, m.z, 2.5, m.r, m.g, m.b);
        }
        
        if(_d > 1 && _d < 1.3) {
          _r /= _d;
          _g /= _d;
          _b /= _d;
          fill(
            pow(_r, 1 / SRGB_GAMMA) * 255,
            pow(_g, 1 / SRGB_GAMMA) * 255, 
            pow(_b, 1 / SRGB_GAMMA) * 255
          );
          push();
          translate(_x * 20, _y * 20, _z * 20);
          box(20, 20, 20);
          pop();
        }
      }
    }
  }
}