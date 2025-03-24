/**
 * Class representing the music system, responsible for handling sound effects such as piano notes, rain, wind, and seagulls.
 */
export class Music{
    /**
     * Creates a new Music object.
     * 
     * @param {object} p - The p5.js instance.
     */
    constructor(p) {
        this.p = p;
        this.pianoNotes = [];
        this.rainSound = [];
        this.windSound = null;
        this.seagullSound = null;
        this.seawindSound = null;
    }

    /**
     * Loads piano note sounds for each note in multiple octaves.
     * It maps each piano note to its respective sound file and loads it into the `pianoNotes` array.
     */
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
        if (typeof this.p.loadSound === 'undefined') {
            console.error('loadSound is not defined.');
        } else {
            console.log('loadSound is ready to use.');
        }
        notes.forEach((octave, i) => {
            octave.forEach((note, j) => {
                let safeNote = note.replace('#', 'sharp'); 
                //let encodedNote = encodeURIComponent(note);
                let filepath = `../sound/piano/88-piano/${safeNote}.ogg`;
                this.pianoNotes[i][j] = this.p.loadSound(filepath, () => {
                    //console.log(safeNote + "loaded");
                }, (err) => {
                    console.error("Error loading" + safeNote);
                });
            });
        });
    }

    /**
     * Loads the sound for rain and loops it.
     */
    loadRainSound() {
        let filepath = `../sound/naturalSound/rain.mp3`;
        if (typeof this.p.loadSound === 'undefined') {
            console.error('loadSound is not defined.');
        } else {
            console.log('loadSound is ready to use.');
        }
        
        this.rainSound = this.p.loadSound(filepath, () => {
            console.log("natural rain sound loaded");
            this.rainSound.setVolume(0.5); 
            this.rainSound.loop(); 
        }, (err) => {
            console.error("Error loading natural rain sound");
        });
    }

    /**
     * Loads the sound for seagulls.
     */
    loadSeagullSound() {
        let filepath = `../sound/naturalSound/seagull.wav`;
        this.seagullSound = this.p.loadSound(filepath, () => {
            console.log("sea gull sound loaded");
        }, (err) => {
            console.error("Error loading seagull sound");
        });
    }

    /**
     * Loads the sound for wind.
     */
    loadWindSound() {
        let filepath = `../sound/naturalSound/wind.wav`;
        this.windSound = this.p.loadSound(filepath, () => {
            console.log("natural wind sound loaded");
            this.windSound.setVolume(0.4); 
        }, (err) => {
            console.error("Error loading natural wind sound");
        });
    }

    /**
     * Loads the sound for seawind.
     */
    loadSeawindSound() {
        let filepath = `../sound/naturalSound/seawind.mp3`;
        this.seawindSound = this.p.loadSound(filepath, () => {
            console.log("seawind sound loaded");
        }, (err) => {
            console.error("Error loading seagull sound");
        });
    }

     /**
     * Plays a specific piano note based on the given octave, note index, and volume.
     * 
     * @param {number} octave - The octave number (0 to 6) indicating the row in the `pianoNotes` array.
     * @param {number} noteIndex - The index of the note within the octave (0 to 11).
     * @param {number} volume - The volume at which to play the note.
     */
    playPianoNote(octave, noteIndex, volume) {
        console.log(`octave:${octave}`);
        if (this.pianoNotes[octave] && this.pianoNotes[octave][noteIndex]) { 
            let sound = this.pianoNotes[octave][noteIndex];
            if (sound) {
                sound.setVolume(volume);
                sound.play();
            }
        }
    } 
}
