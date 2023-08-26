document.body.innerHTML = document.body.innerHTML + '<canvas id = "canvas" width="800px" height="800px"></canvas>';
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = 800;
const rowsCols = 10;
const cw = Math.floor(width / rowsCols);
const cells = [];
let stack = [];
let current;
let before;
let playerCell;

createGrid();
const interv = setInterval(mazeGenerator, 0);
// while(!cells.every(element => element.visited)){ //generate without animation (making error);
//     mazeGenerator();
// }

function createGrid() {
    for (let j = 0; j < rowsCols; j++) {
        for (let i = 0; i < rowsCols; i++) {
            cells.push(new Cell(i, j));
        }
    }
    current = cells[Math.floor(Math.random() * (rowsCols * rowsCols))];  // -- alternative random maze begin generation
    //current = cells[rowsCols * rowsCols - 1];
    current.visited = true;
    cells.forEach(element => element.setup());
}

function Cell(i, j) {
    this.i = i;
    this.j = j;
    this.place = j * rowsCols + i, rowsCols;
    this.walls = [true, true, true, true]; //Top,Right,Bottom,Left;
    this.neighbours = [];
    this.unvisitedNeighbours = [];
    this.visited = false;
    this.player = false;
    this.finish = false;
    let x = cw * j;
    let y = cw * i;

    this.setup = () => {
        playerCell = cells[0];
        for (p = 0; p < 4; p++) {
            if (this.i !== 0 && p == 0) this.neighbours.push(cells[this.place - 1]); //top
            else if (this.j !== rowsCols - 1 && p == 1) this.neighbours.push(cells[this.place + rowsCols]);//Right
            else if (this.i !== rowsCols - 1 && p == 2) this.neighbours.push(cells[this.place + 1]);//Bottom
            else if (this.j !== 0 && p == 3) this.neighbours.push(cells[this.place - rowsCols]); //Left
            else this.neighbours.push(null);
        }
    }

    this.draw = () => {
        if (this.visited) ctx.fillStyle = '#343448';
        if (this.finish === true) ctx.fillStyle = 'rgb(10,150,50)';
        if (this.player) ctx.fillStyle = 'rgb(10,90,180)';
        if (this.creating) ctx.fillStyle = '#fff';
        if (this.checked) ctx.fillStyle = '#f45';
        ctx.fillRect(x, y, cw, cw);

        ctx.beginPath();
        ctx.strokeStyle = '#fff';
        if (this.walls[0]) line(x, y, x + cw, y);
        if (this.walls[1]) line(x + cw, y, x + cw, y + cw);
        if (this.walls[2]) line(x + cw, y + cw, x, y + cw);
        if (this.walls[3]) line(x, y + cw, x, y);
        ctx.stroke();
        ctx.closePath();
    }

    this.isNeighbours = (attrib) => {
        this.unvisitedNeighbours = [];
        for (i = 0; i < 4; i++) {
            if (this.neighbours[i] && !this.neighbours[i][attrib]) this.unvisitedNeighbours.push(this.neighbours[i]);
        }
        if (this.unvisitedNeighbours.length > 0) {
            return this.unvisitedNeighbours[Math.floor(Math.random() * this.unvisitedNeighbours.length)];
        } else return null;
    }
}

function mazeGenerator() {
    cells[0].player = true;
    cells[rowsCols * rowsCols - 1].finish = true;
    before = current;
    current = current.isNeighbours('visited');
    if (current) {
        if (before.place + 1 === current.place) {
            current.walls[0] = false;
            before.walls[2] = false;
        } else if (before.place - 1 === current.place) {
            current.walls[2] = false;
            before.walls[0] = false;
        } else if (before.place - rowsCols === current.place) {
            current.walls[1] = false;
            before.walls[3] = false;
        } else if (before.place + rowsCols === current.place) {
            current.walls[3] = false;
            before.walls[1] = false;
        }

        current.visited = true;
        stack.push(current);
        current.draw();
    } else {
        current = stack.pop();
    }
    current.creating = true;
    before.creating = false;
    current.draw()
    before.draw();
    if (cells.every(element => element.visited)) {
        clearInterval(interv);
        current.creating = false;
        current.draw();
        stack = [];
    }

}

document.addEventListener('keydown', (btn) => {
    if (playerCell === undefined) {
        cells.forEach(element => {
            if (element.player === true) playerCell = element;
        })
    }
    if (btn.key == 'w') move(0, -1);
    if (btn.key == 'd') move(1, rowsCols);
    if (btn.key == 's') move(2, 1);
    if (btn.key == 'a') move(3, -rowsCols);

    if (playerCell.place === rowsCols * rowsCols - 1) gameOver();
})

function move(wall, num) {
    if (playerCell.walls[wall] === false) {
        playerCell.player = false;
        playerCell.draw();
        playerCell = cells[playerCell.place + num];
        playerCell.player = true;
        playerCell.draw();
    }
}
function line(x, y, xa, ya) {
    ctx.moveTo(x, y);
    ctx.lineTo(xa, ya);
}
function gameOver() {
    console.log('gameOver! \nGreat job !');
}


//Objectives:
// -- Implement path-finding algorithm --Pending
// -- refactor once more
// -- change neighbour system to reduce code length !!!!


/*
probably WORKS :
1. while current cell is not finish one
    1.mark current cell as visited
    2.if is there any way to go next neighbour cell
        2.push current cell to stack
        3.make current cell next one
    3. else if there is no any way
        make current cell the popped one of the stack

*/