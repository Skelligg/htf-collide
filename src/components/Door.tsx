import { Card, CardActionArea, Typography, Box, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import LockIcon from "@mui/icons-material/Lock";

interface DoorProps {
    title: string;
    description?: string;
    locked?: boolean;
    doorImage: string;
    mossImage?: string;
    onClick?: () => void; // 🔹 new
}

const DoorCard = styled(Card)({
    width: 200,
    height: 300,
    borderRadius: 16,
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    boxShadow: `
    inset 0 0 50px rgba(0,0,30,0.8),
    0 0 30px rgba(0,150,255,0.6)
  `,
    transition: "transform 0.3s, box-shadow 0.3s",
    "&:hover": {
        transform: "scale(1.05)",
        boxShadow: `
      inset 0 0 70px rgba(0,0,50,0.9),
      0 0 60px rgba(0,200,255,0.8)
    `,
    },
});

const DoorBackground = styled(Box)<{ image: string }>(({ image }) => ({
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: 1,
}));

const MossOverlay = styled(Box)<{ image?: string }>(({ image }) => ({
    position: "absolute",
    inset: 0,
    backgroundImage: image ? `url(${image})` : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: 0.2,
    zIndex: 2,
    pointerEvents: "none",
}));

const DarkOverlay = styled(Box)({
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    zIndex: 3,
    pointerEvents: "none",
    borderRadius: 16,
});

const LockedOverlay = styled(Box)({
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 16,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 4,
    gap: 8,
});

export default function Door({
                                 title,
                                 locked,
                                 doorImage,
                                 mossImage,
                                 onClick,
                             }: DoorProps) {
    const theme = useTheme();

    return (
        <DoorCard>
            <DoorBackground image={doorImage} />
            {locked && mossImage && <MossOverlay image={mossImage} />}
            {!locked && <DarkOverlay />}

            <CardActionArea
                onClick={!locked ? onClick : undefined}
                style={{
                    width: "100%",
                    height: "100%",
                    zIndex: 5,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {!locked ? (
                    <Typography
                        variant="h6"
                        align="center"
                        sx={{
                            fontFamily: "'Audiowide', cursive",
                            color: "#fff",
                            textShadow: "0 2px 6px rgba(0,0,0,0.7)",
                            mb: 1,
                            zIndex: 6,
                        }}
                    >
                        {title}
                    </Typography>
                ) : (
                    <LockedOverlay>
                        <Typography
                            variant="h6"
                            align="center"
                            sx={{
                                fontFamily: "'Audiowide', cursive",
                                color: "#fff",
                                textShadow: "0 2px 6px rgba(0,0,0,0.6)",
                                mb: 0.5,
                            }}
                        >
                            {title}
                        </Typography>
                        <LockIcon
                            sx={{
                                fontSize: 48,
                                color: theme.palette.primary.main || "#00b4d8",
                                textShadow: "0 0 10px rgba(0,180,255,0.6)",
                            }}
                        />
                    </LockedOverlay>
                )}
            </CardActionArea>
        </DoorCard>
    );
}
