import * as React from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

function ReviewHutForm(props) {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Hut to insert
      </Typography>
      <List disablePadding>
          <ListItem key={props.name} sx={{ py: 1, px: 0 }}>
            <ListItemText primary='Name'  />
            <Typography variant="body2">{props.name}</Typography>
          </ListItem>
          <ListItem key={props.elevation} sx={{ py: 1, px: 0 }}>
            <ListItemText primary='Elevation' />
            <Typography variant="body2">{props.elevation}</Typography>
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
          <ListItem key={props.elevation} sx={{ py: 1, px: 0 }}>
            <ListItemText primary='Elevation' />
            <Typography variant="body2">{props.elevation}</Typography>
          </ListItem>

          <ListItem key={props.owner} sx={{ py: 1, px: 0 }}>
            <ListItemText primary='Owner' />
            <Typography variant="body2">{props.owner}</Typography>
          </ListItem>

          <ListItem key={props.emailAddress} sx={{ py: 1, px: 0 }}>
            <ListItemText primary='EmailAddress' />
            <Typography variant="body2">{props.emailAddress}</Typography>
          </ListItem>


          <ListItem key={props.phoneNumber} sx={{ py: 1, px: 0 }}>
            <ListItemText primary='Phone Number' />
            <Typography variant="body2">{props.phoneNumber}</Typography>
          </ListItem>
          <ListItem key={props.website} sx={{ py: 1, px: 0 }}>
            <ListItemText primary='Website' />
            <Typography variant="body2">{props.website}</Typography>
          </ListItem>

          <ListItem key={props.beds} sx={{ py: 1, px: 0 }}>
            <ListItemText primary='Beds' />
            <Typography variant="body2">{props.beds}</Typography>
          </ListItem>
          <ListItem key={props.price} sx={{ py: 1, px: 0 }}>
            <ListItemText primary='Price $' />
            <Typography variant="body2">{props.price}</Typography>
          </ListItem>

{/*
          <ListItem key={props.description} sx={{ py: 1, px: 0 }}>
            <ListItemText primary='Description' />
            <Typography variant="body2" sx={{ml: 12}}>{props.description}</Typography>
  </ListItem>*/}
      </List>
      
    </React.Fragment>
  );
}


export {ReviewHutForm}