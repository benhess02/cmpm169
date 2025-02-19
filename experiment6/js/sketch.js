const inputText = "In probability theory and statistics, a Markov chain or Markov process is a stochastic process describing a sequence of possible events in which the probability of each event depends only on the state attained in the previous event. Informally, this may be thought of as, \"What happens next depends only on the state of affairs now.\" A countably infinite sequence, in which the chain moves state at discrete time steps, gives a discrete-time Markov chain (DTMC). A continuous-time process is called a continuous-time Markov chain (CTMC). Markov processes are named in honor of the Russian mathematician Andrey Markov. Markov chains have many applications as statistical models of real-world processes. They provide the basis for general stochastic simulation methods known as Markov chain Monte Carlo, which are used for simulating sampling from complex probability distributions, and have found application in areas including Bayesian statistics, biology, chemistry, economics, finance, information theory, physics, signal processing, and speech processing. The adjectives Markovian and Markov are used to describe something that is related to a Markov process.";

const splitChars = [" ", ".", "?", "(", ")"];

const words = [];

let wordIndex = 0;

const nodes = [];
const wordNodes = new Map();

let selectedNode = null;

let generatedText = "";

function addNode(x, y, word) {
  let node = {
    x: x,
    y: y,
    word: word,
    outgoing: new Map()
  };  
  nodes.push(node);
  return node;
}

function connectNodes(a, b) {
  if(!a.outgoing.has(b)) {
    a.outgoing.set(b, 0);
  }
  a.outgoing.set(b, a.outgoing.get(b) + 1);
}

function addWord(word, x, y) {
  if(!wordNodes.has(word)) {
    wordNodes.set(word, addNode(x, y, word))
  }
  return wordNodes.get(word);
}

function chooseNext(node) {
  if(node == null) {
    return null;
  }
  let total = 0;
  node.outgoing.forEach((weight, outgoing) => {
    total += weight;
  });
  let i = 0;
  let next = null;
  node.outgoing.forEach((weight, outgoing) => {
    if(next == null) {
      i += weight;
      if(random() * total <= i) {
        next = outgoing;
      } 
    }
  });
  return next;
}

function setup() {
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  
  let nextToken = "";
  for(let i = 0; i < inputText.length; i++) {
    let ch = inputText.charAt(i);
    if(splitChars.includes(ch)) {
      if(nextToken.length > 0) {
        words.push(nextToken);
      }
      if(ch != " ") {
        words.push(ch);
      }
      nextToken = "";
    } else {
      nextToken += ch;
    }
  }
  if(nextToken.length > 0) {
    words.push(nextToken);
  }
}

function drawArrow(a, b, weight) {
  push();
  let dx = b.x - a.x;
  let dy = b.y - a.y;
  let d = sqrt(dx * dx + dy * dy);
  translate(a.x, a.y);
  rotate(atan2(dy, dx));
  strokeWeight(weight);
  line(10, 0, d - 10, 0);
  line(d - 10, 0, d - 15, 5);
  line(d - 10, 0, d - 15, -5);
  pop();
}

function draw() {
  if(frameCount % 20 == 0) {
    if(wordIndex < words.length - 1) {
      let last = addWord(words[wordIndex], width / 2, height / 2);
      let next = addWord(words[wordIndex + 1],
                         last.x + random() - 0.5,
                         last.y + random() - 0.5);
      connectNodes(last, next);
      last = next;
      wordIndex += 1;
    }
    selectedNode = chooseNext(selectedNode);
    if(selectedNode != null) {
      if(selectedNode.word != "(" && selectedNode.word != ")"
         && selectedNode.word != "\"")
      {
        generatedText += " ";  
      }
      generatedText += selectedNode.word; 
    }
  }
  
  background(255);
  fill(128);
  textAlign(LEFT, TOP);
  textWrap(WORD);
  text(generatedText, 0, 0, width);
  
  for(let i = 0; i < nodes.length; i++) {
    noStroke();
    stroke(128);
    nodes[i].outgoing.forEach((weight, outgoing) => {
      drawArrow(nodes[i], outgoing, weight);
    });
  }
  textSize(16);
  textAlign(CENTER, CENTER);
  for(let i = 0; i < nodes.length; i++) {
    if(nodes[i] == selectedNode) {
      fill(0, 255, 255);
    }
    else if(dist(nodes[i].x, nodes[i].y, mouseX, mouseY) < 15) {
      fill(255, 128, 128);
      if(mouseIsPressed) {
        selectedNode = nodes[i];
        generatedText = selectedNode.word;
      }
    } else {
      fill(255, 0, 0);
    }
    text(nodes[i].word, nodes[i].x, nodes[i].y);
  }
  
  let avg_x = 0;
  let avg_y = 0;
  for(let i = 0; i < nodes.length; i++) {
    for(let j = i + 1; j < nodes.length; j++) {
      let a = nodes[i];
      let b = nodes[j];
      let dx = a.x - b.x;
      let dy = a.y - b.y;
      let dSq = dx * dx + dy * dy;
      let d = sqrt(dSq);
      let f = min((1 / dSq) * 1000, 1);
      if(a.outgoing.has(b)) {
          f = (50 - d) * 0.1 * a.outgoing.get(b);
          f = min(f, 1);
      } else if (b.outgoing.has(a)) {
          f = (50 - d) * 0.1 * b.outgoing.get(a);
          f = min(f, 1);
      }
      dx /= d;
      dy /= d;
      a.x += dx * f;
      a.y += dy * f;
      b.x -= dx * f;
      b.y -= dy * f;
    }
    avg_x += nodes[i].x;
    avg_y += nodes[i].y;
  }
  
  avg_x /= nodes.length;
  avg_y /= nodes.length;
  
  for(let i = 0; i < nodes.length; i++) {
    nodes[i].x += ((width / 2) - avg_x) * 0.1;
    nodes[i].y += ((height / 2) - avg_y) * 0.1;
  }
}