// Central Game State Coordinator for ECHOES OF THE CROWD

import { CapturedPhoto, EditorialAngle, EndingResult, GameSettings, HeadlineOption } from '../types/game';
import { SocialMetricsManager } from '../simulation/SocialMetrics';
import { RelationshipSystem } from '../simulation/RelationshipSystem';
import { CityWorld } from '../entities/CityWorld';
import { Crowd } from '../entities/Crowd';
import { EventSystem } from '../simulation/EventSystem';
import { NewsPropagation, PublishedArticle } from '../simulation/NewsPropagation';
import { ChapterCampaign } from '../simulation/ChapterCampaign';
import { Camera } from './Camera';
import { SaveSystem, SerializedGameState } from './SaveSystem';
import { sound } from '../audio/AudioEngine';
import { EndingResolver } from '../simulation/EndingResolver';
import { HeadlineGenerator } from '../simulation/HeadlineGenerator';

export type ActiveModal = 'none' | 'menu' | 'newsroom' | 'journal' | 'social' | 'settings' | 'hotkeys' | 'ending';

export class GameState {
  public metricsManager: SocialMetricsManager;
  public relationshipSystem: RelationshipSystem;
  public world: CityWorld;
  public crowd: Crowd;
  public eventSystem: EventSystem;
  public newsPropagation: NewsPropagation;
  public chapterCampaign: ChapterCampaign;
  public camera: Camera;

  // History & Session Data
  public photos: CapturedPhoto[] = [];
  public selectedPhotoForEditorial: CapturedPhoto | null = null;
  public lastPublishedArticle: PublishedArticle | null = null;
  public newsToastTimer: number = 0;
  public totalPhotosTaken: number = 0;
  public playtimeSeconds: number = 0;
  public isPaused: boolean = false;
  public gameSpeed: number = 1.0; // 1x or 2x
  public activeModal: ActiveModal = 'menu';
  public currentEndingResult: EndingResult | null = null;

  // Settings
  public settings: GameSettings = {
    language: 'vi',
    masterVolume: 0.8,
    sfxVolume: 0.8,
    musicVolume: 0.6,
    ambientVolume: 0.5,
    reducedMotion: false,
    highContrast: false,
    cameraSensitivity: 1.0,
    autoSaveIntervalSec: 60
  };

  private autoSaveTimer: number = 60;
  private changeListeners: Array<() => void> = [];

  constructor() {
    this.metricsManager = new SocialMetricsManager();
    this.relationshipSystem = new RelationshipSystem();
    this.world = new CityWorld();
    this.crowd = new Crowd(this.world);
    this.eventSystem = new EventSystem();
    this.newsPropagation = new NewsPropagation(this.metricsManager, this.relationshipSystem, this.world);
    this.chapterCampaign = new ChapterCampaign();
    this.camera = new Camera();

    // Try load saved settings
    const saved = SaveSystem.loadGame();
    if (saved && saved.settings) {
      this.settings = { ...this.settings, ...saved.settings };
      sound.setVolumes(
        this.settings.masterVolume,
        this.settings.sfxVolume,
        this.settings.musicVolume,
        this.settings.ambientVolume
      );
    }
  }

  public subscribe(fn: () => void): () => void {
    this.changeListeners.push(fn);
    return () => {
      this.changeListeners = this.changeListeners.filter(l => l !== fn);
    };
  }

  public notify(): void {
    this.changeListeners.forEach(fn => fn());
  }

  public startNewGame(): void {
    SaveSystem.clearSave();
    this.metricsManager = new SocialMetricsManager();
    this.relationshipSystem = new RelationshipSystem();
    this.world = new CityWorld();
    this.crowd = new Crowd(this.world);
    this.eventSystem = new EventSystem();
    this.newsPropagation = new NewsPropagation(this.metricsManager, this.relationshipSystem, this.world);
    this.chapterCampaign = new ChapterCampaign();
    this.camera = new Camera();
    this.photos = [];
    this.selectedPhotoForEditorial = null;
    this.totalPhotosTaken = 0;
    this.playtimeSeconds = 0;
    this.currentEndingResult = null;
    this.activeModal = 'none';
    this.isPaused = false;
    sound.init();
    this.notify();
  }

  public loadSavedGame(): boolean {
    const saved = SaveSystem.loadGame();
    if (!saved) return false;

    this.metricsManager.load(saved.metrics);
    this.chapterCampaign.setChapter(saved.currentChapterIndex);
    this.photos = saved.photos || [];
    this.totalPhotosTaken = saved.stats?.totalPhotosTaken || 0;
    this.playtimeSeconds = saved.stats?.playtimeSeconds || 0;
    this.activeModal = 'none';
    this.isPaused = false;
    sound.init();
    this.notify();
    return true;
  }

