let rectangle;

function createRectangleWithSpiral() {
    // Create the semi-transparent grey rectangle
    rectangle = document.createElement('div');
    rectangle.style.width = '100vw'; // Full width
    rectangle.style.height = '100vh'; // Full height
    rectangle.style.position = 'fixed';
    rectangle.style.zIndex = '9999';
    rectangle.style.top = '0';
    rectangle.style.left = '0';
    rectangle.style.display = 'none'; // Add this line

    let spiralURL = chrome.runtime.getURL('images/spiral.png');

    let image = document.createElement('div');
    image.style.backgroundImage = `url(${spiralURL})`;
    image.style.border = '3px solid black';
    image.style.backgroundSize = '100% 100%'; // The image will now stretch to fit the rectangle
    image.style.width = '100%';
    image.style.height = '100%';

    rectangle.appendChild(image);

    rectangle.style.backgroundBlendMode = 'multiply'; // Blend the image with the semi-transparent grey color
    rectangle.style.backgroundColor = 'rgba(128, 128, 128, 0.0)'; // Semi-transparent grey
    rectangle.style.boxShadow = 'inset 0 0 120px rgba(117, 117, 117, 0.41)'; // Add shadow

    document.body.appendChild(rectangle);

    let isDragging = false;
    let isResizing = false;
    let startX, startY;

    rectangle.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging && !isResizing) return;

        let dx = e.clientX - startX;
        let dy = e.clientY - startY;

        let newLeft = rectangle.offsetLeft + dx;
        let newTop = rectangle.offsetTop + dy;

        if (isDragging) {
            if (newLeft >= 0 && newTop >= 0 &&
                newLeft + rectangle.offsetWidth <= window.innerWidth &&
                newTop + rectangle.offsetHeight <= window.innerHeight) {
                rectangle.style.left = `${newLeft}px`;
                rectangle.style.top = `${newTop}px`;
            }
        }

        if (isResizing) {
            let newWidth = rectangle.offsetWidth + dx;
            let newHeight = rectangle.offsetHeight + dy;

            if (newWidth >= 0 && newHeight >= 0 &&
                newLeft + newWidth <= window.innerWidth &&
                newTop + newHeight <= window.innerHeight) {
                rectangle.style.width = `${newWidth}px`;
                rectangle.style.height = `${newHeight}px`;
            }
        }

        startX = e.clientX;
        startY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        isResizing = false;
    });

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.action == "flip-horizontal") {
                let currentTransform = image.style.transform;
                if (currentTransform.includes('scaleX')) {
                    // If image is already flipped horizontally, we revert it back
                    image.style.transform = currentTransform.replace('scaleX(-1)', '');
                } else {
                    // Otherwise, we flip the image horizontally
                    image.style.transform += ' scaleX(-1)';
                }
            }
            if (request.action == "flip-vertical") {
                let currentTransform = image.style.transform;
                if (currentTransform.includes('scaleY')) {
                    // If image is already flipped vertically, we revert it back
                    image.style.transform = currentTransform.replace('scaleY(-1)', '');
                } else {
                    // Otherwise, we flip the image vertically
                    image.style.transform += ' scaleY(-1)';
                }
            }
        }
    );

    // Make the rectangle resizable
    let corner = 'se';
    let resizer = document.createElement('div');
    resizer.style.width = '50px';
    resizer.style.height = '50px';
    resizer.style.border = '3px dotted black';
    resizer.style.backgroundColor = 'rgb(0 0 0 / 9%)';
    resizer.style.position = 'absolute';
    resizer.style.cursor = `${corner}-resize`;

    // Position resizer at the right corner
    if (corner.includes('s')) resizer.style.bottom = '0';
    if (corner.includes('e')) resizer.style.right = '0';

    rectangle.appendChild(resizer);

    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        e.stopPropagation();
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.command === 'activate') {
        if (!rectangle) {
            createRectangleWithSpiral();
        } else {
            rectangle.style.display = rectangle.style.display === 'none' ? 'block' : 'none';
        }
    }
});

window.onload = function() {
    if (!rectangle) {
        createRectangleWithSpiral();
    }


chrome.runtime.sendMessage({command: 'contentScriptLoaded'});
};