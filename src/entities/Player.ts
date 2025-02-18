import CustomCamera from "@/core/camera/Camera";
import InputController from "@/core/InputController";
import { BoundingInfo, Camera, MeshBuilder, Ray, RayHelper, Scene, StandardMaterial, Texture, TransformNode, Vector3, Vector4 } from "@babylonjs/core";
import faceImage from '../../public/textures/face.jpg'

export default class Player extends TransformNode {
    public speed: number = 0.5;
    public rotationSpeed: number = 0.05;
    public scene: Scene;
    private _gravity: Vector3 = new Vector3(0, -9.81, 0); // Gravity vector
    private _velocity: Vector3 = Vector3.Zero(); // Player velocity
    private _isGrounded: boolean = false;
    private _boundingInfo?: BoundingInfo;
    private _lastRayHelper: RayHelper | null = null;
    private _inputController?: InputController;
    private _camera?: Camera;
    private _options?: {[key:string]: any};

    constructor(name: string, scene: Scene) {
        super(name, scene);
        this.scene = scene;
        this.setOptions();

        const box = MeshBuilder.CreateBox(name, this._options ? this._options: {size: 1}, this.scene);
        box.parent = this; 

        const material = new StandardMaterial("Mat", this.scene);
        box.material = material; 

        const texture = new Texture('/textures/face.jpg', this.scene);
        texture.onLoadObservable.add(() => {
            console.log("Texture loaded successfully!");
        });
        material.diffuseTexture = texture;
        material.diffuseTexture.hasAlpha = true;
        // box.rotation.y = Math.PI;

        this._boundingInfo = box.getBoundingInfo();
        const positionOnGround = this._boundingInfo.boundingBox.extendSize.y;
        box.position.y = positionOnGround; 

        // box.showBoundingBox = true;
        box.checkCollisions = true;
    }

    public enableInputController() {
        this._inputController = new InputController(this.scene, this);
        return this._inputController;
    }

    public activateCamera() {
        const playerMesh = this.getChildMeshes()[0];
        const camera = new CustomCamera(this.scene, "follow", playerMesh).getCamera();
        this._camera = camera;
    }

    private setOptions() {
        var faceUV = new Array(6);
        faceUV[0] = new Vector4(1 / 3, 0, 2 / 3, 0.5);
        faceUV[1] = new Vector4(0, 0.5, 1 / 3, 1);
        faceUV[2] = new Vector4(2 / 3, 0, 1, 0.5);
        faceUV[3] = new Vector4(0, 0, 1 / 3, 0.5);
        faceUV[4] = new Vector4(1 / 3, 0.5, 2 / 3, 1);
        faceUV[5] = new Vector4(2 /3, 0.5, 1, 1);
        const options = { size: 1 , faceUV: faceUV, wrap: true };
        this._options = options;
    }

    private _showRayOnScene(ray?: Ray) {
        if(this._lastRayHelper) {
            this._lastRayHelper.dispose();
            this._lastRayHelper = null;
        }
        if(ray) {
            const rayHelper = new RayHelper(ray);
            rayHelper.show(this.scene);
            this._lastRayHelper = rayHelper;
        }
        return;
    }

    private _checkGrounded(): boolean {
        const rayOrigin = this.position.add(new Vector3(0, 0.5, 0));
        const ray = new Ray(rayOrigin, Vector3.Down(), 3); 
        const hit = this.scene.pickWithRay(ray);
        // this._showRayOnScene(ray)
        return hit?.pickedMesh?.name === "ground"; 
    }

    public move(direction: Vector3): void {
        const normalizedDirection = direction.normalize();
        const movementVector = normalizedDirection.scale(this.speed);

        this._velocity.x = movementVector.x;
        this._velocity.z = movementVector.z;
        this._isGrounded = this._checkGrounded();

        if (!this._isGrounded) {
            this._velocity.addInPlace(this._gravity.scale(this.scene.getEngine().getDeltaTime() / 1000));
        }

        this.position.addInPlace(this._velocity);
        if (this._isGrounded) {
            this._velocity.y = 0;
            console.log(`postition y: ${this.position.y} : ${this._boundingInfo?.boundingBox.extendSize.y}`);
        }
    }

    public rotateLeft(): void {
        this.rotation.y -= this.rotationSpeed;
    }

    public rotateRight(): void {
        this.rotation.y += this.rotationSpeed;
    }
}