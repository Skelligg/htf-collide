import { useRef, useState, useEffect } from 'react';
import { Box, Typography, IconButton, Button, TextField } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { motion } from 'framer-motion';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import background from '../assets/submarineBg.jpg';
import submarine from '../assets/submarine.gif';
import { useProblem, useVerifyAnswer } from '../hooks/useProblems';

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

// Motion variants for sections
const sectionVariants = {
    hidden: { opacity: 0, y: 80, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function Problem1() {
    const { data: problem, isLoading, isError, error, refetch } = useProblem(1);

    const missionRefs = useRef<Array<HTMLElement | null>>([]);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [openInput, setOpenInput] = useState<Record<string, boolean>>({});
    const verifyMutation = useVerifyAnswer();

    const [subTop, setSubTop] = useState<number>(() => Math.round(window?.innerHeight * 0.25 || 200));
    const [verificationResults, setVerificationResults] = useState<Record<string, boolean | null>>({});


    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY || 0;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight || 1;
            const progress = Math.max(0, Math.min(1, scrollY / docHeight));
            const minVh = window.innerHeight * 0.18;
            const maxVh = window.innerHeight * 0.6;
            const top = Math.round(minVh + (maxVh - minVh) * progress);
            setSubTop(top);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);

    const scrollTo = (index: number) => {
        const el = missionRefs.current[index];
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const handleInputChange = (missionId: string, value: string) => {
        setAnswers((prev) => ({ ...prev, [missionId]: value }));
    };

// Updated handleVerify function
    const handleVerify = (missionId: string) => {
        if (!problem) return;
        const answer = answers[missionId] || '';
        verifyMutation.mutate(
            { problemId: 1, missionId: Number(missionId), answer },
            {
                onSuccess: (isCorrect) => {
                    // Update verification state for this mission
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
                <Button onClick={() => refetch()} sx={{ ml: 2 }}>
                    Retry
                </Button>
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
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 1100,
                    paddingX: 3,
                    zIndex: 6,
                    position: 'relative',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'flex-start', md: 'center' },
                    justifyContent: 'space-between',
                    gap: 2,
                }}
            >
                <Box>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: '900',
                            letterSpacing: '-0.02em',
                            background: 'linear-gradient(90deg, #82f0ff, #3aa0ff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        {problem?.name || 'Problem 1'}
                    </Typography>
                    <Typography sx={{ mt: 1, fontSize: 18, color: 'rgba(255,255,255,0.85)', maxWidth: 800 }}>
                        {problem?.description || ''}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {missions.map((m, i) => (
                        <Button
                            key={m.id}
                            onClick={() => scrollTo(i)}
                            sx={{
                                background: 'rgba(0,0,0,0.3)',
                                color: '#9be7ff',
                                textTransform: 'none',
                                fontWeight: '600',
                                '&:hover': { background: 'rgba(0,0,0,0.45)' },
                            }}
                        >
                            {m.name}
                        </Button>
                    ))}
                </Box>
            </Box>

            {/* More bubbles */}
            {Array.from({ length: 25 }).map((_, i) => (
                <Bubble key={i} size={4 + Math.random() * 16} left={Math.random() * 100} style={{ zIndex: 2 + Math.random() * 3 }} />
            ))}

            {/* Submarine that follows scroll */}
            <Box
                component="img"
                src={submarine}
                alt="submarine"
                sx={{
                    position: 'fixed',
                    right: { xs: 8, md: 32 },
                    top: subTop,
                    width: { xs: 90, md: 160 },
                    transition: 'top 250ms linear, transform 250ms ease-out',
                    transform: 'translateX(0)',
                    zIndex: 30,
                    pointerEvents: 'none',
                    filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.6))',
                }}
            />

            {/* Mission sections */}
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
                            gap: 20,
                            alignItems: 'flex-start',
                            background: 'rgba(0,0,0,0.6)',
                            borderRadius: 14,
                            padding: '28px',
                            marginBottom: 28,
                            boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
                            borderLeft: `6px solid rgba(155,231,255,0.08)`,
                        }}
                    >
                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: '800', color: '#dff9ff' }}>
                                        {m.name}
                                    </Typography>
                                    <Typography sx={{ mt: 0.5, color: 'rgba(255,255,255,0.9)' }}>{m.objective}</Typography>
                                </Box>
                            </Box>

                            <Typography sx={{ mt: 2, fontStyle: 'italic', color: 'rgba(255,255,255,0.75)' }}>
                                Format: {m.parameters}
                            </Typography>

                            <Box sx={{ mt: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center' }}>
                                <Button
                                    variant="contained"
                                    sx={{ background: '#00b4d8', minWidth: 140 }}
                                    onClick={() => setOpenInput((prev) => ({ ...prev, [String(m.id)]: !prev[String(m.id)] }))}
                                >
                                    Try Challenge
                                </Button>

                                {openInput[String(m.id)] && (
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <TextField
                                            size="small"
                                            placeholder="Type answer..."
                                            value={answers[String(m.id)] || ''}
                                            onChange={(e) => handleInputChange(String(m.id), e.target.value)}
                                            sx={{ background: 'rgba(255,255,255,0.04)', input: { color: '#fff' } }}
                                        />
                                        <Button
                                            onClick={() => handleVerify(String(m.id))}
                                            variant="contained"
                                            sx={{ background: '#0077b6' }}
                                        >
                                            Submit
                                        </Button>

                                        {/* Verification feedback */}
                                        {verificationResults[String(m.id)] !== undefined && verificationResults[String(m.id)] !== null && (
                                            <Typography color={verificationResults[String(m.id)] ? 'lightgreen' : 'salmon'} sx={{ fontSize: 18 }}>
                                                {verificationResults[String(m.id)] ? '✅ Correct' : '❌ Wrong'}
                                            </Typography>
                                        )}
                                        {verificationResults[String(m.id)] === null && (
                                            <Typography color="salmon">Error verifying answer</Typography>
                                        )}
                                    </Box>
                                )}

                            </Box>
                        </Box>

                        {/* Narrow meta column */}
                        <Box sx={{ width: 160, display: { xs: 'none', md: 'block' } }}>
                            <Box sx={{ background: 'rgba(0,0,0,0.25)', padding: 2, borderRadius: 8, textAlign: 'center' }}>
                                <Typography sx={{ fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>Difficulty</Typography>
                                <Typography sx={{ fontSize: 22, fontWeight: 800, mt: 1 }}>{m.difficulty ?? '-'}</Typography>
                                <Typography sx={{ mt: 1, color: 'rgba(255,255,255,0.7)' }}>Attempts: {m.remainingAttempts ?? '-'}</Typography>
                            </Box>
                        </Box>
                    </motion.section>
                ))}
            </Box>

            {/* Scroll to top */}
            <Box sx={{ position: 'fixed', right: 18, bottom: 18, zIndex: 20 }}>
                <IconButton
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    sx={{ background: 'rgba(255,255,255,0.06)', color: '#bfe9ff' }}
                >
                    <ArrowUpwardIcon />
                </IconButton>
            </Box>
        </Box>
    );
}
