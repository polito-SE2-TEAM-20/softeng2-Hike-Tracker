import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import navbarPages from '../../extra/pages-with-categories.json'
import { useNavigate } from 'react-router';
import './navbar-style.css'
import { Grid, Divider } from '@mui/material';
import { displayTypeFlex, displayTypeBlock } from '../../extra/DisplayType';
import DropdownMenu from './DropdownMenu';

function HTNavbar(props) {
    const settings = ['Sign in', 'Sign out'];
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const navigate = useNavigate()

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="sticky" style={{
            backgroundColor: "#202020f0", paddingLeft: 10,
            paddingRight: 10, borderRadius: 0, zIndex: "15"
        }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Grid container sx={{ width: "min-content" }}>
                        <Grid xs={12} sm={12} md={12} lg={12} xl={12} item>
                            <Typography
                                key="titlePC1"
                                className="unselectable"
                                variant="h5"
                                noWrap
                                onClick={() => { navigate("/") }}
                                sx={{
                                    mr: 5,
                                    display: displayTypeFlex.pc,
                                    fontFamily: "Unbounded",
                                    fontWeight: 700,
                                    color: 'inherit',
                                    textDecoration: 'none', transition: "0.2s",
                                    "&:hover": { borderColor: "#EBC824", color: "#EBC824" }
                                }}
                            >
                                HackTheHike.com
                            </Typography>
                        </Grid>
                        <Grid xs={12} sm={12} md={12} lg={12} xl={12} item>
                            <Typography
                                key="titlePC2"
                                className="unselectable"
                                variant="h5"
                                noWrap
                                sx={{
                                    mr: 5,
                                    display: displayTypeFlex.pc,
                                    fontFamily: "Unbounded",
                                    fontWeight: 700,
                                    color: 'inherit',
                                    fontSize: "12px",
                                    textDecoration: 'none', transition: "0.2s"
                                }}
                            >
                                Best solutions for best adventures.
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container sx={{ width: "min-content" }}>
                        <Grid xs={12} sm={12} md={12} lg={12} xl={12} item>
                            <Typography
                                key="titleTABLET1"
                                className="unselectable"
                                variant="h5"
                                noWrap
                                onClick={() => { navigate("/") }}
                                sx={{
                                    mr: 5,
                                    display: displayTypeFlex.tablet,
                                    fontFamily: "Unbounded",
                                    fontWeight: 700,
                                    color: 'inherit',
                                    textDecoration: 'none', transition: "0.2s",
                                    "&:hover": { borderColor: "#EBC824", color: "#EBC824" }
                                }}
                            >
                                HackTheHike.com
                            </Typography>
                        </Grid>
                        <Grid xs={12} sm={12} md={12} lg={12} xl={12} item>
                            <Typography
                                key="titleTABLET2"
                                className="unselectable"
                                variant="h5"
                                noWrap
                                sx={{
                                    mr: 5,
                                    display: displayTypeFlex.tablet,
                                    fontFamily: "Unbounded",
                                    fontWeight: 700,
                                    color: 'inherit',
                                    fontSize: "12px",
                                    textDecoration: 'none', transition: "0.2s"
                                }}
                            >
                                Best solutions for best adventures.
                            </Typography>
                        </Grid>
                    </Grid>
                    <Box sx={{ flexGrow: 1, display: displayTypeFlex.mobile }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: displayTypeBlock.mobile,
                            }}
                        >
                            {
                                navbarPages.map((category) => {
                                    return (<>
                                        {
                                            category.pages.map(page => {
                                                if (props.isLoggedIn && page.role.includes(props.user?.role)) {
                                                    return (
                                                        <MenuItem key={page.title} onClick={() => { handleCloseNavMenu(); navigate(page.URL) }}>
                                                            <Typography textAlign="center" style={{ textTransform: "none", fontFamily: "Unbounded" }}>{page.title}</Typography>
                                                        </MenuItem>
                                                    )
                                                }
                                                else if (!props.isLoggedIn && !page.reqLogin) {
                                                    return (
                                                        <MenuItem key={page.title} onClick={() => { handleCloseNavMenu(); navigate(page.URL) }}>
                                                            <Typography textAlign="center" style={{ textTransform: "none", fontFamily: "Unbounded" }}>{page.title}</Typography>
                                                        </MenuItem>
                                                    )
                                                }
                                                else return (null)
                                            }
                                            )
                                        }
                                    </>)

                                })
                            }
                        </Menu>
                    </Box>
                    <Grid container sx={{ width: "min-content" }}>
                        <Grid xs={12} sm={12} md={12} lg={12} xl={12} item sx={{ display: "flex", justifyContent: "center" }}>
                            <Typography
                                key="titleMobile"
                                className="unselectable"
                                style={{ fontFamily: "Unbounded", fontSize: "14px" }}
                                variant="h5"
                                noWrap
                                onClick={() => { navigate("/") }}
                                sx={{
                                    mr: 4,
                                    display: displayTypeFlex.mobile,
                                    fontFamily: "Unbounded",
                                    fontWeight: 700,
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }}
                            >
                                HackTheHike.com
                            </Typography>
                        </Grid>
                        <Grid xs={12} sm={12} md={12} lg={12} xl={12} item sx={{ display: "flex", justifyContent: "center" }}>
                            <Typography
                                key="titlePC"
                                className="unselectable"
                                variant="h5"
                                noWrap
                                onClick={() => { navigate("/") }}
                                sx={{
                                    mr: 5,
                                    display: displayTypeFlex.mobile,
                                    fontFamily: "Unbounded",
                                    fontWeight: 700,
                                    color: 'inherit',
                                    fontSize: "8px",
                                    textDecoration: 'none', transition: "0.2s",
                                    "&:hover": { borderColor: "#EBC824", color: "#EBC824" }
                                }}
                            >
                                Best solutions for best adventures.
                            </Typography>
                        </Grid>
                    </Grid>



                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {
                            navbarPages.map((category) => {
                                if (props.isLoggedIn && category.overallPermissions.includes(props.user?.role)) {
                                    return (
                                        <div style={{ marginRight: "24px" }}>
                                            <DropdownMenu category={category} role={props.user?.role} />
                                        </div>
                                    )
                                } else if (!props.isLoggedIn && category.overallPermissions.includes(-1)) {
                                    return (
                                        <div style={{ marginRight: "24px" }}>
                                            <DropdownMenu category={category} role={-1} />
                                        </div>
                                    )
                                } else return <></>
                            })
                        }
                    </Box>

                    <Box sx={{ flexGrow: 0, display: { xs: "none", sm: "none", md: "flex", lg: "flex", xl: "flex" } }}>
                        {
                            !props.isLoggedIn ?
                                <Tooltip>
                                    <IconButton onClick={() => { navigate("/login") }} sx={{ p: 0 }}>
                                        <Button variant="outlined" sx={{
                                            fontFamily: "Unbounded", fontSize: "14px",
                                            borderRadius: "24px", color: "white",
                                            "&:hover": { borderColor: "#EBC824", color: "#EBC824" }, textTransform: "none", borderColor: "white"
                                        }}><b>Sign in</b></Button>
                                    </IconButton>
                                </Tooltip> : <></>
                        }
                        {
                            !props.isLoggedIn ?
                                <Tooltip style={{ marginLeft: "20px" }}>
                                    <IconButton onClick={() => { navigate("/signup") }} sx={{ p: 0 }}>
                                        <Button variant="outlined" sx={{
                                            fontFamily: "Unbounded", fontSize: "14px",
                                            "&:hover": { borderColor: "#EBC824", color: "#EBC824" },
                                            borderRadius: "24px", color: "white", textTransform: "none", borderColor: "white"
                                        }}><b>Sign up</b></Button>
                                    </IconButton>
                                </Tooltip>
                                :
                                <></>
                        }
                        {
                            props.isLoggedIn ? <Tooltip>
                                <div style={{ marginRight: "15px" }}>
                                    <Typography color="white" className='unselectable' fontFamily={"Unbounded"} fontSize="18px">
                                        {props.user?.firstName} {props.user?.lastName}
                                    </Typography>
                                    <Typography color="white" className='unselectable' fontFamily={"Unbounded"} fontSize="12px">
                                        {props.user?.role === 0 ? "Hiker" : ""}
                                        {props.user?.role === 1 ? "Friend" : ""}
                                        {props.user?.role === 2 ? "Local guide" : ""}
                                        {props.user?.role === 3 ? "Platform manager" : ""}
                                        {props.user?.role === 4 ? "Hut worker" : ""}
                                        {props.user?.role === 5 ? "Emergency operator" : ""}
                                    </Typography>
                                </div>
                            </Tooltip> : <></>
                        }
                        {
                            props.isLoggedIn && props?.user?.role === 0 ?
                                <Tooltip style={{ marginLeft: "20px" }}>
                                    <IconButton onClick={() => { navigate('/hikerdashboard') }} sx={{ p: 0 }}>
                                        <Button variant="outlined" sx={{
                                            fontFamily: "Unbounded", fontSize: "14px",
                                            borderRadius: "24px", color: "white",
                                            "&:hover": { borderColor: "#EBC824", color: "#EBC824" },
                                            textTransform: "none", borderColor: "white"
                                        }}><b>Dashboard</b></Button>
                                    </IconButton>
                                </Tooltip>
                                :
                                <></>
                        }
                        {
                            props.isLoggedIn && props?.user?.role === 3 ?
                                <Tooltip style={{ marginLeft: "20px" }}>
                                    <IconButton sx={{ p: 0 }}>
                                        <Button onClick={() => { navigate('/admindashboard') }} variant="outlined" sx={{
                                            fontFamily: "Unbounded", fontSize: "14px",
                                            "&:hover": { borderColor: "#EBC824", color: "#EBC824" },
                                            borderRadius: "24px", color: "white", textTransform: "none", borderColor: "white"
                                        }}><b>Dashboard</b></Button>
                                    </IconButton>
                                </Tooltip>
                                :
                                <></>
                        }
                        {
                            props.isLoggedIn ?
                                <Tooltip style={{ marginLeft: "20px" }}>
                                    <IconButton sx={{ p: 0 }}>
                                        <Button variant="outlined" onClick={() => { props.doLogOut() }} sx={{
                                            fontFamily: "Unbounded", fontSize: "14px",
                                            borderRadius: "24px", color: "white", textTransform: "none", borderColor: "white",
                                            "&:hover": { borderColor: "#EBC824", color: "#EBC824" }
                                        }}><b>Sign out</b></Button>
                                    </IconButton>
                                </Tooltip> : <></>
                        }
                    </Box>

                    <Box sx={{ flexGrow: 0, display: { xs: "flex", sm: "flex", md: "none", lg: "none", xl: "none" } }}>
                        <Tooltip title="Profile">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <AccountCircleIcon style={{ color: "white", fontSize: "42px" }} />
                            </IconButton>
                        </Tooltip>


                        <Menu
                            sx={{ mt: '45px', display: { xs: "flex", sm: "flex", md: "none", lg: "none", xl: "none" } }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {
                                props.isLoggedIn ?
                                    <>
                                        <div className='unselectable' style={{ marginLeft: "12px", marginRight: "12px" }} key={settings[1]}>
                                            <Typography color="black" fontFamily={"Unbounded"} fontSize="20px" style={{ display: "flex", justifyContent: "center" }}>
                                                {props.user?.firstName} {props.user?.lastName}
                                            </Typography>
                                            <Typography color="black" fontFamily={"Unbounded"} fontSize="16px">
                                                {props.user?.role === 0 ? " Hiker" : ""}
                                                {props.user?.role === 1 ? " Friend" : ""}
                                                {props.user?.role === 2 ? " Local guide" : ""}
                                                {props.user?.role === 3 ? " Platform manager" : ""}
                                                {props.user?.role === 4 ? " Hut worker" : ""}
                                                {props.user?.role === 5 ? " Emergency operator" : ""}
                                            </Typography>
                                        </div>

                                        <div hidden={props.user?.role !== 0}>
                                            <Divider />
                                            <MenuItem key={"hikerdashboard"} onClick={() => navigate("/hikerdashboard")}>
                                                <Typography onClick={props.doLogOut} textAlign="center">
                                                    Dashboard
                                                </Typography>
                                            </MenuItem>
                                        </div>

                                        <div hidden={props.user?.role !== 3}>
                                            <Divider />
                                            <MenuItem key={"admindashboard"} onClick={() => navigate("/admindashboard")}>
                                                <Typography onClick={props.doLogOut} textAlign="center">
                                                    Dashboard
                                                </Typography>
                                            </MenuItem>
                                        </div>

                                        <Divider />
                                        <MenuItem key={settings[1]} onClick={handleCloseUserMenu}>
                                            <Typography onClick={props.doLogOut} textAlign="center">
                                                {settings[1]}
                                            </Typography>
                                        </MenuItem>
                                    </>
                                    :
                                    <MenuItem key={settings[0]} onClick={handleCloseUserMenu}>
                                        <Typography onClick={props.gotoLogin} textAlign="center">
                                            {settings[0]}
                                        </Typography>
                                    </MenuItem>
                            }
                        </Menu>
                    </Box>
                </Toolbar>
            </Container >
        </AppBar >
    );
}
export default HTNavbar;