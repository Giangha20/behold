// Entry Point for ECHOES OF THE CROWD (Vọng Âm Đám Đông)

import { GameApp } from './core/GameApp';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (!canvas) {
    console.error('Cannot find #game-canvas element');
    return;
  }

  const app = new GameApp(canvas);
  app.start();

  console.log('Echoes of the Crowd (Vọng Âm Đám Đông) successfully initialized.');
});
