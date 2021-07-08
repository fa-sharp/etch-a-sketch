const DEFAULT_GRID_SIZE = 32;
const etchGridElement = document.querySelector(".etch-grid");
const resetGridButton = document.querySelector("#resetGridButton");

/** Mouse event listener for filling in the cells */
const onEtchGridMouseOver = (event) => {
    let { target } = event;
    if (target.classList.contains("etch-cell")) // check if target element is a cell
        target.classList.add("filled");
}

/** Clears the etch grid and creates a new one with the given size */
const createEtchGrid = (size) => {

    // validate size
    if (size < 1 || size > 100) {
        console.error("Invalid grid size!");
        return;
    }

    // reset etch grid (using childNodes.forEach() doesn't work because childNodes a live collection)
    Array.from(etchGridElement.childNodes).forEach(child => child.remove())

    // set up CSS Grid
    etchGridElement.style.gridTemplateColumns = `repeat(${size},1fr)`;

    // create cells
    const numCells = size * size;
    for (let i = 0; i < numCells; i++) {
        const etchCell = document.createElement("div");
        etchCell.classList.add("etch-cell");
        etchGridElement.appendChild(etchCell);
    }

    // set up event listener (remove the old listener first, if it exists)
    etchGridElement.removeEventListener("mouseover", onEtchGridMouseOver);
    etchGridElement.addEventListener("mouseover", onEtchGridMouseOver);
}

// Adding event listener for reset button
resetGridButton.addEventListener("click", () => {
    let newGridSize = prompt("New grid size (limit 100): ", "32");
    createEtchGrid(newGridSize);
});

// Creating the etch grid on page load
createEtchGrid(DEFAULT_GRID_SIZE);