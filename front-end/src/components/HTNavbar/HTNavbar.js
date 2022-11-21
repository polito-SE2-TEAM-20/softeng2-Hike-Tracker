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
import pages from '../../extra/pages.json'
import { useNavigate } from 'react-router';
import './navbar-style.css'
import { Divider } from '@mui/material';

function HTNavbar(props) {
    const settings = ['Login', 'Logout'];
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

    console.log(props.user)

    return (
        <AppBar position="fixed" style={{
            backgroundColor: "#202020", marginBottom: "auto", paddingLeft: "35px",
            paddingRight: "35px", borderRadius: "0px 0px 0px 0px"
        }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        className="unselectable"
                        variant="h3"
                        noWrap
                        onClick={() => { navigate("/") }}
                        sx={{
                            mr: 12,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: "Bakbak One, display",
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        HackTheHike
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => {
                                if (props.isLoggedIn) {
                                    return (
                                        <MenuItem key={page.title} onClick={() => { handleCloseNavMenu(); navigate(page.url) }}>
                                            <Typography textAlign="center" style={{ textTransform: "none", fontFamily: "Bakbak One, display" }}>{page.title}</Typography>
                                        </MenuItem>
                                    )
                                }
                                if (!props.isLoggedIn && !page.reqLogin) {
                                    return (
                                        <MenuItem key={page.title} onClick={() => { handleCloseNavMenu(); navigate(page.url) }}>
                                            <Typography textAlign="center" style={{ textTransform: "none", fontFamily: "Bakbak One, display" }}>{page.title}</Typography>
                                        </MenuItem>
                                    )
                                }
                            })}
                        </Menu>
                    </Box>
                    <Typography
                        className="unselectable"
                        style={{ fontFamily: "Bakbak One, display" }}
                        variant="h5"
                        noWrap
                        onClick={() => { navigate("/") }}
                        sx={{
                            mr: 4,
                            display: { xs: 'flex', md: 'none' },
                            fontFamily: "Bakbak One, display",
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        HackTheHike
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => {
                            if (props.isLoggedIn) {
                                return (
                                    <Button style={{ textTransform: "none", fontFamily: "Bakbak One, display", fontSize: "18px", marginRight: "24px" }}
                                        key={page.title}
                                        onClick={() => { handleCloseNavMenu(); navigate(page.URL) }}
                                        sx={{ my: 2, color: 'white', display: 'block' }}
                                    >
                                        {page.title}
                                        <Divider orientation='vertical' flexItem />
                                    </Button>
                                )
                            }
                            if (!props.isLoggedIn && !page.reqLogin) {
                                return (
                                    <Button style={{ textTransform: "none", fontFamily: "Bakbak One, display", fontSize: "18px", marginRight: "24px" }}
                                        key={page.title}
                                        onClick={() => { handleCloseNavMenu(); navigate(page.URL) }}
                                        sx={{ my: 2, color: 'white', display: 'block' }}
                                    >
                                        {page.title}
                                        <Divider orientation='vertical' flexItem />
                                    </Button>
                                )
                            }
                        }
                        )}
                    </Box>

                    <Box sx={{ flexGrow: 0, display: { xs: "none", sm: "none", md: "flex", lg: "flex", xl: "flex" } }}>
                        {
                            !props.isLoggedIn ?
                                <>
                                    <Tooltip>
                                        <IconButton onClick={() => { navigate("/login") }} sx={{ p: 0 }}>
                                            <Button variant="outlined" sx={{ borderRadius: "24px", color: "white", textTransform: "none", borderColor: "white" }}><b>Sign in</b></Button>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip style={{ marginLeft: "20px" }}>
                                        <IconButton onClick={() => { navigate("/signup") }} sx={{ p: 0 }}>
                                            <Button variant="outlined" sx={{
                                                borderRadius: "24px", color: "white", textTransform: "none", borderColor: "white"
                                            }}><b>Sign up</b></Button>
                                        </IconButton>
                                    </Tooltip>
                                </>
                                :
                                <>
                                    <Tooltip>
                                        <div style={{ marginRight: "15px" }}>
                                            <Typography color="white" className='unselectable' fontFamily={"Bakbak One, display"} fontSize="24px">
                                                {props.user?.firstName} {props.user?.lastName}
                                            </Typography>
                                            <Typography color="white" className='unselectable' fontFamily={"Bakbak One, display"} fontSize="14px">
                                                {props.user?.role == 0 ? "Hiker" : ""}
                                                {props.user?.role == 1 ? "Friend" : ""}
                                                {props.user?.role == 2 ? "Local guide" : ""}
                                                {props.user?.role == 3 ? "Platform manager" : ""}
                                                {props.user?.role == 4 ? "Hut worker" : ""}
                                                {props.user?.role == 5 ? "Emergency operator" : ""}
                                            </Typography>
                                        </div>
                                    </Tooltip>
                                    <Tooltip style={{ marginLeft: "20px" }}>
                                        <IconButton onClick={() => { props.doLogOut() }} sx={{ p: 0 }}>
                                            <Button variant="outlined" sx={{
                                                borderRadius: "24px", color: "white", textTransform: "none", borderColor: "white"
                                            }}><b>Sign out</b></Button>
                                        </IconButton>
                                    </Tooltip>
                                </>
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
                                        <div className='unselectable' style={{marginLeft: "12px", marginRight: "12px"}} key={settings[1]}>
                                            <Typography color="black" fontFamily={"Bakbak One, display"} fontSize="20px" style={{display: "flex", justifyContent: "center"}}>
                                                {props.user?.firstName} {props.user?.lastName}
                                            </Typography>
                                            <Typography color="black" fontFamily={"Bakbak One, display"} fontSize="16px">
                                                {props.user?.role == 0 ? " Hiker" : ""}
                                                {props.user?.role == 1 ? " Friend" : ""}
                                                {props.user?.role == 2 ? " Local guide" : ""}
                                                {props.user?.role == 3 ? " Platform manager" : ""}
                                                {props.user?.role == 4 ? " Hut worker" : ""}
                                                {props.user?.role == 5 ? " Emergency operator" : ""}
                                            </Typography>
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

                        <Menu
                            sx={{ mt: '45px', display: { xs: "none", sm: "none", md: "flex", lg: "flex", xl: "flex" } }}
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
                                    <MenuItem key={settings[1]} onClick={handleCloseUserMenu}>
                                        <Typography className='unselectable' color="black" fontFamily={"Bakbak One, display"} fontSize="24px">
                                            {props.user?.firstName} {props.user?.lastName}
                                        </Typography>
                                        <Typography color="black" fontFamily={"Bakbak One, display"} fontSize="14px">
                                            {props.user?.role == 0 ? "Hiker" : ""}
                                            {props.user?.role == 1 ? "Friend" : ""}
                                            {props.user?.role == 2 ? "Local guide" : ""}
                                            {props.user?.role == 3 ? "Platform manager" : ""}
                                            {props.user?.role == 4 ? "Hut worker" : ""}
                                            {props.user?.role == 5 ? "Emergency operator" : ""}
                                        </Typography>
                                        <Typography onClick={props.doLogOut} textAlign="center">
                                            {settings[1]}
                                        </Typography>
                                    </MenuItem>
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