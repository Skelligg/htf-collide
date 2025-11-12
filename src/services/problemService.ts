import axios from 'axios';
import type { ProblemDto } from '../model/Problem.ts';
import type { ProblemSummaryDto } from '../model/ProblemSummary.ts';
import type { VerifyAnswerRequest } from '../model/VerifyAnswerRequest';

const BACKEND_URL = 'http://localhost:8080';

const PROBLEM_API_URL = `${BACKEND_URL}/api/problem`;
const QUEST_API_URL = `${BACKEND_URL}/api/quest`;

/**
 * Fetch all problem summaries (name + description)
 */
export const fetchProblemSummaries = async (): Promise<ProblemSummaryDto[]> => {
    const response = await axios.get(QUEST_API_URL);
    return response.data;
};

/**
 * Fetch a single problem by ID, including all missions
 */
export const fetchProblemById = async (problemId: number): Promise<ProblemDto> => {
    const response = await axios.get(`${PROBLEM_API_URL}/${problemId}`);
    return response.data;
};

/**
 * Verify an answer for a given problem and mission
 */
export const verifyAnswer = async (answerRequest: VerifyAnswerRequest): Promise<boolean> => {
    const response = await axios.post(`${PROBLEM_API_URL}/verify`, answerRequest);
    return response.data;
};
