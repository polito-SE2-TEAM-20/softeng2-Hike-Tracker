import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '../../components/buttons/Button'
import Typography from '@mui/material/Typography';
import touristIcon from '../../Assets/tourist-icon.png'
import hikerIcon from '../../Assets/hiker-icon.png'
import proIcon from '../../Assets/pro-icon.png'

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const HikeCard = (props) => {
  console.log(props.hike)
  return (
    <Card sx={{ minWidth: 275, maxWidth: 275 }}>
      <CardContent>
        {
          props.hike.difficulty == 0 ?
            <>
              <div style={{ backgroundColor: "#55B657", display: "flex", justifyContent: "center", margin: "16px", padding: "18px", borderRadius: "32px" }}>
                <img src={touristIcon} alt="tourist" width="75px" height="75px" />
              </div>
              <Typography sx={{ fontFamily: "Bakbak One, display", fontWeight: "600", fontSize: 14, textAlign: "center" }} color="text.secondary" gutterBottom>
                <div style={{ display: "inline-block" }}>Difficulty level: <div style={{ backgroundColor: "#55B657", color: "white", borderRadius: "8px", paddingLeft: "12px", paddingTop: "3px", paddingBottom: "3px", paddingRight: "12px", width: "fit-content", display: "inline-block", marginLeft: "8px" }}><b>Tourist</b></div></div>
              </Typography>
            </>
            : <></>
        }
        {
          props.hike.difficulty == 1 ?
            <>
              <div style={{ backgroundColor: "#1a79aa", display: "flex", justifyContent: "center", margin: "16px", padding: "18px", borderRadius: "32px" }}>
                <img src={hikerIcon} alt="tourist" width="75px" height="75px" />
              </div>
              <Typography sx={{ fontFamily: "Bakbak One, display", fontWeight: "600", fontSize: 14, textAlign: "center" }} color="text.secondary" gutterBottom>
                <div style={{ display: "inline-block" }}>Difficulty level: <div style={{ backgroundColor: "#1a79aa", color: "white", borderRadius: "8px", paddingLeft: "12px", paddingTop: "3px", paddingBottom: "3px", paddingRight: "12px", width: "fit-content", display: "inline-block", marginLeft: "8px" }}><b>Hiker</b></div></div>
              </Typography>
            </>
            : <></>

        }
        {
          props.hike.difficulty == 2 ?
            <>
              <div style={{ backgroundColor: "#FA6952", display: "flex", justifyContent: "center", margin: "16px", padding: "18px", borderRadius: "32px" }}>
                <img src={proIcon} alt="tourist" width="75px" height="75px" />
              </div>
              <Typography sx={{ fontFamily: "Bakbak One, display", fontWeight: "600", fontSize: 14, textAlign: "center" }} color="text.secondary" gutterBottom>
                <div style={{ display: "inline-block" }}>Difficulty level: <div style={{ backgroundColor: "#FA6952", color: "white", borderRadius: "8px", paddingLeft: "12px", paddingTop: "3px", paddingBottom: "3px", paddingRight: "12px", width: "fit-content", display: "inline-block", marginLeft: "8px" }}><b>Pro</b></div></div>
              </Typography>
            </>
            : <></>

        }
        <Typography variant="h5" component="div" style={{ fontFamily: "Bakbak One, display", fontWeight: "100" }}>
          {props.hike.title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {props.hike.province} {bull} {props.hike.region}
        </Typography>
        <Typography variant="body2">
          Length: {props.hike.length}km<br />
          Expected time: {props.hike.expectedTime} hours<br />
          Ascent: {props.hike.ascent}m<br />
        </Typography>
      </CardContent>
      <div style={{marginLeft: "12px", marginBottom: "12px"}}>
        <Button text="Read more about" fontSize="14px" color="#1a1a1a" textColor="white" />
      </div>
    </Card>
  );
}

export default HikeCard