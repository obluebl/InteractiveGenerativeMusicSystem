class Music{
    constructor() {
        this.pianoNotes = [];
        this.rainSound = [];
        this.windSound = null;
        this.seagullSound = null;
        this.seawindSound = null;
    }

    loadPianoNotes() {
        const notes = [
            ['c1', 'c1#', 'd1', 'd1#', 'e1', 'f1', 'f1#', 'g1', 'g1#', 'a1', 'a1#', 'b1'],
            ['c2', 'c2#', 'd2', 'd2#', 'e2', 'f2', 'f2#', 'g2', 'g2#', 'a2', 'a2#', 'b2'],
            ['c3', 'c3#', 'd3', 'd3#', 'e3', 'f3', 'f3#', 'g3', 'g3#', 'a3', 'a3#', 'b3'],
            ['c4', 'c4#', 'd4', 'd4#', 'e4', 'f4', 'f4#', 'g4', 'g4#', 'a4', 'a4#', 'b4'],
            ['c5', 'c5#', 'd5', 'd5#', 'e5', 'f5', 'f5#', 'g5', 'g5#', 'a5', 'a5#', 'b5'],
            ['c6', 'c6#', 'd6', 'd6#', 'e6', 'f6', 'f6#', 'g6', 'g6#', 'a6', 'a6#', 'b6'],
            ['c7', 'c7#', 'd7', 'd7#', 'e7', 'f7', 'f7#', 'g7', 'g7#', 'a7', 'a7#', 'b7']
        ];

        this.pianoNotes = new Array(notes.length).fill().map(() => new Array(12));
        if (typeof loadSound === 'undefined') {
            console.error('loadSound is not defined.');
        } else {
            console.log('loadSound is ready to use.');
        }
        notes.forEach((octave, i) => {
            octave.forEach((note, j) => {
                let encodedNote = encodeURIComponent(note);
                let filepath = `../assets/sound/piano/88-piano/${encodedNote}.ogg`;
                this.pianoNotes[i][j] = loadSound(filepath);
            });
        });
    }

    loadRainSound() {
        let filepath = `../assets/sound/naturalSound/rain.mp3`;
        if (typeof loadSound === 'undefined') {
            console.error('loadSound is not defined.');
        } else {
            console.log('loadSound is ready to use.');
        }
        
        this.rainSound = loadSound(filepath, () => {
            console.log("natural rain sound loaded");
            this.rainSound.setVolume(0.5); 
            this.rainSound.loop(); 
        }, (err) => {
            console.error("Error loading natural rain sound");
        });
    }

    loadSeagullSound() {
        let filepath = `../assets/sound/naturalSound/seagull.wav`;
        this.seagullSound = loadSound(filepath, () => {
            console.log("sea gull sound loaded");
        }, (err) => {
            console.error("Error loading seagull sound");
        });
    }

    loadWindSound() {
        let filepath = `../assets/sound/naturalSound/wind.wav`;
        this.windSound = loadSound(filepath, () => {
            console.log("natural wind sound loaded");
            this.windSound.setVolume(0.4); 
        }, (err) => {
            console.error("Error loading natural wind sound");
        });
    }

    loadSeawindSound() {
        let filepath = `../assets/sound/naturalSound/seawind.wav`;
        this.seawindSound = loadSound(filepath, () => {
            console.log("seawind sound loaded");
        }, (err) => {
            console.error("Error loading seagull sound");
        });
    }

    playPianoNote(octave, noteIndex, volume) {
        console.log(`octave的值为${octave}`);
        if (this.pianoNotes[octave] && this.pianoNotes[octave][noteIndex]) { 
            let sound = this.pianoNotes[octave][noteIndex];
            if (sound) {
                sound.setVolume(volume);
                sound.play();
            }
        }
    } 
}

window.Music = Music;
