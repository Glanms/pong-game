declare module "../src/Score" {
    class Score {
        playerScore: number;
        aiScore: number;
        
        constructor(x: number, y: number, fontSize?: number, color?: string, fontFamily?: string);
        
        addPlayerScore(points?: number): void;
        addAIScore(points?: number): void;
        reset(): void;
        draw(ctx: CanvasRenderingContext2D): void;
        getScores(): { player: number; ai: number };
    }
    
    export = Score;
}
