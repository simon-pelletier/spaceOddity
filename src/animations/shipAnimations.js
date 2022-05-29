export default function shipAnimations(scene) {
    //* IDLE

    scene.anims.create({
        key: 'idleShip',
        frames: scene.anims.generateFrameNumbers('ship', {
            start: 30,
            end: 30
        }),
        frameRate: 12
    });
    scene.anims.create({
        key: 'idleShipLanding',
        frames: scene.anims.generateFrameNumbers('ship', {
            start: 0,
            end: 0
        }),
        frameRate: 12
    });

    //* UP DOWN RIGHT LEFT LANDING OFF

    scene.anims.create({
        key: 'upAnimShip',
        frames: scene.anims.generateFrameNumbers('ship', {
            start: 37,
            end: 38
        }),
        frameRate: 12,
        repeat: -1
    });
    scene.anims.create({
        key: 'backAnimShip',
        frames: scene.anims.generateFrameNumbers('ship', {
            start: 35,
            end: 36
        }),
        frameRate: 12,
        repeat: -1
    });
    scene.anims.create({
        key: 'rightAnimShip',
        frames: scene.anims.generateFrameNumbers('ship', {
            start: 33,
            end: 34
        }),
        frameRate: 12,
        repeat: -1
    });
    scene.anims.create({
        key: 'leftAnimShip',
        frames: scene.anims.generateFrameNumbers('ship', {
            start: 31,
            end: 32
        }),
        frameRate: 12,
        repeat: -1
    });

    //* UP DOWN RIGHT LEFT LANDING ON

    scene.anims.create({
        key: 'upAnimShipLanding',
        frames: scene.anims.generateFrameNumbers('ship', {
            start: 18,
            end: 19
        }),
        frameRate: 12,
        repeat: -1
    });
    scene.anims.create({
        key: 'backAnimShipLanding',
        frames: scene.anims.generateFrameNumbers('ship', {
            start: 16,
            end: 17
        }),
        frameRate: 12,
        repeat: -1
    });
    scene.anims.create({
        key: 'rightAnimShipLanding',
        frames: scene.anims.generateFrameNumbers('ship', {
            start: 14,
            end: 15
        }),
        frameRate: 12,
        repeat: -1
    });
    scene.anims.create({
        key: 'leftAnimShipLanding',
        frames: scene.anims.generateFrameNumbers('ship', {
            start: 12,
            end: 13
        }),
        frameRate: 12,
        repeat: -1
    });

    /*scene.anims.create({
		key: 'rightUpAnimShip',
		frames: scene.anims.generateFrameNumbers('ship', {
			start: 35,
			end: 36
		}),
		frameRate: 12,
		repeat: -1
	});
	scene.anims.create({
		key: 'leftUpAnimShip',
		frames: scene.anims.generateFrameNumbers('ship', {
			start: 31,
			end: 32
		}),
		frameRate: 12,
		repeat: -1
    });*/

    //* LANDING END

    scene.anims.create({
        key: 'landingShip',
        frames: scene.anims.generateFrameNumbers('ship', {
            start: 1,
            end: 11
        }),
        frameRate: 12,
        repeat: 0
        //delay: 200
    });

    //* LANDING GEAR

    scene.anims.create({
        key: 'landingGearShipOn',
        frames: scene.anims.generateFrameNumbers('ship', {
            start: 20,
            end: 30
        }),
        frameRate: 12,
        repeat: 0
    });
    scene.anims.create({
        key: 'landingGearShipOff',
        frames: scene.anims.generateFrameNumbers('ship', {
            start: 20,
            end: 30
        }),
        frameRate: 12,
        repeat: 0
    });

    scene.anims.create({
        key: 'disableShip',
        frames: scene.anims.generateFrameNumbers('ship', {
            start: 38,
            end: 39
        }),
        frameRate: 12
    });
}
