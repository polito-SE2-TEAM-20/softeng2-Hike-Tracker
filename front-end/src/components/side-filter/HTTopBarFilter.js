import { Paper } from "@mui/material";
import Button from '../../components/buttons/Button'
import './httopfilter-style.css'

const HTTopBarFilter = (props) => {
  return (
    <div style={{ backgroundColor: "#2a2a2a", width: "100vw", display: "flex", justifyContent: "center",
    paddingTop: "15px", paddingBottom: "15px", position: "fixed", zIndex: "1" }}>
      <div className="filterchild">
        <Button className="filterchild" text="ciao" />
      </div>
      <div className="filterchild">
        <Button className="filterchild" text="ciao" />
      </div>
      <div className="filterchild">
        <Button className="filterchild" text="ciao" />
      </div>
      <div className="filterchild">
        <Button className="filterchild" text="ciao" />
      </div>
      <div className="filterchild">
        <Button className="filterchild" text="ciao" />
      </div>
    </div>
  );
}

export default HTTopBarFilter