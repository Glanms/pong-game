import PongGame from './PongGame';

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
    // 创建游戏实例
    const game = new PongGame();
    
    // 开始游戏
    game.startGame();
    
    // 添加全局键盘事件监听
    document.addEventListener('keydown', (e) => {
        // 空格键开始/暂停游戏
        if (e.code === 'Space') {
            if (game.getGameState() === 'playing') {
                game.pauseGame();
            } else {
                game.resumeGame();
            }
        }
        // ESC键暂停/继续游戏
        else if (e.code === 'Escape') {
            if (game.getGameState() === 'playing') {
                game.pauseGame();
            } else {
                game.resumeGame();
            }
        }
    });
});

// 添加移动端触摸事件支持
document.addEventListener('touchstart', (e) => {
    // 防止触摸时页面滚动
    e.preventDefault();
}, { passive: false });
