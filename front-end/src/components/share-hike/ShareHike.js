import { Grid, SvgIcon, Tooltip, Typography } from "@mui/material"
import ShareIcon from '@mui/icons-material/Share';
import { WEBSITEURL } from "../../API/API";
import { useState } from "react";
import { generateKey } from "../../lib/common/HikeKeygen";
import API from "../../API/API";

const Message = (props) => {
    return <Typography variant="h5" sx={{
        textAlign: "center",
        fontSize: "14px"
    }}>
        Secret code:
        <br />
        <Typography variant="h4" sx={{
            fontSize: "24px"
        }}>
            {props.code}
        </Typography>
        <br />
        The code for this hike has been copied to the clipboard!
    </Typography>
}

const ShareHike = (props) => {
    const [tooltipOpen, setTooltipOpen] = useState(false)
    const [code, setCode] = useState("")

    const generateNewCode = () => {
        let tmpCode = ""
        const apiGenerateCode = async () => {
            tmpCode = await API.requestNewCode()
        }

        apiGenerateCode().then(() => {
            setCode(tmpCode.Code)
            setTooltipOpen(true)
            setTimeout(() => {
                setTooltipOpen(false)
            }, 5000);
            navigator.clipboard.writeText(tmpCode.Code)
        })

    }

    return (
        <Grid item sx={{
            padding: "4px", borderStyle: "solid", borderRadius: "28px",
            borderWidth: "1px", display: "flex", justifyContent: "center",
            alignItems: "center", "&:hover": {
                backgroundColor: "#f5f5f5", color: "purple", borderColor: "purple"
            }
        }} onClick={() => {
            generateNewCode()
        }}>
            <Tooltip title={<Message code={code} hikeID={51} />} open={tooltipOpen} arrow placement="bottom">
                <SvgIcon component={ShareIcon} />
            </Tooltip>
        </Grid>
    )
}

export default ShareHike