const canvas = $("canvas").get(0);
const ctx = canvas.getContext("2d");
const rt3 = Math.sqrt(3);
const affine  = require('affine');

const baseTranslations = [
    {
        x:rt3,
        y:0
    },
    {
        x:0,
        y:3
    }
];

const rnd = n=>{
    return Math.random()*2*n - n;
}
const v = {x:rnd(100), y:rnd(100)};
const boundsV = {x:rnd(250), y:rnd(250)};
const ar = rnd(2.5);
const ar2 = rnd(0.75);
const redraw = (e)=>{
    ctx.clearRect(0, 0, 1024, 600);
    const r = new Rect({x:e.pageX, y:e.pageY}, v, times(perp(v), ar));
    new RectDrawer(r, ctx).draw().fill();
    const bounds = new Rect({x:500, y:220}, boundsV, times(perp(boundsV), ar2));
    new RectDrawer(bounds, ctx).draw();

    const span = r.getSpanXYForRect(bounds);

    for(let i = span.lambda.min; i<= span.lambda.max; i++){
        for(let j = span.mu.min; j<= span.mu.max; j++){
            const offsetRect = r.getOffset(i, j);
            if(RectUtils.rectOverlapsRect(offsetRect, bounds)){
                new RectDrawer(offsetRect, ctx).draw();
            }
        }
    }

};

$("canvas").on("mousemove", redraw);








