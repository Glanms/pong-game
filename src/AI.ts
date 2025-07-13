/**
 * AI 类 - 控制电脑球拍
 */
export default class AI {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    score: number;
    private difficulty: 'easy' | 'medium' | 'hard';

    /**
     * 创建AI控制的球拍
     * @param x 球拍x坐标
     * @param y 初始y坐标
     * @param width 球拍宽度
     * @param height 球拍高度
     * @param speed 移动速度
     * @param difficulty 难度级别：'easy' | 'medium' | 'hard'
     */
    constructor(x: number, y: number, width: number, height: number, speed: number, difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.difficulty = difficulty;
        this.score = 0;
    }

    /**
     * 更新AI球拍位置
     * @param ballY 球的y坐标
     * @param ballX 球的x坐标（用于未来可能的扩展）
     * @param ballDy 球的垂直速度
     * @param canvasHeight 画布高度
     */
    update(ballY: number, _ballX: number, ballDy: number, canvasHeight: number): void {
        // 根据难度调整AI的反应速度和精度
        let targetY = ballY - this.height / 2;
        
        // 根据难度添加一些不完美
        switch (this.difficulty) {
            case 'easy':
                // 反应较慢，且不总是能接到球
                this.speed = 3;
                if (Math.random() > 0.7) return; // 30% 的几率不移动
                // 预测球的位置（简单预测）
                targetY = ballY - this.height / 2 + (ballDy * 0.5);
                break;
                
            case 'medium':
                // 中等反应速度，基本的预测
                this.speed = 5;
                // 预测球的位置（考虑球的速度）
                targetY = ballY - this.height / 2 + (ballDy * 0.8);
                break;
                
            case 'hard':
                // 快速反应，更准确的预测
                this.speed = 7;
                // 更精确的预测（考虑球的速度和方向）
                targetY = ballY - this.height / 2 + (ballDy * 1.2);
                // 添加一些随机性，使AI不会太完美
                targetY += (Math.random() * 20) - 10;
                break;
        }
        
        // 确保目标位置在画布内
        targetY = Math.max(0, Math.min(canvasHeight - this.height, targetY));
        
        // 平滑移动到目标位置
        const direction = targetY > this.y ? 1 : -1;
        const distance = Math.abs(targetY - this.y);
        
        if (distance > 5) { // 添加一个小的阈值，防止抖动
            this.y += direction * Math.min(this.speed, distance);
        }
    }

    /**
     * 增加分数
     * @param points 增加的分数（默认为1）
     */
    addScore(points: number = 1): void {
        this.score += points;
    }

    /**
     * 重置分数
     */
    resetScore(): void {
        this.score = 0;
    }

    /**
     * 获取球拍的边界框，用于碰撞检测
     */
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    /**
     * 绘制球拍
     * @param ctx Canvas 2D 上下文
     */
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
