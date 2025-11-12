import { useState, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import BruteForceMissionPage from "./pages/bruteForceMissionPage";
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

import LandingPage from "./pages/LandingPage";
import Problem1 from "./pages/Problem1";
import music from "./assets/music.mp3";

const queryClient = new QueryClient();

const theme = createTheme({
    palette: {
        primary: { main: "#00b4d8" },
        secondary: { main: "#0077b6" },
    },
    typography: {
        fontFamily: "'Roboto', sans-serif",
    },
});

function App() {
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
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                {/* Audio that persists across pages */}
                <audio ref={audioRef} loop preload="auto" src={music} />
                <div style={{ position: "fixed", top: 16, right: 16, zIndex: 1000 }}>
                    <IconButton
                        onClick={toggleAudio}
                        size="large"
                        style={{
                            background: "rgba(255,255,255,0.06)",
                            color: "#bfe9ff",
                        }}
                    >
                        {playing ? <PauseIcon /> : <PlayArrowIcon />}
                    </IconButton>
                </div>

                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/bruteforce" element={<BruteForceMissionPage />} />
                        <Route path="/problems/1" element={<Problem1 />} />
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </ThemeProvider>
    );
}

export default App;