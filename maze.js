document.body.innerHTML = '<canvas id = "canvas" width="400px" height="400px"></canvas>';
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let playerCell;

document.addEventListener('keydown', (btn) => {
    if (playerCell === undefined) {
        cells.forEach(element => {
            if (element.player === true) playerCell = element;
        })
    }
    if (btn.key == 'w') move(0,-1)
    if (btn.key == 'd') move(1,+10)
    if (btn.key == 's') move(2,+1)
    if (btn.key == 'a') move(3,-10)

    if (playerCell.place === 99) gameOver();
})

function move(wall,num){
    if (playerCell.walls[wall] === false) {
        playerCell.player = false;
        playerCell.draw();
        playerCell = cells[playerCell.place + num];
        playerCell.player = true;
        playerCell.draw();
    }
}

const width = 400;
const height = 400;
const cw = Math.floor(width / 10);
let cells = [];
let stack = [];
let current;

createGrid();
mazeGenerator();


function createGrid() {
    for (let j = 0; j < width / cw; j++) {
        for (let i = 0; i < height / cw; i++) {
            cells.push(new Cell(i, j));
        }
    }
    current = cells[0];
    current.visited = true;
    cells.forEach(element => element.setup());
}

function Cell(i, j) {
    this.i = i;
    this.j = j;
    this.place = j * width / cw + i, height / cw;
    this.walls = [true, true, true, true]; //Top,Right,Bottom,Left;
    this.neighbours = [];
    this.unvisitedNeighbours = [];
    this.visited = false;
    this.player = false;
    let x = cw * j;
    let y = cw * i;


    this.draw = () => {
        if (this.visited) {
            ctx.fillStyle = 'rgb(130,0,130)';
            ctx.fillRect(x, y, cw, cw);
        }
        if (this.finish === true) {
            ctx.fillStyle = 'rgb(10,150,50)';
            ctx.fillRect(x, y, cw, cw);
        }
        if (this.player) {
            ctx.fillStyle = 'rgb(10,90,180)';
            ctx.fillRect(x, y, cw, cw);
        }

        ctx.beginPath();
        ctx.strokeStyle = '#fff';
        if (this.walls[0]) line(x, y, x + cw, y);
        if (this.walls[1]) line(x + cw, y, x + cw, y + cw);
        if (this.walls[2]) line(x + cw, y + cw, x, y + cw);
        if (this.walls[3]) line(x, y + cw, x, y);
        ctx.stroke();
        ctx.closePath();
    }

    this.setup = () => {
        if (this.i !== 0) {
            this.neighbours.push(cells[this.place - 1]);//Top
        } else this.neighbours.push(null);
        if (this.j !== 9) {
            this.neighbours.push(cells[this.place + 10]);//Right
        } else this.neighbours.push(null);
        if (this.i !== 9) {
            this.neighbours.push(cells[this.place + 1]);//Bottom
        } else this.neighbours.push(null);
        if (this.j !== 0) {
            this.neighbours.push(cells[this.place - 10]); //Left
        } else this.neighbours.push(null);
    }

    this.isNeighbours = () => {
        this.unvisitedNeighbours = [];
        if (this.neighbours[0] && !this.neighbours[0].visited) this.unvisitedNeighbours.push(this.neighbours[0]);
        if (this.neighbours[1] && !this.neighbours[1].visited) this.unvisitedNeighbours.push(this.neighbours[1]);
        if (this.neighbours[2] && !this.neighbours[2].visited) this.unvisitedNeighbours.push(this.neighbours[2]);
        if (this.neighbours[3] && !this.neighbours[3].visited) this.unvisitedNeighbours.push(this.neighbours[3]);

        if (this.unvisitedNeighbours.length > 0) {
            return this.unvisitedNeighbours[Math.floor(Math.random() * this.unvisitedNeighbours.length)];
        } else return null;
    }
}

function mazeGenerator() {
    cells[0].player = true;
    cells[99].finish = true;
    while (!cells.every(element => element.visited)) {
        let before = current;
        current = current.isNeighbours();
        if (current) {
            if (before.place + 1 === current.place) {
                current.walls[0] = false;
                before.walls[2] = false;
            } else if (before.place - 1 === current.place) {
                current.walls[2] = false;
                before.walls[0] = false;
            } else if (before.place - 10 === current.place) {
                current.walls[1] = false;
                before.walls[3] = false;
            } else if (before.place + 10 === current.place) {
                current.walls[3] = false;
                before.walls[1] = false;
            }
            current.visited = true;
            stack.push(current);
            current.draw();
            before.draw();
        } else {
            current = stack.pop();
        }
    }
}

function gameOver() {
    console.log('gameOver ! \nGreat job !');
}

function line(x, y, xa, ya) {
    ctx.moveTo(x, y);
    ctx.lineTo(xa, ya);
}

//Objectives:
// -- Make process of generating maze visible.
// -- Refactor.
// -- make size of maze adjustable and decrementable, so you can change size of it.