import './list-of-hikes-style.css'

import { useEffect, useState } from 'react';
import HTNavbar from '../../components/HTNavbar/HTNavbar';
import { Grid } from '@mui/material';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LOH_API from './LOH-API';
import HTSideFilter from '../../components/side-filter/HTSideFilter';
import HTTable from '../../components/table/HTTable';

const HTHutPage = (props) => {
  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      type: 'any',
      width: 150,
      editable: true,
    },
    {
      field: 'expTime',
      headerName: 'Expected Time',
      type: 'any',
      width: 150,
      editable: true,
    },
    {
      field: 'ascent',
      headerName: 'Ascent',
      type: 'any',
      width: 110,
      editable: true,
    },
    {
      field: 'difficulty',
      headerName: 'Diffuculty',
      type: 'any',
      width: 110,
      editable: true,
    },
    {
      field: 'length',
      headerName: 'Length',
      type: 'any',
      width: 110,
      editable: true,
    }
  ];

  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ];

  const [region, setRegion] = useState('')
  const [province, setProvince] = useState('')
  const [minAsc, setMinAsc] = useState('')
  const [maxAsc, setMaxAsc] = useState('')
  const [minDiff, setMinDiff] = useState('')
  const [maxDiff, setMaxDiff] = useState('')
  const [minLen, setMinLen] = useState('')
  const [maxLen, setMaxLen] = useState('')
  const [minExT, setMinExT] = useState('')
  const [maxExT, setMaxExT] = useState('')

  const values = [region, setRegion, province, setProvince, minAsc,
    setMinAsc, maxAsc, setMaxAsc, minDiff, setMinDiff,
    maxDiff, setMaxDiff, minLen, setMinLen, maxLen, setMaxLen,
    minExT, setMinExT, maxExT, setMaxExT]

  const [isFilterOpen, setFilterOpen] = useState(false)
  const [isSortingOpen, setSortingOpen] = useState(false)
  const [isHikeShown, setHikeShow] = useState(false)
  const [hike, setHike] = useState({ title: "", expectedTime: -1, ascent: -1, difficulty: "", length: -1 })
  const [listOfHikes, setListOfHikes] = useState([])
  const navigate = useNavigate()
  const [filter, setFilter] = useState({
    "province": null,
    "region": null,
    "maxLength": null,
    "minLength": null,
    "expectedTimeMin": null,
    "expectedTimeMax": null,
    "difficultyMin": null,
    "difficultyMax": null,
    "ascentMin": null,
    "ascentMax": null
  })
  const [title, setTitle] = useState(0)
  const [expectedTime, setExpectedTime] = useState(0)
  const [ascent, setAscent] = useState(0)
  const [difficulty, setDifficulty] = useState(0)
  const [length, setLength] = useState(0)
  const filterStates = { setTitle, setExpectedTime, setAscent, setDifficulty, setLength }

  useEffect(() => {
    var loh = []
    const getHikes = async () => {
      loh = await LOH_API.getListOfHikes()
    }
    getHikes().then(() => {
      console.log(loh)
      setListOfHikes(loh)
    });
  }, [])

  useEffect(() => {
    var loh = []
    const getHikes = async () => {
      loh = await LOH_API.getFilteredListOfHikes({ filter })
    }
    getHikes().then(() => {
      console.log(loh)
      setListOfHikes(loh)
    });
  }, [filter])

  const filterButton = () => {
    setFilterOpen(!isFilterOpen)
  }

  const sortingButton = () => {
    setSortingOpen(!isSortingOpen)
  }

  const selectHike = (hike_obj) => {
    console.log(hike_obj)
    var difficulty = "Professional hiker"
    if (hike_obj.difficulty == 0) difficulty = "Tourist"
    else if (hike_obj.difficulty == 1) difficulty = "Hiker"
    setHike(
      {
        title: hike_obj.title,
        expectedTime: hike_obj.expectedTime,
        ascent: hike_obj.ascent,
        difficulty: difficulty,
        length: hike_obj.length,
        description: hike_obj.description,
        province: hike_obj.province,
        region: hike_obj.region
      }
    )
    setHikeShow(true)
  }

  const gotoLogin = () => {
    navigate("/login", { replace: false })
  }

  return (
    <Grid container>
      <HTNavbar isLoggedIn={props.isLoggedIn} doLogOut={props.doLogOut} gotoLogin={gotoLogin} />
      <Grid container spacing={0} style={{ backgroundColor: "#F2F2F2", height: "100%", minHeight: "100vh" }}>
        <Grid container>
          {
            isFilterOpen ?
              <>
                <Grid item lg={4} style={{ backgroundColor: "#A6A6A6", paddingTop: "60px" }} >
                  <Box sx={{ height: 400, width: '100%', paddingRight: "42px", paddingLeft: "42px" }}>
                    <HTSideFilter values={values} />
                  </Box>
                </Grid>
                <Grid item lg={8} style={{ paddingTop: "60px" }} sx={{ display: "flex", justifyContent: "center" }}>
                  <Box sx={{ height: 500, width: '100%', paddingRight: "42px", paddingLeft: "42px" }}>
                    <HTTable openFilter={filterButton} />
                  </Box>
                </Grid>
              </>
              : <Grid item lg={12} style={{ paddingTop: "60px" }} sx={{ display: "flex", justifyContent: "center" }}>
                <Box sx={{ height: 500, width: '100%', paddingRight: "42px", paddingLeft: "42px" }}>
                  <HTTable openFilter={filterButton} />
                </Box>
              </Grid>
          }
        </Grid>
      </Grid >
    </Grid>
  );
}

export default HTHutPage;