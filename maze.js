document.body.innerHTML = document.body.innerHTML + '<canvas id = "canvas" width="800px" height="800px"></canvas>';
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = 800;
const rowsCols = 12;
const cw = Math.floor(width / rowsCols);
const cells = [];
const resBtn = document.querySelector('#resolve');
let stack = [];
let current;
let before;
let playerCell;
let resolveTime;

resBtn.addEventListener('click', btnClicked);

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
    this.checked = false;
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
        if (this.creating) ctx.fillStyle = '#fff';
        if (this.checked) ctx.fillStyle = '#f45';
        if (this.road) ctx.fillStyle = 'rgb(180,30,180)';
        if (this.player) ctx.fillStyle = 'rgb(10,90,180)';
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

    this.pickRandom = (attr) => {
        this.ways = [];
        for (i = 0; i < 4; i++) {
            if (attr === true && this.neighbours[i] && !this.neighbours[i].visited) {
                this.ways.push(this.neighbours[i]);
            }
            //Try to make this eeaseier (on bottom :))
            if (attr === false && this.neighbours[i] != null && (this.neighbours[i].walls[i + 2] == false || this.neighbours[i].walls[i - 2] == false) && (this.neighbours[i].checked == false)) {
                this.ways.push(this.neighbours[i]);
            }
        }
        if (this.ways.length > 0) {
            return this.ways[Math.floor(Math.random() * this.ways.length)];
        } else {
            return null;
        }
    }
}

function mazeGenerator() {
    cells[0].player = true;
    cells[rowsCols * rowsCols - 1].finish = true;
    before = current;
    current = current.pickRandom(true);
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
    current.draw();
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
function btnClicked() {
    resolveTime = setInterval(resolveMaze, 20)
}

let currentCell = playerCell;
let nextCell;
function resolveMaze() {
    if (currentCell.finish === false) {
        currentCell.checked = true;
        nextCell = currentCell.pickRandom(false);
        if (nextCell != null) {
            currentCell.draw();
            stack.push(currentCell);
            currentCell = nextCell;
        } else {
            currentCell = stack.pop();
        }
    } else {
        stack.forEach(element => element.road = true);
        cells.forEach(element => element.checked = false);
        cells.forEach(element => element.draw());
        clearInterval(resolveTime);
        return 0;
    }
}