  public saveCurrentGame(): boolean {
    const serialized: SerializedGameState = {
      version: SaveSystem.CURRENT_VERSION,
      timestamp: Date.now(),
      currentChapterIndex: this.chapterCampaign.getCurrentChapter().index,
      metrics: this.metricsManager.serialize(),
      photos: this.photos,
      publishedArticles: this.newsPropagation.getPublishedArticles(),
      unlockedEndings: this.currentEndingResult ? [this.currentEndingResult.type] : [],
      settings: this.settings,
      stats: {
        totalPhotosTaken: this.totalPhotosTaken,
        playtimeSeconds: Math.round(this.playtimeSeconds)
      }
    };
    return SaveSystem.saveGame(serialized);
  }

  public update(dt: number): void {
    if (this.isPaused || this.activeModal !== 'none') return;

    const effectiveDt = dt * this.gameSpeed;
    this.playtimeSeconds += effectiveDt;

    // Camera
    this.camera.update(effectiveDt, this.settings.cameraSensitivity);

    // World & Crowd
    this.world.update(effectiveDt);
    this.crowd.update(effectiveDt, { minX: 0, maxX: this.world.width });

    // Events
    const currentChapter = this.chapterCampaign.getCurrentChapter().index;
    this.eventSystem.update(
      effectiveDt,
      this.crowd.characters,
      this.world,
      currentChapter,
      this.metricsManager.state.tension
    );

    // Metrics natural drift
    this.metricsManager.update(effectiveDt);

    // Dynamic procedural audio update
    sound.updateAtmosphere(this.metricsManager.state.tension, this.metricsManager.state.empathy);

    // News toast timer
    if (this.newsToastTimer > 0) {
      this.newsToastTimer -= effectiveDt;
      if (this.newsToastTimer <= 0) {
        this.lastPublishedArticle = null;
        this.notify();
      }
    }

    // Auto-save check
    this.autoSaveTimer -= dt;
    if (this.autoSaveTimer <= 0) {
      this.autoSaveTimer = this.settings.autoSaveIntervalSec;
      this.saveCurrentGame();
    }
  }

  /**
   * Captures a moment currently in the camera viewfinder.
   */
  public capturePhoto(canvasSnapshotUrl: string): CapturedPhoto | null {
    if (!this.camera.triggerShutter()) return null;

    sound.playShutter();
    sound.playFlash();

    const worldRect = this.camera.getViewfinderWorldRect();
    const evaluation = this.eventSystem.evaluateViewfinder(
      worldRect.x,
      worldRect.y,
      worldRect.width,
      worldRect.height,
      this.crowd.characters
    );

    // Alert nearby characters to look at camera
    evaluation.charactersInFrame.forEach(char => {
      char.onNoticedCamera(worldRect.x + worldRect.width / 2);
    });

    const currentZone = this.world.getZoneAt(worldRect.x + worldRect.width / 2);
    const photoId = 'photo_' + Date.now();
    this.totalPhotosTaken++;

    // Semantic Analysis for Combinatorial 300+ Headline Generation
    const isPigeonNear = this.world.pigeons.some(pg => 
      pg.x >= worldRect.x - 30 && pg.x <= worldRect.x + worldRect.width + 30
    );

    const primaryChar = evaluation.charactersInFrame[0];
    const secondaryChar = evaluation.charactersInFrame[1];
    const primaryAction = primaryChar ? primaryChar.state : (isPigeonNear ? 'feeding_birds' : 'idle');
    const dominantEmotion = primaryChar ? primaryChar.emotion : 'neutral';

    const generatedHeadlines = HeadlineGenerator.generateHeadlines({
      primaryCharacter: primaryChar,
      secondaryCharacter: secondaryChar,
      allCharacters: evaluation.charactersInFrame,
      zone: currentZone,
      primaryAction,
      dominantEmotion,
      isPigeonInFrame: isPigeonNear,
      hasCrowd: evaluation.charactersInFrame.length >= 3,
      hasConflict: evaluation.charactersInFrame.some(c => c.state === 'arguing' || c.state === 'debating' || c.emotion === 'angry'),
      hasRomance: evaluation.charactersInFrame.some(c => c.state === 'in_love'),
      hasPerformance: evaluation.charactersInFrame.some(c => c.state === 'dancing' || c.archetype === 'nam_busker'),
      hasProtest: evaluation.charactersInFrame.some(c => c.state === 'protesting' || c.archetype === 'hoang_activist')
    });

    const newPhoto: CapturedPhoto = {
      id: photoId,
      timestamp: Date.now(),
      gameTimeStr: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      chapterIndex: this.chapterCampaign.getCurrentChapter().index,
      eventInstanceId: evaluation.activeEvent?.instanceId,
      eventDefId: evaluation.activeEvent?.definition.id,
      eventTitle: evaluation.activeEvent ? evaluation.activeEvent.definition.title : (primaryChar ? `${primaryChar.name}` : (isPigeonNear ? 'Đàn Bồ Câu Phố Thị' : 'Nhịp Sống Đô Thị')),
      locationName: currentZone.nameVi,
      charactersInFrame: evaluation.charactersInFrame.map(c => c.name),
      framingScore: evaluation.framingScore,
      imageDataUrl: canvasSnapshotUrl,
      generatedHeadlines,
      published: false
    };

    if (evaluation.activeEvent) {
      this.eventSystem.markCaptured(evaluation.activeEvent.instanceId, evaluation.activeEvent.definition.id);
    }

    this.photos.unshift(newPhoto);

    // Open Newsroom modal for editorial review
    this.selectedPhotoForEditorial = newPhoto;
    this.openModal('newsroom');

    this.notify();
    return newPhoto;
  }

