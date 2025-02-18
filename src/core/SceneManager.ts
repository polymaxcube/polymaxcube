import { PATHS } from "@/core/utils/paths";
import { ArcRotateCamera, Color3, CubeTexture, DirectionalLight, Engine, HemisphericLight, MeshBuilder, Scene, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";

export default class SceneManager {
    public scene: Scene;
    public meshBuilder: typeof MeshBuilder;
    public camera?: any;
    public engine?: Engine;
    
    constructor(engine: Engine) {
        this.engine = engine;
        this.scene = new Scene(this.engine);
        this.meshBuilder = MeshBuilder;
        this.createEnviroment();
    }

    public getScene() {
        return this.scene;
    }

    
    public setScene(scene: Scene) {
        return this.scene = scene;
    }

    public createEnviroment() {
        try {
            this.addSkybox();
            this.addGround();
            this.addLight();
            this.addCamera();
        } catch (error) {
            console.error(error);
        }
    }

    private addSkybox() {
        const skybox = this.meshBuilder.CreateBox("skyBox", { size: 3500.0 }, this.scene);
        const skyboxMaterial = new StandardMaterial("skyBox", this.scene);
      
        const reflectionTexture = new CubeTexture(PATHS.TEXTURES.SKY, this.scene);
        skyboxMaterial.reflectionTexture = reflectionTexture;
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
    
        return skybox
    };

    private addCamera() {
        this.camera = new ArcRotateCamera("camera1", (3 * Math.PI) / 2, Math.PI / 4, 50, new Vector3(0, 0, 0), this.scene);
        this.scene.activeCamera = this.camera;
        this.camera.attachControl(this.scene.getEngine().getRenderingCanvas(), true);
        return this.camera;
    };

    private addLight() {
        const light1 = new HemisphericLight("light1", new Vector3(0, 1, 0), this.scene);
        light1.intensity = 0.6;
        light1.specular = Color3.Black();
      
        const light2 = new DirectionalLight("dir01", new Vector3(0.5, -0.5, -1.0), this.scene);
        light2.position = new Vector3(0, 5, 5);
        light2.intensity = 0.2;
    
        return light1
      };

    private addGround() {
        const ground = this.meshBuilder.CreateGround("ground", { width: 100, height: 100 }, this.scene);
        const groundMaterial = new StandardMaterial("groundMaterial", this.scene);
        const groundTexture = new Texture(PATHS.TEXTURES.WOOD, this.scene);
        groundTexture.uScale = 20;
        groundTexture.vScale = 20;
        // ground.position.y = -1;
        groundMaterial.diffuseTexture = groundTexture;
        ground.material = groundMaterial;
        ground.checkCollisions = true;

        return ground;
    }


}