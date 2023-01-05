import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { useNavigate } from 'react-router';

const DropdownMenu = (props) => {
    const navigate = useNavigate()
    return (
        <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
                <React.Fragment>
                    <Button variant="outlined" sx={{
                        borderRadius: "120px", borderColor: "white", color: "white",
                        textTransform: "none", fontFamily: "Unbounded",
                        "&:hover": { borderColor: "#EBC824", color: "#EBC824" }
                    }} {...bindTrigger(popupState)}>
                        {props.category.categoryName}
                    </Button>
                    <Menu {...bindMenu(popupState)}>
                        {
                            props.category.pages.map(page => {
                                if (page.reqLogin && page.role.includes(props.role))
                                    return (<MenuItem sx={{ fontFamily: "Unbounded", fontSize: "14px" }} onClick={() => {popupState.close(); navigate(page.URL)}}>{page.title}</MenuItem>)
                                else if (!page.reqLogin) {
                                    return (<MenuItem sx={{ fontFamily: "Unbounded", fontSize: "14px" }} onClick={() => {popupState.close(); navigate(page.URL)}}>{page.title}</MenuItem>)
                                }
                                else return <></>
                            })
                        }
                    </Menu>
                </React.Fragment>
            )}
        </PopupState>)
}

export default DropdownMenu