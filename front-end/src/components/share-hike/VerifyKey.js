import { Button, Grid, Input, SvgIcon, Typography } from "@mui/material"
import LockIcon from '@mui/icons-material/Lock';
import { useState } from "react";
import { verifyKey } from "../../lib/common/HikeKeygen";
import { useNavigate } from "react-router";

const VerifyKey = (props) => {
    const [code1, setCode1] = useState("")
    const [code2, setCode2] = useState("")
    const [code3, setCode3] = useState("")
    const [code4, setCode4] = useState("")
    const codes = [code1, code2, code3, code4]
    const setters = [setCode1, setCode2, setCode3, setCode4]
    const listOfInputs = document.querySelectorAll(".inputbox")
    const [index, setIndex] = useState(0)
    const navigate = useNavigate()
    const [message, setMessage] = useState({ color: "", message: "" })
    const [sending, setSending] = useState(false)
    const [ready, setReady] = useState(false)

    /**
     * Submission phase
     */
    const submit = () => {
        // hikeID = 1 <--> da39
        let code = ""
        codes.forEach(c => code = code + c)
        if (verifyKey(code, 1)) {
            setTimeout(() => {
                setMessage({ color: "green", message: "Access granted" })
            }, 50);
            setTimeout(() => {
                navigate("/")
            }, 2000);
        } else {
            setSending(true)
            setMessage({ color: "red", message: "Access denied" })
            setTimeout(() => {
                setMessage({ color: "", message: "" })
            }, 2000);
            setTimeout(() => {
                setSending(false)
                setters.forEach(setter => setter(""))
                setIndex(0)
            }, 50);
        }

    }
    const isDigitValid = digit => digit !== undefined && digit !== "" && digit.length !== 0
    if (isDigitValid(code1) && isDigitValid(code2) && isDigitValid(code3) && isDigitValid(code4) && !sending) {
        setSending(true)
        setReady(true)
    }

    /**
     * Callback for managing the paste of the code
     */
    const handlePaste = e => {
        const data = e.clipboardData.getData("text")
        const value = data.split("")
        if (value.length === listOfInputs.length && !sending) {
            listOfInputs.forEach((input, index) => {
                const fun = setters[index]
                fun(value[index])
            })
            setReady(true)
        } else if (value.length < listOfInputs.length) {
            setMessage({ color: "red", message: "The code you pasted is too short" })
            setTimeout(() => {
                setMessage({ color: "", message: "" })
            }, 1800);
        } else {
            setMessage({ color: "red", message: "The code you pasted is too long" })
            setTimeout(() => {
                setMessage({ color: "", message: "" })
            }, 1800);
        }
    }

    /**
     * Handler for new text insertion inside an input box
     */
    const handleTextInput = n => e => {
        const fun = setters[n]
        const newDigit = e.target.value[e.target.value.length - 1]
        fun(newDigit)
        if (n < listOfInputs.length - 1 && isDigitValid(newDigit)) {
            setIndex(n + 1)
        } else if (!isDigitValid(newDigit)) {
            setIndex(n - 1)
        }
    }

    /**
     * Assignment of the paste callback for all the input textboxes
     */
    listOfInputs.forEach((input, index) => {
        input.dataset.index = index
        input.addEventListener("paste", handlePaste)
    })

    /**
     * Handling backspace in empty box
     */
    const handleDelete = n => e => {
        if (n !== 0 && e.key === "Backspace" && !isDigitValid(e.target.value)) {
            setIndex(n - 1)
        }
    }

    const inputBoxStyle = {
        height: { xs: "100px", sm: "100px", md: "150px", lg: "150px", xl: "150px" },
        width: { xs: "60px", sm: "60px", md: "90px", lg: "90px", xl: "90px" },
        backgroundColor: "#000046",
        borderColor: "#0000ff66",
        borderRadius: "30px",
        borderWidth: "3px",
        borderStyle: "solid",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px",
        color: "white",
        fontSize: "72px",
        textTransform: "uppercase"
    }

    const submitButtonStyle = {
        backgroundColor: "#5531F6",
        color: "white",
        borderRadius: "120px",
        fontFamily: "Unbounded",
        borderColor: "white",
        "&:hover": {
            backgroundColor: "#2A39D4",
            borderColor: "white"
        },
        "&:disabled": {
            backgroundColor: "#dadada",
            color: "#777777"
        }
    }

    return (
        <Grid container sx={{
            backgroundImage: "linear-gradient(90deg, rgba(103,138,168,1) 0%, rgba(83,147,202,1) 25%, rgba(70,153,225,1) 50%, rgba(31,76,116,1) 75%, rgba(59,79,97,1) 100%)",
            backgroundSize: "400% 400%",
            width: "100vw", height: "100vh", display: "flex",
            justifyContent: "center", alignItems: "center",
            "@keyframes verifyBackground": {
                '0%': {
                    backgroundPosition: "0% 50%"
                },
                '50%': {
                    backgroundPosition: "100% 50%"
                },
                '100%': {
                    backgroundPosition: "0% 50%"
                }
            },
            animationIterationCount: "infinite",
            animationDuration: "9s",
            animationName: "verifyBackground"
        }}>
            <Grid container item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ display: "flex", marginTop: "-150px", justifyContent: "center", alignItems: "center", height: "fit-content", flex: "1 1 auto" }}>

                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
                    <SvgIcon sx={{ color: "white", fontSize: "80px" }} component={LockIcon} />
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
                    <Typography className="unselectable" sx={{ color: "white", fontFamily: "Unbounded", fontSize: "32px" }}>
                        Enter your secret code
                    </Typography>
                </Grid>

                <Grid item sx={{ marginRight: "8px" }}>
                    <Input autoFocus value={code1} inputRef={input => index === 0 && input && input.focus()} onChange={handleTextInput(0)} onKeyDown={handleDelete(0)} className="inputbox" disableUnderline placeholder={"h"} sx={inputBoxStyle} />
                </Grid>
                <Grid item sx={{ marginRight: "8px" }}>
                    <Input value={code2} inputRef={input => index === 1 && input && input.focus()} onChange={handleTextInput(1)} onKeyDown={handleDelete(1)} className="inputbox" disableUnderline placeholder={"1"} sx={inputBoxStyle} />
                </Grid>
                <Grid item sx={{ marginRight: "8px" }}>
                    <Input value={code3} inputRef={input => index === 2 && input && input.focus()} onChange={handleTextInput(2)} onKeyDown={handleDelete(2)} className="inputbox" disableUnderline placeholder={"k"} sx={inputBoxStyle} />
                </Grid>
                <Grid item>
                    <Input value={code4} inputRef={input => index === 3 && input && input.focus()} onChange={handleTextInput(3)} onKeyDown={handleDelete(3)} className="inputbox" disableUnderline placeholder={"3"} sx={inputBoxStyle} />
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
                    <Button onClick={submit} disabled={!ready} sx={submitButtonStyle} variant="outlined">Submit</Button>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
                    <Typography sx={{ color: message.color, fontFamily: "Unbounded", fontSize: "32px" }}>
                        {message.message}
                    </Typography>
                </Grid>

            </Grid>
        </Grid>
    )
}

export default VerifyKey