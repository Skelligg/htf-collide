import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LandingPage from "./pages/LandingPage";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Problem1 from "./pages/Problem1.tsx";

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
    return (
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/problem1" element={<Problem1 />} />
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </ThemeProvider>
    );
}

export default App;