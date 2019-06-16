const canvas = $("canvas").get(0);
const ctx = canvas.getContext("2d");
const gp = groupP3M1;

const trans = compose(new affine.translation(80, 50), new affine.rotation(0.2))

const baseTransforms = _.map(gp.baseTransforms, t=>{
    return compose(t, trans);
})

const tRect = gp.baseRect.getTransformed(trans)

new RectDrawer(tRect, ctx).draw();

const CLRS=['rgba(0,200,0, 1)','rgba(0,200,0, 0.9)','rgba(0,200,0, 0.8)','rgba(0,200,0, 0.7)','rgba(0,200,0, 0.6)',

'rgba(0,200,0, 0.5)','rgba(0,200,0, 0.4)','rgba(0,200,0, 1, 0.3)','rgba(0,200,0, 1, 0.2)','rgba(0,200,0, 1, 0.1)']

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
        start:{x:45, y:50},
        end:{x:45, y:40}
    }
];

const bounds = new Rect({x:0, y:0}, {x:1024, y:0}, {x:0, y:600})

const coverTransforms = tRect.getTransformsForRect(bounds)

_.each(coverTransforms, (coverT, i)=>{
    _.each(baseTransforms, (baseTransform)=>{
        let t = compose(baseTransform, coverT);
        let transformedSegments = transformSegments(lineSegments, t)
        drawSegments(transformedSegments, i)
    });
});




