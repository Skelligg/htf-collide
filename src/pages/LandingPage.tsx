import {useRef, useState} from "react";
import { Box, Typography, IconButton } from "@mui/material";
import Door from "../components/Door";
import { styled, keyframes } from "@mui/material/styles";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import background from "../assets/background.gif";
import music from "../assets/music.mp3";
// @ts-ignore
import "@fontsource/audiowide";

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
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 4,
    "&::before": {
        content: '""',
        position: "absolute",
        left: "50%",
        top: "-20%",
        width: "120%",
        height: "80px", // <-- problem: unit missing
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
        height: "140%", // good here
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
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                color: "#fff",
                width: "100vw",
                height: "100vh",
                maxWidth: "100vw",
                overflowX: "hidden",
                position: "relative",
                animation: `${fadeIn} 2.5s ease-out forwards`, // fade-in animation
            }}
        >

            {/* Blue filter overlay */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0, // top:0; left:0; right:0; bottom:0
                    backgroundColor: "rgba(0, 60, 150, 0.3)", // semi-transparent blue
                    pointerEvents: "none", // so it doesn’t block clicks
                    zIndex: 1,
                }}
            />
            {/* Light rays */}
            <LightRays />

            {/* Vignette */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.6) 100%)",
                    pointerEvents: "none",
                    zIndex: 5,
                }}
            />

            {/* Audio */}
            <audio ref={audioRef} loop preload="auto" src={music} />

            <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}>
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

            <Typography
                variant="h3"
                mb={2} // smaller bottom margin
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
                mt={-1} // slight negative margin to pull it closer
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
                <Door title="Challenge 1" color="#0077b6" locked={false} />
                <Door title="Challenge 2" color="#0096c7" locked={true} />
                <Door title="Challenge 3" color="#00b4d8" locked={true} />
            </Box>
        </Box>
    );
}
