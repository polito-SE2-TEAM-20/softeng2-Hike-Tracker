import { Row } from "react-bootstrap"
import { Table } from "react-bootstrap"
import UpAndDown from "../up-and-down-button/UpAndDown"

const Filter = (props) => {
  return (
    <Row hidden={!props.open} style={{ marginTop: "18px", backgroundColor: "#1a1a1a", borderRadius: "10px" }}>
      <div style={{ textAlign: "center" }}>
        <Table>
          <thead>
            <tr>
              <th className='filter-name'>Title</th>
              <th className='filter-name'>Expected time</th>
              <th className='filter-name'>Ascent</th>
              <th className='filter-name'>Difficulty</th>
              <th className='filter-name'>Length</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><UpAndDown /></td>
              <td><UpAndDown /></td>
              <td><UpAndDown /></td>
              <td><UpAndDown /></td>
              <td><UpAndDown /></td>
            </tr>
          </tbody>
        </Table>
        <br></br>
        <Table>
          <thead>
            <tr>
              <th className='filter-name'>Province</th>
              <th className='filter-name'>Region</th>
              <th className='filter-name'>Minimum Ascent</th>
              <th className='filter-name'>Maximum Ascent</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th><input type="text" style={{maxWidth: "120px"}} /></th>
              <th><input type="text" style={{maxWidth: "120px"}} /></th>
              <th><input type="text" style={{maxWidth: "120px"}} /></th>
              <th><input type="text" style={{maxWidth: "120px"}} /></th>
            </tr>
          </tbody>
          <thead>
            <tr>
              <th className='filter-name'>Minimum Length</th>
              <th className='filter-name'>Maximum Length</th>
              <th className='filter-name'>Minimum Difficulty</th>
              <th className='filter-name'>Maximum Difficulty</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th><input type="text" style={{maxWidth: "120px"}} /></th>
              <th><input type="text" style={{maxWidth: "120px"}} /></th>
              <th><input type="text" style={{maxWidth: "120px"}} /></th>
              <th><input type="text" style={{maxWidth: "120px"}} /></th>
            </tr>
          </tbody>
        </Table>
      </div>
    </Row>
  )
}

export default Filter