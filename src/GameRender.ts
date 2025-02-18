import BaseGameRender from "@/core/BaseGameRender";
import SceneManager from "@/core/SceneManager";
import PlayerMesh from "@/entities/Player";

export default class GameRender extends BaseGameRender {
    
    declare public sceneManager?: SceneManager;
    private player?: PlayerMesh; 

    constructor(canvas: string) {
        super(canvas);

        if (!this.engine) throw new Error("Engine not found!");
        if (!this.scene) throw new Error("Scene not found!");

        this.player = new PlayerMesh("player_01", this.scene); 
        this.player.enableInputController();
        this.player.activateCamera();
    }

    berforeRender(): void {
        throw new Error("Method not implemented.");
    }

    render(): void {
        if (!this.engine) {
            console.error("Engine is not initialized!");
            return;
        }

        this.engine?.runRenderLoop(() => {
            this.scene?.render();
        });
    }
}
