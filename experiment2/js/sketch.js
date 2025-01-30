let p;

let nodes = [];
let connections = [];
let signals = [];

function generateNodes(x, y, layers, addr) {
  let root = { x: x, y: y, addr: addr, light: 0 };
  nodes.push(root);
  if(layers > 0) {
    let count = p.round(1 + p.random() * 3);
    let d = 40 * layers;
    for(let i = 0; i < count; i++) {
      let a = p.random() * 360;
      let nextAddr = [...addr];
      nextAddr[addr.length - layers] = i + 1;
      let n = generateNodes(x + p.cos(a) * d, y + p.sin(a) * d, layers - 1, nextAddr);
      connections.push({ a: root, b: n });
    }
  }
  return root;
}

function main() {
  p.setup = () => {
    let canvasContainer = $("#canvas-container");
    let canvas = p.createCanvas(canvasContainer.width(), canvasContainer.height());
    canvas.parent("canvas-container");
    p.background(0);
    let roots = [];
    for(let i = 0; i < 3; i++) {
      roots.push(generateNodes(
        100 + p.random() * (p.width - 200),
        100 + p.random() * (p.height - 200),
        3, [0, 0, 0]));
    }
    for(let i = 0; i < roots.length; i++) {
      for(let j = i + 1; i < roots.length; i++) {
        connections.push({ a: roots[i], b: roots[j] });
      }
    }
  };
  p.draw = () => {
    p.background(0);
    p.stroke(128);
    p.strokeWeight(1);
    for(let i = 0; i < connections.length; i++) {
      p.line(connections[i].a.x, connections[i].a.y,
             connections[i].b.x, connections[i].b.y);
    }
    p.stroke(255, 255, 0);
    p.strokeWeight(3);
    for(let i = 0; i < signals.length; i++) {
      let d = p.dist(signals[i].src.x, signals[i].src.y,
             signals[i].dest.x, signals[i].dest.y);
      let sig_x_1 = p.lerp(signals[i].src.x, signals[i].dest.x, (signals[i].t - 4) / d);
      let sig_y_1 = p.lerp(signals[i].src.y, signals[i].dest.y, (signals[i].t - 4) / d);
      let sig_x_2 = p.lerp(signals[i].src.x, signals[i].dest.x, (signals[i].t + 4) / d);
      let sig_y_2 = p.lerp(signals[i].src.y, signals[i].dest.y, (signals[i].t + 4) / d);
      p.line(sig_x_1, sig_y_1, sig_x_2, sig_y_2);
    }
    p.stroke(255);
    p.strokeWeight(1);
    for(let i = 0; i < nodes.length; i++) {
      p.fill(p.lerpColor(p.color(0), p.color(255, 255, 0), nodes[i].light));
      p.circle(nodes[i].x, nodes[i].y, 10);
      nodes[i].light *= 0.95;
    }
    p.noStroke();
    for(let i = 0; i < nodes.length; i++) {
      p.fill(p.lerpColor(p.color(255), p.color(255, 255, 0), nodes[i].light));
      p.text(nodes[i].addr.toString(), nodes[i].x, nodes[i].y - 10);
    }
    
    for(let i = 0; i < signals.length; i++) {
      signals[i].t += 5;
      let d = p.dist(signals[i].src.x, signals[i].src.y,
             signals[i].dest.x, signals[i].dest.y);
      if(signals[i].t >= d) {
        signals[i].dest.light = 1;
        signals.splice(i, 1);
        i--;
      }
    }
    
    if(p.random() < 0.2) {
      let i = p.floor(p.random() * connections.length);
      let src;
      let dest;
      if(p.random() < 0.5) {
        src = connections[i].a;
        dest = connections[i].b;
      } else {
        src = connections[i].b;
        dest = connections[i].a;
      }
      signals.push({ src: src, dest: dest, t: 0 });
    }
  };
}

new p5((_p) => {
  p = _p;
  main();
});