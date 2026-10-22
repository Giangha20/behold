// Camera & Viewfinder System for ECHOES OF THE CROWD
// Controls world viewport panning, interactive viewfinder targeting, optical lens zoom, and framing evaluation.

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

  // Viewfinder base frame dimensions (Standard 4:3 photography aspect ratio)
  public readonly baseFrameWidth: number = 172;
  public readonly baseFrameHeight: number = 129;

  // Optical Lens Zoom System (0.5x to 2.5x)
  public zoomLevel: number = 1.0;
  public targetZoomLevel: number = 1.0;
  public readonly minZoom: number = 0.5;
  public readonly maxZoom: number = 2.5;

  // Preset zoom levels for Quick Toggle (Key F)
  private readonly zoomPresets: number[] = [0.7, 1.0, 1.5, 2.2];
  private currentPresetIndex: number = 1;

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

  /**
   * Smoothly Zoom In (Phóng to cận cảnh)
   */
  public zoomIn(delta: number = 0.2): void {
    this.targetZoomLevel = Math.min(this.maxZoom, Math.round((this.targetZoomLevel + delta) * 10) / 10);
  }

  /**
   * Smoothly Zoom Out (Thu nhỏ góc rộng)
   */
  public zoomOut(delta: number = 0.2): void {
    this.targetZoomLevel = Math.max(this.minZoom, Math.round((this.targetZoomLevel - delta) * 10) / 10);
  }

  /**
   * Directly set zoom level (with clamping)
   */
  public setZoom(zoom: number): void {
    this.targetZoomLevel = Math.max(this.minZoom, Math.min(this.maxZoom, Math.round(zoom * 100) / 100));
  }

  /**
   * Reset Zoom to standard 1.0x
   */
  public resetZoom(): void {
    this.targetZoomLevel = 1.0;
  }

  /**
   * Quick toggle between zoom presets (Góc rộng -> Tiêu chuẩn -> Cận cảnh -> Siêu cận cảnh)
   */
  public toggleFocus(): boolean {
    this.currentPresetIndex = (this.currentPresetIndex + 1) % this.zoomPresets.length;
    this.targetZoomLevel = this.zoomPresets[this.currentPresetIndex];
    return this.targetZoomLevel > 1.2;
  }

  /**
   * Returns human-readable descriptor for current zoom focal length
   */
  public getZoomDescriptor(): string {
    if (this.zoomLevel <= 0.75) return 'GÓC RỘNG (WIDE)';
    if (this.zoomLevel <= 1.2) return 'TIÊU CHUẨN (STD)';
    if (this.zoomLevel <= 1.75) return 'TRUNG CẢNH (MID)';
    if (this.zoomLevel <= 2.2) return 'CẬN CẢNH (TELE)';
    return 'SIÊU CẬN (MACRO)';
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

    // Smooth optical zoom interpolation
    this.zoomLevel += (this.targetZoomLevel - this.zoomLevel) * Math.min(1, dt * 14);

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
   * When zoomed in (high zoomLevel), world rect is smaller (narrower FOV = telephoto).
   * When zoomed out (low zoomLevel), world rect is larger (wider FOV = wide angle).
   */
  public getViewfinderWorldRect(): { x: number; y: number; width: number; height: number } {
    const w = this.baseFrameWidth / this.zoomLevel;
    const h = this.baseFrameHeight / this.zoomLevel;

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
   * Features real optical lens magnification inside the reticle, composition grid, and focal telemetry.
   */
  public renderOverlay(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
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

    // 2. Viewfinder Reticle Frame Dimensions on Screen
    const fw = this.baseFrameWidth;
    const fh = this.baseFrameHeight;
    const fx = this.viewfinderX - fw / 2;
    const fy = this.viewfinderY - fh / 2;

    // 3. Optical Lens Magnification (Zoom To / Zoom Nhỏ)
    // Extracts source area from canvas and magnifies it inside the viewfinder glass
    const sourceW = fw / this.zoomLevel;
    const sourceH = fh / this.zoomLevel;
    const sourceX = this.viewfinderX - sourceW / 2;
    const sourceY = this.viewfinderY - sourceH / 2;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(fx, fy, fw, fh, 6);
    ctx.clip();

    // Draw hardware-accelerated magnified lens view from current canvas
    try {
      ctx.drawImage(
        canvas,
        sourceX, sourceY, sourceW, sourceH,
        fx, fy, fw, fh
      );
    } catch {
      // In case coordinates fall slightly out of canvas boundary during extreme resize
    }

    // Optical Lens Vignette & Antireflective Coating
    const lensGrad = ctx.createRadialGradient(
      this.viewfinderX, this.viewfinderY, fw * 0.2,
      this.viewfinderX, this.viewfinderY, fw * 0.72
    );
    lensGrad.addColorStop(0, 'rgba(56, 189, 248, 0.03)');
    lensGrad.addColorStop(0.75, 'rgba(15, 23, 42, 0.12)');
    lensGrad.addColorStop(1, 'rgba(15, 23, 42, 0.32)');
    ctx.fillStyle = lensGrad;
    ctx.fillRect(fx, fy, fw, fh);

    // Rule of Thirds Professional Photography Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(fx + fw / 3, fy); ctx.lineTo(fx + fw / 3, fy + fh);
    ctx.moveTo(fx + (fw * 2) / 3, fy); ctx.lineTo(fx + (fw * 2) / 3, fy + fh);
    ctx.moveTo(fx, fy + fh / 3); ctx.lineTo(fx + fw, fy + fh / 3);
    ctx.moveTo(fx, fy + (fh * 2) / 3); ctx.lineTo(fx + fw, fy + (fh * 2) / 3);
    ctx.stroke();

    ctx.restore(); // Exit clip

    // 4. Viewfinder Frame Border & Corner Brackets
    const bracketLen = 22;
    const accentColor = this.shutterCooldown > 0 
      ? '#94a3b8' 
      : (hasNotableSubject ? '#22c55e' : '#38bdf8');

    // Outer subtle boundary line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(fx, fy, fw, fh, 6);
    ctx.stroke();

    // Heavy corner brackets
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;

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

    // Center Crosshairs with Autofocus Ring
    const cx = this.viewfinderX;
    const cy = this.viewfinderY;
    const chLen = 9;

    ctx.lineWidth = 1.2;
    ctx.strokeStyle = hasNotableSubject ? 'rgba(34, 197, 94, 0.85)' : 'rgba(56, 189, 248, 0.75)';
    ctx.beginPath();
    ctx.moveTo(cx - chLen, cy); ctx.lineTo(cx + chLen, cy);
    ctx.moveTo(cx, cy - chLen); ctx.lineTo(cx, cy + chLen);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.stroke();

    // 5. Top Telemetry Tag: Live Zoom Factor & Lens Mode
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.roundRect(fx, fy - 22, fw, 18, 4);
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 9.5px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`🔍 ${this.zoomLevel.toFixed(1)}x • ${this.getZoomDescriptor()}`, fx + fw / 2, fy - 13);

    // 6. Bottom Telemetry Tag: Framing Score and Status
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.roundRect(fx, fy + fh + 6, fw, 20, 4);
    ctx.fill();

    ctx.fillStyle = accentColor;
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    if (this.shutterCooldown > 0) {
      const pct = Math.round((1 - this.shutterCooldown / this.maxCooldown) * 100);
      ctx.fillText(`NẠP PHIM... ${pct}%`, fx + fw / 2, fy + fh + 16);
    } else if (hasNotableSubject) {
      ctx.fillText(`KHOẢNH KHẮC [${framingScore}%]`, fx + fw / 2, fy + fh + 16);
    } else {
      ctx.fillText('QUAN SÁT...', fx + fw / 2, fy + fh + 16);
    }

    ctx.restore();
  }
}
