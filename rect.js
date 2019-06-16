const RectUtils = {
    rectContainsPoint:(p, q)=>{
        const mult = p.getMultipliers(q);
        return mult.lambda >= 0 && mult.mu >= 0 && mult.lambda <= 1 && mult.mu <= 1;
    },
    rectAIsWithinRectB:(a, b)=>{
        const pts = a.getAll();
        for(i = 0; i < pts.length; i++){
            if(!RectUtils.rectContainsPoint(b, pts[i])){
                return false;
            }
        }
        return true;
    },
    lineIntersectsRect:(p, v, rect)=>{
        return vectorsIntersect(p, v, rect.get('p'), rect.v) ||
        vectorsIntersect(p, v, rect.get('p'), rect.w) ||
        vectorsIntersect(p, v, rect.get('v'), rect.w) ||
        vectorsIntersect(p, v, rect.get('w'), rect.v);
    },
    rectOverlapsRect:(rectA, rectB)=>{
        return RectUtils.rectAIsWithinRectB(rectA, rectB) ||
        RectUtils.rectAIsWithinRectB(rectB, rectA) ||
        RectUtils.lineIntersectsRect(rectA.get('p'), rectA.v, rectB) ||
        RectUtils.lineIntersectsRect(rectA.get('p'), rectA.w, rectB) ||
        RectUtils.lineIntersectsRect(rectA.get('v'), rectA.w, rectB) ||
        RectUtils.lineIntersectsRect(rectA.get('w'), rectA.v, rectB);
    }
}

class Rect{
    /*
    Rectangle defined by one point and two perpendicular vectors
    */
    constructor(p, v, w){
        const TOL = 0.00001;
        if(Math.abs(dot(v, w)) > TOL){
            throw "Not a Rectangle"
        }
        this.p = p;
        this.v = v;
        this.w = w;
        this.q = add(p, v);
        this.r = add(p, w);
        this.s = add(p, v, w);
    }
    /*
    A new Rect offset by lambda * v + mu * w
    */
    getOffset(lambda = 0, mu = 0){
        const offsetP = add(this.p, times(this.v, lambda), times(this.w, mu));
        return new Rect(offsetP, this.v, this.w);
    }
    getTransformed(t){
        const newPPoint = t.getTransformedVec(this.p)
        const newVPoint = t.getTransformedVec(this.get('v'))
        const newWPoint = t.getTransformedVec(this.get('w'))

        return new Rect(newPPoint, pToQ(newPPoint, newVPoint), pToQ(newPPoint, newWPoint))
    }
    getAll(){
        return [
            this.get('p'),
            this.get('v'),
            this.get('w'),
            this.get('v+w')
        ];
    }
    get(i){
        if(i === 'p'){
            return this.p;
        }
        if(i === 'v'){
            return add(this.p, this.v);
        }
        if(i === 'w'){
            return add(this.p, this.w);
        }
        if(i === 'v+w'){
            return add(this.p, this.v, this.w);
        }
        else{
            throw "undefined postion";
        }
    }
    getMultipliers(q){
        return getMultipliersForBasis(pToQ(this.p, q), this.v, this.w);
    }
    getTransformsForRect(r){
        const span = this.getSpanXYForRect(r);
        const transforms = [];
        for(let lambda = span.lambda.min; lambda <= span.lambda.max; lambda++){
            for(let mu = span.mu.min; mu <= span.mu.max; mu++){
                transforms.push(new affine.translation(lambda*this.v.x + mu*this.w.x, lambda*this.v.y + mu*this.w.y));
            }
        }
        return transforms;
    }
    getSpanXYForRect(r){
        const pts = r.getAll().map(this.getMultipliers.bind(this));
        const lambdas = pts.map(p=>p.lambda);
        const mus = pts.map(p=>p.mu);
        return {
            lambda:{
                min:Math.floor(_.min(lambdas)),
                max:Math.floor(_.max(lambdas))
            },
            mu:{
                min:Math.floor(_.min(mus)),
                max:Math.floor(_.max(mus))
            }
        };
    }
}




