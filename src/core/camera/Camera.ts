import { AbstractMesh, ArcRotateCamera, Camera, FollowCamera, Scene, UniversalCamera, Vector3 } from "@babylonjs/core";

export default class CustomCamera {
    private camera: Camera;

    constructor(scene: Scene, type: "follow" | "arc" | "universal", player: AbstractMesh) {
        switch (type) {
            case "follow":
                this.camera = new FollowCamera("followCam", new Vector3(0, 10, -10), scene);
                (this.camera as FollowCamera).lockedTarget = player;
                (this.camera as FollowCamera).radius = 10;
                (this.camera as FollowCamera).heightOffset = 5;
              
                (this.camera as FollowCamera).rotationOffset = 180; // Always behind the player
              
                (this.camera as FollowCamera).cameraAcceleration = 0.05;  // How fast the camera moves to target
                (this.camera as FollowCamera).maxCameraSpeed = 100;        // Max speed camera can move
              
                // 🛑 Prevent excessive zooming in/out
                (this.camera as FollowCamera).lowerRadiusLimit = 5;  // Minimum distance from the player
                (this.camera as FollowCamera).upperRadiusLimit = 15; // Maximum distance (prevents scrolling too far away)
              
                // 🛑 Prevent vertical movement from going too high or low
                (this.camera as FollowCamera).lowerHeightOffsetLimit = 3;  // Minimum height (prevents looking under the player)
                (this.camera as FollowCamera).upperHeightOffsetLimit = 7;  // Maximum height (prevents extreme overhead views)
              
                // 🛑 Prevent the camera from spinning too far (optional)
                (this.camera as FollowCamera).lowerRotationOffsetLimit = 180; // Lock rotation
                (this.camera as FollowCamera).upperRotationOffsetLimit = 180;
                
                // Attach camera control when clicking
                scene.getEngine().getRenderingCanvas()?.addEventListener("pointerdown", () => {
                    const canvas = scene.getEngine().getRenderingCanvas();
                    if (canvas) {
                        this.camera.attachControl(true);
                    }                    
                });

                // Set as active camera
                scene.activeCamera = this.camera;

                break;
            case "arc":
                this.camera = new ArcRotateCamera("arcCam", Math.PI / 2, Math.PI / 2, 10, Vector3.Zero(), scene);
                break;
            case "universal":
                this.camera = new UniversalCamera("universalCam", new Vector3(0, 10, -10), scene);
                break;
            default:
                throw new Error("Invalid camera type");
        }
    }

    getCamera(): Camera {
        return this.camera;
    }
}
