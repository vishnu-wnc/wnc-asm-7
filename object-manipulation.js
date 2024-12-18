var image = document.getElementById('image');
var file = document.getElementById('file');
var addCircleButton = document.getElementById('add-circle-button')

//canvas
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var canvasDiv = document.getElementById("canvas-div");

var removeCircleButton = document.querySelector('#remove-circle-button')

//Map
var circleMap = new Map();

//By how much to move
var movePx = 2;

//current circle which is clicked
var clickedCircle = null;

/**
 * Definition of circle
 */
class Circle {

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} radius 
     * @param {String} color 
     */
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }


    /**
     * Used for drawing on canvas called from function drawOnCanvas()
     * @param {HTMLCanvasElement} ctx 
     */
    drawShape(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    /**
     * after clicking if click coordinate is inside the circle
     * @param {Number} mouseOnX 
     * @param {Number} mouseOnY 
     * @returns 
     */
    isSelected(mouseOnX, mouseOnY) {
        const distance = Math.sqrt((mouseOnX - this.x) ** 2 + (mouseOnY - this.y) ** 2);
        return distance <= this.radius;
    }
}

/**
 * Uploading image in background of div and making canvas transparent
 */
function upload() {
    image.src = URL.createObjectURL(file.files[0]);
    let canvasContainer = document.getElementById('canvas-div');
    canvasContainer.style.backgroundImage = "url('" + image.src + "')";
    canvasContainer.style.backgroundSize = "cover";
    canvasContainer.style.backgroundPosition = "center";
    canvasContainer.style.backgroundRepeat = "no-repeat";
    canvas.style.opacity = 1;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}



// const radius = canvas.height / 10;

/**
 * radius of every circe
 */
const radius = 30;

/**
 * Key for every object in Map 
 */
var index = 0;

/**
 * 
 * @param {Circle} circle 
 * @returns true if we clicked inside the circle and false if click outside the circle
 */
function isInsideCanvas(circle) {
    if (circle.x - circle.radius < 0 || circle.x + circle.radius > canvas.width || circle.y - circle.radius < 0 || circle.y + circle.radius > canvas.height)
        return false;
    return true;
}

/**
 * Adding circle to the canvas after clicking add circle button
 */
addCircleButton.addEventListener("click", () => {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    if (isInsideCanvas(new Circle(x, y, radius, "red"))) {
        const circle = new Circle(x, y, radius, "red");
        circleMap.set(index, circle);
        index++;
        drawOnCanvas();
        console.log(circleMap);
    }
});


/**
 * Drawing on can after updating map
 */
function drawOnCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let cir of circleMap.values())
        cir.drawShape(ctx);
}


/**
 * Making and acessing event inside canvas and return the coordinates
 * @param {MouseEvent} event 
 * @returns 
 */
function mousePosition(event) {
    const area = canvas.getBoundingClientRect();

    // Calculate scaling factors for both axes
    const scalingOfX = canvas.width / area.width;
    const scalingOfY = canvas.height / area.height;

    // Correctly scale mouse coordinates based on canvas scaling
    const mouseOnX = (event.clientX - area.left) * scalingOfX;
    const mouseOnY = (event.clientY - area.top) * scalingOfY;

    return { mouseOnX, mouseOnY };
}

/**
 * For selecting the circle inside the canvas
 */
canvas.addEventListener("mousedown", function (event) {
    const { mouseOnX, mouseOnY } = mousePosition(event);
    let i = 0;
    for (let cir of circleMap.values()) {
        if (cir.isSelected(mouseOnX, mouseOnY)) {
            window.removeEventListener("keydown", moveListner);
            clickedCircle = cir;
            console.log("selected");
            console.log(clickedCircle);
            moveObject();
            break;
        }
    }
});

/**
 * For moving the object using arrow keys
 */
function moveObject() {
    window.addEventListener("keydown", moveListner);
}

// All four function are used to move the circle
function moveUp() {
    clickedCircle.y = Math.max(clickedCircle.radius, clickedCircle.y - movePx);
    drawOnCanvas();
}

function moveDown() {
    clickedCircle.y = Math.min(canvas.height - clickedCircle.radius, clickedCircle.y + movePx);
    drawOnCanvas();
}

function moveLeft() {
    clickedCircle.x = Math.max(clickedCircle.radius, clickedCircle.x - movePx);
    drawOnCanvas();
}

function moveRight() {
    clickedCircle.x = Math.min(canvas.width - clickedCircle.radius, clickedCircle.x + movePx);
    drawOnCanvas();
}

/**
 * taking event from keyboard and using all arrow keys
 */
moveListner = (e) => {
    if (e.key === "ArrowUp") {
        moveUp();
    } else if (e.key === "ArrowDown") {
        moveDown();
    } else if (e.key === "ArrowLeft") {
        moveLeft();
    } else if (e.key === "ArrowRight") {
        moveRight();
    }
}


/**
 * getting object key by value used for deletion from map
 * @param {Map} map
 * @param {Circle} object  
 */
function getKeyByValue(map, object) {
    for(let [key, value] of map.entries()) {
        if(value === object)
            return key;
    }
}

/**
 * Function is executing the task for deletion of object in 5 seconds
 * @returns Promise which first delete the circle and then starts to delete another target one
 */
function removeCircle() {
    return new Promise((resolve, reject) => {
        if(clickedCircle == null) {
            alert("No circle is Selected");
            return;
        }

        let deletingCircle = clickedCircle;
        clickedCircle = null;


        setTimeout(() => {
            const deletingKey = getKeyByValue(circleMap, deletingCircle);

            if(circleMap.has(deletingKey)) {
                circleMap.delete(deletingKey);
                deletingCircle = null;
                drawOnCanvas();
            }
        }, 5000)

    })
}

//Removing the circle button after clicking
removeCircleButton.addEventListener("click", () =>{
    removeCircle();
});
