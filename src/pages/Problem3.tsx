import { useRef, useState } from 'react';
import { Box, Typography, IconButton, Button, TextField } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { motion } from 'framer-motion';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import background from '../assets/background3.gif';
import { useProblem, useVerifyAnswer } from '../hooks/useProblems';
import Brute from './Brute.tsx';

// Floating bubbles animation
const floatUp = keyframes`
    0% { transform: translateY(0); opacity: 0.7; }
    50% { opacity: 0.9; }
    100% { transform: translateY(-100vh); opacity: 0; }
`;

const Bubble = styled('div')<{ size?: number; left?: number }>(({ size = 10, left = 50 }) => ({
    position: 'absolute',
    bottom: '-50px',
    left: `${left}%`,
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderRadius: '50%',
    filter: 'blur(0.3px)',
    animation: `${floatUp} ${6 + Math.random() * 4}s linear infinite`,
    opacity: 0.7 + Math.random() * 0.3,
    pointerEvents: 'none',
}));

const sectionVariants = {
    hidden: { opacity: 0, y: 80, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function Problem3() {
    const { data: problem, isLoading, isError, error, refetch } = useProblem(3);
    const missionRefs = useRef<Array<HTMLElement | null>>([]);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const verifyMutation = useVerifyAnswer();
    const [verificationResults, setVerificationResults] = useState<Record<string, boolean | null>>({});

    const handleInputChange = (missionId: string, value: string) => {
        setAnswers((prev) => ({ ...prev, [missionId]: value }));
    };

    const handleVerify = (missionId: string) => {
        if (!problem) return;
        const answer = answers[missionId] || '';
        verifyMutation.mutate(
            { problemId: 3, missionId: Number(missionId), answer },
            {
                onSuccess: (isCorrect) => {
                    setVerificationResults((prev) => ({ ...prev, [missionId]: isCorrect }));
                },
                onError: () => {
                    setVerificationResults((prev) => ({ ...prev, [missionId]: null }));
                },
            }
        );
    };

    if (isLoading)
        return (
            <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography>Loading problem...</Typography>
            </Box>
        );

    if (isError)
        return (
            <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="error">Error: {(error as any)?.message || 'Unknown'}</Typography>
                <Button onClick={() => refetch()} sx={{ ml: 2 }}>Retry</Button>
            </Box>
        );

    const missions = problem?.mission || [];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: { xs: 6, md: 10 },
                paddingBottom: 8,
                color: '#fff',
                width: '100vw',
                position: 'relative',
                overflowX: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,10,30,0.8))',
                    zIndex: 1,
                },
            }}
        >
            {/* Header */}
            <Box sx={{ width: '100%', maxWidth: 1100, px: 3, zIndex: 6 }}>
                <Typography variant="h3" sx={{
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    background: 'linear-gradient(90deg, #82f0ff, #3aa0ff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                }}>
                    {problem?.name || 'Problem 3'}
                </Typography>
                <Typography sx={{ mb: 3, color: 'rgba(255,255,255,0.85)', maxWidth: 800 }}>
                    {problem?.description || 'A series of challenges including a Python brute force terminal and additional questions.'}
                </Typography>
            </Box>

            {/* Floating bubbles */}
            {Array.from({ length: 25 }).map((_, i) => (
                <Bubble key={i} size={4 + Math.random() * 16} left={Math.random() * 100} style={{ zIndex: 2 + Math.random() * 3 }} />
            ))}

            {/* Missions */}
            <Box sx={{ width: '100%', maxWidth: 1100, mt: 6, mb: 12, position: 'relative', zIndex: 6 }}>
                {missions.map((m, i) => (
                    <motion.section
                        key={m.id}
                        ref={(el) => { missionRefs.current[i] = el; }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-18% 0px -18% 0px' }}
                        variants={sectionVariants}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 16,
                            background: 'rgba(0,0,0,0.6)',
                            borderRadius: 14,
                            padding: 28,
                            marginBottom: 28,
                            boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
                            borderLeft: `6px solid rgba(155,231,255,0.08)`,
                        }}
                    >
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#dff9ff' }}>{m.name}</Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.85)', mb: 2 }}>{m.objective}</Typography>

                        {/* If mission id is 2, show brute force terminal */}
                        {i === 1 ? (
                            <Brute />
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    placeholder="Type your answer..."
                                    value={answers[m.id] || ''}
                                    onChange={e => handleInputChange(m.id, e.target.value)}
                                    sx={{ background: 'rgba(255,255,255,0.04)', input: { color: '#fff' } }}
                                />
                                <Button variant="contained" sx={{ width: 140 }} onClick={() => handleVerify(m.id)}>
                                    Submit
                                </Button>
                                {verificationResults[m.id] === true && <Typography color="lightgreen">✅ Correct</Typography>}
                                {verificationResults[m.id] === false && <Typography color="salmon">❌ Wrong</Typography>}
                                {verificationResults[m.id] === null && <Typography color="salmon">Error verifying answer</Typography>}
                            </Box>
                        )}
                    </motion.section>
                ))}
            </Box>

            {/* Scroll to top */}
            <Box sx={{ position: 'fixed', right: 18, bottom: 18, zIndex: 20 }}>
                <IconButton onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} sx={{ background: 'rgba(255,255,255,0.06)', color: '#bfe9ff' }}>
                    <ArrowUpwardIcon />
                </IconButton>
            </Box>
        </Box>
    );
}
