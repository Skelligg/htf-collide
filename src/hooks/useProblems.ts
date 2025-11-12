import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProblemSummaryDto } from '../model/ProblemSummary.ts';
import type { ProblemDto } from '../model/Problem.ts';
import type { VerifyAnswerRequest } from '../model/VerifyAnswerRequest';
import { fetchProblemSummaries, fetchProblemById, verifyAnswer } from '../services/problemService';


/**
 * Hook to fetch all problem summaries
 */
export const useProblemSummaries = () => {
    return useQuery<ProblemSummaryDto[], Error>({
        queryKey: ['problemSummaries'],
        queryFn: fetchProblemSummaries,
    });
};

/**
 * Hook to fetch a single problem by its ID
 */
export const useProblem = (problemId: number) => {
    return useQuery<ProblemDto, Error>({
        queryKey: ['problem', problemId],
        queryFn: () => fetchProblemById(problemId),
        enabled: problemId > 0, // only fetch if valid id
    });
};

/**
 * Hook to verify an answer
 */
export const useVerifyAnswer = () => {
    const queryClient = useQueryClient();

    return useMutation<boolean, Error, VerifyAnswerRequest>({
        mutationFn: (answerRequest: VerifyAnswerRequest) => verifyAnswer(answerRequest),
        onSuccess: () => {
            // Optional: invalidate queries to refresh data if needed
            queryClient.invalidateQueries({ queryKey: ['problemSummaries'] });
        },
    });
};
