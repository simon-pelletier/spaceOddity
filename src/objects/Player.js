/* ========================================================================== */
/*                                                                            */
/*                               STAR GAMEOBJECT                              */
/*                                                                            */
/* ========================================================================== */

import Game from '../game';
import * as Setup from '../setup';

export default class Player extends Phaser.GameObjects.GameObject {

    /* ========================================================================== */
    /*                                 CONSTRUCTOR                                */
    /* ========================================================================== */

    constructor(config) {

        super(config.scene, config.name, config.key);

        this.name = config.name;
        this.fuel = 1000;
        this.health = 100;
        this.hsc = 5;
        this.isDead = false;
        this.rawMat = 1000;

        this.maxHealth = 100;

        return this;
    }

    /* ========================================================================== */
    /*                                   GETTERS                                  */
    /* ========================================================================== */

    getName() {
        return this.name;
    }
    getFuel() {
        return this.fuel;
    }
    getHealth() {
        return this.health;
    }
    getHsc() {
        return this.hsc;
    }
    getRawMat(){
        return this.rawMat;
    }

    /* ========================================================================== */
    /*                                   SETTERS                                  */
    /* ========================================================================== */

    setName(name) {
        this.name = name;
    }
    setFuel(fuel) {
        this.fuel = fuel;
    }
    setHealth(health) {
        this.health = health;
    }
    setHsc(hsc) {
        this.hsc = hsc;
    }
    setRawMat(rawMat){
        this.rawMat = rawMat;
    }

    /* ========================================================================== */
    /*                                  SPECIALS                                  */
    /* ========================================================================== */

    /* ----------------------------------- HSC ---------------------------------- */

    useHsc(number) {
        this.hsc -= Number(number);
    }

    /* --------------------------------- HEALTH --------------------------------- */

    repairShip(repairAmount) {
        this.health += repairAmount;
        this.rawMat -= repairAmount;
    }

    takeDamages(dmg) {
        this.health -= dmg;
    }

    /* ---------------------------------- FUEL ---------------------------------- */

    consumeFuel(factor) {
        this.fuel -= factor;
    }

    pumpFuel(factor) {
        this.fuel += factor;
    }

    /* --------------------------------- RAW MAT -------------------------------- */

    digRawMat(factor) {
        this.rawMat += factor;
    }

    /* ------------------------------- CONVERTERS ------------------------------- */

    craftHscToFuel() {
        this.fuel += 1000;
        this.hsc -= 1;
    }

    craftFuelToHsc() {
        this.fuel -= 1000;
        this.hsc += 1;
    }

    /* ========================================================================== */
    /*                                  END GAME                                  */
    /* ========================================================================== */

    getIsDead() {
        return this.isDead;
    }

    setIsDead(boolean) {
        this.isDead = boolean;
    }

    isFuel() {
        if (this.fuel > 0) {
            return true;
        } else {
            return false;
        }
    }

    isHealth() {
        if (this.health > 0) {
            return true;
        } else {
            return false;
        }
    }

    isOver() {
        if (this.isFuel() == false || this.isHealth() == false) {
            return true;
        } else {
            return false;
        }
    }

    /* ========================================================================== */
    /*                                  CONTROLS                                  */
    /* ========================================================================== */

    controls(scene) {
        scene.keyCraftHsc = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
        scene.keyCraftFuel = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        scene.keyRepairShip = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    updateControls(scene) {
        /* -------------------------------- CONTROLS -------------------------------- */

        // Ecoute la touche H
        if (Phaser.Input.Keyboard.JustDown(scene.keyCraftHsc)) {
            if (this.fuel >= 1000) {
                this.craftFuelToHsc();
            }
        }
        // Ecoute la touche F
        if (Phaser.Input.Keyboard.JustDown(scene.keyCraftFuel)) {
            if (this.hsc > 0) {
                this.craftHscToFuel();
            }
        }
        // Ecoute la touche R
        if (scene.keyRepairShip.isDown && this.health < this.maxHealth) {
            if (this.rawMat > 0) {
                this.repairShip(1);
            }
        }

    }

}
