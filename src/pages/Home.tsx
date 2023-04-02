/**
 * Main home page that displays introduction content
 */

import { makeStyles, TextField, Typography } from '@material-ui/core';
import { useMemo, useState } from 'react';
import BioTokenizer from '../utils/BioTokenizer';
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
    subtext: {
      paddingLeft: '15px',
    }
  }));


  function Home() {
    const classes = useStyles();
    const [word, setWord] = useState("")
    const word2VecUtility = new Word2VecUtils();
    const bioTokenizer = new BioTokenizer();
    const bios = bioTokenizer.getBios();
    const bioTokens = bioTokenizer.getBioTokens();
    const filteredTerms = word2VecUtility.filterTerms(bioTokens);
 
   const similarities = useMemo(() => {
     return word2VecUtility.findSimilarWords(10, word);
   }, [word2VecUtility, word])
 
  return (
    <div>
      <div className={classes.textContainer}>
      <Typography variant='h5'>Welcome to our Project: I AM GROUP</Typography>
      <br />
      <p>It is a group recommender that groups users based on similarities of their bios.</p>
      <br />
      <TextField label="Top 10 Similar Words" variant="outlined" onChange={(e) => setWord(e.target.value)}/>
      <br />
      {similarities.map((item) => <Typography>{item[0]}: {item[1]}</Typography>)}
      <br />
      <Typography>User Bio Tokens:</Typography>
      <br />
      {Object.keys(bioTokens).map((username) => 
        <>
          <Typography><b>{username}</b>:</Typography>
          <Typography className={classes.subtext}><b><i>Original</i></b>: {bios[username]}</Typography>
          <Typography className={classes.subtext}><b><i>Terms</i></b>: {bioTokens[username].join(", ")}</Typography>
          <Typography className={classes.subtext}><b><i>Word2Vec Terms</i></b>: {filteredTerms[username].join(", ")}</Typography>
        </>
      )}
      </div>
    </div>
  );
}
 
export default Home;
 