
const sideLen = 100;

const p = {x:sideLen*rt3/2, y:sideLen/2};
const p2 = {x:p.x, y:sideLen + p.y};
const p3 = {x:p.x, y:sideLen + p2.y};

const t0 = getReflection(p, Math.PI/6)
const t1 = getReflection(p, Math.PI/2)
const t2 = getReflection(p, -Math.PI/6)
const t3 = getReflection(p2, Math.PI/6)
const t4 = getReflection(p2, -Math.PI/6)
const t5 = getReflection(p3, Math.PI/6)
const t6 = getReflection(p3, -Math.PI/6)
const id = affine.identity()

const groupP3M1 = {
    name:"p3m1",
    baseRect: new Rect({x:0,y:0}, {x:sideLen*rt3,y:0}, {x:0,y:3*sideLen}),
    baseTransforms:[
        id,
        t0,
        compose(t0, t1),
        t1,
        compose(t1, t0),
        t2,
        compose(t2, t3),
        compose(t2, t3, t1),
        compose(t2, t3, t4),
        t4,
        compose(t2, t4),
        compose(t2, t3, t4, t5),
        compose(t2, t3, t4, t5, t6),
        compose(t2, t3, t4, t6)
    ]

}


