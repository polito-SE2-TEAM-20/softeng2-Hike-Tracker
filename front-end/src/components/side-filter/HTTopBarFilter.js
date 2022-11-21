import { Grid, Paper } from "@mui/material";
import Button from '../../components/buttons/Button'
import './httopfilter-style.css'
import HTDropdown from './HTDropdown'
import { useEffect, useState } from "react";
import HTSlider from './HTSlider'

const HTTopBarFilter = (props) => {
  var regions = []
  const [region, setRegion] = useState("")

  var provinces = []
  const [province, setProvince] = useState("")


  const [maxLen, setMaxLen] = useState(0)
  const [length, setLength] = useState([0, 0])


  const [maxExpTime, setMaxExpTime] = useState(0)
  const [expTime, setExpTime] = useState([0, 0])


  const [maxDiff, setMaxDiff] = useState(0)
  const [diff, setDiff] = useState([0, 0])


  const [maxAsc, setMaxAsc] = useState(0)
  const [asc, setAsc] = useState([0, 0])

  const getMax = (a, b) => Math.max(a, b);
  const resetAllFields = () => {
    setRegion("")
    setProvince("")
    setLength([0, maxLen])
    setExpTime([0, maxExpTime])
    setDiff([0, maxDiff])
    setAsc([0, maxAsc])
  }

  if (props.loading) {
    regions = Array.from(props?.listOfHikes.filter(x => { if (province != "") return x.province === province; return true }).map(x => x.region).filter(x => x !== undefined && x !== '').reduce((set, x) => set.add(x), new Set()))
  }
  if (props.loading) {
    provinces = Array.from(props?.listOfHikes.filter(x => { if (region != "") return x.region === region; return true }).map(x => x.province).filter(x => x !== undefined && x !== '').reduce((set, x) => set.add(x), new Set()))
  }
  useEffect(() => {
    setMaxLen(props?.listOfHikes.map(x => x.length).reduce(getMax, 0))
    setMaxExpTime(props?.listOfHikes.map(x => x.expectedTime).reduce(getMax, 0))
    setMaxDiff(props?.listOfHikes.map(x => x.difficulty).reduce(getMax, 0))
    setMaxAsc(props?.listOfHikes.map(x => x.ascent).reduce(getMax, 0))
  }, [props.listOfHikes])

  return (
    <Grid container columns={12} spacing={0} style={{
      backgroundColor: "#f2f2f2", width: "100vw", display: "flex", justifyContent: "center",
      paddingTop: "15px", paddingBottom: "15px", position: "fixed", zIndex: "1"
    }}>
      <Grid lg={2} item style={{ display: "flex", justifyContent: "center" }}>
        <HTDropdown dataset={regions} hint="Region" setFun={setRegion} val={region} />
      </Grid>
      <Grid lg={2} item style={{ display: "flex", justifyContent: "center" }}>
        <HTDropdown dataset={provinces} hint="Province" setFun={setProvince} val={province} />
      </Grid>
      <Grid lg={2} item style={{ display: "flex", justifyContent: "center" }}>
        <HTSlider value={length} setFun={setLength} max={maxLen} text="Length" />
      </Grid>
      <Grid lg={2} item style={{ display: "flex", justifyContent: "center" }}>
        <HTSlider value={expTime} setFun={setExpTime} max={maxExpTime} text="Expected time" />
      </Grid>
      <Grid lg={2} item style={{ display: "flex", justifyContent: "center" }}>
        <HTSlider value={diff} setFun={setDiff} max={maxDiff} text="Difficulty" />
      </Grid>
      <Grid lg={2} item style={{ display: "flex", justifyContent: "center" }}>
        <HTSlider value={asc} setFun={setAsc} max={maxAsc} text="Ascent" />
      </Grid>
      <Grid lg={3} item style={{ display: "flex", justifyContent: "center" }}>
        <Button text="Apply filters" size="16px" textColor="white" />
      </Grid>
      <Grid lg={3} item style={{ display: "flex", justifyContent: "center" }}>
        <Button text="Reset filters" size="16px" textColor="white" navigate={() => { resetAllFields() }} />
      </Grid>
    </Grid>
  );
}

export default HTTopBarFilter