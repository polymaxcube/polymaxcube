import SceneManager from "@/core/SceneManager";
import { Engine, Scene } from "@babylonjs/core";

export default abstract class BaseGameRender {
    protected canvas: string;
    protected engine?: Engine;
    public scene?: Scene;
    public sceneManager?: SceneManager;

    constructor(canvas: string) {
        if (!canvas) throw new Error("Canvas Name not found!");
        this.canvas = canvas;

        if (!this.canvas) throw new Error("Canvas not found!");
        this.setUpEngine(this.canvas);

        this.sceneManager = new SceneManager(this.engine!);
        this.scene = this.sceneManager?.getScene();

    }

    public setUpEngine(canvasSelector: string) {
        const canvas: HTMLCanvasElement | null = 
            document.getElementById(canvasSelector) as HTMLCanvasElement | null;
        if(canvas) {
            this.engine = new Engine(canvas, true)
        }
    }

    protected resizeWindow() {
        if (typeof window !== "undefined") {
            window.addEventListener("resize", () => {
                if (this.engine) {
                    this.engine.resize();
                } else {
                    console.error("Engine is not initialized!");
                }
            });
        } else {
            console.error("Window object is not available. This code is likely not running in a browser.");
        }
    }

    abstract berforeRender(): void; 
    abstract render(): void; 
}