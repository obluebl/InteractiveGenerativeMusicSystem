class RainDrop{
    constructor(x, y, size, color, octave) {
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
        let initialColor = color('#A7FFFF');
        let finalColor = color('#0028FD');
        let lerpAmt = constrain(dropSize/80, 0, 1);
        this.color = lerpColor(initialColor, finalColor, lerpAmt);
    }

    draw() {
        if (this.body) {
            let pos = this.body.position;
            push();
            translate(pos.x, pos.y);
            fill(this.color);
            stroke('#3595CD');
            strokeWeight(2);
            beginShape();
            vertex(0, -this.size * 0.4);
            bezierVertex(-this.size * 0.2, 0, -this.size * 0.6, this.size, 0, this.size * 1.2);
            bezierVertex(this.size * 0.6, this.size, this.size * 0.2, 0, 0, -this.size * 0.4);
            endShape(CLOSE);
            pop();
        } else {
            push();
            translate(this.x, this.y);
            fill(this.color);
            stroke('#3595CD');
            strokeWeight(2);
            beginShape();
            vertex(0, -this.size * 0.4);
            bezierVertex(-this.size * 0.2, 0, -this.size * 0.6, this.size, 0, this.size * 1.2);
            bezierVertex(this.size * 0.6, this.size, this.size * 0.2, 0, 0, -this.size * 0.4);
            endShape(CLOSE);
            pop();
        }
    }
}

window.RainDrop = RainDrop;

