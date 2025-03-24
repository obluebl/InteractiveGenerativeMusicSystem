/**
 * Class representing a cloud in the sketch.
 */
export class Cloud {
    /**
     * Creates a new Cloud object.
     * @param {object} p - The p5.js instance.
     * @param {number} x - The initial x-coordinate of the cloud.
     * @param {number} y - The initial y-coordinate of the cloud.
     */
    constructor(p, x, y) {
        this.p = p;
        this.x = x;
        this.y = y;
        this.ellipses=[
            {cx: x, cy: y, rx: 25, ry: 15},
            {cx: x+20, cy: y-10, rx: 30, ry: 25},
            {cx: x+50, cy: y, rx: 25, ry: 15}
        ];
        this.updateColor();
    }

    /**
     * Displays the cloud on the canvas.
     * Draws the cloud using a series of ellipses based on the cloud's ellipses array.
     */
    display() {
        this.p.noStroke();
        this.p.fill(this.color);
        this.ellipses.forEach((ellipseData)=>{
            this.p.ellipse(ellipseData.cx, ellipseData.cy, ellipseData.rx*2, ellipseData.ry*2);
        })

    }

    /**
     * Checks whether a point (px, py) is within the cloud's ellipses.
     * @param {number} px - The x-coordinate of the point to check.
     * @param {number} py - The y-coordinate of the point to check.
     * @returns {boolean} Returns true if the point is within one of the ellipses, otherwise false.
     */
    containsPoint(px, py){
        let isContained = this.ellipses.some(function(ellipseData){
            let dx = (px-ellipseData.cx)/ellipseData.rx;
            let dy = (py-ellipseData.cy)/ellipseData.ry;
            return (dx*dx + dy*dy )<= 1;
        })
        return isContained;
    }

    /**
     * Updates the position of the cloud to a new (x, y) position.
     * Adjusts the cloud's ellipses based on the new position and ensures the cloud stays within the canvas bounds.
     * @param {number} x - The new x-coordinate of the cloud.
     * @param {number} y - The new y-coordinate of the cloud.
     */
    updatePosition(x, y) {
        this.x = x;
        if(this.x - this.ellipses[0].rx > this.p.width) { 
            this.x = this.ellipses[0].rx; 
        }
        if(this.x+50 + this.ellipses[2].rx <0 ) { 
            this.x = this.p.width - this.ellipses[2].rx - 50; 
        }
        this.y = y;
        this.ellipses = [
            {cx: x, cy: y, rx: 25, ry: 15},
            {cx: x + 20, cy: y - 10, rx: 30, ry: 25},
            {cx: x + 50, cy: y, rx: 25, ry: 15}
        ];
    }

    /**
     * Updates the color of the cloud based on its vertical position on the canvas.
     * The cloud changes color as it moves higher or lower on the screen.
     */
    updateColor() {
        if (this.y < this.p.height / 3) {
            this.color='#FFFFFC';
        } else if (this.y < 2 * this.p.height / 3) {
            this.color='#F7F6ED';
        } else {
            this.color='#FAF5DD';
        }
    }  
}
