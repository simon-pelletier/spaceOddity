import Game from '../game';

import * as Setup from '../setup';

class UiScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'UiScene'
        });
    }

    create() {
        var helpStyleText = {
            fontSize: '17px',
            fontFamily: Setup.TYPO,
            color: '#000000',
            backgroundColor: 'rgba(255, 255, 255, 0.6)'
        };

        this.helpText = this.add
            .text(40, this.scale.gameSize.height - 150, '', helpStyleText)
            .setPadding(10, 10);
        this.helpText.setDepth(30);

        this.helpText.setText(
            '[M]ap' +
                '\n[E]xtract resources' +
                '\n[R]epair Ship' +
                '\nCraft 1 [H]SC for 1K Fuel' +
                '\nCraft 1K [F]uel for 1 HSC'
        );

        //* GRAPHISME

        this.cargo = this.add.image(240, 109, 'cargo');
        this.monitor = this.add.image(
            this.scale.gameSize.width - 138,
            109,
            'monitor'
        );

        this.gravity_needle = this.add.image(
            this.scale.gameSize.width - 125,
            90,
            'needle'
        );
        this.speed_needle = this.add.image(
            this.scale.gameSize.width - 240,
            60,
            'needle'
        );
        this.speed_needle.setScale(0.6);
        this.alt_needle = this.add.image(
            this.scale.gameSize.width - 61,
            165,
            'needle'
        );
        this.alt_needle.setScale(0.6);
        this.alt_needle.rotation = 0.3;

        this.fuel_needle = this.add.image(160, 105, 'needleH');
        this.mats_needle = this.add.image(265, 105, 'needleH');
        this.health_needle = this.add.image(370, 105, 'needleH');

        this.hscBulbs = [];
        var marginHscBulb = 0;
        for (var i = 0; i < Game.player.maxHsc; i++) {
            this.hscBulb = this.add.image(314 + marginHscBulb, 182, 'hscBulb');
            this.hscBulbs.push(this.hscBulb);
            marginHscBulb += 19.8;
        }

        this.scale.on('resize', this.resize, this);
    }

    resize(gameSize, baseSize, displaySize, resolution) {
        this.helpText.setPosition(40, gameSize.height - 150);
        this.monitor.setPosition(gameSize.width - 138, 109);

        this.gravity_needle.setPosition(gameSize.width - 125, 90);
        this.speed_needle.setPosition(gameSize.width - 240, 60);
        this.alt_needle.setPosition(gameSize.width - 61, 165);
    }

    update() {
        for (var i = 0; i < this.hscBulbs.length; i++) {
            if (i < Number(Game.player.hsc)) {
                this.hscBulbs[i].y = 182;
            } else {
                this.hscBulbs[i].y = -100;
            }
        }

        this.speed_needle.angle = (Game.ship.body.body.speed * 10).toFixed(0);
        this.alt_needle.angle = Game.ship.getAltitude().toFixed(0);

        this.fuel_percentage =
            (Game.player.getFuel().toFixed(0) * 100) / Game.player.maxFuel;
        this.mats_percentage =
            (Game.player.getRawMat().toFixed(0) * 100) / Game.player.maxRawMat;
        this.health_percentage =
            (Game.player.getHealth().toFixed(0) * 100) / Game.player.maxHealth;

        this.fuel_needle.angle = ((this.fuel_percentage * 90) / 100).toFixed(0);
        this.mats_needle.angle = ((this.mats_percentage * 90) / 100).toFixed(0);
        this.health_needle.angle = (
            (this.health_percentage * 90) /
            100
        ).toFixed(0);

        if (Game.currentScene === 'Planet') {
            //! A CORRIGER !!!
            let maxPlanetMass = Setup.MASS_MAX_OF_PLANET;
            let onePercentMass = maxPlanetMass / 280;
            let angleNeedle =
                (Game.univers[Game.currentSystem].system[Game.currentPlanet]
                    .mass -
                    maxPlanetMass) /
                onePercentMass;
            this.gravity_needle.angle = angleNeedle.toFixed(1); // is the max - 0/280
        } else {
            this.gravity_needle.angle = 0;
        }
    }
}

export default UiScene;
