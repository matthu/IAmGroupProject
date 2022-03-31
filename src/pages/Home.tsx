import { makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(theme => ({
  root: {
  },
}));

function Home() {
  const classes = useStyles();
  
  return (
    <div>
      Home Page
    </div>
  );
}

export default Home;
