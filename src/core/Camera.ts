// Camera & Viewfinder System for ECHOES OF THE CROWD
// Controls world viewport panning, interactive viewfinder targeting, and framing evaluation.

export class Camera {
  public viewportX: number = 700; // Left coordinate of viewport in world space
  public viewportY: number = 0;
  public targetViewportX: number = 700;
  
  // Screen size
  public screenWidth: number = 1000;
  public screenHeight: number = 600;

  // Viewfinder mouse coordinate in screen space
  public mouseScreenX: number = 500;
  public mouseScreenY: number = 300;
  public viewfinderX: number = 500;
  public viewfinderY: number = 300;

  // Viewfinder dimensions
  public baseFrameWidth: number = 160;
  public baseFrameHeight: number = 120;
  public isFocused: boolean = false; // Zoom / Focus Mode (Key F)

  // Flash & shutter visual state
  public flashAlpha: number = 0;
  public shutterCooldown: number = 0;
  public readonly maxCooldown: number = 1.2; // seconds

  // World bounds
  public readonly worldWidth: number = 2400;

  constructor() {}

  public resize(width: number, height: number): void {
    this.screenWidth = width;
    this.screenHeight = height;
    this.clampViewport();
  }

  public setMousePosition(screenX: number, screenY: number): void {
    this.mouseScreenX = screenX;
    this.mouseScreenY = screenY;
  }

  public pan(deltaX: number): void {
    this.targetViewportX += deltaX;
    this.clampViewport();
  }

  public toggleFocus(): boolean {
    this.isFocused = !this.isFocused;
    return this.isFocused;
  }

  public triggerShutter(): boolean {
    if (this.shutterCooldown > 0) return false;
    this.shutterCooldown = this.maxCooldown;
    this.flashAlpha = 0.95;
    return true;
  }

  public update(dt: number, sensitivity: number = 1.0): void {
    // Smooth camera viewport pan interpolation
    this.viewportX += (this.targetViewportX - this.viewportX) * Math.min(1, dt * 8);

    // Smooth viewfinder inertia towards mouse
    const lerpRate = Math.min(1, dt * 16 * sensitivity);
    this.viewfinderX += (this.mouseScreenX - this.viewfinderX) * lerpRate;
    this.viewfinderY += (this.mouseScreenY - this.viewfinderY) * lerpRate;

    // Fade flash
    if (this.flashAlpha > 0) {
      this.flashAlpha = Math.max(0, this.flashAlpha - dt * 3.2);
    }

    // Cooldown recovery
    if (this.shutterCooldown > 0) {
      this.shutterCooldown = Math.max(0, this.shutterCooldown - dt);
    }
  }

  public clampViewport(): void {
    const maxViewportX = Math.max(0, this.worldWidth - this.screenWidth);
    this.targetViewportX = Math.max(0, Math.min(maxViewportX, this.targetViewportX));
  }

  /**
   * Returns current viewfinder bounding box in WORLD coordinates.
   */
  public getViewfinderWorldRect(): { x: number; y: number; width: number; height: number } {
    const scale = this.isFocused ? 0.75 : 1.0;
    const w = this.baseFrameWidth * scale;
    const h = this.baseFrameHeight * scale;

    const worldCenterX = this.viewportX + this.viewfinderX;
    const worldCenterY = this.viewfinderY;

    return {
      x: worldCenterX - w / 2,
      y: worldCenterY - h / 2,
      width: w,
      height: h
    };
  }

  /**
   * Renders the authentic photojournalistic camera viewfinder overlay onto screen canvas.
   */
  public renderOverlay(
    ctx: CanvasRenderingContext2D,
    hasNotableSubject: boolean,
    framingScore: number
  ): void {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Screen space

    // 1. Shutter Flash
    if (this.flashAlpha > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.flashAlpha})`;
      ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
    }

    // 2. Viewfinder Reticle Frame
    const scale = this.isFocused ? 0.75 : 1.0;
    const fw = this.baseFrameWidth * scale;
    const fh = this.baseFrameHeight * scale;
    const fx = this.viewfinderX - fw / 2;
    const fy = this.viewfinderY - fh / 2;

    // Corner brackets
    const bracketLen = 18;
    const accentColor = this.shutterCooldown > 0 
      ? '#94a3b8' 
      : (hasNotableSubject ? '#22c55e' : '#38bdf8');

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2.5;

    // Top-Left
    ctx.beginPath();
    ctx.moveTo(fx, fy + bracketLen);
    ctx.lineTo(fx, fy);
    ctx.lineTo(fx + bracketLen, fy);
    ctx.stroke();

    // Top-Right
    ctx.beginPath();
    ctx.moveTo(fx + fw - bracketLen, fy);
    ctx.lineTo(fx + fw, fy);
    ctx.lineTo(fx + fw, fy + bracketLen);
    ctx.stroke();

    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(fx, fy + fh - bracketLen);
    ctx.lineTo(fx, fy + fh);
    ctx.lineTo(fx + bracketLen, fy + fh);
    ctx.stroke();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(fx + fw - bracketLen, fy + fh);
    ctx.lineTo(fx + fw, fy + fh);
    ctx.lineTo(fx + fw, fy + fh - bracketLen);
    ctx.stroke();

    // Center Crosshairs
    ctx.lineWidth = 1;
    ctx.strokeStyle = hasNotableSubject ? 'rgba(34, 197, 94, 0.7)' : 'rgba(255, 255, 255, 0.4)';
    const cx = this.viewfinderX;
    const cy = this.viewfinderY;
    const chLen = 8;
    ctx.beginPath();
    ctx.moveTo(cx - chLen, cy); ctx.lineTo(cx + chLen, cy);
    ctx.moveTo(cx, cy - chLen); ctx.lineTo(cx, cy + chLen);
    ctx.stroke();

    // Framing readout HUD tag below viewfinder
    ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
    ctx.beginPath();
    ctx.roundRect(fx, fy + fh + 6, fw, 20, 4);
    ctx.fill();

    ctx.fillStyle = accentColor;
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    if (this.shutterCooldown > 0) {
      const pct = Math.round((1 - this.shutterCooldown / this.maxCooldown) * 100);
      ctx.fillText(`CUỘN PHIM... ${pct}%`, fx + fw / 2, fy + fh + 16);
    } else if (hasNotableSubject) {
      ctx.fillText(`KHOẢNH KHẮC [${framingScore}%]`, fx + fw / 2, fy + fh + 16);
    } else {
      ctx.fillText('QUAN SÁT...', fx + fw / 2, fy + fh + 16);
    }

    ctx.restore();
  }
}
