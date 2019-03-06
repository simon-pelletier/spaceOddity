/* ========================================================================== */
/*                                                                            */
/*                            ANIMATIONS - RAW MATS                           */
/*                                                                            */
/* ========================================================================== */

export default function rawMatAnimations(scene) {

/* ---------------------------------- FLOW ---------------------------------- */

    scene.anims.create({
        key: 'idle',
        frames: scene.anims.generateFrameNumbers('rawMat', {
            start: 0,
            end: 1
        }),
        frameRate: 12,
        repeat: -1
    });

}
