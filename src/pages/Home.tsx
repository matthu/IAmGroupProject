/**
 * Main home page that displays introduction content
 */

import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(theme => ({
  root: {
  },
  profileImage: {
    borderRadius: '8px',
    maxWidth: '300px',
    marginRight: '30px',
  },
  textContainer: {
    display: 'inline-block',
    width: '100%',
    verticalAlign: 'top',
  },
}));

function Home() {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.textContainer}>
        <Typography variant='h5'>Welcome to our Project: I AM GROUP</Typography>
        <br />  
        <p>It is a group recommender that groups users based on similarities of their bios.</p>
      </div>
    </div>
  );
}

export default Home;
