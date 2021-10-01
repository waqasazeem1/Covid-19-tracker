import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";

function InfoBox({ title, cases, isRed, isGreen, active, total, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox_selected"} ${
        isRed && "infoBox_red"
      } `}
    >
      <CardContent>
        <Typography className="infoBox_title" color="textSecondary">
          {title}
        </Typography>
        <h2
          className={`info_Cases  ${isGreen & active && "info_green"} ${
            isRed & active && "infoBox_red"
          } `}
        >
          {cases}
        </h2>
        <Typography className="infoBox_total">{total}</Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
