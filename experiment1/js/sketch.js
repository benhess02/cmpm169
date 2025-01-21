// sketch.js - a vector style gravity simulation
// Author: Ben Hess
// Date: 1/20/2025

let objects = [];

function setup() {
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  
  background(25, 25, 25);
  stroke(0, 255, 0);
  noFill();
  
  // Create objects
  for(let i = 0; i < 500; i++) {
    let a = random() * 360;
    let d = random() * 400;
    objects.push({
      x: random() * width,
      y: random() * height,
      vx: random() * 2 - 1,
      vy: random() * 2 - 1,
      size: random() * 5
    });
  }
}

function applyGravity(i, j, inv_x, inv_y) {
  let rx = objects[j].x - objects[i].x;
  let ry = objects[j].y - objects[i].y;
  if(inv_x) {
    if(rx > 0) {
      rx = -width + rx; 
    } else {
      rx = width + rx;
    }
  }
  if(inv_y) {
    if(ry > 0) {
      ry = -height + ry; 
    } else {
      ry = height + ry;
    }
  }
  let r_sq = rx * rx + ry * ry;
  if(r_sq >= 0) {
    let f = (objects[i].size * objects[j].size) / r_sq;
    let r = sqrt(r_sq);
    let fx = rx / r * f;
    let fy = ry / r * f;
    objects[i].vx += fx / objects[i].size;
    objects[i].vy += fy / objects[i].size;
  }
}

function draw() {
  background(25, 25, 25, 25);
  
  // Check collisions
  for(let i = 0; i < objects.length; i++) {
    for(let j = 0; j < objects.length; j++) {
      if(i != j) {
        let rx = objects[j].x - objects[i].x;
        let ry = objects[j].y - objects[i].y;
        let r_sq = rx * rx + ry * ry;
        let ri = pow(objects[i].size, 1 / 3);
        let rj = pow(objects[j].size, 1 / 3);
        let min_r = ri + rj;
        if(r_sq < min_r * min_r) {
          let new_size = objects[i].size + objects[j].size;
          let new_x = (objects[i].x * objects[i].size + objects[j].x * objects[j].size) / new_size;
          let new_y = (objects[i].y * objects[i].size + objects[j].y * objects[j].size) / new_size;
          let new_vx = (objects[i].vx * objects[i].size + objects[j].vx * objects[j].size) / new_size;
          let new_vy = (objects[i].vy * objects[i].size + objects[j].vy * objects[j].size) / new_size;
          objects.splice(i, 1);
          if(j > i) {
            j -= 1;
          }
          i -= 1;
          objects.splice(j, 1);
          if(i > j) {
            i -= 1;
          }
          j -= 1;
          objects.push({
            x: new_x,
            y: new_y,
            vx: new_vx,
            vy: new_vy,
            size: new_size
          });
          break;
        }
      }
    }
  }
  
  // Update velocities
  for(let i = 0; i < objects.length; i++) {
    for(let j = 0; j < objects.length; j++) {
      if(i != j) {
        applyGravity(i, j, false, false);
        applyGravity(i, j, true, false);
        applyGravity(i, j, false, true);
        applyGravity(i, j, true, true);
      }
    }
  }
  
  // Move objects
  for(let i = 0; i < objects.length; i++) {
    objects[i].x += objects[i].vx;
    objects[i].y += objects[i].vy;
    if(objects[i].x >= width) {
      objects[i].x -= width;
    }
    if(objects[i].x < 0) {
      objects[i].x += width;
    }
    if(objects[i].y >= height) {
      objects[i].y -= height;
    }
    if(objects[i].y < 0) {
      objects[i].y += height;
    }
  }
  
  // Draw objects
  for(let i = 0; i < objects.length; i++) {
    circle(objects[i].x, objects[i].y, pow(objects[i].size, 1 / 3));
  }
}