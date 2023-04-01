/**
 * Main home page that displays introduction content
 */

import { Input, makeStyles, Typography } from '@material-ui/core';
import React, { useMemo, useState } from 'react';
import Word2VecUtils from '../utils/Word2VecUtils';

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
  const [word, setWord] = useState("")
  const utility = Word2VecUtils();

  const similarities = useMemo(() => {
    return utility.findSimilarWords(10, word);
  }, [utility, word])

  return (
    <div>
      <div className={classes.textContainer}>
        <Typography variant='h5'>Welcome to our Project: I AM GROUP</Typography>
        <br />
        <p>It is a group recommender that groups users based on similarities of their bios.</p>
        <br />
        <Input onChange={(e) => setWord(e.target.value)}/>
        <br />
        {similarities.map((item) => <Typography>{item}</Typography>)}
      </div>
    </div>
  );
}

export default Home;
