import Player from "@/entities/Player";
import { ActionManager, KeyboardEventTypes, Scene, Vector3 as _vector3 } from "@babylonjs/core";

export default class InputController {
    private actionManager?: ActionManager;
    private scene?: Scene;
    private inputMap: Record<string, boolean> = {};
    private player?: Player;

    private isJumping: boolean = false;
    private jumpVelocity: number = 0.2; // Adjust jump height
    private gravity: number = 0.01; // Simulated gravity effect
    private jumpCooldown: boolean = false; // Prevent mid-air jumps

    constructor(scene: Scene, player: Player) {
        this.scene = scene;
        this.actionManager = new ActionManager(scene);
        this.scene.actionManager = this.actionManager;
        this.player = player;

        this.scene.onKeyboardObservable.add(({ event, type }) => {
            this.inputMap[event.key.toLowerCase()] = type === KeyboardEventTypes.KEYDOWN;
        });

        this.scene.onBeforeRenderObservable.add(() => {
            let moved = false;
            
            if (this.player) {
                let rotationBefore = this.player.rotation.y;

                // Calculate movement direction based on player's rotation
                // const localForward = new Vector3(0, 0, 1);
                // const worldForward = Vector3.TransformNormal(localForward, this.player.getWorldMatrix()).normalize();


                if (this.inputMap["w"] && !this.inputMap[" "]) {
                    const forwardDirection = this.player.forward.clone();
                    forwardDirection.scaleInPlace(this.player.speed);
                    this.player.move(forwardDirection);
                    moved = true;
                }
                if (this.inputMap["s"]) {
                    const backwardDirection = this.player.forward.clone();
                    backwardDirection.scaleInPlace(-this.player.speed);
                    this.player.move(backwardDirection);
                    moved = true;
                }
                if (this.inputMap["a"]) {
                    this.player.rotateLeft();
                    moved = true;
                }
                if (this.inputMap["d"]) {
                    this.player.rotateRight();
                    moved = true;
                }

                let rotationAfter = this.player.rotation.y;

                if (moved) {
                    // console.log(`Player position: ${this.player.position.x}, ${this.player.position.y}, ${this.player.position.z}`);
                    // console.log(`Rotation before: ${rotationBefore}, Rotation after: ${rotationAfter}`);
                }

                // Handle Jump
                if (this.inputMap[" "] && !this.isJumping && !this.jumpCooldown) {
                    this.isJumping = true;
                    this.jumpCooldown = true; // Prevent double jumps
                }

                if (this.isJumping) {
                    this.player.position.y += this.jumpVelocity; // Move up
                    this.jumpVelocity -= this.gravity; // Apply gravity effect

                    // If player lands (assumed ground level is y=0)
                    if (this.player.position.y <= 0) {
                        this.player.position.y = 0; // Snap to ground
                        this.isJumping = false;
                        this.jumpVelocity = 0.2; // Reset jump velocity
                        setTimeout(() => (this.jumpCooldown = false), 200); // Cooldown before next jump
                    }
                }
            }
        });
    }

    getScene() {
        return this.scene;
    }
}