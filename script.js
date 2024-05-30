// Get the canvas element and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions
canvas.width = 600;
canvas.height = 600;

// Define the tile size and calculate the number of rows and columns
const tileSize = 40;
const rows = canvas.width / tileSize;
const cols = canvas.height / tileSize;

// Define the maze layout
const maze = [
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0]
];

// Load the bush image from the Images folder
const bushImage = new Image();
bushImage.src = 'Images/Bushes.jpg';

// load dog image
const dogImage = new Image();
dogImage.src = 'Images/dog.png';

//load bone image
const boneImage = new Image();
boneImage.src = 'Images/Bone.png';


// Rotate the image 90 degrees clockwise
bushImage.onload = function () {
    const rotatedBushImage = rotateImage(bushImage, 90);
    draw(rotatedBushImage);
};

// Function to rotate an image
function rotateImage(image, angle) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = image.height;
    canvas.height = image.width;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle * Math.PI / 180);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    return canvas;
}

//function to draw the dog
function drawDog() {

    ctx.drawImage(dogImage, dog.x, dog.y, dog.width, dog.height);

}


// Define the dog object
const dog = {
    x: 0,
    y: 0,
    width: tileSize,
    height: tileSize,
};

// Define the bone object
const bone = {
    x: (cols - 1) * tileSize,
    y: (rows - 1) * tileSize,
    width: tileSize,
    height: tileSize,

};

// Function to draw the maze
function drawMaze() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (maze[row][col] === 1) {
                ctx.drawImage(bushImage, col * tileSize, row * tileSize, tileSize, tileSize);
            }
        }
    }
}


// Function to draw the bone
function drawBone() {
    ctx.drawImage(boneImage, bone.x, bone.y, bone.width, bone.height);
}

// Function to draw fog effect
function drawFog() {
    // Set the global alpha value to control transparency
    ctx.globalAlpha = 0.8; // Adjust this value as needed for the desired fog density

    // Fill the entire canvas with a semi-transparent gray color
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Use 'destination-out' composite operation to reveal the area around the dog
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.arc(dog.x + dog.width / 2, dog.y + dog.height / 2, 100, 0, Math.PI * 2); // Adjust radius as needed
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over'; // Reset composite operation
}

// Function to draw everything on the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    drawDog();
    drawBone();
    drawFog();
}

// Function to move the dog and handle collisions
function moveDog(dx, dy) {
    const newX = dog.x + dx;
    const newY = dog.y + dy;

    const col = Math.floor(newX / tileSize);
    const row = Math.floor(newY / tileSize);

    if (maze[row] && maze[row][col] === 0) {
        dog.x = newX;
        dog.y = newY;
    }

    if (dog.x === bone.x && dog.y === bone.y) {
        setTimeout(() => {
            alert('You found the bone!');
            dog.x = 0;
            dog.y = 0;
            draw();
        }, 100);
    }
}

// Event listener for keyboard input to move the dog
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            moveDog(0, -tileSize);
            break;
        case 'ArrowDown':
            moveDog(0, tileSize);
            break;
        case 'ArrowLeft':
            moveDog(-tileSize, 0);
            break;
        case 'ArrowRight':
            moveDog(tileSize, 0);
            break;
    }
    draw();
});

// Variable to track whether the game is paused
let paused = false;

// Event listener for keyboard input to toggle pause
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        togglePause();
    }
});

// Function to toggle pause
function togglePause() {
    paused = !paused;
    if (paused) {
        // Show pause menu
        showPauseMenu();
    } else {
        // Hide pause menu
        hidePauseMenu();
    }
}

// Function to show pause menu
function showPauseMenu() {
    // Blur the canvas
    canvas.style.filter = 'blur(5px)';

    // Show the pause menu elements
    pauseMenu.style.display = 'block';
}

// Function to hide pause menu
function hidePauseMenu() {
    // Unblur the canvas
    canvas.style.filter = 'none';

    // Hide the pause menu elements
    pauseMenu.style.display = 'none';
}

// Event listeners for pause menu buttons
resumeButton.addEventListener('click', () => {
    togglePause();
});

mainMenuButton.addEventListener('click', () => {
    window.location.href = 'start.html'; // Redirect to the main menu
});

quitButton.addEventListener('click', () => {
    window.close(); // Close the tab
});

document.getElementById('helpButton').addEventListener('click', function () {
    document.getElementById('helpModal').style.display = 'block';
});

document.querySelector('.close-button').addEventListener('click', function () {
    document.getElementById('helpModal').style.display = 'none';
});

window.addEventListener('click', function (event) {
    if (event.target == document.getElementById('helpModal')) {
        document.getElementById('helpModal').style.display = 'none';
    }
});

// Initial draw to display the game
draw();
