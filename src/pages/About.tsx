/**
 * About page displaying more personal details
 */

import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
  },
}));

function About() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant='h5'>About The Project</Typography>
      <br />
      <Typography>Uses Word2Vec to compare similarities of users' bios.</Typography>
      <br />
      <Typography>Creates a recommended grouping of users based on similarities.</Typography>
    </div>
  );
}

export default About;
