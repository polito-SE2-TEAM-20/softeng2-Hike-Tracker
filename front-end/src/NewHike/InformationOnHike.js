import * as React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import {DifficultySelect} from './DifficultySelect'


function InformationOnHike(props) {

return(

<>
<Grid item xs={12}>
                    <TextField
                      required id="title" name="title" label="Title"
                      fullWidth variant="standard"
                      value={props.title}
                      onChange={(e) => props.setTitle(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required id="lengthStr" name="lengthStr"
                      label="Length (m)" fullWidth variant="standard" type="number" min={0}
                      value={props.lengthStr}
                      onChange={(e) => { props.setLengthStr(e.target.value) }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required id="expectedTimeStr" name="expectedTimeStr" label="Expected Time (hh:mm)"
                      fullWidth variant="standard" min={0} type="text"
                      value={props.expectedTimeStr}
                      onChange={(e) => { props.setExpectedTimeStr(e.target.value) }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required id="ascentStr" name="ascentStr" label="Ascent (m)"
                      fullWidth variant="standard" type="number" min={0}
                      value={props.ascentStr}
                      onChange={(e) => props.setAscentStr(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <DifficultySelect setDifficultyStr={props.setDifficultyStr} difficultyStr={props.difficultyStr}></DifficultySelect>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required id="country"
                      name="country" label="Country"
                      fullWidth autoComplete="country"
                      variant="standard" type="text"
                      value={props.country}
                      disabled
                      onChange={(e) => props.setCountry(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required id="region"
                      name="region" label="Region"
                      fullWidth autoComplete="region"
                      variant="standard" type="text"
                      value={props.region}
                      disabled
                      onChange={(e) => props.setRegion(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      id="province" name="province"
                      label="Province" fullWidth
                      autoComplete="province" variant="standard" type="text"
                      required
                      value={props.province}
                      disabled
                      onChange={(e) => props.setProvince(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required id="city"
                      name="city" label="City"
                      fullWidth autoComplete="city"
                      variant="standard" type="text"
                      value={props.city}
                      disabled
                      onChange={(e) => props.setCity(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required id="description"
                      name="description" label="Description (max 1000 characters)"
                      fullWidth autoComplete="description"
                      variant="standard" multiline
                      inputProps={
                        { maxLength: 990 }
                      }
                      //mettere un alert se vai oltre
                      value={props.description}
                      onChange={(e) => props.setDescription(e.target.value)}
                    />
                  </Grid> 
</>
)
}
                  

export {InformationOnHike}

