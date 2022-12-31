import { Card, CardContent, Typography } from "@mui/material";

function HikeItem(props) {
    return (
        <Card
            style={{
                marginTop: 12, marginBotom: 12, marginRight: 8, marginLeft: 8,
                width: "100vh"
            }}>
            <CardContent>
                <Typography variant="h6">
                    {props.hike.title}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default HikeItem;