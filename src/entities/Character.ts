// Character Entity System for ECHOES OF THE CROWD
// Completely original, stylized procedural vector rendering with distinct visual identities and AI state machine.

import { CharacterArchetype, CharacterState, EmotionType, SocialGroup } from '../types/game';

export interface VisualTraits {
  headShape: 'round' | 'oval' | 'square' | 'teardrop';
  skinTone: string;
  hairStyle: 'messy' | 'ponytail' | 'curly' | 'short_part' | 'bald_elder' | 'bun' | 'beanie';
  hairColor: string;
  outfitColor: string;
  pantsColor: string;
  accessory?: 'glasses' | 'headphones' | 'guitar' | 'scarf' | 'notebook' | 'cap' | 'medical_bag';
  scale: number;
}

export class Character {
  public id: string;
  public name: string;
  public group: SocialGroup;
  public archetype: CharacterArchetype;
  public x: number;
  public y: number;
  public targetX: number;
  public speed: number = 38; // px/sec
  public facing: 'left' | 'right' = 'right';

  public state: CharacterState = 'idle';
  public emotion: EmotionType = 'neutral';
  public visual: VisualTraits;

  // AI & simulation properties
  public trust: number = 50;
  public tension: number = 20;
  public empathy: number = 50;
  public stateTimer: number = 0;
  public walkCycle: number = 0;
  public isTalking: boolean = false;
  public currentSpeechBubble: string | null = null;
  public speechBubbleTimer: number = 0;
  public lastNewsReadId: string | null = null;
  public targetCharacterId: string | null = null;

  // Camera awareness
  public noticedCameraTimer: number = 0;

  constructor(
    id: string,
    name: string,
    group: SocialGroup,
    archetype: CharacterArchetype,
    x: number,
    y: number,
    visual: VisualTraits
  ) {
    this.id = id;
    this.name = name;
    this.group = group;
    this.archetype = archetype;
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.visual = visual;
    this.stateTimer = 2 + Math.random() * 4;
  }

  public update(dt: number, worldBounds: { minX: number; maxX: number }, nearbyChars: Character[]): void {
    this.stateTimer -= dt;
    this.walkCycle += dt * 6.5;

    if (this.speechBubbleTimer > 0) {
      this.speechBubbleTimer -= dt;
      if (this.speechBubbleTimer <= 0) {
        this.currentSpeechBubble = null;
      }
    }

    if (this.noticedCameraTimer > 0) {
      this.noticedCameraTimer -= dt;
    }

    // AI State Machine
    switch (this.state) {
      case 'idle':
        if (this.stateTimer <= 0) {
          this.decideNextBehavior(worldBounds, nearbyChars);
        }
        break;

      case 'wandering':
        this.moveTowardTarget(dt);
        if (Math.abs(this.x - this.targetX) < 4) {
          this.state = 'idle';
          this.stateTimer = 2 + Math.random() * 5;
        }
        break;

      case 'chatting':
      case 'debating':
        if (this.stateTimer <= 0) {
          this.state = 'idle';
          this.stateTimer = 1.5 + Math.random() * 3;
          this.currentSpeechBubble = null;
        }
        break;

      case 'reading_news':
      case 'dancing':
      case 'in_love':
      case 'protesting':
      case 'taking_selfie':
      case 'feeding_birds':
      case 'pointing_sky':
        if (this.stateTimer <= 0) {
          this.state = 'idle';
          this.stateTimer = 2.5 + Math.random() * 3;
        }
        break;

      case 'tripping':
        if (this.stateTimer <= 0) {
          this.state = 'idle';
          this.emotion = 'surprised';
          this.stateTimer = 2;
        }
        break;

      case 'jogging':
        this.moveTowardTarget(dt * 1.8);
        if (Math.abs(this.x - this.targetX) < 6) {
          this.state = 'idle';
          this.stateTimer = 2;
        }
        break;

      case 'staring_at_camera':
        if (this.noticedCameraTimer <= 0) {
          this.state = 'idle';
          this.stateTimer = 2;
        }
        break;

      case 'fleeing':
        this.moveTowardTarget(dt * 1.6);
        if (Math.abs(this.x - this.targetX) < 5) {
          this.state = 'idle';
          this.emotion = 'worried';
          this.stateTimer = 3;
        }
        break;

      default:
        if (this.stateTimer <= 0) {
          this.state = 'idle';
          this.stateTimer = 2;
        }
        break;
    }
  }

