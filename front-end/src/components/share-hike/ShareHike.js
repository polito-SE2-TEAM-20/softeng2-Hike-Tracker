import { Grid, SvgIcon, Tooltip, Typography } from "@mui/material"
import ShareIcon from '@mui/icons-material/Share';
import { WEBSITEURL } from "../../API/API";
import { useState } from "react";
import { generateKey } from "../../lib/common/HikeKeygen";

const Message = (props) => {
    return <Typography variant="h5" sx={{
        textAlign: "center",
        fontSize: "14px"
    }}>
        The link to this hike has been copied to the clipboard!
        <br /><br />
        <a href={WEBSITEURL + props.URL}>{WEBSITEURL + props.URL}</a>
        <br /><br />
        Secret code:
        <br />
        <Typography variant="h4" sx={{
            fontSize: "24px"
        }}>
            {generateKey(props.hikeID).toUpperCase()}
        </Typography>
    </Typography>
}

const ShareHike = (props) => {
    const [tooltipOpen, setTooltipOpen] = useState(false)

    return (
        <Grid item sx={{
            padding: "4px", borderStyle: "solid", borderRadius: "28px",
            borderWidth: "1px", display: "flex", justifyContent: "center",
            alignItems: "center", "&:hover": {
                backgroundColor: "#f5f5f5", color: "purple", borderColor: "purple"
            }
        }} onClick={() => {
            navigator.clipboard.writeText(WEBSITEURL + "/link/to/the/hike/tracker")
            setTooltipOpen(true)
            setTimeout(() => {
                setTooltipOpen(false)
            }, 5000);
        }}>
            <Tooltip title={<Message URL={"/link/to/the/hike/tracker"} hikeID={3} />} open={tooltipOpen} arrow placement="bottom">
                <SvgIcon component={ShareIcon} />
            </Tooltip>
        </Grid>
    )
}

export default ShareHike