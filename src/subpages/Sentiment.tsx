/**
 * Project page for the sentiment analysis project
 */

import { makeStyles } from '@material-ui/core';
import React, { useState } from 'react';

const useStyles = makeStyles(theme => ({
  root: {
  },
  smallIframe: {
    boxSizing: 'border-box',
    margin: '0px',
    minWidth: '0px',
    width: '100%',
    height: '420px',
    minHeight: '420px',
    border: '0px',
    '& body': {
      background: 'transparent !important',
    }
  },
  content: {
    padding: '20px',
  },
}));

function Sentiment() {
  const classes = useStyles();

  return (
    <>
      <div className={classes.content}>
        <iframe className={classes.smallIframe} src="https://jsfiddle.net/matthu/3se0dj8h/show" title="sentiment-analysis" allow="geolocation; microphone; camera; midi; encrypted-media; xr-spatial-tracking; fullscreen" allowFullScreen={true}></iframe>
        <iframe className={classes.smallIframe} src="https://jsfiddle.net/matthu/mc5zxoqd/show" title="sentiment-analysis" allow="geolocation; microphone; camera; midi; encrypted-media; xr-spatial-tracking; fullscreen" allowFullScreen={true}></iframe>
      </div>
      <div className={classes.content}>
        <p><b>Description</b></p>
        <p>For fun, I attempted using Google's Sentiment Analysis to try to detect emotions in popular novels. So for all books of Harry Potter and Lord of the Rings, I fed each chapter, sentence by sentence, through Google's Sentiment Analysis and charted the results. Each sentence would be analyzed as a negative or positive emotion, ranging from -1 to 1, so I simply aggregated them into line charts by book</p>
      </div>
    </>
  );
}

export default Sentiment;