  private moveTowardTarget(dt: number): void {
    const dx = this.targetX - this.x;
    if (Math.abs(dx) > 2) {
      this.facing = dx > 0 ? 'right' : 'left';
      const step = Math.sign(dx) * this.speed * dt;
      this.x += step;
    }
  }

  public decideNextBehavior(bounds: { minX: number; maxX: number }, nearbyChars: Character[]): void {
    // 1. Social contagion: if someone nearby is pointing at the sky, join in!
    const pointer = nearbyChars.find(c => c.id !== this.id && c.state === 'pointing_sky' && Math.abs(c.x - this.x) < 140);
    if (pointer && Math.random() < 0.7) {
      this.state = 'pointing_sky';
      this.facing = pointer.facing;
      this.emotion = 'surprised';
      this.sayRandom(['Có cái gì trên trời kìa?!', 'Vật thể lạ sao?!', 'Mọi người nhìn kìa!'], 3.5);
      this.stateTimer = 4;
      return;
    }

    // 2. Social contagion: if someone is dancing (like Nam), join the dance!
    const dancer = nearbyChars.find(c => c.id !== this.id && (c.state === 'dancing' || c.archetype === 'nam_busker') && Math.abs(c.x - this.x) < 120);
    if (dancer && Math.random() < 0.45 && this.tension < 65) {
      this.state = 'dancing';
      this.emotion = 'happy';
      this.sayRandom(['Nhạc cuốn quá!', 'Cùng nhún nhảy nào!', 'Yeah!'], 3);
      this.stateTimer = 4 + Math.random() * 3;
      return;
    }

    // 3. Archetype specific spontaneous actions:
    if (this.archetype === 'nam_busker' && Math.random() < 0.5) {
      this.state = 'dancing';
      this.emotion = 'happy';
      this.sayRandom(['*Gảy đàn ghi-ta ngẫu hứng*', 'Giai điệu buổi sáng!'], 4);
      this.stateTimer = 6;
      return;
    }

    if (this.archetype === 'quynh_influencer' && Math.random() < 0.45) {
      this.state = 'taking_selfie';
      this.emotion = 'happy';
      this.sayRandom(['Selfie một tấm nào!', 'Góc này ánh sáng đỉnh quá!'], 3.5);
      this.stateTimer = 4.5;
      return;
    }

    if (this.archetype === 'hoang_activist' && Math.random() < 0.4) {
      this.state = 'protesting';
      this.emotion = 'angry';
      this.sayRandom(['Chúng tôi cần sự thật!', 'Bảo vệ không gian sống!', 'Hãy lắng nghe dân!'], 4);
      this.stateTimer = 5;
      return;
    }

    if (this.archetype === 'child_an' && Math.random() < 0.5) {
      this.state = 'jogging';
      this.targetX = Math.max(bounds.minX + 40, Math.min(bounds.maxX - 40, this.x + (Math.random() * 300 - 150)));
      this.emotion = 'happy';
      this.sayRandom(['Đuổi theo đàn bồ câu!', 'Bắt kịp tớ không!'], 3);
      this.stateTimer = 4;
      return;
    }

    // 4. Clumsy mishap (tripping over cobblestone) - 5% chance!
    if (Math.random() < 0.05 && this.state !== 'tripping') {
      this.state = 'tripping';
      this.emotion = 'surprised';
      this.sayRandom(['Ối da! Suýt ngã!', 'Vỉa hè trơn quá!', 'Ai để vỏ chuối ở đây vậy!'], 2.5);
      this.stateTimer = 2.5;
      return;
    }

    // 5. Romance / Hug between close characters with high empathy
    const closeFriends = nearbyChars.filter(c => c.id !== this.id && Math.abs(c.x - this.x) < 70);
    if (closeFriends.length > 0 && Math.random() < 0.45) {
      const partner = closeFriends[Math.floor(Math.random() * closeFriends.length)];
      this.targetCharacterId = partner.id;
      this.facing = partner.x > this.x ? 'right' : 'left';

      if (this.empathy > 55 && Math.random() < 0.3) {
        this.state = 'in_love';
        this.emotion = 'happy';
        this.sayRandom(['Gặp bạn thật vui!', 'Mãi là bạn tốt nhé!', 'Ấm lòng quá!'], 3.5);
        this.stateTimer = 4;
        return;
      }
      
      if (this.tension > 60 || partner.tension > 60) {
        this.state = 'debating';
        this.emotion = 'worried';
        this.sayRandom(['Tại sao lại như thế chứ?', 'Tôi không đồng ý!', 'Có chuyện gì vậy?']);
      } else {
        this.state = 'chatting';
        this.emotion = this.empathy > 55 ? 'happy' : 'neutral';
        this.sayRandom(['Chào buổi sáng!', 'Hôm nay trời đẹp nhỉ.', 'Bạn vừa nghe tin gì chưa?']);
      }
      this.stateTimer = 3 + Math.random() * 4;
      return;
    }

    // 6. Otherwise wander
    this.state = 'wandering';
    const wanderDist = (Math.random() * 260 - 130);
    this.targetX = Math.max(bounds.minX + 30, Math.min(bounds.maxX - 30, this.x + wanderDist));
    this.stateTimer = 8;
  }

