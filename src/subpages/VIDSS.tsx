/**
 * Project page for the VIDSS project
 */

import { makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import ImageTile from '../components/ImageTile';
import vidssImage1 from './../images/vidss1.jpg';
import vidssImage2 from './../images/vidss2.jpg';
import vidssImage3 from './../images/vidss3.jpg';

const useStyles = makeStyles(theme => ({
  root: {
  },
  content: {
    padding: '20px',
  },
}));

function VIDSS() {
  const classes = useStyles();

  const [fullscreenImageId, setFullscreenImageId] = useState<string | undefined>(undefined);

  const toggleFullscreen = (id: string) => {
    if (fullscreenImageId == id) {
      setFullscreenImageId(undefined);
    }
    else {
      setFullscreenImageId(id);
    }
  }

  return (
    <>
      <div className={classes.content}>
        <p>VIDSS was a project funded by FeedTheFuture that investigated and facilitated crop rotation to increase Ethiopian agricultural yield. The interface was meant to be used by simple farmers, so it couldn't be too complicated, as well as more advanced users, so we had to find a blend of the two. The interface allows easy toggling of different crop layers for farmers to then note what and when they can plant in order to maximize yield. The top navigation bar even offers a walkthrough, where it lists steps and guides farmers in choosing what crops to focus on, as shown below.</p>
      </div>
      <div className={classes.content}>
        <ImageTile id='vidss1' src={vidssImage1} fullscreenImageId={fullscreenImageId} onClick={toggleFullscreen} />
        <ImageTile id='vidss2' src={vidssImage2} fullscreenImageId={fullscreenImageId} onClick={toggleFullscreen} />
        <ImageTile id='vidss3' src={vidssImage3} fullscreenImageId={fullscreenImageId} onClick={toggleFullscreen} />
      </div>
    </>
  );
}

export default VIDSS;
