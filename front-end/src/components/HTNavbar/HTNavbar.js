import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const pages = ['Browse hikes', 'List of hikes'];
const settings = ['Login', 'Logout'];

function HTNavbar(props) {
    React.useEffect(() => {console.log(props.isLoggedIn)})
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

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
            backgroundColor: "#202020", marginBottom: "auto", paddingLeft: "35px",
            paddingRight: "35px", borderRadius: "0px 0px 120px 0px"
        }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h2"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 12,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: "Bakbak One, display",
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Hike Tracker
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
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center" style={{ textTransform: "none", fontFamily: "Bakbak One, display" }}>{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Typography
                        style={{ fontFamily: "Bakbak One, display" }}
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
                        sx={{
                            mr: 4,
                            display: { xs: 'flex', md: 'none' },
                            fontFamily: "Bakbak One, display",
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Hike Tracker
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button style={{ textTransform: "none", fontFamily: "Bakbak One, display", fontSize: "24px" }}
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Profile">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <AccountCircleIcon style={{ color: "white", fontSize: "42px" }} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
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
            </Container>
        </AppBar>
    );
}
export default HTNavbar;