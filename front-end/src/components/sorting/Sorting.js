import { Table, Row } from "react-bootstrap"
import Button from "../buttons/Button"

const Sorting = (props) => {
  const filter = {
    "province": null,
    "region": null,
    "maxLength": null,
    "minLength": null,
    "expectedTimeMin": null,
    "expectedTimeMax": null,
    "difficultyMin": null,
    "difficultyMax": null,
    "ascentMin": null,
    "ascentMax": null
  }
  return (
    <Row hidden={!props.open} style={{ marginTop: "18px", backgroundColor: "#1a1a1a", borderRadius: "10px" }}>
      <div style={{ textAlign: "center" }}>
        <Table>
          <thead>
            <tr>
              <th className='filter-name'>Province</th>
              <th className='filter-name'>Region</th>
              <th className='filter-name'>Minimum Ascent</th>
              <th className='filter-name'>Maximum Ascent</th>
              <th className='filter-name'>Minimum Expected Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th><input id="provinceID" type="text" style={{ maxWidth: "180px", borderRadius: "30px" }} /></th>
              <th><input id="regionID" type="text" style={{ maxWidth: "180px", borderRadius: "30px" }} /></th>
              <th><input id="ascMinID" type="number" style={{ maxWidth: "180px", borderRadius: "30px" }} /></th>
              <th><input id="ascMaxID" type="number" style={{ maxWidth: "180px", borderRadius: "30px" }} /></th>
              <th><input id="minExpTimeID" type="number" style={{ maxWidth: "180px", borderRadius: "30px" }} /></th>
            </tr>
          </tbody>
          <thead>
            <tr>
              <th className='filter-name'>Maximum Expected Time</th>
              <th className='filter-name'>Minimum Length</th>
              <th className='filter-name'>Maximum Length</th>
              <th className='filter-name'>Minimum Difficulty</th>
              <th className='filter-name'>Maximum Difficulty</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th><input id="maxExpTimeID" type="number" style={{ maxWidth: "180px", borderRadius: "30px" }} /></th>
              <th><input id="minLenID" type="number" style={{ maxWidth: "180px", borderRadius: "30px" }} /></th>
              <th><input id="maxLenID" type="number" style={{ maxWidth: "180px", borderRadius: "30px" }} /></th>
              <th><input id="diffMinID" type="number" style={{ maxWidth: "180px", borderRadius: "30px" }} /></th>
              <th><input id="diffMaxID" type="number" style={{ maxWidth: "180px", borderRadius: "30px" }} /></th>
            </tr>
          </tbody>
        </Table>
        <Row>
          <div style={{ display: "flex", justifyContent: "center", paddingBottom: "24px" }}>
            <div style={{ paddingRight: "10px" }}>
              <Button navigate={() => {
                props.setFilter({
                  "province": document.getElementById("provinceID").value==""?null:document.getElementById("provinceID").value,
                  "region": document.getElementById("regionID").value==""?null:document.getElementById("regionID").value,
                  "minLength": document.getElementById("minLenID").value==""?null:document.getElementById("minLenID").value,
                  "maxLength": document.getElementById("maxLenID").value==""?null:document.getElementById("maxLenID").value,
                  "expectedTimeMin": document.getElementById("minExpTimeID").value==""?null:document.getElementById("minExpTimeID").value,
                  "expectedTimeMax": document.getElementById("maxExpTimeID").value==""?null:document.getElementById("maxExpTimeID").value,
                  "difficultyMin": document.getElementById("diffMinID").value==""?null:document.getElementById("diffMinID").value,
                  "difficultyMax": document.getElementById("diffMaxID").value==""?null:document.getElementById("diffMaxID").value,
                  "ascentMin": document.getElementById("ascMinID").value==""?null:document.getElementById("ascMinID").value,
                  "ascentMax": document.getElementById("ascMaxID").value==""?null:document.getElementById("ascMaxID").value
                })
              }} text="Apply" textColor="black" color="white" fontSize="24px" />
            </div>
            <div style={{ paddingLeft: "10px" }}>
              <Button navigate={() => {
                props.setFilter({
                  "province": null,
                  "region": null,
                  "maxLength": null,
                  "minLength": null,
                  "expectedTimeMin": null,
                  "expectedTimeMax": null,
                  "difficultyMin": null,
                  "difficultyMax": null,
                  "ascentMin": null,
                  "ascentMax": null
                }
                )
                document.getElementById("provinceID").value = "";
                document.getElementById("regionID").value = "";
                document.getElementById("minLenID").value = "";
                document.getElementById("maxLenID").value = "";
                document.getElementById("minExpTimeID").value = "";
                document.getElementById("maxExpTimeID").value = "";
                document.getElementById("diffMinID").value = "";
                document.getElementById("diffMaxID").value = "";
                document.getElementById("ascMinID").value = "";
                document.getElementById("ascMaxID").value = "";
              }} text="Reset" textColor="black" color="white" fontSize="24px" />
            </div>
          </div>
        </Row>
      </div>
    </Row>
  )
}

export default Sorting