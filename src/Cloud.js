export class Cloud {
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

    display() {
        this.p.noStroke();
        this.p.fill(this.color);
        this.ellipses.forEach((ellipseData)=>{
            this.p.ellipse(ellipseData.cx, ellipseData.cy, ellipseData.rx*2, ellipseData.ry*2);
        })

    }

    containsPoint(px, py){
        let isContained = this.ellipses.some(function(ellipseData){
            let dx = (px-ellipseData.cx)/ellipseData.rx;
            let dy = (py-ellipseData.cy)/ellipseData.ry;
            return (dx*dx + dy*dy )<= 1;
        })
        return isContained;
    }

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

    updateColor() {
        if (this.y < this.p.height / 3) {
            this.color='#FFFFFC';
        } else if (this.y < 2 * height / 3) {
            this.color='#F7F6ED';
        } else {
            this.color='#FAF5DD';
        }
    }
    
}
