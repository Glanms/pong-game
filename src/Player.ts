export default class Player {
    x: number;
    y: number;
    width: number;
    height: number;
    dy: number;
    speed: number;
    score: number;

    /**
     * 创建玩家球拍
     * @param x 球拍x坐标
     * @param y 球拍y坐标
     * @param width 球拍宽度
     * @param height 球拍高度
     * @param speed 移动速度
     */
    constructor(x: number, y: number, width: number, height: number, speed: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dy = 0;
        this.speed = speed;
        this.score = 0;
    }

    /**
     * 更新球拍位置
     * @param canvasHeight 画布高度，用于边界检测
     */
    update(canvasHeight: number): void {
        // 更新位置
        this.y += this.dy;

        // 边界检测
        if (this.y < 0) {
            this.y = 0;
        } else if (this.y + this.height > canvasHeight) {
            this.y = canvasHeight - this.height;
        }
    }

    /**
     * 向上移动
     * @param deltaTime 时间增量
     */
    moveUp(deltaTime: number): void {
        this.y -= this.speed * deltaTime;
        if (this.y < 0) {
            this.y = 0;
        }
    }

    /**
     * 向下移动
     * @param deltaTime 时间增量
     * @param canvasHeight 画布高度
     */
    moveDown(deltaTime: number, canvasHeight: number): void {
        this.y += this.speed * deltaTime;
        if (this.y + this.height > canvasHeight) {
            this.y = canvasHeight - this.height;
        }
    }

    /**
     * 设置垂直移动方向
     * @param direction 移动方向：-1=上，0=停止，1=下
     */
    setDirection(direction: -1 | 0 | 1): void {
        this.dy = direction * this.speed;
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
     * 重置球拍位置
     * @param y 新的y坐标
     */
    resetPosition(y: number): void {
        this.y = y;
        this.dy = 0;
    }

    /**
     * 绘制球拍
     * @param ctx Canvas 2D 上下文
     */
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x, this.y, this.width, this.height);
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
}