import * as React from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

function ReviewParkingForm(props) {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Parking Lot to insert
      </Typography>
      <List disablePadding>
          <ListItem key={props.name} sx={{ py: 1, px: 0 }}>
            <ListItemText primary='Name'  />
            <Typography variant="body2">{props.name}</Typography>
          </ListItem>
          <ListItem key={props.country} sx={{ py: 1, px: 0 }}>
            <ListItemText primary='Country' />
            <Typography variant="body2">{props.country}</Typography>
          </ListItem>

          <ListItem key={props.region} sx={{ py: 1, px: 0 }}>
            <ListItemText primary='Region' />
            <Typography variant="body2">{props.region}</Typography>
          </ListItem>

          <ListItem key={props.province} sx={{ py: 1, px: 0 }}>
            <ListItemText primary='Province' />
            <Typography variant="body2">{props.province}</Typography>
          </ListItem>
          <ListItem key={props.city} sx={{ py: 1, px: 0 }}>
            <ListItemText primary='City' />
            <Typography variant="body2">{props.city}</Typography>
          </ListItem>


          <ListItem key={props.address} sx={{ py: 1, px: 0 }}>
            <ListItemText primary='Address' />
            <Typography variant="body2">{props.address}</Typography>
          </ListItem>

          <ListItem key={props.latitude} sx={{ py: 1, px: 0 }}>
            <ListItemText primary='Latitude' />
            <Typography variant="body2">{props.latitude}</Typography>
          </ListItem>

          <ListItem key={props.longitude} sx={{ py: 1, px: 0 }}>
            <ListItemText primary='Longitude' />
            <Typography variant="body2">{props.longitude}</Typography>
          </ListItem>
          <ListItem key={props.spots} sx={{ py: 1, px: 0 }}>
            <ListItemText primary='Spots' />
            <Typography variant="body2">{props.spots}</Typography>
          </ListItem>
      </List>
      
    </React.Fragment>
  );
}
export {ReviewParkingForm}