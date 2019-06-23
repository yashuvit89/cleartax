class App {
  constructor() {
    this.grid = [];
    this.rows = 0;
    this.noOfSeats = 0;
    this.isAlreadySelected = false;
  }

  init() {
    const rows = parseInt(prompt("Enter number of rows"), 10);
    const noOfSeats = parseInt(prompt("Enter number of seats"), 10);

    if (isNaN(rows) || rows <= 0 || isNaN(noOfSeats) || noOfSeats <= 0) {
      alert("Please enter valid number of rows");
      return;
    }

    this.rows = rows;
    this.noOfSeats = noOfSeats;

    this.grid = HelperUtils.createGridArray(rows, rows);
    HelperUtils.fillSeats(this.grid);

    DomUtils.createLayout(this.grid);
    this.attachEvent();
  }

  attachEvent() {
    // register click handler
    const gridTable = document.querySelector("#grid-table");
    gridTable.addEventListener("click", this.handleGridClick.bind(this));
  }

  handleGridClick(e) {
    const target = e.target;

    // filter on td
    if (target.nodeName.toLowerCase() === "td") {
      const value = target.id;
      const [x, y] = value.split("-");
      this.checkCollision(parseInt(x, 10), parseInt(y, 10));
    }
  }

  checkCollision(row, column) {
    // console.log('check collision for' + row + '-'+ column);
    const currentRow = this.grid[row];

    if (this.isAlreadySelected) {
      console.log("Grid already selected");

      // TODO: update grid html
    }

    // get from click point to right seats
    const endIndex = column + this.noOfSeats;
    const seatsFromClick = currentRow.slice(column, endIndex);
    console.log("rest of display curr row:" + seatsFromClick);
    const isOutOfBounds = endIndex > this.grid[row].length;
    // check if there is occupied seat
    if (seatsFromClick.indexOf("O") > -1 || isOutOfBounds) {
      // yes occupied
      console.log("occupied");
    } else {
      // available
      console.log("available");
      const gridClone = [...this.grid];
      DomUtils.fillSeats(gridClone, row, column, endIndex, this.noOfSeats);
      this.isAlreadySelected = true;
    }

    // console.log("Grid", this.grid);
  }
}

class DomUtils {
  static createLayout(model) {
    const size = model.length;

    const theaterEl = document.querySelector("#theater");
    const gridTable = document.createElement("table");
    gridTable.setAttribute("id", "grid-table");

    // iterate over rows|columns and paint grid cell
    for (let i = 0; i < size; i++) {
      const gridRow = document.createElement("tr");

      for (let j = 0; j < size; j++) {
        const gridData = document.createElement("td");
        let value = model[i][j];
        if (value !== "O") {
          // value = value.split('-')[1];
          gridData.classList.add("default");
        }
        gridData.setAttribute("id", `${i}-${j}`);
        gridData.innerText = value;
        gridRow.appendChild(gridData);
      }

      gridTable.appendChild(gridRow);
    }
    theaterEl.appendChild(gridTable);
  }

  static fillSeats(grid, row, column, columnEnd, noOfSeats) {
    const currentRow = grid[row];
    for (var i = column; i < columnEnd; i++) {
      const selectorValue = `${row}-${i}`;
      const currTd = document.getElementById(selectorValue);
      currTd.innerText = "S";
      currTd.classList.add("selected");
      grid[row][i] = "S";
    }
  }
}

class HelperUtils {
  // assuming fixed theature of rows and columns
  static createGridArray(rows, columns) {
    const alphabets = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "I"];
    const gridArray = [];
    for (let i = 0; i < rows; i++) {
      let gridRow = [];
      for (var j = 0; j < columns; j++) {
        const formattedValue = `${alphabets[i] || "Z"}-${j + 1}`;
        // const formattedValue = `${j+1}`
        gridRow.push(formattedValue);
      }
      gridArray.push(gridRow);
    }
    return gridArray;
  }

  // Fill/mark few seats already selected
  static fillSeats(grid) {
    const size = grid.length;
    for (let i = 0; i < size; i++) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      grid[x][y] = "O";
    }
    return grid;
  }
}

window.onload = function() {
  const APP = new App();
  APP.init();
};
