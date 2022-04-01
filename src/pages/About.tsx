/**
 * About page displaying more personal details
 */

import { Grid, makeStyles, Typography } from '@material-ui/core';
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
      <Typography variant='h5'>About Me</Typography>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={2}>
          Full-Time Employee
        </Grid>
        <Grid item xs={10}>
          Texas A&M Center for Applied Technology
        </Grid>
        <Grid item xs={2}>
          Part-Time Student
        </Grid>
        <Grid item xs={10}>
          Texas A&M University, pursuing Master's of Computer Science, graduating May 2023
        </Grid>
        <Grid item xs={2}>
          Husband & Father
        </Grid>
        <Grid item xs={10}>
          Beautiful wife Amanda and a 2 year old son Zavier
        </Grid>
      </Grid>
      <br />
      <Typography variant='h5'>Character</Typography>
      <Typography variant='h5'>Skills</Typography>
    </div>
  );
}

export default About;
