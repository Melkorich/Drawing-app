const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const toolBtns = document.querySelectorAll('.tool');
const fillColor = document.querySelector('#fill-color');
const sizeSlider = document.querySelector('#size-slider');
const colorBtns = document.querySelectorAll('.colors .option');
const colorPicker = document.querySelector('#color-picker');
const clearCanvasBtn = document.querySelector('.clear-canvas');
const saveImgsBtn = document.querySelector('.save-img');

//global variables with default value
let prevMouseX, prevMouseY, snapShot;
let isDrawing = false;
let selectedTool = 'brush';
let brushWidth = 5;
let selectedColor = '#000';

const setCanvasBackground = () => {
    //setting canvas bg to white while saving as img
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; //fillstyle will be as selected color, will be brush color
}

window.addEventListener('load', function () {
    //setting canvas width and height
    //offsetWidth/height returns viewable width|height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

const startDraw = function (e) {
    isDrawing = true;
    prevMouseX = e.offsetX; //passing current mouseX pisition as prevMouse value
    prevMouseY = e.offsetY;//passing current mouseY pisition as prevMouse value
    ctx.beginPath(); //creating a new path to draw
    ctx.lineWidth = brushWidth; //passing brushSize as line width
    ctx.strokeStyle = selectedColor; //passing selected color as stroke style
    ctx.fillStyle = selectedColor;//passing selected color as fill style
    snapShot = ctx.getImageData(0, 0, canvas.width, canvas.height); //copying canvas data and passing as snapshot value.. this avoids dragging the image
};

const drawRect = function (e) {
    //if fillColor not checked - draw a rect with border, otherwise drow with background
    if (!fillColor.checked) {
        //creating circle according to the mousepointer
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCircle = function (e) {
    ctx.beginPath(); //creating new path to draw circle
    //radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke(); //if fillColor is ckeched - draw filled circle if not - border
}

const drawTriangle = function (e) {
    ctx.beginPath(); //creating new path to draw triangle
    ctx.moveTo(prevMouseX, prevMouseY);//moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY); //creating first line according to the mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); //creating bottom line of triangle
    ctx.closePath();//closing with tridd line automaticallty
    // ctx.stroke();
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawing = function (e) {

    if (!isDrawing) return; //if isDrawing false return from here

    ctx.putImageData(snapShot, 0, 0); //additing copied canvas data on to this canvas

    if (selectedTool === 'brush' || selectedTool === 'eraser') {
        //if selected tool is eraser set color to white otherwise - picked color
        ctx.strokeStyle = selectedTool === 'eraser' ? '#fff' : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); //creating line according to the mouse pointer
        ctx.stroke(); //drawing line with color
    } else if (selectedTool === 'rectangle') {
        drawRect(e);
    } else if (selectedTool === 'circle') {
        drawCircle(e);
    } else {
        drawTriangle(e);
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener('click', () => { //adding click event 
        document.querySelector('.options .active').classList.remove('active');
        btn.classList.add('active'); //add to current
        selectedTool = btn.id;;
    });
});

sizeSlider.addEventListener('change', function () { //passing slider value as brushsize
    brushWidth = sizeSlider.value;
})

colorBtns.forEach(btn => {
    btn.addEventListener('click', () => { //click to all color btns
        document.querySelector('.options .selected').classList.remove('selected');
        btn.classList.add('selected'); //add to current

        //adding selected btn color as selected value
        selectedColor = (window.getComputedStyle(btn).getPropertyValue('background-color'));
    })
})

colorPicker.addEventListener('change', () => {
    //passing picked color value from color picker to last color btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
})

clearCanvasBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clearing whole canvas
    setCanvasBackground();
})

saveImgsBtn.addEventListener('click', () => {
    const link = document.createElement('a'); //creating :a: element
    link.download = `${Date.now()}.jpg`; //passing current date as link download value
    link.href = canvas.toDataURL();//passing canvasData as link href value
    link.click(); //clicking link to download img
})

canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', drawing);
canvas.addEventListener('mouseup', function () {
    isDrawing = false;
});

