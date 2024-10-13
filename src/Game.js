let rainDrops = [];
let umbrellas = [];
let clouds = [];
let isGrowing = false;
let currentDrop = null;
let startTime = null;
let umbrellaCount = 7;
let music = new Music();
let physics = new Physics();
let interface = new Interface();
let umbrellaClicked;
let rainIntensity = 1;
let rainIntensitySlider;
let rainFrequencySlider;
let baseRainIntensity = 1;
let rainFrequency = 900; 
let cloudDragged = false;
let cloudOffsetX;
let cloudOffsetY;
let isGeneratingRainDrops = true; 
let helpButton;
let showHelp = false;  
let helpBoxX, helpBoxY, helpBoxWidth, helpBoxHeight;

function preload() {
    music.loadPianoNotes();
    music.loadRainSound();
    music.loadWindSound();
    music.loadSeagullSound();
    music.loadSeawindSound();
}

function setup() {
    console.log('窗体高度为'+windowHeight);
    createCanvas(windowWidth, windowHeight);
    noStroke();

    rainIntensitySlider = createSlider(0.5, 2, 0.5, 0.1); 
    rainFrequencySlider = createSlider(100, 1800, 900, 100); 
    cloudSpeedSlider = createSlider(-2, 2, 0, 0.1); 

    rainIntensitySlider.position(10, 10);
    rainFrequencySlider.position(10 + rainIntensitySlider.width + 50, 10); 
    cloudSpeedSlider.position(20 + rainIntensitySlider.width + rainFrequencySlider.width +100, 10 );
    
    let intensityLabel = createP('Rain Intensity');
    intensityLabel.position(rainIntensitySlider.x, rainIntensitySlider.y + 20);
    let frequencyLabel = createP('Rain Frequency');
    frequencyLabel.position(rainFrequencySlider.x, rainFrequencySlider.y + 20);
    let speedLable = createP('Wind Speed');
    speedLable.position(cloudSpeedSlider.x, cloudSpeedSlider.y + 20);

    helpBoxWidth = 465;
    helpBoxHeight = 300;
    helpBoxX = width - helpBoxWidth;
    helpBoxY = 200;

    helpButton = createButton('Help');
    helpButton.position(width - 60, 10);
    helpButton.style('background-color', 'white'); 
    helpButton.style('color', 'black'); 
    helpButton.style('border', 'none'); 
    helpButton.style('border-radius', '10px'); 
    helpButton.style('padding', '5px 10px'); 
    helpButton.style('text-align', 'center'); 
    helpButton.style('text-decoration', 'none'); 
    helpButton.style('display', 'inline-block'); 
    helpButton.style('font-size', '16px'); 
    helpButton.mousePressed(toggleHelp);

    let umbrellaGap = 50;
    let totalGap = umbrellaGap * (umbrellaCount - 1);
    let umbrellaWidth = (width - totalGap) / umbrellaCount;
    let umbrellaHeight = umbrellaWidth * 0.5;
    let noteIndices = [0, 2, 4, 5, 7, 9, 11];
    for (let i = 0; i < umbrellaCount; i++) {
        let x = i * (umbrellaWidth + umbrellaGap) + umbrellaWidth / 2;
        let y = height - umbrellaHeight;
        let umbrella = new Umbrella(x, y, umbrellaWidth, umbrellaHeight, noteIndices[i], physics);
        umbrellas.push(umbrella);

        let cloud = new Cloud(x, 100);  
        clouds.push(cloud);
    }

    physics.onCollision((event) => {
        let pairs = event.pairs;
        pairs.forEach(pair => {
            let bodyA = pair.bodyA;
            let bodyB = pair.bodyB;
            umbrellas.forEach(umbrella => {
                if ((bodyA === umbrella.body && bodyB.label === 'Circle Body') || (bodyB === umbrella.body && bodyA.label === 'Circle Body')) {
                    let rainDrop = (bodyA.label === 'Circle Body' ? bodyA : bodyB);
                    let volume = map(rainDrop.circleRadius, 10, 20, 0.02, 0.3); 
                    music.playPianoNote(rainDrop.octave, umbrella.noteIndex+umbrella.adjustPitch, volume);
                }
            });
        });
    });

}

function updateRainIntensity(){
    baseRainIntensity = rainIntensitySlider.value();
    rainFrequency = rainFrequencySlider.value();
    rainIntensity = baseRainIntensity * map(sin(frameCount / rainFrequency), -1, 1, 0.5, 2);
}

function manageRainDropsGeneration() {
    if (baseRainIntensity !== 0.5 && !isGeneratingRainDrops) {
        isGeneratingRainDrops = true;
        generateRainDrop();
    } else if (baseRainIntensity === 0.5) {
        isGeneratingRainDrops = false;
    }
}