  public sayRandom(phrases: string[], durationSec: number = 3.5): void {
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    this.currentSpeechBubble = phrase;
    this.speechBubbleTimer = durationSec;
  }

  public onNoticedCamera(cameraX: number): void {
    this.noticedCameraTimer = 2.5;
    this.state = 'staring_at_camera';
    this.facing = cameraX > this.x ? 'right' : 'left';
    if (this.archetype === 'quynh_influencer') {
      this.emotion = 'happy';
      this.sayRandom(['*Tạo dáng chụp*', 'Góc này đẹp nè!'], 2);
    } else if (this.archetype === 'phong_engineer') {
      this.emotion = 'skeptical';
      this.sayRandom(['Ai đang chụp thế?', 'Có việc gì không?'], 2);
    } else {
      this.emotion = 'surprised';
    }
  }

  /**
   * High fidelity procedural vector rendering of the character.
   */
  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x, this.y);

    const scale = this.visual.scale;
    ctx.scale(this.facing === 'right' ? scale : -scale, scale);

    // Dynamic state rotation & bounce
    if (this.state === 'tripping') {
      ctx.rotate(0.35); // Stumble forward
    } else if (this.state === 'dancing') {
      ctx.rotate(Math.sin(this.walkCycle * 2) * 0.1); // Fun dance sway
    }

    const isMoving = this.state === 'wandering' || this.state === 'fleeing' || this.state === 'jogging';
    const danceBob = this.state === 'dancing' ? Math.abs(Math.sin(this.walkCycle * 2)) * 6 : 0;
    const walkOffset = (isMoving ? Math.sin(this.walkCycle) * 3 : 0) - danceBob;
    const legSwing = isMoving ? Math.sin(this.walkCycle) * 8 : (this.state === 'dancing' ? Math.sin(this.walkCycle * 2) * 5 : 0);

    // 1. Soft Shadow
    ctx.fillStyle = 'rgba(20, 25, 35, 0.22)';
    ctx.beginPath();
    ctx.ellipse(0, 4, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Legs / Pants
    ctx.strokeStyle = this.visual.pantsColor;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    // Back leg
    ctx.beginPath();
    ctx.moveTo(3, -12);
    ctx.lineTo(3 - legSwing, 2);
    ctx.stroke();
    // Front leg
    ctx.beginPath();
    ctx.moveTo(-3, -12);
    ctx.lineTo(-3 + legSwing, 2);
    ctx.stroke();

    // 3. Torso / Outfit
    ctx.fillStyle = this.visual.outfitColor;
    ctx.beginPath();
    // Stylized rounded coat / hoodie torso
    ctx.roundRect(-8, -32 + walkOffset, 16, 20, [4, 4, 2, 2]);
    ctx.fill();

    // 4. Arms & Accessories
    ctx.strokeStyle = this.visual.outfitColor;
    ctx.lineWidth = 3.5;
    if (this.state === 'pointing_sky') {
      ctx.beginPath();
      ctx.moveTo(0, -28 + walkOffset);
      ctx.lineTo(12, -48 + walkOffset);
      ctx.stroke();
    } else {
      const armSwing = isMoving ? -Math.sin(this.walkCycle) * 6 : (this.state === 'dancing' ? -Math.sin(this.walkCycle * 2) * 8 : 0);
      ctx.beginPath();
      ctx.moveTo(0, -28 + walkOffset);
      ctx.lineTo(6 + armSwing, -16 + walkOffset);
      ctx.stroke();
    }

    // Draw active state prop if any
    if (this.state === 'protesting') {
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(4, -20 + walkOffset);
      ctx.lineTo(8, -60 + walkOffset);
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-2, -76 + walkOffset, 24, 16);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      ctx.strokeRect(-2, -76 + walkOffset, 24, 16);

      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 7px sans-serif';
      ctx.fillText('THẬT', 2, -65 + walkOffset);
    } else if (this.state === 'taking_selfie') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(8, -26 + walkOffset, 6, 10);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(9, -25 + walkOffset, 4, 8);
    }

    // Draw accessory if any
    this.renderAccessory(ctx, walkOffset);

    // 5. Head & Neck
    ctx.fillStyle = this.visual.skinTone;
    ctx.beginPath();
    const headY = -42 + walkOffset;
    if (this.visual.headShape === 'round') {
      ctx.arc(0, headY, 9, 0, Math.PI * 2);
    } else if (this.visual.headShape === 'square') {
      ctx.roundRect(-8, headY - 8, 16, 16, 3);
    } else {
      ctx.ellipse(0, headY, 8, 10, 0, 0, Math.PI * 2);
    }
    ctx.fill();

    // 6. Hair
    this.renderHair(ctx, headY);

    // 7. Facial Features & Emotion
    this.renderFace(ctx, headY);

    ctx.restore();

    // Speech bubble or reaction icon (drawn upright regardless of facing scale)
    this.renderOverheadBubble(ctx, scale, walkOffset);
  }

  private renderAccessory(ctx: CanvasRenderingContext2D, walkOffset: number): void {
    if (!this.visual.accessory) return;

    if (this.visual.accessory === 'guitar') {
      // Guitar slung across back
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.ellipse(-6, -24 + walkOffset, 5, 9, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-8, -32 + walkOffset);
      ctx.lineTo(-5, -16 + walkOffset);
      ctx.stroke();
    } else if (this.visual.accessory === 'scarf') {
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.roundRect(-7, -34 + walkOffset, 14, 5, 2);
      ctx.fill();
    } else if (this.visual.accessory === 'notebook') {
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(4, -20 + walkOffset, 6, 8);
    }
  }

  private renderHair(ctx: CanvasRenderingContext2D, headY: number): void {
    ctx.fillStyle = this.visual.hairColor;
    const style = this.visual.hairStyle;

    if (style === 'short_part') {
      ctx.beginPath();
      ctx.arc(0, headY - 2, 9.5, Math.PI * 1.1, Math.PI * 2.1);
      ctx.lineTo(8, headY - 1);
      ctx.lineTo(-7, headY - 1);
      ctx.fill();
    } else if (style === 'ponytail') {
      ctx.beginPath();
      ctx.arc(0, headY - 2, 9.5, Math.PI, Math.PI * 2);
      ctx.fill();
      // tail
      ctx.beginPath();
      ctx.ellipse(-10, headY + 2, 4, 7, 0.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (style === 'beanie') {
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(0, headY - 4, 10, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(-9, headY - 4, 18, 4);
    } else if (style === 'bald_elder') {
      // Side fringe
      ctx.beginPath();
      ctx.arc(0, headY - 2, 9.5, Math.PI * 1.25, Math.PI * 1.75);
      ctx.stroke();
    } else {
      // messy / default
      ctx.beginPath();
      ctx.arc(0, headY - 3, 10, Math.PI * 0.95, Math.PI * 2.05);
      ctx.fill();
    }
  }

  private renderFace(ctx: CanvasRenderingContext2D, headY: number): void {
    // Eyes
    ctx.fillStyle = '#1e293b';
    const eyeX = 3;
    const eyeY = headY - 1;

    if (this.emotion === 'happy') {
      // Happy curve eye
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, 2.5, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
    } else if (this.emotion === 'angry') {
      // Slanted angry eye
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, 1.8, 0, Math.PI * 2);
      ctx.fill();
      // Eyebrow
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(eyeX - 3, eyeY - 4);
      ctx.lineTo(eyeX + 3, eyeY - 2);
      ctx.stroke();
    } else if (this.emotion === 'surprised') {
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, 2.4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Normal eye
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Mouth
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    const mouthY = headY + 4;
    if (this.state === 'in_love') {
      // Blushing cheeks
      ctx.fillStyle = 'rgba(244, 63, 94, 0.45)';
      ctx.beginPath();
      ctx.arc(eyeX - 1, eyeY + 4, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    if (this.emotion === 'happy' || this.state === 'dancing' || this.state === 'in_love') {
      ctx.arc(eyeX - 1, mouthY - 1, 2.5, 0.2, Math.PI - 0.2);
    } else if (this.emotion === 'angry') {
      ctx.arc(eyeX - 1, mouthY + 2, 2.5, Math.PI + 0.2, Math.PI * 2 - 0.2);
    } else if (this.emotion === 'surprised' || this.state === 'tripping' || this.state === 'pointing_sky') {
      ctx.fillStyle = '#1e293b';
      ctx.ellipse(eyeX - 1, mouthY, 1.5, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.moveTo(eyeX - 2, mouthY);
      ctx.lineTo(eyeX + 1, mouthY);
    }
    ctx.stroke();
  }

  private renderOverheadBubble(ctx: CanvasRenderingContext2D, scale: number, walkOffset: number): void {
    const bubbleY = this.y - 56 * scale + walkOffset;

    // Emotion mark if strong emotion
    if (this.noticedCameraTimer > 0) {
      this.drawPillIcon(ctx, this.x, bubbleY - 8, '📷', '#38bdf8');
      return;
    }

    if (this.currentSpeechBubble) {
      // Elegant speech bubble
      ctx.save();
      ctx.font = '600 11px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif';
      const textMetrics = ctx.measureText(this.currentSpeechBubble);
      const padding = 8;
      const width = textMetrics.width + padding * 2;
      const height = 22;
      const bx = this.x - width / 2;
      const by = bubbleY - height - 4;

      // Bubble background
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(bx, by, width, height, 6);
      ctx.fill();
      ctx.stroke();

      // Tail
      ctx.beginPath();
      ctx.moveTo(this.x - 4, by + height);
      ctx.lineTo(this.x, by + height + 5);
      ctx.lineTo(this.x + 4, by + height);
      ctx.fill();

      // Text
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.currentSpeechBubble, this.x, by + height / 2);
      ctx.restore();
    } else if (this.state === 'dancing') {
      this.drawPillIcon(ctx, this.x, bubbleY, '🎵', '#a855f7');
    } else if (this.state === 'in_love') {
      this.drawPillIcon(ctx, this.x, bubbleY, '💖', '#ec4899');
    } else if (this.state === 'protesting') {
      this.drawPillIcon(ctx, this.x, bubbleY, '📢', '#dc2626');
    } else if (this.state === 'taking_selfie') {
      this.drawPillIcon(ctx, this.x, bubbleY, '📱', '#3b82f6');
    } else if (this.state === 'pointing_sky') {
      this.drawPillIcon(ctx, this.x, bubbleY, '👆', '#f59e0b');
    } else if (this.state === 'tripping') {
      this.drawPillIcon(ctx, this.x, bubbleY, '💫', '#eab308');
    } else if (this.emotion === 'angry') {
      this.drawPillIcon(ctx, this.x, bubbleY, '💢', '#ef4444');
    } else if (this.emotion === 'happy') {
      this.drawPillIcon(ctx, this.x, bubbleY, '✨', '#eab308');
    } else if (this.emotion === 'worried') {
      this.drawPillIcon(ctx, this.x, bubbleY, '💧', '#3b82f6');
    }
  }

  private drawPillIcon(ctx: CanvasRenderingContext2D, x: number, y: number, icon: string, _accent: string): void {
    ctx.save();
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon, x, y);
    ctx.restore();
  }
}
