// City Environment & Multi-Layer Parallax Renderer
// Original vector architecture, distinct city zones, and dynamic social mood ambience.

export interface CityZone {
  id: string;
  nameVi: string;
  nameEn: string;
  startX: number;
  endX: number;
  centerX: number;
  descriptionVi: string;
}

export class CityWorld {
  public readonly width: number = 2400; // Total horizontal world span
  public readonly height: number = 600;
  public readonly groundY: number = 490;

  public zones: CityZone[] = [
    {
      id: 'residential',
      nameVi: 'Khu Dân Cư Phố Cổ',
      nameEn: 'Old Town Residential',
      startX: 0,
      endX: 420,
      centerX: 210,
      descriptionVi: 'Những dãy nhà gạch ấm áp, ban công hoa và nhịp sống yên ả'
    },
    {
      id: 'cafe',
      nameVi: "Quán Cà Phê L'Aura",
      nameEn: "Cafe L'Aura",
      startX: 420,
      endX: 840,
      centerX: 630,
      descriptionVi: 'Mái che kẻ sọc, bàn ghế ngoài trời, nơi giới trí thức đàm đạo'
    },
    {
      id: 'plaza',
      nameVi: 'Quảng Trường Ánh Sáng',
      nameEn: 'Central Plaza & Fountain',
      startX: 840,
      endX: 1320,
      centerX: 1080,
      descriptionVi: 'Đài phun nước trung tâm, nơi người dân tụ hội và nghệ sĩ biểu diễn'
    },
    {
      id: 'monolith',
      nameVi: 'Tháp Màn Hình Tin Tức',
      nameEn: 'Media Screen Monolith',
      startX: 1320,
      endX: 1740,
      centerX: 1530,
      descriptionVi: 'Màn hình LED thị chính khổng lồ, phát sóng các bài báo định hình dư luận'
    },
    {
      id: 'transit',
      nameVi: 'Trạm Trung Chuyển Xe Tuyến',
      nameEn: 'Civic Transit Hub',
      startX: 1740,
      endX: 2100,
      centerX: 1920,
      descriptionVi: 'Nhà chờ xe bus, dòng người hối hả đi làm và về nhà'
    },
    {
      id: 'park',
      nameVi: 'Công Viên Hòa Bình',
      nameEn: 'Peace Park',
      startX: 2100,
      endX: 2400,
      centerX: 2250,
      descriptionVi: 'Hàng cây xanh rợp bóng, ghế đá, nơi tìm kiếm sự tĩnh lặng'
    }
  ];

  // News monolith display state
  public activeBroadcastHeadline: string = 'CHÀO ĐÓN NGÀY MỚI TẠI THÀNH PHỐ ECHOES';
  public activeBroadcastSubtitle: string = 'Thời tiết dễ chịu. Hãy chú ý quan sát những điều xung quanh!';
  public activeBroadcastImage: HTMLImageElement | null = null;
  public broadcastFlashTimer: number = 0;

  // Pigeons wandering in Plaza and Park
  public pigeons: Array<{ x: number; y: number; vx: number; peckCycle: number; isFlying: boolean; flyTimer: number }> = [];

