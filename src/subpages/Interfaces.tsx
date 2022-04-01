/**
 * Project page for interfaces I've developed
 */

import { makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import ImageTile from '../components/ImageTile';
import alimImage1 from './../images/alim1.png';
import vidssImage1 from './../images/vidss1.jpg';
import vidssImage2 from './../images/vidss2.jpg';
import vidssImage3 from './../images/vidss3.jpg';
import volemsImage1 from './../images/volems1.jpg';
import volemsImage2 from './../images/volems2.jpg';

const useStyles = makeStyles(theme => ({
  root: {
  },
  content: {
    padding: '20px',
  },
}));

function Interfaces() {
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
        <p>I have worked for the Texas A&M Center for Applied Technology (TCAT) for almost seven years now and have done a wide variety of projects. Most of my experience has revolved around interfaces and UI/UX work in front-end development. I am well-versed in React, Typescript, and other common libraries like Redux, Material UI, and Webpack. With a good eye for design, I can spin up a React app pretty quickly and get to customizing the UI to fit the client's needs. I prefer Material UI for UI elements since it offers a clean modern look while allowing customization.</p>
        <p>Below is a small showcase of some interfaces I have put together that are both functional and aesthetic. All are using Webpack, React, & Material UI among other libraries.</p>
      </div>
      <div className={classes.content}>
        <ImageTile id='vidss1' src={vidssImage1} fullscreenImageId={fullscreenImageId} onClick={toggleFullscreen} />
        <ImageTile id='vidss2' src={vidssImage2} fullscreenImageId={fullscreenImageId} onClick={toggleFullscreen} />
        <ImageTile id='vidss3' src={vidssImage3} fullscreenImageId={fullscreenImageId} onClick={toggleFullscreen} />
        <ImageTile id='volems1' src={volemsImage1} fullscreenImageId={fullscreenImageId} onClick={toggleFullscreen} />
        <ImageTile id='volems2' src={volemsImage2} fullscreenImageId={fullscreenImageId} onClick={toggleFullscreen} />
        <ImageTile id='alim1' src={alimImage1} fullscreenImageId={fullscreenImageId} onClick={toggleFullscreen} />
      </div>
    </>
  );
}

export default Interfaces;
