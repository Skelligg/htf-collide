import { useState, useRef } from "react";
import {
    Box,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import Door from "../components/Door";
import { styled, keyframes } from "@mui/material/styles";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import background from "../assets/background.gif";
import music from "../assets/music.mp3";
import seaweed from "../assets/seaweed.jpg";
import door1 from "../assets/door1.jpg";
import door2 from "../assets/door2.jpg";
import door3 from "../assets/door3.jpg";
// @ts-ignore
import "@fontsource/audiowide";
import { useProblemSummaries } from "../hooks/useProblems";
import { useNavigate } from "react-router-dom";

// bubble animation
const floatUp = keyframes`
    0% { transform: translateY(0); opacity: 0.7; }
    50% { opacity: 0.9; }
    100% { transform: translateY(-100vh); opacity: 0; }
`;

// Bubble component
const Bubble = styled("div")<{ size?: number; left?: number }>(({ size = 10, left = 50 }) => ({
    position: "absolute",
    bottom: "-50px",
    left: `${left}%`,
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: "rgba(255,255,255,0.45)",
    borderRadius: "50%",
    filter: "blur(0.3px)",
    animation: `${floatUp} ${8 + Math.random() * 2}s linear infinite`,
    opacity: 0.75,
    pointerEvents: "none",
}));

// Light rays overlay
const LightRays = styled("div")({
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    zIndex: 4,
    "&::before": {
        content: '""',
        position: "absolute",
        left: "50%",
        top: "-20%",
        width: "120%",
        height: "80px",
        transform: "translateX(-50%) rotate(-6deg)",
        background:
            "radial-gradient(ellipse at top center, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 30%, transparent 60%)",
        filter: "blur(30px)",
        opacity: 1,
    },
    "&::after": {
        content: '""',
        position: "absolute",
        left: "10%",
        top: "-10%",
        width: "80%",
        height: "140%",
        transform: "translateX(0) rotate(4deg)",
        background:
            "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.00) 30%)",
        mixBlendMode: "screen",
        filter: "blur(24px)",
        opacity: 1,
    },
});

// Fade-in keyframes
const fadeIn = keyframes`
    0% { opacity: 0; }
    100% { opacity: 1; }
`;

export default function LandingPage() {
    const [playing, setPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { data: problems, isLoading, error } = useProblemSummaries();

    const [selectedProblem, setSelectedProblem] = useState<{
        id: number;
        name: string;
        description: string;
    } | null>(null);

    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const navigate = useNavigate();

    const handleDoorClick = (problem: any, index: number) => {
        setSelectedProblem({
            id: problem.problemId,
            name: problem.problemName,
            description: problem.problemDescription,
        });
        setSelectedIndex(index);
    };

    const handleEnter = () => {
        if (selectedIndex !== null) {
            navigate(`/problems/${selectedIndex + 1}`);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error || !problems) return <div>Error loading problems</div>;

    const toggleAudio = async () => {
        if (!audioRef.current) return;
        try {
            if (audioRef.current.paused) {
                await audioRef.current.play();
                setPlaying(true);
            } else {
                audioRef.current.pause();
                setPlaying(false);
            }
        } catch (err) {
            console.error("Audio playback failed:", err);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundImage: `url(${background})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                color: "#fff",
                width: "100vw",
                maxWidth: "100vw",
                overflowX: "hidden",
                position: "relative",
                animation: `${fadeIn} 2.5s ease-out forwards`,
            }}
        >
            {/* Blue filter overlay */}
            <Box
                sx={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(0, 60, 150, 0.3)",
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            />

            {/* Light rays */}
            <LightRays />

            {/* Vignette */}
            <Box
                sx={{
                    position: "fixed",
                    inset: 0,
                    background:
                        "radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.6) 100%)",
                    pointerEvents: "none",
                    zIndex: 5,
                }}
            />

            {/* Audio */}
            <audio ref={audioRef} loop preload="auto" src={music} />

            {/* Music toggle */}
            <Box sx={{ position: "fixed", top: 16, right: 16, zIndex: 10 }}>
                <IconButton
                    onClick={toggleAudio}
                    size="large"
                    sx={{
                        background: "rgba(255,255,255,0.06)",
                        color: "#bfe9ff",
                        "&:hover": { background: "rgba(255,255,255,0.08)" },
                    }}
                >
                    {playing ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
            </Box>

            {/* Title */}
            <Typography
                variant="h3"
                mb={2}
                align="center"
                sx={{
                    zIndex: 6,
                    fontFamily: "'Audiowide', cursive",
                    background: "linear-gradient(45deg, #00f0ff, #00ff90)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "bold",
                    letterSpacing: 2,
                    textShadow: "0 2px 6px rgba(0,0,0,0.3)",
                }}
            >
                AQUATECH MISSION 104
            </Typography>

            <Typography
                variant="h5"
                mt={-1}
                align="center"
                sx={{
                    fontFamily: "'Audiowide', cursive",
                    background: "linear-gradient(45deg, #00d0ff, #00ffb0)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "normal",
                    letterSpacing: 1.5,
                    textShadow: "0 1px 4px rgba(0,0,0,0.2)",
                    opacity: 0.9,
                }}
            >
                Can you complete the missions?
            </Typography>

            {/* Bubbles */}
            {Array.from({ length: 22 }).map((_, i) => (
                <Bubble
                    key={i}
                    size={6 + Math.random() * 18}
                    left={Math.random() * 100}
                    style={{ zIndex: 3, animationDelay: `${Math.random() * 6}s` }}
                />
            ))}

            {/* Doors */}
            <Box
                mt={5}
                sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    width: "100%",
                    maxWidth: 1200,
                    gap: 4,
                    zIndex: 6,
                }}
            >
                {problems.map((p, idx) => (
                    <Door
                        key={idx}
                        title={p.problemName}
                        description={p.problemDescription}
                        doorImage={[door1, door2, door3][idx % 3]}
                        mossImage={seaweed}
                        locked={idx !== 0}
                        onClick={() => handleDoorClick(p, idx)}
                    />
                ))}
            </Box>

            {/* Dialog */}
            <Dialog
                open={!!selectedProblem}
                onClose={() => setSelectedProblem(null)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: "rgba(10,30,50,0.95)",
                        color: "#fff",
                        backdropFilter: "blur(6px)",
                        border: "1px solid rgba(0,200,255,0.2)",
                        boxShadow: "0 0 25px rgba(0,200,255,0.3)",
                    },
                }}
            >
                {selectedProblem && (
                    <>
                        <DialogTitle
                            sx={{
                                fontFamily: "'Audiowide', cursive",
                                textAlign: "center",
                                color: "#00e0ff",
                            }}
                        >
                            {selectedProblem.name}
                        </DialogTitle>
                        <DialogContent>
                            <Typography sx={{ mt: 1, fontSize: "1rem" }}>
                                {selectedProblem.description}
                            </Typography>
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                            <Button
                                onClick={() => setSelectedProblem(null)}
                                sx={{ color: "#ccc" }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleEnter}
                                variant="contained"
                                sx={{
                                    background: "linear-gradient(45deg, #00d0ff, #00ffb0)",
                                    color: "#000",
                                    fontWeight: "bold",
                                    px: 3,
                                    "&:hover": {
                                        background: "linear-gradient(45deg, #00aaff, #00ffcc)",
                                    },
                                }}
                            >
                                Enter Mission
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
}
