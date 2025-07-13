import Ball from "./Ball";
import Player from "./Player";
import AI from "./AI";
// Import the Score class with type information
import Score from "./Score";

/**
 * 游戏状态类型
 */
type GameState = 'menu' | 'playing' | 'paused' | 'game_over';

/**
 * PongGame 类 - 游戏主类
 */
export default class PongGame {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private ball!: Ball;  // Using definite assignment assertion
    private player!: Player;
    private ai!: AI;
    private score!: Score;
    private gameState: GameState = 'menu';
    
    /**
     * 获取当前游戏状态
     */
    public getGameState(): GameState {
        return this.gameState;
    }
    

    private lastTime: number = 0;
    private animationFrameId: number | null = null;
    private keys: Set<string> = new Set();

    // 游戏常量
    private readonly PADDLE_WIDTH = 12;
    private readonly PADDLE_HEIGHT = 100;
    private readonly BALL_SIZE = 16;
    private readonly PADDLE_OFFSET = 20;
    private readonly WINNING_SCORE = 5;

    constructor() {
        this.canvas = document.getElementById("pong") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        
        // 设置响应式画布尺寸
        this.setupResponsiveCanvas();
        
        // 初始化游戏对象
        this.initializeGameObjects();
        
        // 设置事件监听
        this.addEventListeners();
        
        // 开始游戏循环
        this.lastTime = 0;
        this.startGame();
    }

