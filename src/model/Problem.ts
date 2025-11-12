export interface MissionDto {
    id: string;
    name: string;
    objective: string;
    parameters: string;
    difficulty: number;
    remainingAttempts: string;
    solved: boolean;
    effect: string;
}

export interface ProblemDto {
    name: string;
    description: string;
    solved: boolean;
    score: number;
    badgeUrl: string;
    mission: MissionDto[];
}