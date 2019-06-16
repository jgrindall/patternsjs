const canvas = $("canvas").get(0);
const ctx = canvas.getContext("2d");
const gp = groupP3M1;

const trans = compose(new affine.translation(80, 50), new affine.scaling(0.75, 0.75), new affine.rotation(1.3))

const baseTransforms = _.map(gp.baseTransforms, t=>{
    return compose(t, trans);
})

const tRect = gp.baseRect.getTransformed(trans)

new RectDrawer(tRect, ctx).draw();

const lineSegments = [
    {
        start:{x:25, y:30},
        end:{x:25, y:70}
    },
    {
        start:{x:25, y:50},
        end:{x:45, y:50}
    },
    {
        start:{x:245, y:50},
        end:{x:45, y:40}
    }
];

const bounds = new Rect({x:0, y:0}, {x:1024, y:0}, {x:0, y:600})

const coverTransforms = tRect.getTransformsForRect(bounds)

const allT = [];

console.time("calc")

_.each(coverTransforms, (coverT, i)=>{
    _.each(baseTransforms, (baseTransform)=>{
        allT.push(compose(baseTransform, coverT));
    });
});

console.timeEnd("calc")
console.time("draw")

_.each(allT, (t, i)=>{
    drawSegments(transformSegments(lineSegments, t), i)
});

console.timeEnd("draw")





