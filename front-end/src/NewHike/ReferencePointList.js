
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Button} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';



function ReferencePointList(props){
    function handleDeleteReferencePoint(n) {
        const indexOfObject = props.listReferencePoint.findIndex(object => object.name === n)
        const prova = props.listReferencePoint.splice(indexOfObject, 1);
        props.setListReferencePoint(props.listReferencePoint.filter(el => el.name !== prova.name));
      }
      {console.log(props.listReferencePoint)}

                    
                        props.listReferencePoint.map((reference) => {
                          return (
                            <>
                            {console.log(reference)}
                                <Grid item xs={12} sm={3.5}>
                                  <TextField id="referencename" name="referencename"
                                    label="Reference Point Name" fullWidth
                                    autoComplete="referencename" variant="standard"
                                    value={reference.name}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={3.5}>
                                  <TextField
                                    required
                                    name="referencePointAdd"
                                    label="Reference Point Address"
                                    fullWidth
                                    autoComplete="referencePointAdd"
                                    variant="standard"
                                    value={reference.address}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                  <TextField name="referencelat"
                                    label="Reference Point Latitude" fullWidth
                                    autoComplete="referencelat" variant="standard"
                                    disabled

                                    id="outlined-disabled"
                                    value={reference.lat}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                  <TextField
                                    name="referencePointLon"
                                    label="Reference Point Longitude"
                                    fullWidth
                                    autoComplete="referencePointLon"
                                    variant="standard"
                                    disabled
                                    id="outlined-disabled"
                                    value={reference.lon}
                                  />
                                </Grid>

                                <Grid item xs={12} sm={1} mt={2}>
                                  <Button edge="end" onClick={() => handleDeleteReferencePoint(reference.name)} >
                                    <DeleteIcon />
                                  </Button>
                                </Grid>

                              
                            </>
                          )
                        })
                      

}


export {ReferencePointList}