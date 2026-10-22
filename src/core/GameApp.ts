// GameApp: Main Application Coordinator, Canvas Render Loop, and User Input Handler

import { GameState } from './GameState';
import { HUD } from '../ui/HUD';
import { MainMenuUI } from '../ui/MainMenuUI';
import { NewsroomUI } from '../ui/NewsroomUI';
import { JournalUI } from '../ui/JournalUI';
import { SocialOverviewUI } from '../ui/SocialOverviewUI';
import { SettingsUI } from '../ui/SettingsUI';
import { EndingUI } from '../ui/EndingUI';
import { HotkeysUI } from '../ui/HotkeysUI';
import { sound } from '../audio/AudioEngine';

export class GameApp {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private gameState: GameState;

  // UI Overlays
  public hud: HUD;
  public mainMenu: MainMenuUI;
  public newsroomUI: NewsroomUI;
  public journalUI: JournalUI;
  public socialUI: SocialOverviewUI;
  public settingsUI: SettingsUI;
  public endingUI: EndingUI;
  public hotkeysUI: HotkeysUI;

  // Game Loop
  private lastTime: number = 0;
  private isRunning: boolean = false;

  // Key tracking
  private keysDown: Set<string> = new Set();

  // Multi-touch pinch tracking
  private initialTouchDistance: number = 0;
  private initialTouchZoom: number = 1.0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Could not get 2D canvas context');
    this.ctx = ctx;

    this.gameState = new GameState();

    // Init UI Overlays
    this.hud = new HUD(this.gameState, () => this.handleShutterSnapshot());
    this.mainMenu = new MainMenuUI(this.gameState);
    this.newsroomUI = new NewsroomUI(this.gameState);
    this.journalUI = new JournalUI(this.gameState);
    this.socialUI = new SocialOverviewUI(this.gameState);
    this.settingsUI = new SettingsUI(this.gameState);
    this.endingUI = new EndingUI(this.gameState);
    this.hotkeysUI = new HotkeysUI(this.gameState);

