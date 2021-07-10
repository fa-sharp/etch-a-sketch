const DEFAULT_GRID_SIZE = 32;
const etchGridElement = document.querySelector(".etch-grid");
const resetGridButton = document.querySelector("#resetGridButton");

/** Mouse event listener for filling in the cells */
const onEtchGridPointerMove = (event) => {
    if (event.buttons !== 1) // check if primary mouse button is clicked
        return;
    
    // search for the cell using coordinates (pointermove event won't update the target element as you move across the grid)
    const target = document.elementFromPoint(event.clientX,event.clientY);

    if (target.classList.contains("etch-cell")) // check if target element is a cell
        target.classList.add("filled");
}

/** Clears the etch grid and creates a new one with the given size */
const createEtchGrid = (size) => {

    // validate size
    size = Number.parseInt(size);
    if (size < 1 || size > 100) {
        console.error("Invalid grid size!");
        return;
    }

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

// Adding event listener for reset button
resetGridButton.addEventListener("click", () => {
    let newGridSize = prompt("New grid size (limit 100): ", "32");
    if (newGridSize)
        createEtchGrid(newGridSize);
});

// Creating the etch grid on page load
createEtchGrid(DEFAULT_GRID_SIZE);