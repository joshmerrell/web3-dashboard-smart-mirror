// Conway's Game of Life implementation, to be used if webcam is not available or is blocked by the user

const tileSize = 20;
const canvas = document.createElement("canvas");
canvas.id = "circles";
// styles set here to make sure that it gets the right size before rendering, otherwise it will cause blurry canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.width = "100vw";
canvas.style.height = "100vh";
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
const tilesX = Math.floor(canvas.clientWidth / tileSize);
const tilesY = Math.floor(canvas.clientHeight / tileSize);
const fillCol = "red";
const stayCol = fillCol;
const clearCol = "white";
const gridCol = "#555";

let field = new Array(tilesY);
let tmpField = new Array(tilesY);
let mouseDown = false;
let animationInterval = -1;

for(let y = 0; y < tilesY; y++) {
	field[y] = new Array(tilesX);
	tmpField[y] = new Array(tilesX);
}

function resetField(main,temp) {
	if(main) field = new Array(tilesY);
	if(temp) tmpField = new Array(tilesY);
	for(let y = 0; y < tilesY; y++) {
		if(temp) tmpField[y] = new Array(tilesX);
		if(main) field[y] = new Array(tilesX);
	}
}

function drawGrid() {
	const tmpStyle = ctx.fillStyle;
	ctx.strokeStyle = gridCol;
	ctx.beginPath();
	for(let y = tileSize; y < canvas.clientHeight; y += tileSize) {
		ctx.moveTo(0, y);
		ctx.lineTo(canvas.clientWidth, y);
	}
	for(let x = tileSize; x < canvas.clientWidth; x += tileSize) {
		ctx.moveTo(x, 0);
		ctx.lineTo(x, canvas.clientHeight);
	}
	ctx.stroke();
	ctx.fillStyle = tmpStyle;
}

function fillCell(x,y) {
	ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
}

function clearCell(x,y) {
	ctx.fillStyle = "white";
	ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
}

function canvasPosition(pos) {
	const x = pos.clientX - canvas.offsetLeft;
	const y = pos.clientY - canvas.offsetTop
	return {
		x: x,
		y: y,
		tileX: Math.floor(x / tileSize),
		tileY: Math.floor(y / tileSize)
	}
}

function drawCanvas(grid) {
	ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	for(let y = 0; y < tilesY; y++) {
		for(let x = 0; x < tilesX; x++) {
			if(field[y][x])
				fillCell(x, y);
		}
	}
	if(grid) drawGrid();
}

function getNeighbors(x,y) {
	return {
		nw: (x <= 0 || y <= 0)?false:field[y-1][x-1],
		n: (y <= 0)?false:field[y-1][x],
		ne: (x >= tilesX || y <= 0)?false:field[y-1][x+1],
		w: (x <= 0)?false:field[y][x-1],
		e: (x >= tilesX-1)?false:field[y][x+1],
		sw: (x <= 0 || y >= tilesY-1)?false:field[y+1][x-1],
		s: (y >= tilesY-1)?false:field[y+1][x],
		se: (x >= tilesX-1 || y >= tilesY-1)?false:field[y+1][x+1]
	}
}

function doRules() {
	resetField(false,true);
	ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	for(let y = 0; y < tilesY; y++) {
		for(let x = 0; x < tilesX; x++) {
			const neighbors = getNeighbors(x,y);
			let aliveNeighbors = 0;
			if(neighbors.nw) aliveNeighbors++;
			if(neighbors.n) aliveNeighbors++;
			if(neighbors.ne) aliveNeighbors++;
			if(neighbors.w) aliveNeighbors++;
			if(neighbors.e) aliveNeighbors++;
			if(neighbors.sw) aliveNeighbors++;
			if(neighbors.s) aliveNeighbors++;
			if(neighbors.se) aliveNeighbors++;

			if(field[y][x]) {
				// Any live cell with fewer than two live neighbours
				// dies, as if by underpopulation.
				if(aliveNeighbors < 2) {
					tmpField[y][x] = false;
					clearCell(x, y);
				}

				// Any live cell with two or three live neighbours
				// lives on to the next generation.
				if(aliveNeighbors == 2 || aliveNeighbors == 3) {
					ctx.fillStyle = stayCol;
					fillCell(x, y);
					tmpField[y][x] = true;
				}
			} else if(aliveNeighbors === 3) {
				// Any dead cell with exactly three live neighbours
				// becomes a live cell, as if by reproduction.
				tmpField[y][x] = true;
				ctx.fillStyle = fillCol;
				fillCell(x, y);
			}
		}
	}

	drawGrid();
	field = tmpField.slice();
}

function doAnimation(time) {
	if(!mouseDown)
		doRules();
}

function mouseHandler(e) {
	if((e.buttons & 1) === 0) {
		mouseDown = false;
		return;
	}
	mouseDown = true;
	const pos = canvasPosition(e);
	field[pos.tileY][pos.tileX] = !e.shiftKey;
	ctx.fillStyle = e.shiftKey?clearCol:fillCol;
	fillCell(pos.tileX, pos.tileY);
}

function randomizeField() {
	resetField(true,true);
	for(let y = 0; y < tilesY; y++) {
		for(let x = 0; x < tilesX; x++) {
			if(Math.random() > 0.5) {
				ctx.fillStyle = fillCol;
				field[y][x] = true;
				fillCell(x, y);
			} else {
				ctx.fillStyle = clearCol;
				field[y][x] = false;
				clearCell(x, y);
			}
		}
	}
}

canvas.addEventListener("mousedown", mouseHandler);
canvas.addEventListener("mouseup", mouseHandler);
canvas.addEventListener("mousemove", mouseHandler);

randomizeField();

animationInterval = setInterval(doAnimation, 1000/20);

setInterval(randomizeField, 1000*30);