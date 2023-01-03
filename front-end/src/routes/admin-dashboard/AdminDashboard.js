import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import API from "../../API/API";
import { AdminDashboardPC, AdminDashboardTABLET, AdminDashboardMOBILE } from "./AdminDashboardMODES";

const AdminDashboard = (props) => {
    
    const [loaded, setLoaded] = useState(false)
    const [listOfRequests, setListOfRequests] = useState([])
    const [filter, setFilter] = useState({ 'hut': true, 'local': true })
    const [tmpLOR, setTmpLOR] = useState([])

    useEffect(() => {
        var listOfLocalGuides = []
        var listOfHutWorkers = []
        setLoaded(false)

        const getHWLists = async () => {
            listOfHutWorkers = await API.getNotApprovedHutWorkers()
        }

        const getLGList = async () => {
            listOfLocalGuides = await API.getNotApprovedLocalGuides()
        }

        getLGList().then(() => {
            getHWLists().then(() => {
                setTmpLOR([].concat(listOfHutWorkers).concat(listOfLocalGuides))
                setTimeout(() => {
                    setLoaded(true)
                }, 500);
            })
        })
    }, [])

    useEffect(() => {
        setListOfRequests(tmpLOR)
    }, [tmpLOR])

    const acceptUser = (id) => {
        const accUser = async () => {
            await API.approveUserByID(id);
        }
        accUser().then(() => {
            setTmpLOR(tmpLOR.filter(x => x.id !== id))
        })
    }

    return (
        <>
            <AdminDashboardPC {...props} loaded={loaded}
                listOfRequests={listOfRequests}
                filter={filter}
                setFilter={setFilter}
                acceptUser={acceptUser} />
            <AdminDashboardTABLET {...props} loaded={loaded}
                listOfRequests={listOfRequests}
                filter={filter}
                setFilter={setFilter}
                acceptUser={acceptUser} />
            <AdminDashboardMOBILE {...props} loaded={loaded}
                listOfRequests={listOfRequests}
                filter={filter}
                setFilter={setFilter}
                acceptUser={acceptUser} />
        </>
    );
}

export default AdminDashboard;