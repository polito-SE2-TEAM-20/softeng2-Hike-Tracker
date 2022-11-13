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
              <th><UpAndDown /></th>
              <th><UpAndDown /></th>
              <th><UpAndDown /></th>
              <th><UpAndDown /></th>
              <th><UpAndDown /></th>
            </tr>
          </tbody>
        </Table>
      </div>
    </Row>
  )
}

export default Filter