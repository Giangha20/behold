// Entry Point for ECHOES OF THE CROWD (Vọng Âm Đám Đông)

import { GameApp } from './core/GameApp';

function initGame(): void {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (!canvas) {
    console.error('Cannot find #game-canvas element');
    return;
  }

  const app = new GameApp(canvas);
  app.start();

  console.log('Echoes of the Crowd (Vọng Âm Đám Đông) successfully initialized.');
}

// Support both initial parsing and deferred/module execution
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}
