export default function rawMatAnimations(scene) {
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
