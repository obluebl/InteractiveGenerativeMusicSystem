export class RainDrop{
    constructor(p, x, y, size, color, octave) {
        this.p = p;
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.physics = null;
        this.body = null;
        this.octave = octave;
    }

    createBody(physics) {
        this.body = Matter.Bodies.circle(this.x, this.y, this.size/2, {
            isStatic: true,
            density: 0.01,
            frictionAir: 0.01,
            restitution: 0,
            label: 'Circle Body'
        });
        this.body.octave=this.octave;
        physics.addBody(this.body);
    }

    updateColor(dropSize){
        let initialColor = this.p.color('#A7FFFF');
        let finalColor = this.p.color('#0028FD');
        let lerpAmt = this.p.constrain(dropSize/80, 0, 1);
        this.color = this.p.lerpColor(initialColor, finalColor, lerpAmt);
    }

    draw() {
        if (this.body) {
            let pos = this.body.position;
            this.p.push();
            this.p.translate(pos.x, pos.y);
            this.p.fill(this.color);
            this.p.stroke('#3595CD');
            this.p.strokeWeight(2);
            this.p.beginShape();
            this.p.vertex(0, -this.size * 0.4);
            this.p.bezierVertex(-this.size * 0.2, 0, -this.size * 0.6, this.size, 0, this.size * 1.2);
            this.p.bezierVertex(this.size * 0.6, this.size, this.size * 0.2, 0, 0, -this.size * 0.4);
            this.p.endShape(this.p.CLOSE);
            this.p.pop();
        } else {
            this.p.push();
            this.p.translate(this.x, this.y);
            this.p.fill(this.color);
            this.p.stroke('#3595CD');
            this.p.strokeWeight(2);
            this.p.beginShape();
            this.p.vertex(0, -this.size * 0.4);
            this.p.bezierVertex(-this.size * 0.2, 0, -this.size * 0.6, this.size, 0, this.size * 1.2);
            this.p.bezierVertex(this.size * 0.6, this.size, this.size * 0.2, 0, 0, -this.size * 0.4);
            this.p.endShape(this.p.CLOSE);
            this.p.pop();
        }
    }
}
