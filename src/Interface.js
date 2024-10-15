export class Interface{
    constructor(p){
        this.p=p;
        this.palette = ["#d6ebff", "#90A8C3", "#A6E1FA", "#284B63", "#33658A"];
    }

    drawBackgroundRain(rainIntensity, baseRainIntensity){
            this.p.colorMode(this.p.RGB);
            let bgStartColor = this.p.color(163, 208, 251); 
            let bgEndColor = this.p.color(50, 50, 50); 

            if(baseRainIntensity==0.5)
            {
                this.p.background(this.p.red(bgStartColor), this.p.green(bgStartColor), this.p.blue(bgStartColor), 50);
            }
            else
            {
                let amt = this.p.map(rainIntensity, 0.5*baseRainIntensity, 2*baseRainIntensity, 0, 1);
                let bgColor = this.p.lerpColor(bgStartColor, bgEndColor, amt);
                this.p.background(this.p.red(bgColor), this.p.green(bgColor), this.p.blue(bgColor), 50);
        
                let randomness = this.p.map(rainIntensity, 0.5*baseRainIntensity, 2*baseRainIntensity, 0, this.p.windowWidth) / this.p.windowHeight;
                let ranShiftX = this.p.random(-randomness, randomness);
                let ranShiftY = this.p.random(-randomness, randomness);
            
                let drops = this.p.map(rainIntensity, 0.5*baseRainIntensity, 2*baseRainIntensity, 0, 150, true); 
                
                for(let i = 0; i < drops; i++){
                    let randomColor = this.p.random(this.palette);
                    this.p.fill(randomColor);
                    
                    let ax = this.p.random(0, this.p.width);
                    let ay = this.p.random(0, this.p.height);
                    let bx = this.p.random(0, 2);
                    let by = this.p.random(0, this.p.map(rainIntensity, 0.5, 2, 0, this.p.windowWidth) / 2);    
                    
                    this.p.ellipse(ax + ranShiftX, ay + ranShiftY, bx, by);
                    }
            }
        }
}