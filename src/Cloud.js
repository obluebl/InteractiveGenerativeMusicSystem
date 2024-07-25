class Cloud {
    constructor(x, y) {
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
        noStroke();
        fill(this.color);
        this.ellipses.forEach(function(ellipseData){
            ellipse(ellipseData.cx, ellipseData.cy, ellipseData.rx*2, ellipseData.ry*2);
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
        if(this.x - this.ellipses[0].rx > width) { 
            this.x = this.ellipses[0].rx; 
        }
        if(this.x+50 + this.ellipses[2].rx <0 ) { 
            this.x = width - this.ellipses[2].rx - 50; 
        }
        this.y = y;
        this.ellipses = [
            {cx: x, cy: y, rx: 25, ry: 15},
            {cx: x + 20, cy: y - 10, rx: 30, ry: 25},
            {cx: x + 50, cy: y, rx: 25, ry: 15}
        ];
    }

    updateColor() {
        if (this.y < height / 3) {
            this.color='#FFFFFC';
        } else if (this.y < 2 * height / 3) {
            this.color='#F7F6ED';
        } else {
            this.color='#FAF5DD';
        }
    }
    
}

window.Cloud = Cloud;