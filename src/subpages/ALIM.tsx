/**
 * Project page for the ALIM project
 */

import { makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import ImageTile from '../components/ImageTile';
import alimImage1 from './../images/alim1.png';

const useStyles = makeStyles(theme => ({
  root: {
  },
  content: {
    padding: '20px',
  },
}));

function ALIM() {
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
        <p>This project relied on using a BIM model viewer to allow users to fully explore a building with all of its intricate components. I was in charge the UI as well as linking the BIM viewer into the interface and customizing it as needed.</p>
      </div>
      <div className={classes.content}>
        <ImageTile id='alim1' src={alimImage1} fullscreenImageId={fullscreenImageId} onClick={toggleFullscreen} />
      </div>
    </>
  );
}

export default ALIM;