  public publishSelectedPhoto(selectedHeadlineIndex: number): PublishedArticle | null {
    if (!this.selectedPhotoForEditorial) return null;
    const photo = this.selectedPhotoForEditorial;

    // Get tailored headline option
    let chosenHeadline: HeadlineOption | null = null;
    if (photo.generatedHeadlines && photo.generatedHeadlines[selectedHeadlineIndex]) {
      chosenHeadline = photo.generatedHeadlines[selectedHeadlineIndex];
    } else if (photo.eventDefId) {
      const def = this.eventSystem.getCatalog().find(d => d.id === photo.eventDefId);
      if (def && def.headlineOptions[selectedHeadlineIndex]) {
        chosenHeadline = def.headlineOptions[selectedHeadlineIndex];
      }
    }

    // Fallback headline if needed
    if (!chosenHeadline) {
      const angle: EditorialAngle = selectedHeadlineIndex === 0 ? 'factual' : selectedHeadlineIndex === 1 ? 'sensational' : 'bridging';
      chosenHeadline = {
        id: 'generic_street_' + Date.now(),
        angle,
        title: selectedHeadlineIndex === 0 
          ? `Nhịp sống bình dị tại ${photo.locationName}`
          : selectedHeadlineIndex === 1 
            ? `Bất an hay thanh bình? Góc nhìn mới về ${photo.locationName}`
            : `Những bước chân tìm kiếm sự đồng điệu giữa đô thị`,
        subtitle: `Ghi nhận thực tế từ ống kính phóng viên thị chính.`,
        biasDescription: 'Ghi chép phóng sự tự do.',
        metricImpact: selectedHeadlineIndex === 0 ? { trust: 3 } : selectedHeadlineIndex === 1 ? { tension: 6, polarization: 4 } : { empathy: 6 },
        groupReactions: { youth: 'support', elders: 'support', intellect: 'neutral', commuters: 'support', activists: 'support' },
        viralityBonus: 1.1
      };
    }

    sound.playBroadcastAlert();
    const article = this.newsPropagation.publishStory(photo, chosenHeadline, this.crowd.characters);
    this.lastPublishedArticle = article;
    this.newsToastTimer = 7.0; // Display toast for 7 seconds
    
    // Check campaign progression
    const totalPublished = this.newsPropagation.getPublishedArticles().length;
    this.chapterCampaign.onArticlePublished(totalPublished);

    // Check if final campaign reached ending condition (6 articles published)
    if (this.chapterCampaign.isFinalChapterComplete(totalPublished)) {
      const ending = EndingResolver.resolve(
        this.metricsManager.state,
        this.newsPropagation.getPublishedArticles(),
        this.totalPhotosTaken
      );
      this.currentEndingResult = ending;
      this.openModal('ending');
    } else {
      this.closeModal();
    }

    this.saveCurrentGame();
    this.notify();
    return article;
  }

  public openModal(modal: ActiveModal): void {
    this.activeModal = modal;
    sound.playUIClick();
    this.notify();
  }

  public closeModal(): void {
    this.activeModal = 'none';
    sound.playUIClick();
    this.notify();
  }

  public togglePause(): void {
    this.isPaused = !this.isPaused;
    sound.playUIClick();
    this.notify();
  }

  public setSpeed(speed: number): void {
    this.gameSpeed = speed;
    sound.playUIClick();
    this.notify();
  }
}