function draw() {
    updateRainIntensity();
    manageRainDropsGeneration(); 

    if (showHelp) 
    {
        fill(255, 255, 255, 150); 
        noStroke();
        rect(helpBoxX, helpBoxY, helpBoxWidth, helpBoxHeight); 
        
        fill(0);  
        textSize(14);
        text( "When the rain intensity is at minimum:\n" +
        "1. Try clicking different positions on the screen vertically\n" +
        "2. Try clicking different positions on the screen horizontally\n" +
        "3. Try releasing the mouse at different times\n" +
        "4. Try clicking the umbrella head multiple times to set different colors\n" +
        "5. Try clicking the umbrella handle\n\n" +
        "Try to increase the rain intensity and then\n" +
        "1. Try dragging the cloud to different positions\n" +
        "2. Try adjusting the wind speed slider\n" +
        "3. Try adjusting the rain frequency slider\n" +
        "4. Try adjusting the rain intensity slider\n\n" +
        "Finally, customize everything and create your own music!\n\n"+
        "~~~🎵🎵🎵🎹☔️☔️☔️🥰🥰🥰🥰☔️☔️☔️🎹🎵🎵🎵~~~", helpBoxX+10, helpBoxY + 20);
    }

    let windSpeed = cloudSpeedSlider.value();
    let disorderVolume;
    if(baseRainIntensity==0.5)
    {
        disorderVolume=0;
        if(!music.seagullSound.isPlaying())
        {
            music.seagullSound.loop();
            music.seagullSound.setVolume(0);
            music.seagullSound.fade(1,2000);
        }
    }
    else
    {
        disorderVolume = map(rainIntensity, 0.5*baseRainIntensity, 2*baseRainIntensity, 0.10, 1, true);
        if(music.seagullSound.isPlaying())
        {
            music.seagullSound.pause();
        }
    }
    music.rainSound.setVolume(disorderVolume);

    interface.drawBackgroundRain(rainIntensity, baseRainIntensity);

    umbrellas.forEach(umbrella => {
        umbrella.draw();
    });

    rainDrops.forEach(drop => {
        drop.draw();
    });

    clouds.forEach(cloud => {
        if (windSpeed!=0) 
        {
            cloud.updatePosition(cloud.x+windSpeed, cloud.y); 
            if(baseRainIntensity==0.5 && !music.seawindSound.isPlaying())
            {
                if(music.windSound.isPlaying())
                {
                    music.windSound.pause();
                }
                music.seawindSound.loop();
                let seawindVolume = map(Math.abs(windSpeed), 0, 2, 0.3, 1);
                music.seawindSound.setVolume(seawindVolume);

            }

            if(baseRainIntensity!=0.5 && !music.windSound.isPlaying())
            {
                if(music.seawindSound.isPlaying())
                {
                    music.seawindSound.pause();
                }
                music.windSound.loop();
                let windVolume = map(Math.abs(windSpeed), 0, 2, 0.3, 1);
                music.windSound.setVolume(windVolume);
            }
        }
        if(windSpeed ===0)
        {
            if(music.seawindSound.isPlaying())
            {
                music.seawindSound.pause();
            }
            if(music.windSound.isPlaying())
            {
                music.windSound.pause();
            }
        }
        cloud.display();
    });

    if (isGrowing && currentDrop) {
        let timeElapsed = millis() - startTime;
        currentDrop.size = constrain(map(timeElapsed, 0, 1000, 20, 80), 20, 40); 
        currentDrop.updateColor(currentDrop.size);
    }
}

function toggleHelp() {
    showHelp = !showHelp;
  }

function mouseInButton() {
    if (mouseX >= helpButton.position().x && mouseX <= helpButton.position().x + helpButton.size().width &&
        mouseY >= helpButton.position().y && mouseY <= helpButton.position().y + helpButton.size().height) 
    { return true;}
    return false;
}

function isMouseOverSlider() {
    return isMouseOverSpecificSlider(rainIntensitySlider) || isMouseOverSpecificSlider(rainFrequencySlider) || isMouseOverSpecificSlider(cloudSpeedSlider);
  }
  
function isMouseOverSpecificSlider(slider) {
        let sliderPos = slider.position();
        let sliderSize = slider.size();
        let mouseXInRange = mouseX >= sliderPos.x && mouseX <= sliderPos.x + sliderSize.width;
        let mouseYInRange = mouseY >= sliderPos.y && mouseY <= sliderPos.y + sliderSize.height;
        return mouseXInRange && mouseYInRange;
    }

function mouseInCloud(px, py){
    for(let i=0; i<clouds.length; i++)
    {
        if(clouds[i].containsPoint(px, py))
        {
            cloudOffsetX= px-clouds[i].x;
            cloudOffsetY= py-clouds[i].y;
            return clouds[i];
        }
    }
    return false;
}

