const target = document.getElementById('target-element');
const codeBox = document.getElementById('css-code');
const workspace = document.getElementById('workspace');
const bgUpload = document.getElementById('bg-upload');

let points = []; // Array of objects {x: 50, y: 0} (percentages)
let activeHandleIndex = null;
let isDragging = false;

// Initial Shape (Triangle)
const shapes = {
    triangle:  [{x: 50, y: 0}, {x: 0, y: 100}, {x: 100, y: 100}],
    trapezoid: [{x: 20, y: 0}, {x: 80, y: 0}, {x: 100, y: 100}, {x: 0, y: 100}],
    hexagon:   [{x: 50, y: 0}, {x: 100, y: 25}, {x: 100, y: 75}, {x: 50, y: 100}, {x: 0, y: 75}, {x: 0, y: 25}],
    cross:     [{x: 10, y: 25}, {x: 35, y: 25}, {x: 35, y: 0}, {x: 65, y: 0}, {x: 65, y: 25}, {x: 90, y: 25}, {x: 90, y: 75}, {x: 65, y: 75}, {x: 65, y: 100}, {x: 35, y: 100}, {x: 35, y: 75}, {x: 10, y: 75}],
    message:   [{x: 0, y: 0}, {x: 100, y: 0}, {x: 100, y: 75}, {x: 75, y: 75}, {x: 75, y: 100}, {x: 50, y: 75}, {x: 0, y: 75}]
};

// Initialize
setShape('triangle');

// --- Core Logic ---

function setShape(shapeName) {
    if (shapeName === 'circle') {
        // Special case for circle
        points = []; // Clear polygon points
        renderHandles();
        const code = "clip-path: circle(50% at 50% 50%);";
        target.style.clipPath = "circle(50% at 50% 50%)";
        codeBox.innerText = code;
        return;
    }
    
    // Deep copy the preset array
    points = JSON.parse(JSON.stringify(shapes[shapeName]));
    renderHandles();
    updateClipPath();
}

function renderHandles() {
    // Clear existing handles
    target.innerHTML = '';

    points.forEach((p, index) => {
        const handle = document.createElement('div');
        handle.classList.add('handle');
        handle.style.left = p.x + '%';
        handle.style.top = p.y + '%';
        
        // Mouse Down Event
        handle.addEventListener('mousedown', (e) => {
            e.stopPropagation(); // Prevent bubbling
            isDragging = true;
            activeHandleIndex = index;
        });

        target.appendChild(handle);
    });
}

// Global Mouse Move (to handle dragging even if mouse leaves the handle dot)
document.addEventListener('mousemove', (e) => {
    if (!isDragging || activeHandleIndex === null) return;

    const rect = target.getBoundingClientRect();
    
    // Calculate position relative to the box
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // Constrain to box limits (0 to width/height)
    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));

    // Convert to Percentage
    const xPct = Math.round((x / rect.width) * 100);
    const yPct = Math.round((y / rect.height) * 100);

    // Update Data
    points[activeHandleIndex].x = xPct;
    points[activeHandleIndex].y = yPct;

    // Update UI (Visually move the handle)
    const handle = target.children[activeHandleIndex];
    if (handle) {
        handle.style.left = xPct + '%';
        handle.style.top = yPct + '%';
    }

    updateClipPath();
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    activeHandleIndex = null;
});

function updateClipPath() {
    if (points.length === 0) return;

    // Generate string: "50% 0%, 100% 100%..."
    const polyString = points.map(p => `${p.x}% ${p.y}%`).join(', ');
    const cssValue = `polygon(${polyString})`;
    
    target.style.clipPath = cssValue;
    target.style.webkitClipPath = cssValue;
    
    codeBox.innerText = `clip-path: ${cssValue};`;
}

// Copy Button
document.getElementById('btn-copy').addEventListener('click', function() {
    navigator.clipboard.writeText(codeBox.innerText);
    const original = this.innerText;
    this.innerText = "Copied!";
    setTimeout(() => this.innerText = original, 1500);
});

// Background Image Upload
bgUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            target.style.backgroundImage = `url(${event.target.result})`;
            target.style.backgroundSize = "cover";
            target.style.backgroundPosition = "center";
        };
        reader.readAsDataURL(file);
    }
});