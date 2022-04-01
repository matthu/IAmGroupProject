/**
 * Project page for the VolEMS project
 */

import { makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import ImageTile from '../components/ImageTile';
import volemsImage1 from './../images/volems1.jpg';
import volemsImage2 from './../images/volems2.jpg';

const useStyles = makeStyles(theme => ({
  root: {
  },
  content: {
    padding: '20px',
  },
}));

function VolEMS() {
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
        <p>VolEMS was a project meant to allow volunteers to help in emergency situations. The incentive was that volunteers could be nearby to an emergency and help in the critical minutes before an ambulance might arrive. The user interface was meant to be very simple, with the dispatcher only having to enter minimal information before volunteers are notified through a mobile app.</p>
      </div>
      <div className={classes.content}>
        <ImageTile id='volems1' src={volemsImage1} fullscreenImageId={fullscreenImageId} onClick={toggleFullscreen} />
        <ImageTile id='volems2' src={volemsImage2} fullscreenImageId={fullscreenImageId} onClick={toggleFullscreen} />
      </div>
    </>
  );
}

export default VolEMS;
