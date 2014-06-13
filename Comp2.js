// Frequency Stair Stepping Demo
var clock = flock.enviro.shared.asyncScheduler,
    clock2 = flock.enviro.shared.asyncScheduler,
    synth = flock.synth({
        nickName: "sin-synth",
        synthDef: {
            id: "carrier",
            ugen: "flock.ugen.sinOsc",
            freq: 50,
            mul: {
                ugen: "flock.ugen.line",
                start: .015,
                end: .01,
                duration: .010
            }
        }
    });

var synth2 = flock.synth({
        nickName: "sin",
        synthDef: {
            id: "carrier",
            ugen: "flock.ugen.sinOsc",
            freq: 500,
            mul: {
                ugen: "flock.ugen.line",
                start: .015,
                end: .01,
                duration: .010
            }
        }
    }); 

    

    

clock.schedule([
    {
    
        interval: "repeat",
        time: 4,
        change: {
            synth: "sin-synth",
            values: {
                "carrier.mul.start": 2,
                "carrier.mul.end": 0.50,
                "carrier.mul.duration": 1.50
            }
        }
    }
]);
        

clock2.schedule([
    {
    
        interval: "repeat",
        time: 4.5,
        change: {
            synth: "sin",
            values: {
                "carrier.mul.start": .05,
                "carrier.mul.end": 0.0,
                "carrier.mul.duration": 2.910
            }
        }
    }
]); 



var fundamental = 440;

var polySynth = flock.synth.polyphonic({
    synthDef: {
        id: "carrier",
        ugen: "flock.ugen.sin",
        freq: fundamental,
        mul: {
            id: "env",
            ugen: "flock.ugen.env.simpleASR",
            attack: 0.25,
            sustain: 1.0,
            release: 0.5
        }
    }
});

var score = [
    {
        action: "noteOn",
        noteName: "root",
        change: {
            "carrier.freq": fundamental
        }
    },

    {
        action: "noteOn",
        noteName: "mediant",
        change: {
            "carrier.freq": fundamental * 1/2
        }
    },

    {
        action: "noteOn",
        noteName: "dominant",
        change: {
            "carrier.freq": fundamental * 2
        }
    },

    {
        action: "noteOff",
        noteName: "root"
    },

    {
        action: "noteOff",
        noteName: "mediant"
    },

    {
        action: "noteOff",
        noteName: "dominant"
    }
];

var clock = flock.scheduler.async();

var idx = 0;
clock.repeat(1.5, function () {
    if (idx >= score.length) {
        idx = 0;
    }
    var event = score[idx];
    polySynth[event.action](event.noteName, event.change);
    idx++;
});
