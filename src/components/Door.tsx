import { Card, CardActionArea, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

interface DoorProps {
    title: string;
    color?: string;
    locked?: boolean;
}

const DoorCard = styled(Card)<{ doorColor?: string }>(({ doorColor }) => ({
    width: 200,
    height: 300,
    backgroundColor: doorColor || "#004d99",
    borderRadius: 16,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
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
    `
    }
}));


const LockedOverlay = styled("div")({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 16,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "1.2rem",
});

export default function Door({ title, color, locked }: DoorProps) {
    return (
        <DoorCard doorColor={color}>
            <CardActionArea style={{ width: "100%", height: "100%" }}>
                <Typography
                    variant="h5"
                    align="center"
                    sx={{ color: "#fff", zIndex: 2 }}
                >
                    {title}
                </Typography>
                {locked && <LockedOverlay>Locked</LockedOverlay>}
            </CardActionArea>
        </DoorCard>
    );
}
