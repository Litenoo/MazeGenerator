document.body.innerHTML = '<canvas id = "canvas" width="400px" height="400px"></canvas>';
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = 400;
const height = 400;
const cw = Math.floor(width / 10);
let cells = [];
let current;
createMaze();
move();


function createMaze() {
    for (let j = 0; j < 10; j++) {
        for (let i = 0; i < 10; i++) {
            cells.push(new Cell(i, j));
            current = cells[0];
        }
    }
    cells.forEach(element => element.draw());
    cells.forEach(element => element.addNeighbors());
}

function Cell(i, j) {
    this.i = i;
    this.j = j;
    this.place = j * 10 + i, 10;
    this.walls = [true, true, true, true]; //Top,Right,Bottom,Left;
    this.visited = false;
    this.neighbours = [];
    let x = cw * j;
    let y = cw * i;




    this.draw = () => {
        ctx.beginPath();
        ctx.strokeStyle = '#fff';
        if (this.walls[0]) line(x, y, x + cw, y);
        if (this.walls[1]) line(x + cw, y, x + cw, y + cw);
        if (this.walls[2]) line(x + cw, y + cw, x, y + cw);
        if (this.walls[3]) line(x, y + cw, x, y);
        ctx.stroke();
        ctx.closePath();
    }

    this.addNeighbors = () => {
        if (this.i !== 0) {
            this.neighbours.push(cells[this.place - 1]);//Top
        } else {
            this.neighbours.push(null);
        }
        if (this.j !== 9) {
            this.neighbours.push(cells[this.place + 10]);//Right
        } else {
            this.neighbours.push(null);
        }
        if (this.i !== 9) {
            this.neighbours.push(cells[this.place + 1]);//Bottom
        } else {
            this.neighbours.push(null);
        }
        if (this.j !== 0) {
            this.neighbours.push(cells[this.place - 10]); //Left
        } else {
            this.neighbours.push(null);
        }
    }

    this.checkNeighbours = () => {
        ctx.fillStyle = 'rgba(255,0,255,0.5)';
        if (this.visited) ctx.fillRect(x + 1, y + 1, cw - 1, cw - 1);
        let result = [];
        console.log(this.neighbours);
    }
}

function move() {
    current.visited = true;
    current.checkNeighbours();
}

function line(x, y, xa, ya) {
    ctx.moveTo(x, y);
    ctx.lineTo(xa, ya);
}

// Objectives :
// -- spot is the neighbours are visited or not.