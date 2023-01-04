import { AlertPopup } from "../../components/alert-popup/AlertPopup"
import { useEffect, useState } from "react"
import API from "../../API/API"

const TestPage = () => {
    const [open, setOpen] = useState(true)
    const [listOfAlerts, setListOfAlerts] = useState([])
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        let tmpListOfAlerts = []
        const apiGetAlerts = async () => {
            tmpListOfAlerts = await API.getMyAlerts()
        }

        apiGetAlerts().then(() => {
            setListOfAlerts(tmpListOfAlerts)
            setLoaded(true)
            console.log(tmpListOfAlerts)
        })
    }, [])

    if(!loaded) return <></>
    return (
        <AlertPopup open={open} setOpen={setOpen} listOfAlerts={listOfAlerts} />
    )
}

export default TestPage