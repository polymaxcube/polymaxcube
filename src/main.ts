import GameRender from "@/GameRender";

document.addEventListener("DOMContentLoaded", () => {
  const game = new GameRender("renderGame");
  game.render();
});

