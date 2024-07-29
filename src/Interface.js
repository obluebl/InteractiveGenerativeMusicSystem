class Interface{
    constructor(){
        this.palette = ["#d6ebff", "#90A8C3", "#A6E1FA", "#284B63", "#33658A"];
    }

    drawBackgroundRain(rainIntensity, baseRainIntensity){
            colorMode(RGB);
            let bgStartColor = color(163, 208, 251); 
            let bgEndColor = color(50, 50, 50); 

            if(baseRainIntensity==0.5)
            {
                background(red(bgStartColor), green(bgStartColor), blue(bgStartColor), 50);
            }
            else
            {
                let amt = map(rainIntensity, 0.5*baseRainIntensity, 2*baseRainIntensity, 0, 1);
                let bgColor = lerpColor(bgStartColor, bgEndColor, amt);
                background(red(bgColor), green(bgColor), blue(bgColor), 50);
        

                let randomness = map(rainIntensity, 0.5*baseRainIntensity, 2*baseRainIntensity, 0, windowWidth) / windowHeight;
                let ranShiftX = random(-randomness, randomness);
                let ranShiftY = random(-randomness, randomness);
            
            
                let drops = map(rainIntensity, 0.5*baseRainIntensity, 2*baseRainIntensity, 0, 150, true); 
                
                for(let i = 0; i < drops; i++){
                    let randomColor = random(this.palette);
                    fill(randomColor);
                    
                    let ax = random(0, width);
                    let ay = random(0, height);
                    let bx = random(0, 2);
                    let by = random(0, map(rainIntensity, 0.5, 2, 0, windowWidth) / 2);    
                    
                    ellipse(ax + ranShiftX, ay + ranShiftY, bx, by);
                    }
            }
        }
}

window.Interface = Interface;