function mouseInUmbrella(px, py){
    const mousePoint = { x: px, y: py };
    for (const umbrella of umbrellas) {
        if (Matter.Query.point([umbrella.body], mousePoint).length > 0) {
            return umbrella; 
        }
    }
    return false;

}

function mouseInUmbrellaHandle(px, py){
    for(let umbrella of umbrellas)
    {
        if(px >= umbrella.x-5 && px <= umbrella.x+5 && py >= umbrella.y+umbrella.height/2 && py <= umbrella.y+umbrella.height/2+umbrella.handleLength)
        {
            return umbrella;
        }
    }
    return false;
}


function mousePressed() {
    let clickedCloud = mouseInCloud(mouseX, mouseY);
    if(clickedCloud)
    {
        cloudDragged=clickedCloud;
    }

    let clickedUmbrellaHandle = mouseInUmbrellaHandle(mouseX, mouseY);
    if(clickedUmbrellaHandle)
    {
        clickedUmbrellaHandle. adjustSemitone();
    }

    umbrellaClicked = mouseInUmbrella(mouseX, mouseY);
    if(umbrellaClicked)
    {
        umbrellaClicked.toggleColorAndRestitution();
    }
   
    if (!umbrellaClicked && !clickedCloud && !clickedUmbrellaHandle && !isMouseOverSlider() && !mouseInButton()) {
        isGrowing = true;
        let size = 20;
        let rainDropOctave = Math.floor(map(mouseY, 0, windowHeight, 6, 3));
        currentDrop = new RainDrop(mouseX, mouseY, size, '#A7FFFF', rainDropOctave);
        rainDrops.push(currentDrop);
        startTime = millis();
    } 
    else 
    {
        currentDrop = null;
    }
}


function mouseDragged(){
    if(cloudDragged)
    {
        let cloud = cloudDragged;
        cloud.updatePosition(mouseX-cloudOffsetX, mouseY-cloudOffsetY);
        cloud.updateColor();
    }

}

function mouseReleased() {
    console.log(currentDrop);

    if (currentDrop) 
    { 
        isGrowing = false;
        let timeElapsed = millis() - startTime;
        let finalSize = constrain(map(timeElapsed, 0, 1000, 20, 80), 20, 40);  
        currentDrop.size = finalSize; 
        currentDrop.createBody(physics);  
        Matter.Body.setStatic(currentDrop.body, false);
    } 

    umbrellaClicked = false; 
    cloudDragged = false; 
    windButtonClicked = false;

}

function generateRainDrop() {
    if (!isGeneratingRainDrops) return;

    let cloudIndex = Math.floor(Math.random() * clouds.length);
    let cloud = clouds[cloudIndex];

    let rainDropX = cloud.x + Math.random() * 100 - 50; 
    let rainDropY = cloud.y + 20;  
    let rainDropSize = Math.random() * 20 + 20;  

    let initialColor = color('#A7FFFF');
    let finalColor = color('#0028FD');
    let lerpAmt = constrain(rainDropSize/80, 0, 1);
    let raindropColor = lerpColor(initialColor, finalColor, lerpAmt);

    let rainDropOctave = Math.floor(map(cloud.y, 0, windowHeight, 6, 3));

    let rainDrop = new RainDrop(rainDropX, rainDropY, rainDropSize, raindropColor, rainDropOctave);
    rainDrops.push(rainDrop);
    rainDrop.createBody(physics);
    Matter.Body.setStatic(rainDrop.body, false); 

    let baseInterval = 1000; 
    let interval = (baseInterval / rainIntensity) + Math.random() * 100 ;
    console.log("Next Drop Interval: ", interval);
    setTimeout(generateRainDrop, interval);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight); 

    helpButton.position(width - 60, 10);

    rainIntensitySlider.position(10, 10);
    rainFrequencySlider.position(10 + rainIntensitySlider.width + 50, 10); 
    cloudSpeedSlider.position(20 + rainIntensitySlider.width + rainFrequencySlider.width + 100, 10);

    let umbrellaGap = 50;
    let totalGap = umbrellaGap * (umbrellaCount - 1);
    let umbrellaWidth = (width - totalGap) / umbrellaCount;
    let umbrellaHeight = umbrellaWidth * 0.5;

    umbrellas.forEach((umbrella, i) => {
        let x = i * (umbrellaWidth + umbrellaGap) + umbrellaWidth / 2;
        let y = height - umbrellaHeight;
        umbrella.handleLength=umbrella.height/2;
        umbrella.updatePosition(x,y); 
    });

    clouds.forEach((cloud, i) => {
        let x = i * (umbrellaWidth + umbrellaGap) + umbrellaWidth / 2;
        cloud.updatePosition(x, 100); 
    });

    helpBoxX = width - helpBoxWidth;
    helpBoxY = 200;
}
