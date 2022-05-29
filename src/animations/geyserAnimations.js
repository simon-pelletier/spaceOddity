export default function geyserAnimations(scene) {
    scene.anims.create({
        key: 'flow',
        frames: scene.anims.generateFrameNumbers('geyser', {
            start: 0,
            end: 11
        }),
        frameRate: 12,
        repeat: -1
    });
}
