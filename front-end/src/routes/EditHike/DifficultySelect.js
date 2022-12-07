import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { HikeDifficultyLevel } from '../../lib/common/Hike';


function DifficultySelect(props) {
    return <>
        <FormControl 
            fullWidth 
            required
            disabled = {props.disabled}>
            <InputLabel id="demo-simple-select-label">
                Difficulty
            </InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-seimple-select"
                value={props.difficultyStr}
                fullWidth
                name="difficultyStr"
                variant="standard"
                label="difficultyStr"
                onChange={ev => props.setDifficultyStr(ev.target.value)}>
                    
                <MenuItem value={HikeDifficultyLevel.Tourist}>
                    Tourist
                </MenuItem>
                <MenuItem value={HikeDifficultyLevel.Hiker}>
                    Hiker
                </MenuItem>
                <MenuItem value={HikeDifficultyLevel.Pro}>
                    Professional Hiker
                </MenuItem>
            </Select>
        </FormControl>
    </>
}

export { DifficultySelect }