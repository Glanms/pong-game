/**
 * Score 类 - 管理游戏分数
 */
export default class Score {
    playerScore: number;
    aiScore: number;
    private x: number;
    private y: number;
    private fontSize: number;
    private fontFamily: string;
    private color: string;

    /**
     * 创建分数显示器
     * @param x 分数显示的x坐标
     * @param y 分数显示的y坐标
     * @param fontSize 字体大小
     * @param color 字体颜色
     * @param fontFamily 字体
     */
    constructor(
        x: number, 
        y: number, 
        fontSize: number = 48, 
        color: string = '#fff',
        fontFamily: string = 'Arial'
    ) {
        this.playerScore = 0;
        this.aiScore = 0;
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
        this.color = color;
        this.fontFamily = fontFamily;
    }

    /**
     * 增加玩家分数
     * @param points 增加的分数（默认为1）
     */
    addPlayerScore(points: number = 1): void {
        this.playerScore += points;
    }

    /**
     * 增加AI分数
     * @param points 增加的分数（默认为1）
     */
    addAIScore(points: number = 1): void {
        this.aiScore += points;
    }

    /**
     * 重置分数
     */
    reset(): void {
        this.playerScore = 0;
        this.aiScore = 0;
    }

    /**
     * 绘制分数
     * @param ctx Canvas 2D 上下文
     */
    draw(ctx: CanvasRenderingContext2D): void {
        // 设置字体样式
        ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        ctx.fillStyle = this.color;
        ctx.textAlign = 'center';
        
        // 绘制玩家分数（左）
        ctx.fillText(
            this.playerScore.toString(), 
            this.x, 
            this.y, 
            this.x * 2
        );
        
        // 绘制AI分数（右）
        ctx.fillText(
            this.aiScore.toString(), 
            this.x * 3, 
            this.y, 
            this.x * 2
        );
    }

    /**
     * 获取当前分数
     */
    getScores() {
        return {
            player: this.playerScore,
            ai: this.aiScore
        };
    }
}
