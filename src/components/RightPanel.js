import React from "react"
import { Checkbox, Dropdown, Divider } from "semantic-ui-react"
import nBackDropDownOptions from "../nBackDropDownOptions"

export default function RightPanel({
  level,
  trials,
  nBack,
  updateNBack,
  options,
  saveOptions,
  toggleSaveHistory,
  toggleAutoUpdateNBack,
}) {
  return (
    <React.Fragment>
      <p>
        Level: <span style={{ fontWeight: "bold" }}>{level}</span>
      </p>
      <p>
        Number of trails: <span style={{ fontWeight: "bold" }}>{trials}</span>
      </p>
      <Dropdown
        simple
        placeholder="N Back"
        options={nBackDropDownOptions}
        value={nBack}
        onChange={updateNBack}
      />
      <Divider />
      <p>Options</p>
      <Checkbox
        key={options}
        label="Auto-update n-back"
        toggle
        checked={options.autoUpdateNBack}
        onChange={(e) => {
          toggleAutoUpdateNBack()
          saveOptions()
        }}
      />
      <Checkbox
        label="Save history"
        toggle
        style={{ marginTop: "15px" }}
        checked={options.saveHistory}
        onChange={(e) => {
          toggleSaveHistory()
          saveOptions()
        }}
      />
    </React.Fragment>
  )
}