    /**
     * 设置响应式画布尺寸
     */
    private setupResponsiveCanvas(): void {
        const resizeCanvas = () => {
            const container = this.canvas.parentElement;
            if (!container) return;
            
            const containerRect = container.getBoundingClientRect();
            const maxWidth = Math.min(800, containerRect.width - 40); // 减去padding
            const maxHeight = Math.min(500, window.innerHeight * 0.6);
            
            // 根据屏幕尺寸调整画布尺寸
            let canvasWidth: number;
            let canvasHeight: number;
            
            if (window.innerWidth <= 480) {
                // 小屏幕设备
                canvasWidth = Math.min(maxWidth, 320);
                canvasHeight = canvasWidth * (2/3); // 3:2 比例
            } else if (window.innerWidth <= 768) {
                // 中等屏幕设备
                canvasWidth = Math.min(maxWidth, 480);
                canvasHeight = canvasWidth * (3/4); // 4:3 比例
            } else {
                // 大屏幕设备
                canvasWidth = Math.min(maxWidth, 800);
                canvasHeight = canvasWidth * (5/8); // 8:5 比例
            }
            
            // 设置画布尺寸
            this.canvas.width = canvasWidth;
            this.canvas.height = canvasHeight;
            
            // 重新初始化游戏对象以适应新尺寸
            this.initializeGameObjects();
        };
        
        // 初始设置
        resizeCanvas();
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            resizeCanvas();
            // 如果游戏正在运行，重新渲染
            if (this.gameState === 'playing') {
                this.render();
            }
        });
    }

    /**
     * 初始化游戏对象
     */
    private initializeGameObjects(): void {
        const { width, height } = this.canvas;

        // 根据画布尺寸调整游戏元素大小
        const scaleFactor = Math.min(width / 800, height / 500);
        const paddleWidth = Math.max(8, Math.floor(this.PADDLE_WIDTH * scaleFactor));
        const paddleHeight = Math.max(60, Math.floor(this.PADDLE_HEIGHT * scaleFactor));
        const ballSize = Math.max(12, Math.floor(this.BALL_SIZE * scaleFactor));
        const paddleOffset = Math.max(15, Math.floor(this.PADDLE_OFFSET * scaleFactor));

        const ballSpeed = 7 * scaleFactor;
        this.ball = new Ball(
            width / 2 - ballSize / 2,
            height / 2 - ballSize / 2,
            ballSize,
            ballSpeed * (Math.random() > 0.5 ? 1 : -1), // dx
            ballSpeed * (Math.random() * 2 - 1),     // dy
            ballSpeed
        );

        this.player = new Player(
            paddleOffset,
            height / 2 - paddleHeight / 2,
            paddleWidth,
            paddleHeight,
            10 * scaleFactor // 玩家球拍速度
        );

        this.ai = new AI(
            width - paddleOffset - paddleWidth,
            height / 2 - paddleHeight / 2,
            paddleWidth,
            paddleHeight,
            5 * scaleFactor, // AI基础速度
            'medium' // 难度
        );

        // 根据画布尺寸调整分数显示
        const fontSize = Math.max(24, Math.floor(48 * scaleFactor));
        this.score = new Score(
            width / 4, // 玩家分数x坐标
            Math.max(30, Math.floor(60 * scaleFactor)),        // 分数y坐标
            fontSize,        // 字体大小
            '#fff',    // 字体颜色
            'Arial'    // 字体
        );
    }

    /**
     * 添加事件监听器
     */
    private addEventListeners(): void {
        // 键盘控制
        window.addEventListener('keydown', (e) => {
            this.keys.add(e.key.toLowerCase());
            
            // 空格键开始/暂停游戏
            if (e.key === ' ' && (this.gameState === 'menu' || this.gameState === 'paused')) {
                this.startGame();
            } else if (e.key === 'Escape') {
                if (this.gameState === 'playing') {
                    this.pauseGame();
                } else if (this.gameState === 'paused') {
                    this.resumeGame();
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys.delete(e.key.toLowerCase());
        });

        // 鼠标控制
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.gameState === 'playing') {
                const rect = this.canvas.getBoundingClientRect();
                const mouseY = e.clientY - rect.top - this.player.height / 2;
                // 限制球拍在画布内移动
                this.player.y = Math.max(0, Math.min(this.canvas.height - this.player.height, mouseY));
            }
        });

        // 触摸控制（移动设备）
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (this.gameState === 'playing') {
                const rect = this.canvas.getBoundingClientRect();
                const touchY = e.touches[0].clientY - rect.top - this.player.height / 2;
                this.player.y = Math.max(0, Math.min(this.canvas.height - this.player.height, touchY));
            }
        }, { passive: false });
    }

    /**
     * 开始新游戏
     */
    public startGame(): void {
        console.log('Starting game...');
        
        if (this.gameState === 'menu' || this.gameState === 'paused') {
            this.gameState = 'playing';
            this.lastTime = performance.now();
            
            try {
                // 重置分数
                if (this.score) {
                    this.score.reset();
                } else {
                    console.warn('Score not initialized, resetting game objects...');
                    this.initializeGameObjects();
                }
                
                // 确保所有游戏对象都已初始化
                if (!this.ball || !this.player || !this.ai) {
                    console.warn('Some game objects not initialized, reinitializing...');
                    this.initializeGameObjects();
                }
                
                // 重置球和球拍位置
                this.resetRound();
                
                console.log('Starting game loop...');
                // 开始游戏循环
                this.loop();
            } catch (error) {
                console.error('Error starting game:', error);
                this.gameState = 'menu';
            }
        }
    }

    /**
     * 暂停游戏
     */
    pauseGame(): void {
        this.gameState = 'paused';
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * 继续游戏
     */
    resumeGame(): void {
        if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.lastTime = performance.now();
            this.loop();
        }
    }

    /**
     * 游戏主循环
     */
    private loop(timestamp: number = 0): void {
        // 计算时间增量（秒）
        const deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        // 更新游戏状态
        this.update(deltaTime);
        
        // 渲染游戏
        this.render();

        // 继续循环
        if (this.gameState === 'playing') {
            this.animationFrameId = requestAnimationFrame((ts) => this.loop(ts));
        }
    }

    /**
     * 更新游戏状态
     * @param deltaTime 时间增量（秒）
     */
    private update(_deltaTime: number): void {
        if (this.gameState !== 'playing') return;

        const { height } = this.canvas;

        // 更新玩家位置（键盘控制）
        if (this.keys.has('w') || this.keys.has('arrowup')) {
            this.player.y = Math.max(0, this.player.y - this.player.speed);
        }
        if (this.keys.has('s') || this.keys.has('arrowdown')) {
            this.player.y = Math.min(height - this.player.height, this.player.y + this.player.speed);
        }

        // 更新AI位置
        this.ai.update(
            this.ball.y,
            this.ball.x,
            this.ball.dy,
            height
        );

        // 更新球的位置
        this.ball.update(height);

        // 检测碰撞和得分
        this.checkCollisions();
        this.checkScore();
    }

    /**
     * 重置回合
     */
    private resetRound(): void {
        const { width, height } = this.canvas;
        this.ball.reset(width, height);
    }

    /**
     * 渲染游戏
     */
    private render(): void {
        const { width, height } = this.canvas;
        
        // 清空画布
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, width, height);

        // 绘制中间线
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.setLineDash([5, 15]);
        this.ctx.beginPath();
        this.ctx.moveTo(width / 2, 0);
        this.ctx.lineTo(width / 2, height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // 绘制游戏对象
        this.ball.draw(this.ctx);
        this.player.draw(this.ctx);
        this.ai.draw(this.ctx);
        this.score.draw(this.ctx);

        // 显示游戏状态信息
        this.ctx.fillStyle = '#fff';
        const scaleFactor = Math.min(width / 800, height / 500);
        const mainFontSize = Math.max(16, Math.floor(24 * scaleFactor));
        const subFontSize = Math.max(12, Math.floor(16 * scaleFactor));
        this.ctx.font = `${mainFontSize}px Arial`;
        this.ctx.textAlign = 'center';
        
        if (this.gameState === 'menu') {
            this.ctx.fillText('按空格键开始游戏', width / 2, height / 2);
            this.ctx.font = `${subFontSize}px Arial`;
            this.ctx.fillText('使用 W/S 或 方向键 或 鼠标 移动球拍', width / 2, height / 2 + 40 * scaleFactor);
        } else if (this.gameState === 'paused') {
            this.ctx.fillText('游戏已暂停', width / 2, height / 2);
            this.ctx.font = `${subFontSize}px Arial`;
            this.ctx.fillText('按空格键继续', width / 2, height / 2 + 40 * scaleFactor);
        } else if (this.gameState === 'game_over') {
            const winner = this.score.playerScore > this.score.aiScore ? '玩家' : '电脑';
            this.ctx.fillText(`${winner} 获胜！`, width / 2, height / 2);
            this.ctx.font = `${subFontSize}px Arial`;
            this.ctx.fillText('按空格键重新开始', width / 2, height / 2 + 40 * scaleFactor);
        }
    }


    private checkCollisions(): void {
        // 检测球与玩家球拍的碰撞
        if (this.ball.checkPaddleCollision(this.player)) {
            // 球被玩家球拍击中后的逻辑
        }

        // 检测球与AI球拍的碰撞
        if (this.ball.checkPaddleCollision(this.ai)) {
            // 球被AI球拍击中后的逻辑
        }
    }

    private checkScore(): void {
        const { width } = this.canvas;
        // 检测得分
        if (this.ball.x < 0) {
            // AI得分
            this.score.addAIScore();
            this.resetRound();
        } else if (this.ball.x > width) {
            // 玩家得分
            this.score.addPlayerScore();
            this.resetRound();
        }

        // 检查胜利条件
        if (this.score.playerScore >= this.WINNING_SCORE || this.score.aiScore >= this.WINNING_SCORE) {
            this.gameState = 'game_over';
        }
    }
}