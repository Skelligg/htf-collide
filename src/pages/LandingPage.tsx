import { Box, Typography } from "@mui/material";
import Door from "../components/Door";

export default function LandingPage() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(to bottom, #001f3f, #003366, #004d99)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 4,
                color: "#fff",
                width: "100vw", // full viewport width
                overflowX: "hidden", // prevent horizontal scroll
            }}
        >
            <Typography variant="h3" mb={6} align="center">
                Welcome to Aqua Topia
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-evenly", // doors spread evenly
                    width: "100%", // take full width
                    maxWidth: "1200px", // optional limit for very wide screens
                    gap: 4,
                }}
            >
                <Door title="Challenge 1" color="#0077b6" locked={false} />
                <Door title="Challenge 2" color="#0096c7" locked={true} />
                <Door title="Challenge 3" color="#00b4d8" locked={true} />
            </Box>
        </Box>
    );
}
