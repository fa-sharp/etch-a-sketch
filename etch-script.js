const etchGridElement = document.querySelector(".etch-grid");
const savedGridElement = document.querySelector(".saved-grid");

const resetGridButton = document.querySelector("#resetGridButton");
const saveGridButton = document.querySelector("#saveGridButton");
const eraserCheckbox = document.querySelector("#eraserCheckbox");

const DEFAULT_GRID_SIZE = 32;

let currentGridSize = DEFAULT_GRID_SIZE;
let eraser = false;

init();

/** Setting up the etch grid, saved grid, and controls on page load */
function init() {
    createEtchGrid(DEFAULT_GRID_SIZE);
    createSavedGrid();
    eraserCheckbox.checked = false;
    setUpControlListeners();
}

/******************* ETCH GRID SETUP **********************/

/** Clears the etch grid and creates a new one with the given size */
function createEtchGrid(size) {
    // validate size
    size = Number.parseInt(size);
    if (!size || size < 1 || size > 100) {
        console.error("Invalid grid size!");
        return;
    }
    currentGridSize = size;

    // reset etch grid (using childNodes.forEach() directly doesn't work because childNodes is a live collection)
    Array.from(etchGridElement.childNodes).forEach(child => child.remove());

    // set up CSS Grid
    etchGridElement.style.gridTemplateColumns = `repeat(${size},1fr)`;

    // create cells
    const numCells = size * size;
    for (let i = 0; i < numCells; i++) {
        const etchCell = document.createElement("div");
        etchCell.classList.add("etch-cell");
        etchGridElement.appendChild(etchCell);
    }

    // set up mouse event listeners (remove the old listeners first, if needed)
    etchGridElement.removeEventListener("pointerdown", onEtchGridPointerMove);
    etchGridElement.removeEventListener("pointermove", onEtchGridPointerMove);
    etchGridElement.addEventListener("pointerdown", onEtchGridPointerMove);
    etchGridElement.addEventListener("pointermove", onEtchGridPointerMove);
}

/** Mouse/pointer event listener for filling in the cells */
function onEtchGridPointerMove(event) {
    if (event.buttons !== 1) // check if primary mouse button is clicked
        return;
    event.preventDefault();
    
    // search for the cell using coordinates (can't use event.target because pointermove event on mobile won't update the target element as you move across the grid)
    const target = document.elementFromPoint(event.clientX,event.clientY);

    if (target.classList.contains("etch-cell")) { // check if target element is a cell
        if (!eraser)
            target.classList.add("filled");
        else
            target.classList.remove("filled");
    }
}
/****************************************************/



/********************* CONTROLS ********************/

/** Setting up the event listeners for the controls */
function setUpControlListeners() {

    // Event listener for reset button
    resetGridButton.addEventListener("click", () => {
        let newGridSize = prompt("New grid size (limit 100): ", currentGridSize);
        if (newGridSize)
            createEtchGrid(newGridSize);
    });

    // Event listener for save button
    saveGridButton.addEventListener("click", () => {
        saveCurrentGrid();
    });

    // Event listener for enabling/disabling eraser
    eraserCheckbox.addEventListener("change", (event) => {
        const {target} = event;
        eraser = target.checked;
        target.parentElement.classList.toggle("enabled");
    });
}

/****************************************************/



/****************** SAVING/LOADING DRAWING ******************/

/** Save the current drawing to local storage */
function saveCurrentGrid() {
    let drawingArray = [];
    etchGridElement.childNodes.forEach((cell,cellIndex) => {
        if (cell.classList.contains("filled"))
            drawingArray.push(cellIndex);
    });

    localStorage.setItem("gridSize", currentGridSize);
    localStorage.setItem("savedDrawing", JSON.stringify(drawingArray));
    
    createSavedGrid();
}

/** Re-create the saved drawing from local storage */
function createSavedGrid() {
    // reset saved grid
    Array.from(savedGridElement.childNodes).forEach(child => child.remove());

    // get saved drawing from local storage
    const size = localStorage.getItem("gridSize");
    const savedDrawing = JSON.parse(localStorage.getItem("savedDrawing"));

    // set up CSS Grid
    savedGridElement.style.gridTemplateColumns = `repeat(${size},1fr)`;

    // re-create cells from saved drawing
    const numCells = size * size;
    let savedDrawingIndex = 0;
    for (let i = 0; i < numCells; i++) {
        const savedCell = document.createElement("div");
        savedCell.classList.add("saved-cell");

        // check if cell at index i is filled in saved drawing - if so, add "filled" class
        if (savedDrawing[savedDrawingIndex] === i) {
            savedCell.classList.add("filled");
            savedDrawingIndex++;
        }

        savedGridElement.appendChild(savedCell);
    }
}

/********************************************************/