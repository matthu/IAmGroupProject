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

  const sportWeights = useMemo(() => {
    return word2VecUtility.getNSimilarTermsToTerm(10, filteredTerms, "sport");
  }, [filteredTerms])

  const programmingWeights = useMemo(() => {
    return word2VecUtility.getNSimilarTermsToTerm(10, filteredTerms, "programming");
  }, [filteredTerms])

  const hobbyWeights = useMemo(() => {
    return word2VecUtility.getNSimilarTermsToTerm(10, filteredTerms, "hobby");
  }, [filteredTerms])

  const foodWeights = useMemo(() => {
    return word2VecUtility.getNSimilarTermsToTerm(10, filteredTerms, "food");
  }, [filteredTerms])

  const uniqueTerms = useMemo(() => {
    var terms = new Set<string>();
    for (var username of Object.keys(bioTokens)) {
      for (var term of bioTokens[username]) {
        terms.add(term);
      }
    }
    return Array.from(terms.values()).sort();
  }, [bioTokens])

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
            <Typography className={classes.subtext}><b><i>"Sport" Similarities</i></b>: {sportWeights[username].map(item => item[0] + ": " + item[1]).join(", ")}</Typography>
            <Typography className={classes.subtext}><b><i>"Programming" Similarities</i></b>: {programmingWeights[username].map(item => item[0] + ": " + item[1]).join(", ")}</Typography>
            <Typography className={classes.subtext}><b><i>"Food" Similarities</i></b>: {foodWeights[username].map(item => item[0] + ": " + item[1]).join(", ")}</Typography>
            <Typography className={classes.subtext}><b><i>"Hobby" Similarities</i></b>: {hobbyWeights[username].map(item => item[0] + ": " + item[1]).join(", ")}</Typography>
          </>
        )}
        <Typography>Unique Terms:</Typography>
        <br />
        {JSON.stringify(uniqueTerms)}
      </div>
    </div>
  );
}

export default Home;
