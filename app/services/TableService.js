export const drawTableBackground = (ctx, canvasWidth, canvasHeight) => {
    console.log("canvas width " + canvasWidth + ", " + canvasHeight)
    ctx.fillStyle = '#006405';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
};