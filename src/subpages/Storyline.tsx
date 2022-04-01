/**
 * Project page for the storyline visualization project
 */

import { makeStyles } from '@material-ui/core';
import React, { useState } from 'react';

const useStyles = makeStyles(theme => ({
  root: {
  },
  iframe: {
    boxSizing: 'border-box',
    margin: '0px',
    minWidth: '0px',
    width: '100%',
    height: '680px',
    minHeight: '680px',
    border: '0px',
  },
  content: {
    padding: '20px',
  },
}));

function Storyline() {
  const classes = useStyles();

  return (
    <>
      <iframe className={classes.iframe} src="https://spatial-temporal-storyline.glitch.me" title="spatial-temporal-storyline" allow="geolocation; microphone; camera; midi; encrypted-media; xr-spatial-tracking; fullscreen" allowFullScreen={true}></iframe>
      <div className={classes.content}>
        <p><b>Description</b></p>
        <p>Through the course of a semester, a small team and I got together to create a storyline visualization that very much needed to exist: Die Hard. The novel visualization tracks each notable character throughout the movie and gives details on movements, locations, and events that happen in what is deemed the best Christmas movie ever.</p>

        <span>Features</span>
        <ul>
          <li>The overall trend of the lines can vividly represent the evolution of the plot.</li>
          <li>The interval between the lines can also display the relation of the characters.</li>
          <li>Defined locations on y axis.</li>
          <li>Movie time is displayed on x axis.</li>
          <li>Icons for notable events, like flash grenades, C4 explosions, woundings, and deaths.</li>
          <li>Separation of character lines per location so they are easier to distinguish.</li>
          <li>Hover highlighting of characters and groups.</li>
          <li>Hover tooltip of movements and events to get more specific details.</li>
          <li>X-axis zoom and panning.</li>
          <li>Bottom overview ruler showing x-axis view range.</li>
        </ul>

        <p><b>Implementation</b></p>
        <p>This project was implemented in Javascript and D3 and was submitted as a course project for CSCE 679 Data Visualizations at Texas A&M University.</p>
      </div>
    </>
  );
}

export default Storyline;
