import { AbstractMesh, FollowCamera, Scene, Vector3 } from "@babylonjs/core";

export default class PlayerCamera {
    private camera: FollowCamera;

    constructor(player: AbstractMesh, scene: Scene) {
        this.camera = new FollowCamera("FollowCam", new Vector3(0, 5, -10), scene);
        this.camera.lockedTarget = player;
        this.camera.radius = 10;
        this.camera.heightOffset = 5;

        this.camera.rotationOffset = 180; // Always behind the player

        this.camera.cameraAcceleration = 0.05;  // How fast the camera moves to target
        this.camera.maxCameraSpeed = 100;       // Max speed camera can move

        // 🛑 Prevent excessive zooming in/out
        this.camera.lowerRadiusLimit = 5;  // Minimum distance from the player
        this.camera.upperRadiusLimit = 15; // Maximum distance (prevents scrolling too far away)

        // 🛑 Prevent vertical movement from going too high or low
        this.camera.lowerHeightOffsetLimit = 3;  // Minimum height (prevents looking under the player)
        this.camera.upperHeightOffsetLimit = 7;  // Maximum height (prevents extreme overhead views)

        // 🛑 Lock rotation to prevent unwanted movement
        this.camera.lowerRotationOffsetLimit = 180;
        this.camera.upperRotationOffsetLimit = 180;

        // Attach camera control when clicking
        scene.getEngine().getRenderingCanvas()?.addEventListener("pointerdown", () => {
            const canvas = scene.getEngine().getRenderingCanvas();
            if (canvas) {
                this.camera.attachControl(true);
            }                    
        });

        // Set as active camera
        scene.activeCamera = this.camera;
    }

    getCamera(): FollowCamera {
        return this.camera;
    }
}