    this.initWindowListeners();
    this.initInputListeners();
    this.handleResize();
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame(time => this.loop(time));
  }

  private loop(currentTime: number): void {
    if (!this.isRunning) return;

    let dt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Clamp dt to avoid huge step when user switches tabs
    if (dt > 0.1) dt = 0.1;

    this.processKeyboardPanning(dt);
    this.gameState.update(dt);
    this.render();

    requestAnimationFrame(time => this.loop(time));
  }

  private processKeyboardPanning(dt: number): void {
    if (this.gameState.activeModal !== 'none' || this.gameState.isPaused) return;

    const panSpeed = 380; // px/sec
    let dx = 0;
    if (this.keysDown.has('KeyA') || this.keysDown.has('ArrowLeft')) dx -= panSpeed * dt;
    if (this.keysDown.has('KeyD') || this.keysDown.has('ArrowRight')) dx += panSpeed * dt;

    if (dx !== 0) {
      this.gameState.camera.pan(dx);
    }
  }

  private render(): void {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const camera = this.gameState.camera;
    const metrics = this.gameState.metricsManager.state;

    // 1. World Viewport (Rendered with Camera Translation)
    this.ctx.save();
    this.ctx.translate(-camera.viewportX, 0);

    // City World (Sky, Parallax, Buildings, Streets, Monolith, Props)
    this.gameState.world.render(
      this.ctx,
      camera.viewportX,
      w,
      h,
      metrics.tension,
      metrics.empathy
    );

    // Crowd (Autonomous Characters)
    this.gameState.crowd.render(
      this.ctx,
      camera.viewportX,
      camera.viewportX + w
    );

    this.ctx.restore();

    // 2. Camera Viewfinder Overlay (Screen Space with Optical Lens Magnification)
    if (this.gameState.activeModal === 'none') {
      const worldRect = camera.getViewfinderWorldRect();
      const evaluation = this.gameState.eventSystem.evaluateViewfinder(
        worldRect.x,
        worldRect.y,
        worldRect.width,
        worldRect.height,
        this.gameState.crowd.characters
      );

      camera.renderOverlay(
        this.ctx,
        this.canvas,
        evaluation.hasNotableEvent,
        evaluation.framingScore
      );
    }
  }

  private handleShutterSnapshot(): void {
    if (this.gameState.activeModal !== 'none') return;

    sound.init(); // Resume audio on action

    // Generate high-quality snapshot of viewfinder area
    const worldRect = this.gameState.camera.getViewfinderWorldRect();
    const snapshotCanvas = document.createElement('canvas');
    snapshotCanvas.width = 320;
    snapshotCanvas.height = 240;
    const sCtx = snapshotCanvas.getContext('2d');

    if (sCtx) {
      // Screen coordinates corresponding to the active zoom world rect
      const screenX = this.gameState.camera.viewfinderX - (worldRect.width / 2);
      const screenY = this.gameState.camera.viewfinderY - (worldRect.height / 2);

      sCtx.drawImage(
        this.canvas,
        screenX,
        screenY,
        worldRect.width,
        worldRect.height,
        0,
        0,
        320,
        240
      );
      // Photo filter effect: subtle vintage warmth & newspaper scanline vibe
      sCtx.fillStyle = 'rgba(254, 240, 138, 0.08)';
      sCtx.fillRect(0, 0, 320, 240);
    }

    const dataUrl = snapshotCanvas.toDataURL('image/jpeg', 0.85);
    this.gameState.capturePhoto(dataUrl);
  }

  private initWindowListeners(): void {
    window.addEventListener('resize', () => this.handleResize());
  }

  private handleResize(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.canvas.width = w;
    this.canvas.height = h;
    this.gameState.camera.resize(w, h);
  }

  private initInputListeners(): void {
    // Mouse movement
    window.addEventListener('mousemove', e => {
      this.gameState.camera.setMousePosition(e.clientX, e.clientY);
    });

    // Mouse wheel: Optical Zoom In (Cuộn lên) / Zoom Out (Cuộn xuống)
    window.addEventListener('wheel', e => {
      if (this.gameState.activeModal === 'none' && !this.gameState.isPaused) {
        if (e.deltaY < 0) {
          this.gameState.camera.zoomIn(0.15);
        } else if (e.deltaY > 0) {
          this.gameState.camera.zoomOut(0.15);
        }
      }
    }, { passive: true });

    // Mouse click for camera shutter
    this.canvas.addEventListener('click', () => {
      if (this.gameState.activeModal === 'none' && !this.gameState.isPaused) {
        this.handleShutterSnapshot();
      }
    });

    // Touch controls: single touch for viewfinder aim, pinch for optical zoom
    this.canvas.addEventListener('touchstart', e => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        this.initialTouchDistance = Math.hypot(dx, dy);
        this.initialTouchZoom = this.gameState.camera.targetZoomLevel;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', e => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        this.gameState.camera.setMousePosition(touch.clientX, touch.clientY);
      } else if (e.touches.length === 2 && this.initialTouchDistance > 0) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const factor = dist / this.initialTouchDistance;
        this.gameState.camera.setZoom(this.initialTouchZoom * factor);
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', e => {
      if (e.touches.length < 2) {
        this.initialTouchDistance = 0;
      }
    });

    // Keyboard controls
    window.addEventListener('keydown', e => {
      this.keysDown.add(e.code);

      // Space to toggle pause
      if (e.code === 'Space') {
        e.preventDefault();
        if (this.gameState.activeModal === 'none') {
          this.gameState.togglePause();
        }
      }

      // Zoom In (Z, +, =)
      if (e.code === 'KeyZ' || e.code === 'Equal' || e.code === 'NumpadAdd') {
        this.gameState.camera.zoomIn(0.25);
      }

      // Zoom Out (X, -, _)
      if (e.code === 'KeyX' || e.code === 'Minus' || e.code === 'NumpadSubtract') {
        this.gameState.camera.zoomOut(0.25);
      }

      // Reset Zoom to 1.0x (Digit 0)
      if (e.code === 'Digit0' || e.code === 'Numpad0') {
        this.gameState.camera.resetZoom();
      }

      // F for Quick Preset Focus/Zoom Toggle
      if (e.code === 'KeyF') {
        this.gameState.camera.toggleFocus();
      }

      // H for Hotkeys Help
      if (e.code === 'KeyH') {
        if (this.gameState.activeModal === 'hotkeys') {
          this.gameState.closeModal();
        } else {
          this.gameState.openModal('hotkeys');
        }
      }

      // N for Newsroom
      if (e.code === 'KeyN') {
        if (this.gameState.activeModal === 'none' && this.gameState.photos.length > 0) {
          this.gameState.selectedPhotoForEditorial = this.gameState.photos[0];
          this.gameState.openModal('newsroom');
        }
      }

      // J for Journal
      if (e.code === 'KeyJ') {
        if (this.gameState.activeModal === 'journal') {
          this.gameState.closeModal();
        } else {
          this.gameState.openModal('journal');
        }
      }

      // M for Social Overview
      if (e.code === 'KeyM') {
        if (this.gameState.activeModal === 'social') {
          this.gameState.closeModal();
        } else {
          this.gameState.openModal('social');
        }
      }

      // Escape to close modals or open Settings
      if (e.code === 'Escape') {
        if (this.gameState.activeModal !== 'none') {
          this.gameState.closeModal();
        } else {
          this.gameState.openModal('settings');
        }
      }
    });

    window.addEventListener('keyup', e => {
      this.keysDown.delete(e.code);
    });
  }
}
