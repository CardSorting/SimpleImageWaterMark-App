(function() {
    // Configuration constants
    const config = {
        watermarkMaxDimension: 100,
        watermarkSrc: 'IMG.png',
        maxCanvasSize: 800,
    };

    // Initialize image and watermark
    let image, watermark;

    // Initialize event listeners
    function initEventListeners() {
        document.getElementById('imageInput').addEventListener('change', handleImageInput);
        document.getElementById('watermarkButton').addEventListener('click', applyWatermarkToCanvas);
    }

    // Load image
    function loadImage(img, src) {
        return new Promise((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Error loading image: ${src}`));
            img.src = src;
        });
    }

    async function handleImageInput(event) {
        image = new Image();
        await loadImage(image, URL.createObjectURL(event.target.files[0]));
        drawImageToCanvas();
    }

    // Draw image on canvas
    function drawImageToCanvas() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const aspectRatio = image.width / image.height;

        canvas.width = image.width > image.height ? config.maxCanvasSize : config.maxCanvasSize * aspectRatio;
        canvas.height = image.width > image.height ? config.maxCanvasSize / aspectRatio : config.maxCanvasSize;

        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }

    // Calculate watermark dimensions
    function calculateWatermarkDimensions() {
        const aspectRatio = watermark.width / watermark.height;
        return watermark.width > watermark.height ?
            { width: config.watermarkMaxDimension, height: config.watermarkMaxDimension / aspectRatio } :
            { height: config.watermarkMaxDimension, width: config.watermarkMaxDimension * aspectRatio };
    }

    // Apply watermark to canvas
    function applyWatermarkToCanvas() {
        if (!image) {
            console.warn("Image not loaded or selected yet.");
            return;
        }

        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        drawImageToCanvas();

        const { width, height } = calculateWatermarkDimensions();
        const watermarkX = canvas.width - width - 10;
        const watermarkY = canvas.height - height - 10;

        ctx.drawImage(watermark, watermarkX, watermarkY, width, height);

        triggerImageDownload(canvas);
    }

    // Trigger image download
    function triggerImageDownload(canvas) {
        canvas.toBlob(blob => {
            const downloadLink = document.getElementById('downloadLink');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = 'watermarked_image.png';
            downloadLink.style.display = 'block';
            downloadLink.click();
        }, 'image/png');
    }

    // Initialize the application
    async function init() {
        watermark = new Image();
        await loadImage(watermark, config.watermarkSrc);
        initEventListeners();
    }

    document.addEventListener('DOMContentLoaded', init);
})();