  // Environmental particles (ambient dust, leaves, or tension ash)
  private particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number }> = [];

  constructor() {
    // Generate pigeons in Plaza and Park
    const pigeonSpots = [980, 1040, 1120, 1180, 2200, 2280, 2340];
    pigeonSpots.forEach(px => {
      this.pigeons.push({
        x: px,
        y: this.groundY - 2,
        vx: (Math.random() - 0.5) * 12,
        peckCycle: Math.random() * 10,
        isFlying: false,
        flyTimer: 0
      });
    });

    // Generate initial atmospheric ambient particles
    for (let i = 0; i < 45; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: 100 + Math.random() * 400,
        vx: 8 + Math.random() * 14,
        vy: (Math.random() - 0.5) * 8,
        size: 1.5 + Math.random() * 2,
        alpha: 0.2 + Math.random() * 0.4
      });
    }
  }

  public setBroadcast(headline: string, subtitle: string, imageSrc?: string): void {
    this.activeBroadcastHeadline = headline;
    this.activeBroadcastSubtitle = subtitle;
    this.broadcastFlashTimer = 3.5;
    if (imageSrc && typeof Image !== 'undefined') {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        this.activeBroadcastImage = img;
      };
    }
  }

  public update(dt: number): void {
    if (this.broadcastFlashTimer > 0) {
      this.broadcastFlashTimer -= dt;
    }

    // Update ambient particles
    for (const p of this.particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.x > this.width) p.x = 0;
      if (p.y > this.groundY) p.y = 120;
    }

    // Update pigeons
    for (const pg of this.pigeons) {
      pg.peckCycle += dt * 5;
      if (pg.isFlying) {
        pg.flyTimer -= dt;
        pg.x += pg.vx * dt * 2.5;
        pg.y = this.groundY - 14 - Math.sin(pg.flyTimer * 4) * 16;
        if (pg.flyTimer <= 0) {
          pg.isFlying = false;
          pg.y = this.groundY - 2;
        }
      } else {
        pg.x += pg.vx * dt;
        if (Math.random() < 0.02) pg.vx = (Math.random() - 0.5) * 16;
        if (Math.random() < 0.005) {
          pg.isFlying = true;
          pg.flyTimer = 1.2 + Math.random() * 1.5;
        }
      }
    }
  }

  public getZoneAt(x: number): CityZone {
    const found = this.zones.find(z => x >= z.startX && x < z.endX);
    return found || this.zones[2]; // Default to plaza
  }

  /**
   * Renders the multi-layered city world with parallax scrolling and dynamic atmospheric lighting.
   */
  public render(
    ctx: CanvasRenderingContext2D,
    cameraX: number,
    viewportWidth: number,
    viewportHeight: number,
    tension: number,
    empathy: number
  ): void {
    // 1. Sky & Atmospheric gradient
    this.renderSky(ctx, viewportWidth, viewportHeight, tension, empathy);

    // 2. Distant Parallax Skyline Layer (0.25x speed)
    this.renderDistantSkyline(ctx, cameraX, viewportHeight);

    // 3. Middleground Architectural Facades (1.0x speed world coordinate)
    this.renderCityBuildings(ctx, tension);

    // 4. Ground pavement & cobblestones
    this.renderStreetGround(ctx);

    // 5. Environmental Props & Landmarks (Trees, Cafe tables, Fountain, Monolith, Bus Stop)
    this.renderPropsAndLandmarks(ctx, tension);

    // 6. Cute street pigeons pecking & flying
    this.drawPigeons(ctx);

    // 7. Atmospheric floating particles
    this.renderParticles(ctx, tension, empathy);
  }

  private renderSky(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    tension: number,
    empathy: number
  ): void {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    
    if (tension > 60) {
      // High tension: gloomy charcoal / amber haze
      skyGrad.addColorStop(0, '#334155');
      skyGrad.addColorStop(0.65, '#64748b');
      skyGrad.addColorStop(1, '#94a3b8');
    } else if (empathy > 60) {
      // High empathy: warm pastel sunrise/sunset peach
      skyGrad.addColorStop(0, '#fbcfe8');
      skyGrad.addColorStop(0.4, '#fed7aa');
      skyGrad.addColorStop(1, '#ffedd5');
    } else {
      // Balanced / Clear Daylight
      skyGrad.addColorStop(0, '#93c5fd');
      skyGrad.addColorStop(0.6, '#bfdbfe');
      skyGrad.addColorStop(1, '#e0f2fe');
    }

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Viewport fixed
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  private renderDistantSkyline(ctx: CanvasRenderingContext2D, cameraX: number, h: number): void {
    ctx.save();
    const parallaxOffset = cameraX * 0.2;
    ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';

    // Procedural distant towers
    const towerWidth = 85;
    for (let i = -2; i < 35; i++) {
      const bx = i * towerWidth - (parallaxOffset % towerWidth);
      const th = 140 + ((i * 37) % 180);
      ctx.fillRect(bx, h - 220 - th, towerWidth - 10, th + 220);
    }
    ctx.restore();
  }

  private renderCityBuildings(ctx: CanvasRenderingContext2D, tension: number): void {
    // 1. Old Town Residential (0 - 420)
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(20, 200, 160, 290);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(200, 170, 180, 320);

    // Residential windows & balconies
    ctx.fillStyle = '#f8fafc';
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        ctx.fillRect(40 + c * 45, 230 + r * 55, 26, 32);
        ctx.fillRect(225 + c * 50, 205 + r * 55, 28, 34);
      }
    }

    // 2. Cafe L'Aura Building (420 - 840)
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(440, 220, 360, 270);
    // Striped Awning
    const awningY = 380;
    for (let i = 0; i < 18; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#dc2626' : '#ffffff';
      ctx.fillRect(450 + i * 19, awningY, 19, 24);
    }
    // Cafe signboard
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(540, 340, 180, 30);
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 14px serif';
    ctx.textAlign = 'center';
    ctx.fillText("CAFÉ L'AURA", 630, 360);

    // 3. Central Plaza Monument Backdrop (840 - 1320)
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(860, 210, 420, 280);
    // Classical columns
    ctx.fillStyle = '#cbd5e1';
    for (let c = 0; c < 5; c++) {
      ctx.fillRect(900 + c * 80, 250, 22, 240);
    }

    // 4. Media Screen Monolith Tower (1320 - 1740)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(1380, 70, 300, 420);

    // Giant LED Media Screen!
    this.renderNewsScreen(ctx, tension);

    // 5. Civic Transit Hub Building (1740 - 2100)
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(1770, 260, 300, 230);
    // Modern glass panels
    ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.fillRect(1790, 300, 260, 130);

    // 6. Park Pavilion (2100 - 2400)
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(2140, 310, 220, 180);
  }

  private renderNewsScreen(ctx: CanvasRenderingContext2D, tension: number): void {
    const sx = 1395;
    const sy = 95;
    const sw = 270;
    const sh = 200;

    // Glowing screen bezel
    ctx.fillStyle = tension > 60 ? '#450a0a' : '#0284c7';
    ctx.fillRect(sx - 4, sy - 4, sw + 8, sh + 8);

    // Screen inner background
    const isFlashing = this.broadcastFlashTimer > 0 && Math.floor(Date.now() / 200) % 2 === 0;
    ctx.fillStyle = isFlashing ? '#fef08a' : (tension > 60 ? '#181114' : '#041f38');
    ctx.fillRect(sx, sy, sw, sh);

    // Screen contents
    ctx.save();
    
    // Top banner
    ctx.fillStyle = isFlashing ? '#000000' : '#38bdf8';
    ctx.font = '700 11px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('● THỜI SỰ ĐÔ THỊ TRỰC TIẾP', sx + 12, sy + 18);

    // Photo Box on Screen
    const imgX = sx + 12;
    const imgY = sy + 28;
    const imgW = 86;
    const imgH = 68;

    // Photo background / frame
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(imgX - 1, imgY - 1, imgW + 2, imgH + 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(imgX - 1, imgY - 1, imgW + 2, imgH + 2);

    if (this.activeBroadcastImage && this.activeBroadcastImage.complete) {
      // Draw actual captured photo onto screen
      ctx.drawImage(this.activeBroadcastImage, imgX, imgY, imgW, imgH);
      // Subtle scanline overlay
      ctx.fillStyle = 'rgba(2, 132, 199, 0.12)';
      for (let sl = imgY; sl < imgY + imgH; sl += 4) {
        ctx.fillRect(imgX, sl, imgW, 1.5);
      }
    } else {
      // Camera placeholder illustration if before first snapshot
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(imgX, imgY, imgW, imgH);
      ctx.fillStyle = '#64748b';
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📷', imgX + imgW / 2, imgY + imgH / 2 + 7);
    }

    // Headline and details on the right of the photo
    const textX = imgX + imgW + 10;
    const textMaxW = sw - (imgW + 30);
    ctx.fillStyle = isFlashing ? '#000000' : '#ffffff';
    ctx.textAlign = 'left';
    ctx.font = '700 11px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif';
    this.drawWrappedText(ctx, this.activeBroadcastHeadline, textX, imgY + 12, textMaxW, 14);

    // Subtitle below photo
    ctx.fillStyle = isFlashing ? '#333333' : '#94a3b8';
    ctx.font = '500 10px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif';
    this.drawWrappedText(ctx, this.activeBroadcastSubtitle, sx + 12, imgY + imgH + 16, sw - 24, 13);

    // Community Evaluation Rating Banner
    const evalY = sy + sh - 42;
    ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
    ctx.beginPath();
    ctx.roundRect(sx + 10, evalY, sw - 20, 18, 3);
    ctx.fill();

    ctx.fillStyle = '#f59e0b';
    ctx.font = '700 9.5px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('ĐÁNH GIÁ: ★★★★☆', sx + 16, evalY + 12);
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'right';
    ctx.fillText('DƯ LUẬN THEO DÕI SÁT', sx + sw - 16, evalY + 12);

    // Bottom ticker
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(sx, sy + sh - 20, sw, 20);
    ctx.fillStyle = '#38bdf8';
    ctx.font = '700 9px monospace';
    ctx.textAlign = 'center';
    const tickerTime = new Date().toLocaleTimeString('vi-VN');
    ctx.fillText(`LIVE [${tickerTime}] • PHÁT THANH TRUYỀN HÌNH THỊ CHÍNH`, sx + sw / 2, sy + sh - 7);

    ctx.restore();
  }

  private drawWrappedText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): void {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
        if (currentY > y + lineHeight * 2) {
          ctx.fillText('...', x, currentY);
          return;
        }
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, currentY);
  }

  private renderStreetGround(ctx: CanvasRenderingContext2D): void {
    // Sidewalk curb
    ctx.fillStyle = '#64748b';
    ctx.fillRect(0, this.groundY - 6, this.width, 6);

    // Road & Pavement
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, this.groundY, this.width, this.height - this.groundY);

    // Pavement cobbles & lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, this.groundY);
      ctx.lineTo(x + 10, this.height);
      ctx.stroke();
    }
  }

  private renderPropsAndLandmarks(ctx: CanvasRenderingContext2D, _tension: number): void {
    // 1. Street Lanterns across zones
    const lampPositions = [120, 360, 600, 840, 1080, 1320, 1680, 1920, 2160, 2350];
    for (const lx of lampPositions) {
      this.drawStreetLamp(ctx, lx, this.groundY);
    }

    // 2. Central Fountain in Plaza (1080)
    this.drawFountain(ctx, 1080, this.groundY);

    // 3. Park Foliage & Trees (2150 - 2380)
    this.drawTree(ctx, 2180, this.groundY, 48, '#16a34a');
    this.drawTree(ctx, 2320, this.groundY, 56, '#15803d');

    // 4. Transit Bus Shelter at 1920
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(1870, this.groundY - 70, 100, 70);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(1874, this.groundY - 66, 92, 45); // Glass
    // Bench
    ctx.fillStyle = '#92400e';
    ctx.fillRect(1885, this.groundY - 20, 70, 8);
  }

  private drawStreetLamp(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 90);
    ctx.lineTo(x + 12, y - 98);
    ctx.stroke();

    // Lamp bulb
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(x + 12, y - 94, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawFountain(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    // Base basin
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.ellipse(x, y - 10, 48, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Water pool
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.ellipse(x, y - 12, 42, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Center spout & spray
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x - 5, y - 36, 10, 26);
    
    // Spouting water jets
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 2;
    const t = Date.now() * 0.005;
    ctx.beginPath();
    ctx.arc(x, y - 36, 14 + Math.sin(t) * 2, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
  }

  private drawTree(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, leafColor: string): void {
    // Trunk
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x - 6, y - 60, 12, 60);

    // Leaves
    ctx.fillStyle = leafColor;
    ctx.beginPath();
    ctx.arc(x, y - 85, radius, 0, Math.PI * 2);
    ctx.arc(x - 20, y - 70, radius * 0.75, 0, Math.PI * 2);
    ctx.arc(x + 20, y - 70, radius * 0.75, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawPigeons(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    for (const pg of this.pigeons) {
      ctx.save();
      ctx.translate(pg.x, pg.y);
      const facing = pg.vx >= 0 ? 1 : -1;
      ctx.scale(facing, 1);

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath();
      ctx.ellipse(0, 0, 5, 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Body
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.ellipse(0, -5, 6, 4, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Head with peck bob
      const peckY = pg.isFlying ? -7 : (-7 + Math.sin(pg.peckCycle) * 2);
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(4, peckY, 3, 0, Math.PI * 2);
      ctx.fill();

      // Orange Beak
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(6, peckY);
      ctx.lineTo(9, peckY + 1);
      ctx.lineTo(6, peckY + 2);
      ctx.fill();

      // Wing (flutters if flying)
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      if (pg.isFlying) {
        const wingFlap = Math.sin(pg.peckCycle * 3) * 6;
        ctx.ellipse(-2, -9 + wingFlap, 6, 3, -0.6, 0, Math.PI * 2);
      } else {
        ctx.ellipse(-1, -6, 5, 3, 0.1, 0, Math.PI * 2);
      }
      ctx.fill();

      ctx.restore();
    }
    ctx.restore();
  }

  private renderParticles(ctx: CanvasRenderingContext2D, tension: number, empathy: number): void {
    ctx.save();
    for (const p of this.particles) {
      if (tension > 60) {
        ctx.fillStyle = `rgba(30, 41, 59, ${p.alpha})`; // Urban smog / grit
      } else if (empathy > 60) {
        ctx.fillStyle = `rgba(244, 114, 182, ${p.alpha})`; // Pink blossom petals
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`; // Fresh dust motes
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}
