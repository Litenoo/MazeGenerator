document.body.innerHTML = '<canvas id = "canvas" width="400px" height="400px"></canvas>';
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = 400;
const height = 400;
const cw = Math.floor(width / 10);
let cells = [];
let current;
createMaze();


function createMaze() {
    for (let j = 0; j < 10; j++) {
        for (let i = 0; i < 10; i++) {
            cells.push(new Cell(i, j));
        }
    }
    current = cells[0];
    current.visited = true;
    cells.forEach(element =>{
        element.draw();
        element.addNeighbors();
    });
}

function Cell(i, j) {
    this.i = i;
    this.j = j;
    this.place = j * width / cw + i, height / cw;
    this.walls = [true, true, true, true]; //Top,Right,Bottom,Left;
    this.visited = false;
    this.neighbours = [];
    this.unvisitedNeighbours = [];
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

        if (this.visited) {
            ctx.fillStyle = 'rgba(255,0,255,0.5)';
            if (this.visited) ctx.fillRect(x + 1, y + 1, cw - 1, cw - 1);
        }
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

    this.isNeighbours = () => {
        this.unvisitedNeighbours = [];
        if (this.neighbours[0] && !this.neighbours[0].visited) this.unvisitedNeighbours.push(this.neighbours[0]);
        if (this.neighbours[1] && !this.neighbours[1].visited) this.unvisitedNeighbours.push(this.neighbours[1]);
        if (this.neighbours[2] && !this.neighbours[2].visited) this.unvisitedNeighbours.push(this.neighbours[2]);
        if (this.neighbours[3] && !this.neighbours[3].visited) this.unvisitedNeighbours.push(this.neighbours[3]);

        if (this.unvisitedNeighbours.length > 0) {
            let r = Math.floor(Math.random() * this.unvisitedNeighbours.length);
            return this.unvisitedNeighbours[r];
        }
    }
}

function line(x, y, xa, ya) {
    ctx.moveTo(x, y);
    ctx.lineTo(xa, ya);
}

// Objectives :
// -- spot is the neighbours are visited or not.
// -- refactor code !!!