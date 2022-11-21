import '../../routes/browse-hikes/browse-hikes-style.css'

import { Container, Row } from 'react-bootstrap'
import MainTitle from '../main-title/MainTitle'
import SearchBar from '../searchbar/SearchBar'
import Button from '../buttons/Button'

const Navbar = () => {
    return (<Navbar className="is-sticky" expand="lg">
        <Row>
            <MainTitle color="white" size="48px" />
            <div style={{ display: 'flex', justifyContent: "center" }}>
                <SearchBar />
            </div>
            <div className='filtercontainer'>

            </div>
            <Button text="Login" textColor="black" color="white" size="24px" />
        </Row>
    </Navbar>)
}

export default Navbar