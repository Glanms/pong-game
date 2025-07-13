export default class Ball {
    x: number;
    y: number;
    readonly size: number;
    dx: number;
    dy: number;
    speed: number;

    constructor(x: number, y: number, size: number, dx: number, dy: number, speed: number) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.dx = dx;
        this.dy = dy;
        this.speed = speed;
    }

    /**
     * 更新球的位置
     * @param canvasHeight 画布高度，用于边界检测
     */
    update(canvasHeight: number): void {
        // 更新位置
        this.x += this.dx;
        this.y += this.dy;

        // 上下边界碰撞检测
        if (this.y <= 0 || this.y + this.size >= canvasHeight) {
            this.dy = -this.dy;
        }
    }

    /**
     * 重置球的位置到画布中央
     * @param canvasWidth 画布宽度
     * @param canvasHeight 画布高度
     */
    reset(canvasWidth: number, canvasHeight: number): void {
        this.x = canvasWidth / 2 - this.size / 2;
        this.y = canvasHeight / 2 - this.size / 2;
        this.dx = this.speed * (Math.random() > 0.5 ? 1 : -1);
        this.dy = this.speed * (Math.random() * 2 - 1);
    }

    /**
     * 检测与球拍的碰撞
     * @param paddle 球拍对象
     * @returns 是否发生碰撞
     */
    checkPaddleCollision(paddle: { x: number; y: number; width: number; height: number }): boolean {
        if (
            this.x < paddle.x + paddle.width &&
            this.x + this.size > paddle.x &&
            this.y < paddle.y + paddle.height &&
            this.y + this.size > paddle.y
        ) {
            // 计算碰撞点相对于球拍中心的位置（-1 到 1）
            const hitPos = (this.y + this.size / 2 - (paddle.y + paddle.height / 2)) / (paddle.height / 2);
            
            // 根据碰撞点改变球的角度
            const angle = hitPos * (Math.PI / 3); // 最大60度角
            const direction = this.dx > 0 ? -1 : 1;
            
            this.dx = direction * this.speed * Math.cos(angle);
            this.dy = this.speed * Math.sin(angle);
            
            // 确保球速不变
            const speed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
            this.dx = (this.dx / speed) * this.speed;
            this.dy = (this.dy / speed) * this.speed;
            
            return true;
        }
        return false;
    }

    /**
     * 绘制球
     * @param ctx Canvas 2D 上下文
     */
    draw(ctx: CanvasRenderingContext2D): void {
        // 保存当前绘图状态
        ctx.save();
        
        // 绘制基础圆形（蓝色）
        const gradient = ctx.createRadialGradient(
            this.x + this.size / 2,
            this.y + this.size / 2,
            0,
            this.x + this.size / 2,
            this.y + this.size / 2,
            this.size / 2
        );
        
        // 创建从深蓝到浅蓝的径向渐变
        gradient.addColorStop(0, '#3399ff');     // 中心颜色（较深）
        gradient.addColorStop(0.7, '#66ccff');   // 中间颜色
        gradient.addColorStop(1, '#99ddff');     // 边缘颜色（较浅）
        
        // 绘制主球体
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(
            this.x + this.size / 2,
            this.y + this.size / 2,
            this.size / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // 添加主高光（大而柔和）
        const highlightGradient1 = ctx.createRadialGradient(
            this.x + this.size / 2.5,  // 高光x位置
            this.y + this.size / 3,    // 高光y位置
            0,                         // 内圆半径
            this.x + this.size / 2.5,
            this.y + this.size / 3,
            this.size / 1.5            // 外圆半径
        );
        
        highlightGradient1.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        highlightGradient1.addColorStop(0.7, 'rgba(255, 255, 255, 0.2)');
        highlightGradient1.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = highlightGradient1;
        ctx.beginPath();
        ctx.arc(
            this.x + this.size / 2,
            this.y + this.size / 2,
            this.size / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // 添加次高光（小而亮）
        const highlightGradient2 = ctx.createRadialGradient(
            this.x + this.size / 2.8,  // 高光x位置
            this.y + this.size / 3.5,  // 高光y位置
            0,                         // 内圆半径
            this.x + this.size / 2.8,
            this.y + this.size / 3.5,
            this.size / 4              // 外圆半径
        );
        
        highlightGradient2.addColorStop(0, 'rgba(255, 255, 255, 1)');
        highlightGradient2.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = highlightGradient2;
        ctx.beginPath();
        ctx.arc(
            this.x + this.size / 2,
            this.y + this.size / 2,
            this.size / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // 添加边缘反光
        const edgeGradient = ctx.createRadialGradient(
            this.x + this.size / 2,
            this.y + this.size / 2,
            this.size / 2.2,           // 内圆半径
            this.x + this.size / 2,
            this.y + this.size / 2,
            this.size / 2              // 外圆半径
        );
        
        edgeGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        edgeGradient.addColorStop(0.8, 'rgba(200, 230, 255, 0.1)');
        edgeGradient.addColorStop(1, 'rgba(200, 230, 255, 0.3)');
        
        ctx.fillStyle = edgeGradient;
        ctx.beginPath();
        ctx.arc(
            this.x + this.size / 2,
            this.y + this.size / 2,
            this.size / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // 恢复绘图状态
        ctx.restore();
    }
}