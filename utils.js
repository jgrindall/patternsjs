const affine  = require('affine');
const rt3 = Math.sqrt(3);
const mark = (p, r = 3, clr = 'rgb(200,40,40)')=>{
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, 2*Math.PI);
    ctx.fillStyle = clr;
    ctx.fill();
    ctx.closePath();
};
affine.identity = function(){
    return new affine.translation(0, 0);
};
const getInverse = t=>{
    let det = getDet(t)
    if(det !== 0){
        return new affine.affine2d(t.m11/det, -t.m10/det, -t.m01/det, t.m00/det, -t.v0, -t.v1);
    }
    throw "no inverse"
};

const getDet = t=>{
    return t.m00*t.m11 - t.m01*t.m10;
};

const _compose = (a, b)=>{
    // a then b
    const c = affine.identity();
    c.rightComposeWith(b)
    c.rightComposeWith(a)
    return c
};

const compose = (...args)=>{
    const ctx = this;
    if(args.length <= 1){
        throw "ONE!?!!?"
    }
    if(args.length === 2){
        return _compose(args[0], args[1]);
    }
    const last = args.pop();
    const firsts = compose.call(ctx, ...args);
    return _compose(firsts, last);
};

const TEST = compose(new affine.translation(0, 0), new affine.translation(0, 0), new affine.translation(0, 0))

const getReflection = (pt, angleRad)=>{
    const d = 50;
    const EPS = 0.00001;
    let t = new affine.translation(pt.x, pt.y);
    let tinv = getInverse(t)
    let r = new affine.reflection(angleRad);
    const composed = compose(compose(tinv, r), t)
    const img = composed.getTransformedVec(pt);
    const pointOnLine = {x:pt.x + d*Math.cos(angleRad), y:pt.y + d*Math.sin(angleRad)};
    const img2 = composed.getTransformedVec(pointOnLine);
    const pointOffLine = {x:pt.x - d*Math.sin(angleRad), y:pt.y + d*Math.cos(angleRad)};
    const pointOffLineDash = {x:pt.x + d*Math.sin(angleRad), y:pt.y - d*Math.cos(angleRad)};
    const pointOffLineTrans = composed.getTransformedVec(pointOffLine);
    console.assert(Math.abs(img.x - pt.x) < EPS);
    console.assert(Math.abs(img.y - pt.y) < EPS);
    console.assert(Math.abs(img2.x - pointOnLine.x) < EPS);
    console.assert(Math.abs(img2.y - pointOnLine.y) < EPS);
    console.assert(Math.abs(pointOffLineTrans.x - pointOffLineDash.x) < EPS);
    console.assert(Math.abs(pointOffLineTrans.y - pointOffLineDash.y) < EPS);
    return composed;
};

const markLine = (p, angle, clr= 'rgba(130,130,150, 0.75)')=>{
    ctx.beginPath();
    const d = 500
    ctx.strokeStyle = clr;
    ctx.moveTo(p.x + d*Math.cos(angle)*d, p.y + d*Math.sin(angle)*d);
    ctx.lineTo(p.x - d*Math.cos(angle)*d, p.y - d*Math.sin(angle)*d);
    ctx.stroke();
    ctx.closePath();
}

const add = (...a) => {
    const origin = {x:0, y:0}
    return a.reduce((previous, current) => {
        return {
            x:previous.x + current.x,
            y:previous.y + current.y
        };
    }, origin);
}

const pMinusQ = (p, q) => {
    return {
        x:p.x - q.x,
        y:p.y - q.y
    };
}

const times = (p, n)=>{
    return {
        x:p.x * n,
        y:p.y * n
    };
};

const pToQ = (p, q)=>{
    return pMinusQ(q, p);
};

const moveTo = function(ctx, p){
    ctx.moveTo(p.x, p.y);
};
const lineTo = function(ctx, p){
    ctx.lineTo(p.x, p.y);
};

const perp = v=>{
    return {
        x:-v.y,
        y:v.x
    }
};

const dot = (a, b)=>{
    return a.x*b.x + a.y*b.y;
};

const modSqr = (a)=>{
    return dot(a, a);
};

const getMultipliersForBasis = (p, v, w)=>{
    // any p can be expressed as: p = Lambda v + Mu w
    const lambda = dot(p, v)/modSqr(v);
    const mu = dot(p, w)/modSqr(w);
    return {lambda, mu};
}

const cross = (p, q)=>{
    // multiple of 'k'
    return p.x*q.y - p.y*q.x;
}

const vectorsIntersect = (p, v, q, w)=>{
    const mu = cross(pMinusQ(p, q), v) / cross(w, v);
    const lambda = cross(pMinusQ(q, p), v) / cross(v, w);
    return !isNaN(mu) && mu >= 0 && mu <= 1 && !isNaN(lambda) && lambda >= 0 && lambda <= 1;
}

const drawSegment=(segment, i)=>{
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "green";
    moveTo(ctx, segment.start)
    lineTo(ctx, segment.end)
    ctx.closePath();
    ctx.stroke()
};

const drawSegments=(segments, i)=>{
    _.each(segments, (segment)=>{
        drawSegment(segment, i)
    })
};

const transformPt=(p, t)=>{
    return t.getTransformedVec(p)
};

const transformSegment = (segment, t)=>{
    return {
        start:transformPt(segment.start, t),
        end:transformPt(segment.end, t)
    };
};

const transformSegments = (segments, t)=>{
    return _.map(segments, segment=>{
        return transformSegment(segment, t)
    })
};




