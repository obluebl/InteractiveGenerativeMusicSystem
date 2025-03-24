import { Cloud } from "./Cloud.js";
import { Interface } from "./Interface.js";
import { Music } from "./Music.js";
import { Physics } from "./Physics.js";
import { RainDrop } from "./RainDrop.js";
import { Umbrella } from "./Umbrella.js";

/**
 * Main sketch function for the p5.js project.
 * 
 * @param {object} p - The p5.js instance.
 */
const sketch = (p) =>{
    let rainDrops = [];
    let umbrellas = [];
    let clouds = [];
    let isGrowing = false;
    let currentDrop = null;
    let startTime = null;
    let umbrellaCount = 7;
    let music = new Music(p);
    let physics = new Physics(p);
    let gameInterface = new Interface(p);
    let umbrellaClicked;
    let rainIntensity = 1;
    let rainIntensitySlider;
    let rainFrequencySlider;
    let cloudSpeedSlider;
    let windButtonClicked;
    let baseRainIntensity = 1;
    let rainFrequency = 900; 
    let cloudDragged = false;
    let cloudOffsetX;
    let cloudOffsetY;
    let isGeneratingRainDrops = true; 
    let helpButton;
    let showHelp = false;  
    let helpBoxX, helpBoxY, helpBoxWidth, helpBoxHeight;
  
    /**
     * Setup function that runs once at the start to initialize the canvas, UI elements, and other components.
     */
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.noStroke();

        //Asynchronously loads audio without blocking page rendering
        music.loadPianoNotes();
        music.loadRainSound();
        music.loadWindSound();
        music.loadSeagullSound();
        music.loadSeawindSound();
    
        rainIntensitySlider = p.createSlider(0.5, 2, 0.5, 0.1); 
        rainFrequencySlider = p.createSlider(100, 1800, 900, 100); 
        cloudSpeedSlider = p.createSlider(-2, 2, 0, 0.1); 
    
        rainIntensitySlider.position(10, 10);
        rainFrequencySlider.position(10 + rainIntensitySlider.width + 50, 10); 
        cloudSpeedSlider.position(20 + rainIntensitySlider.width + rainFrequencySlider.width +100, 10 );
        
        let intensityLabel = p.createP('Rain Intensity');
        intensityLabel.position(rainIntensitySlider.x, rainIntensitySlider.y + 20);
        let frequencyLabel = p.createP('Rain Frequency');
        frequencyLabel.position(rainFrequencySlider.x, rainFrequencySlider.y + 20);
        let speedLable = p.createP('Wind Speed');
        speedLable.position(cloudSpeedSlider.x, cloudSpeedSlider.y + 20);
    
        helpBoxWidth = 465;
        helpBoxHeight = 300;
        helpBoxX = p.width - helpBoxWidth;
        helpBoxY = 200;
    
        helpButton = p.createButton('Help');
        helpButton.position(p.width - 60, 10);
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
        let umbrellaWidth = (p.width - totalGap) / umbrellaCount;
        let umbrellaHeight = umbrellaWidth * 0.5;
        let noteIndices = [0, 2, 4, 5, 7, 9, 11];
        for (let i = 0; i < umbrellaCount; i++) {
            let x = i * (umbrellaWidth + umbrellaGap) + umbrellaWidth / 2;
            let y = p.height - umbrellaHeight;
            let umbrella = new Umbrella(p, x, y, umbrellaWidth, umbrellaHeight, noteIndices[i], physics);
            umbrellas.push(umbrella);
    
            let cloud = new Cloud(p, x, 100);  
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
                        let volume = p.map(rainDrop.circleRadius, 10, 20, 0.02, 0.3); 
                        music.playPianoNote(rainDrop.octave, umbrella.noteIndex+umbrella.adjustPitch, volume);
                    }
                });
            });
        });
    
    }
  
     /**
     * Updates the rain intensity based on the rainIntensitySlider value.
     * Calculates the new rain intensity using the slider and a sine function to create natural rain fluctuation.
     */
    const updateRainIntensity = () => {
        baseRainIntensity = rainIntensitySlider.value();
        rainFrequency = rainFrequencySlider.value();
        rainIntensity = baseRainIntensity * p.map(p.sin(p.frameCount / rainFrequency), -1, 1, 0.5, 2);
    }
    
    /**
     * Manages the generation of raindrops based on the baseRainIntensity.
     * If rain intensity is at the minimum level (0.5), stops generating raindrops.
     */
    const manageRainDropsGeneration = () => {
        if (baseRainIntensity !== 0.5 && !isGeneratingRainDrops) {
            isGeneratingRainDrops = true;
            generateRainDrop();
        } else if (baseRainIntensity === 0.5) {
            isGeneratingRainDrops = false;
        }
    }

    /**
     * Main draw loop that runs continuously and updates the state of the sketch.
     */
    p.draw = () => {
        updateRainIntensity();
        manageRainDropsGeneration(); 
    
        if (showHelp) {
            p.fill(255, 255, 255, 150); 
            p.noStroke();
            p.rect(helpBoxX, helpBoxY, helpBoxWidth, helpBoxHeight); 
            
            p.fill(0);  
            p.textSize(14);
            p.text( "When the rain intensity is at minimum:\n" +
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
        if(baseRainIntensity==0.5) {
            disorderVolume=0;
            if(music.seagullSound.isLoaded() && !music.seagullSound.isPlaying()) {
                music.seagullSound.loop();
                music.seagullSound.setVolume(0);
                music.seagullSound.fade(1,2000);
            }
        } else {
            disorderVolume = p.map(rainIntensity, 0.5*baseRainIntensity, 2*baseRainIntensity, 0.10, 1, true);
            if(music.seagullSound.isLoaded() && music.seagullSound.isPlaying()) {
                music.seagullSound.pause();
            }
        }

        if(music.rainSound.isLoaded()) {
            music.rainSound.setVolume(disorderVolume);
        }
    
        gameInterface.drawBackgroundRain(rainIntensity, baseRainIntensity);
    
        umbrellas.forEach(umbrella => {
            umbrella.draw();
        });
    
        rainDrops.forEach(drop => {
            drop.draw();
        });
    
        clouds.forEach(cloud => {
            if (windSpeed!=0) {
                cloud.updatePosition(cloud.x+windSpeed, cloud.y); 
                if(baseRainIntensity==0.5 && music.seawindSound.isLoaded() && !music.seawindSound.isPlaying()) {
                    if(music.windSound.isLoaded() && music.windSound.isPlaying()) {
                        music.windSound.pause();
                    }
                    music.seawindSound.loop();
                    let seawindVolume = p.map(Math.abs(windSpeed), 0, 2, 0.3, 1);
                    music.seawindSound.setVolume(seawindVolume);
                }
    
                if(baseRainIntensity!=0.5 && music.windSound.isLoaded() && !music.windSound.isPlaying()) {
                    if(music.windSound.isLoaded() && music.seawindSound.isPlaying()) {
                        music.seawindSound.pause();
                    }
                    music.windSound.loop();
                    let windVolume = p.map(Math.abs(windSpeed), 0, 2, 0.3, 1);
                    music.windSound.setVolume(windVolume);
                }
            }
            if(windSpeed ===0) {
                if(music.seawindSound.isLoaded() && music.seawindSound.isPlaying()) {
                    music.seawindSound.pause();
                }
                if(music.windSound.isLoaded() && music.windSound.isPlaying()) {
                    music.windSound.pause();
                }
            }
            cloud.display();
        });
    
        if (isGrowing && currentDrop) {
            let timeElapsed = p.millis() - startTime;
            currentDrop.size = p.constrain(p.map(timeElapsed, 0, 1000, 20, 80), 20, 40); 
            currentDrop.updateColor(currentDrop.size);
        }
    }

    /**
     * Toggles the visibility of the help menu when the help button is clicked.
     */
    const toggleHelp = () => {
        showHelp = !showHelp;
    }

    /**
     * Checks if the mouse is over the help button.
     * 
     * @returns {boolean} Returns true if the mouse is over the help button, otherwise false.
     */
    const mouseInButton = () => {
        if (p.mouseX >= helpButton.position().x && p.mouseX <= helpButton.position().x + helpButton.size().width &&
            p.mouseY >= helpButton.position().y && p.mouseY <= helpButton.position().y + helpButton.size().height) 
        { return true;}
        return false;
    }

    /**
     * Checks if the mouse is over any slider (rainIntensitySlider, rainFrequencySlider, cloudSpeedSlider).
     * 
     * @returns {boolean} Returns true if the mouse is over any of the sliders, otherwise false.
     */
    const isMouseOverSlider = () => {
        return isMouseOverSpecificSlider(rainIntensitySlider) || isMouseOverSpecificSlider(rainFrequencySlider) || isMouseOverSpecificSlider(cloudSpeedSlider);
    }

    /**
     * Checks if the mouse is over a specific slider element.
     * 
     * @param {p5.Element} slider - The slider element to check.
     * @returns {boolean} Returns true if the mouse is over the slider, otherwise false.
     */
    const isMouseOverSpecificSlider = (slider) => {
        let sliderPos = slider.position();
        let sliderSize = slider.size();
        let mouseXInRange = p.mouseX >= sliderPos.x && p.mouseX <= sliderPos.x + sliderSize.width;
        let mouseYInRange = p.mouseY >= sliderPos.y && p.mouseY <= sliderPos.y + sliderSize.height;
        return mouseXInRange && mouseYInRange;
    }

    /**
     * Checks if the mouse is over a cloud and returns the cloud if true.
     * 
     * @param {number} px - The x-coordinate of the mouse pointer.
     * @param {number} py - The y-coordinate of the mouse pointer.
     * @returns {Cloud|false} Returns the cloud object being dragged or false if no cloud is selected.
     */
    const mouseInCloud = (px, py) => {
        for(let i=0; i<clouds.length; i++) {
            if(clouds[i].containsPoint(px, py)) {
                cloudOffsetX= px-clouds[i].x;
                cloudOffsetY= py-clouds[i].y;
                return clouds[i];
            }
        }
        return false;
    }

    /**
     * Checks if the mouse is over an umbrella and returns the umbrella if true.
     * 
     * @param {number} px - The x-coordinate of the mouse pointer.
     * @param {number} py - The y-coordinate of the mouse pointer.
     * @returns {Umbrella|false} Returns the umbrella object being clicked or false if no umbrella is selected.
     */
    const mouseInUmbrella = (px, py) => {
        const mousePoint = { x: px, y: py };
        for (const umbrella of umbrellas) {
            if (Matter.Query.point([umbrella.body], mousePoint).length > 0) {
                return umbrella; 
            }
        }
        return false;
    
    }

    /**
     * Checks if the mouse is over the umbrella handle and returns the umbrella if true.
     * 
     * @param {number} px - The x-coordinate of the mouse pointer.
     * @param {number} py - The y-coordinate of the mouse pointer.
     * @returns {Umbrella|false} Returns the umbrella object if the mouse is over the handle, or false if not.
     */
    const mouseInUmbrellaHandle = (px, py) =>{
        for(let umbrella of umbrellas) {
            if(px >= umbrella.x-5 && px <= umbrella.x+5 && py >= umbrella.y+umbrella.height/2 && py <= umbrella.y+umbrella.height/2+umbrella.handleLength) {
                return umbrella;
            }
        }
        return false;
    }

    /**
     * Handles mouse press events.
     * Checks for interactions with clouds, umbrellas, sliders, and other elements in the sketch.
     */
    p.mousePressed = () => {
        let clickedCloud = mouseInCloud(p.mouseX, p.mouseY);
        if(clickedCloud) {
            cloudDragged=clickedCloud;
        }
    
        let clickedUmbrellaHandle = mouseInUmbrellaHandle(p.mouseX, p.mouseY);
        if(clickedUmbrellaHandle) {
            clickedUmbrellaHandle. adjustSemitone();
        }
    
        umbrellaClicked = mouseInUmbrella(p.mouseX, p.mouseY);
        if(umbrellaClicked) {
            umbrellaClicked.toggleColorAndRestitution();
        }
       
        if (!umbrellaClicked && !clickedCloud && !clickedUmbrellaHandle && !isMouseOverSlider() && !mouseInButton()) {
            isGrowing = true;
            let size = 20;
            let rainDropOctave = Math.floor(p.map(p.mouseY, 0, p.windowHeight, 6, 3));
            currentDrop = new RainDrop(p, p.mouseX, p.mouseY, size, '#A7FFFF', rainDropOctave);
            rainDrops.push(currentDrop);
            startTime = p.millis();
        } else {
            currentDrop = null;
        }
    }

    /**
     * Handles mouse drag events to move clouds.
     */
    p.mouseDragged = () =>{
        if(cloudDragged) {
            let cloud = cloudDragged;
            cloud.updatePosition(p.mouseX-cloudOffsetX, p.mouseY-cloudOffsetY);
            cloud.updateColor();
        }
    
    }

    /**
     * Handles mouse release events.
     * If a raindrop was being generated, it finalizes its size and adds it to the physics simulation.
     */
    p.mouseReleased = () => {
        console.log(currentDrop);
    
        if (currentDrop) { 
            isGrowing = false;
            let timeElapsed = p.millis() - startTime;
            let finalSize = p.constrain(p.map(timeElapsed, 0, 1000, 20, 80), 20, 40);  
            currentDrop.size = finalSize; 
            currentDrop.createBody(physics);  
            Matter.Body.setStatic(currentDrop.body, false);
        } 
    
        umbrellaClicked = false; 
        cloudDragged = false; 
        windButtonClicked = false;
    
    }

    /**
     * Generates a new raindrop at random positions based on the position of clouds.
     * Recursively calls itself to continue generating raindrops based on rain intensity.
     */
    const generateRainDrop = () => {
        if (!isGeneratingRainDrops) return;
    
        let cloudIndex = Math.floor(Math.random() * clouds.length);
        let cloud = clouds[cloudIndex];
    
        let rainDropX = cloud.x + Math.random() * 100 - 50; 
        let rainDropY = cloud.y + 20;  
        let rainDropSize = Math.random() * 20 + 20;  
    
        let initialColor = p.color('#A7FFFF');
        let finalColor = p.color('#0028FD');
        let lerpAmt = p.constrain(rainDropSize/80, 0, 1);
        let raindropColor = p.lerpColor(initialColor, finalColor, lerpAmt);
    
        let rainDropOctave = Math.floor(p.map(cloud.y, 0, p.windowHeight, 6, 3));
    
        let rainDrop = new RainDrop(p, rainDropX, rainDropY, rainDropSize, raindropColor, rainDropOctave);
        rainDrops.push(rainDrop);
        rainDrop.createBody(physics);
        Matter.Body.setStatic(rainDrop.body, false); 
    
        let baseInterval = 1000; 
        let interval = (baseInterval / rainIntensity) + Math.random() * 100 ;
        console.log("Next Drop Interval: ", interval);
        setTimeout(generateRainDrop, interval);
    }

    /**
     * Updates the canvas size and adjusts the positions of UI elements when the window is resized.
     */
    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight); 
    
        if(helpButton) {
            helpButton.position(p.width - 60, 10);
        }
    
        if(rainFrequencySlider) {
            rainIntensitySlider.position(10, 10);
        }

        if(rainFrequencySlider) {
            rainFrequencySlider.position(10 + rainIntensitySlider.width + 50, 10); 
        }

        if(cloudSpeedSlider) {
            cloudSpeedSlider.position(20 + rainIntensitySlider.width + rainFrequencySlider.width + 100, 10);
        }
        
        let umbrellaGap = 50;
        let totalGap = umbrellaGap * (umbrellaCount - 1);
        let umbrellaWidth = (p.width - totalGap) / umbrellaCount;
        let umbrellaHeight = umbrellaWidth * 0.5;
    
        umbrellas.forEach((umbrella, i) => {
            let x = i * (umbrellaWidth + umbrellaGap) + umbrellaWidth / 2;
            let y = p.height - umbrellaHeight;
            umbrella.handleLength=umbrella.height/2;
            umbrella.updatePosition(x,y); 
        });
    
        clouds.forEach((cloud, i) => {
            let x = i * (umbrellaWidth + umbrellaGap) + umbrellaWidth / 2;
            cloud.updatePosition(x, 100); 
        });
    
        helpBoxX = p.width - helpBoxWidth;
        helpBoxY = 200;
    }
  
}

new p5(sketch);