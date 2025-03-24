/**
 * Class representing a raindrop in the sketch, with physics properties and graphical representation.
 */
export class RainDrop{
    /**
     * Creates a new RainDrop object.
     * 
     * @param {object} p - The p5.js instance.
     * @param {number} x - The x-coordinate of the raindrop.
     * @param {number} y - The y-coordinate of the raindrop.
     * @param {number} size - The size (diameter) of the raindrop.
     * @param {string|p5.Color} color - The color of the raindrop.
     * @param {number} octave - The musical octave associated with the raindrop for sound generation.
     */
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

    /**
     * Creates the Matter.js body for the raindrop and adds it to the physics world.
     * 
     * @param {object} physics - The physics engine instance that handles adding the body to the world.
     */
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

    /**
     * Updates the color of the raindrop based on its size using a gradient from light blue to dark blue.
     * 
     * @param {number} dropSize - The current size of the raindrop, used to determine the color transition.
     */
    updateColor(dropSize){
        let initialColor = this.p.color('#A7FFFF');
        let finalColor = this.p.color('#0028FD');
        let lerpAmt = this.p.constrain(dropSize/80, 0, 1);
        this.color = this.p.lerpColor(initialColor, finalColor, lerpAmt);
    }

    /**
     * Draws the raindrop on the canvas, either in its original position or based on its physics body position.
     */
    draw() {
        if (this.body) {
            //console.log(this.body.position);
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
