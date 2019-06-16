

class RectDrawer{
    constructor(r, ctx){
        this.rect = r;
        this.ctx = ctx;
    }
    _draw(){
        this.ctx.beginPath();
        moveTo(this.ctx, this.rect.get('p'));
        lineTo(this.ctx, this.rect.get('v'));
        lineTo(this.ctx, this.rect.get('v+w'));
        lineTo(this.ctx, this.rect.get('w'));
        lineTo(this.ctx, this.rect.get('p'));
        this.ctx.closePath();
    }
    fill(){
        this.ctx.fillStyle = "rgba(10, 10, 150, 0.2)";
        this._draw(ctx);
        this.ctx.fill();
        return this;
    }
    draw(){
        mark(this.rect.get('p'));
        this._draw(this.ctx);
        this.ctx.stroke();
        return this;
    }
}
