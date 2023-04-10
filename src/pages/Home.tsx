/**
 * Main home page that displays introduction content
 */

import { makeStyles, TextField, Typography } from '@material-ui/core';
import { useMemo, useState } from 'react';
import BioTokenizer from '../utils/BioTokenizer';
import Word2VecUtils from '../utils/Word2VecUtils';
import { tfidfScores } from '../utils/TF_IDF';

type Scores = Record<string, Record<string, number>>;

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
  },
  subtitleText: {
    fontWeight: 700
  },
  subtitleDescription: {
    fontStyle: "italic"
  },
}));

/** The home page of the application */
function Home() {
  const classes = useStyles();

  /** Parameters */
  const similarityWeight = 1.0; // The weight to apply to similarity weights. I.e. "How much we should pay attention to similarity weights".
  const tfidfWeight = 0.8; // The weight to apply to tf-idf weights. I.e. "How much we should pay attention to tf-idf weights".
  const categoryWeight = 0.8; // The weight to apply to category weights. I.e. "How much we should pay attention to category weigths".

  /** The word to find similar words to */
  const [localWord, setLocalWord] = useState("")
  const [word, setWord] = useState("")
  const [filteredScores, setFilteredScores] = useState<Scores>({});
  const [filteredNames, setFilteredNames] = useState<Scores>({});
  const [inputValue, setInputValue] = useState('');
  const [usernameLookupValue, setUsernameLookupValue] = useState('');


  /** A utility class for calculating simularity scores */
  const word2VecUtility = useMemo(() => {
    return new Word2VecUtils();
  }, [])

  /** A utility class for extracting tokens from bios */
  const bioTokenizer = useMemo(() => {
    return new BioTokenizer();
  }, [])

  /** Finding similar words */
  const similarities = useMemo(() => {
    return word2VecUtility.findSimilarWords(10, word);
  }, [word])

  /** The raw bios of users */
  const bios: { [username: string]: string } = useMemo(() => {
    return bioTokenizer?.getBios();
  }, [bioTokenizer])

  /** The extracted tokens from bios */
  const bioTokens: { [username: string]: string[] } = useMemo(() => {
    return bioTokenizer?.getBioTokens();
  }, [bioTokenizer])

  /** The terms filtered to those in our word2vec or glove vocabulary */
  const filteredTerms: { [username: string]: string[] } = useMemo(() => {
    return word2VecUtility?.filterTerms(bioTokens);
  }, [word2VecUtility])

  /** These are interest weights to try to find most valuable words to us */

  const categories = ["sports", "programming", "hobby", "food"];

  const sportWeights = useMemo(() => {
    return word2VecUtility.getNSimilarTermsToTerm(10, filteredTerms, "sports");
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

  /** This finds all unique terms in the vocabulary */
  const uniqueTerms = useMemo(() => {
    var terms = new Set<string>();
    for (var username of Object.keys(bioTokens)) {
      for (var term of bioTokens[username]) {
        terms.add(term);
      }
    }
    return Array.from(terms.values()).sort();
  }, [bioTokens])

  /** These calculate the similarity between two users */

  const similarityWeightsA = useMemo(() => {
    return word2VecUtility.getComparisonOfTerms(filteredTerms["dushyant-rathore"], filteredTerms["satish-kumar-reddy-madduri"]);
  }, [filteredTerms])

  const similarityWeightsB = useMemo(() => {
    return word2VecUtility.getComparisonOfTerms(filteredTerms["satish-kumar-reddy-madduri"], filteredTerms["dushyant-rathore"]);
  }, [filteredTerms])

  /** These calculate the weights from the categories for the two users */

  const categoryWeightsA = useMemo(() => {
    return word2VecUtility.getUserCategoryWeights(filteredTerms["dushyant-rathore"], categories);
  }, [filteredTerms])

  const categoryWeightsB = useMemo(() => {
    return word2VecUtility.getUserCategoryWeights(filteredTerms["satish-kumar-reddy-madduri"], categories);
  }, [filteredTerms])

  /** These are the TF-IDF weights for the two users */

  const tfidfWeightsA = useMemo(() => {
    return tfidfScores["dushyant-rathore"];
  }, [tfidfScores])

  const tfidfWeightsB = useMemo(() => {
    return tfidfScores["satish-kumar-reddy-madduri"];
  }, [tfidfScores])

  /** These calculate the weights from the categories for the two users */

  const finalWeightsA = useMemo(() => {
    const finalWeights: {[id: string]: number} = {};
    for (const term of Object.keys(similarityWeightsA)) {
      const similarity = similarityWeightsA[term] ?? 0;
      const category = categoryWeightsA[term] ?? 0;
      const tfidf = tfidfWeightsA[term] ?? 0;
      finalWeights[term] = (similarity) * (category) * (tfidf);
    }
    return finalWeights;
  }, [similarityWeightsA, categoryWeightsA, tfidfWeightsA])

  const finalWeightsB = useMemo(() => {
    const finalWeights: {[id: string]: number} = {};
    for (const term of Object.keys(similarityWeightsB)) {
      const similarity = similarityWeightsB[term] ?? 0;
      const category = categoryWeightsB[term] ?? 0;
      const tfidf = tfidfWeightsB[term] ?? 0;
      finalWeights[term] = (similarity) * (category) * (tfidf);
    }
    return finalWeights;
  }, [similarityWeightsA, categoryWeightsA, tfidfWeightsA])
  
  /** 
   * This calculates the similarities of every user pair, across all users
   * Format is [usernameA, usernameB, similarityScore][]
   */

  const userSimilarities: [string, string, number][] = useMemo(() => {
    return word2VecUtility.getSimilarityOfAllUsers(filteredTerms).slice(0, 50);
  }, [filteredTerms])

  function handleLookup(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value.trim());
  }
  // function to simply get the terms 
  function handleTerm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!inputValue) {
      setFilteredScores({});
    } else {
      setFilteredScores(
        Object.entries(tfidfScores).reduce((acc: Scores, [username, scores]) => {
          const filtered = Object.entries(scores).filter(([term]) =>
            term.toLowerCase().includes(inputValue.toLowerCase())
          );
          if (filtered.length) {
            acc[username] = Object.fromEntries(filtered);
          }
          return acc;
        }, {})
      );
    }
  }
  //function to get the users and the terms 
  const handleUsernameLookup = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameLookupValue(event.target.value);
    if (!event.target.value) {
      setFilteredNames({});
    } else {
      setFilteredNames(
        Object.entries(tfidfScores)
          .filter(([username]) => username.toLowerCase().includes(event.target.value.trim().toLowerCase()))
          .reduce((acc: Scores, [username, scores]) => {
            acc[username] = scores;
            return acc;
          }, {})
      );
    }
  };

  return (
    <div>
      <div className={classes.textContainer}>
        <Typography variant='h5'>Welcome to our Project: I AM GROUP</Typography>
        {/* {Object.entries(tfidfScores).map(([username, scores]) =>
          Object.entries(scores).map(([term, score]) =>
            <tr key={`${username}-${term}`}>
              <td>{username}</td>
              <td>{term}</td>
              <td>{score.toFixed(10)}</td>
            </tr>
          )
        )} */}
        <div>
          <br />
          <form onSubmit={handleTerm}>
            <TextField
              label="Lookup Term"
              variant="outlined"
              value={inputValue}
              onChange={handleLookup}
            />
          </form>
          {Object.entries(filteredScores).map(([username, scores]) =>
            <Typography>
              {username + ": " +
                Object.entries(scores).map(([term, score]) => score.toFixed(10)).join(", ")
              }
            </Typography>
          )}
          <br />
          <TextField
            label="Lookup Username"
            variant="outlined"
            value={usernameLookupValue}
            onChange={handleUsernameLookup}
          />
          {Object.entries(filteredNames).map(([username, scores]) =>
              Object.entries(scores).map(([term, score]) => 
                <Typography>{term + ": " + score.toFixed(10)}</Typography>
              )
          )}
        </div>
        <br />
        <TextField
          label="Top 10 Similar Words"
          variant="outlined"
          onKeyUp={(e) => {
            if (e.keyCode === 13) {
              setWord(localWord);
            }
          }}
          onChange={(e) => setLocalWord(e.target.value)} />
        <br />
        {similarities.map((item) => <Typography>{item[0]}: {item[1]}</Typography>)}
        <br />
        <Typography className={classes.subtitleText}>User Pair Similarity:</Typography>
        <Typography className={classes.subtitleDescription}>For each term of a user's bio, find the max similarity value to the other user's bio's terms.</Typography>
        <br />
        <Typography>"dushyant-rathore" to "satish-kumar-reddy-madduri" Average: {Object.values(similarityWeightsA).reduce((a, b) => a + b) / Object.keys(similarityWeightsA).length}</Typography>
        <Typography>{Object.keys(similarityWeightsA).map(item => item + ": " + similarityWeightsA[item]).join(", ")}</Typography>
        <br />
        <Typography>"satish-kumar-reddy-madduri" to "dushyant-rathore" Average: {Object.values(similarityWeightsB).reduce((a, b) => a + b) / Object.keys(similarityWeightsB).length}</Typography>
        <Typography>{Object.keys(similarityWeightsB).map(item => item + ": " + similarityWeightsB[item]).join(", ")}</Typography>
        <Typography>Pair Similarity Average: {Object.values(similarityWeightsA).concat(Object.values(similarityWeightsB)).reduce((a, b) => a + b) / (Object.keys(similarityWeightsA).length + Object.keys(similarityWeightsB).length)}</Typography>
        <br />
        <Typography className={classes.subtitleText}>Category Weights:</Typography>
        <Typography className={classes.subtitleDescription}>For each term, find the max similarity value to the list of categories.</Typography>
        <br />
        <Typography>"dushyant-rathore" Category Weights</Typography>
        <Typography>{Object.keys(categoryWeightsA).map(item => item + ": " + categoryWeightsA[item]).join(", ")}</Typography>
        <br />
        <Typography>"satish-kumar-reddy-madduri" Category Weights</Typography>
        <Typography>{Object.keys(categoryWeightsB).map(item => item + ": " + categoryWeightsB[item]).join(", ")}</Typography>
        <br />
        <Typography className={classes.subtitleText}>TF-IDF Weights:</Typography>
        <Typography className={classes.subtitleDescription}>For each term, calculate the tf-idf score. Score should be between 0 - 1, with 1 representing the most rare words.</Typography>
        <br />
        <Typography>"dushyant-rathore" Category Weights</Typography>
        <Typography>{Object.keys(tfidfWeightsA).map(item => item + ": " + tfidfWeightsA[item]).join(", ")}</Typography>
        <br />
        <Typography>"satish-kumar-reddy-madduri" Category Weights</Typography>
        <Typography>{Object.keys(tfidfWeightsB).map(item => item + ": " + tfidfWeightsB[item]).join(", ")}</Typography>
        <br />
        <Typography className={classes.subtitleText}>Final Term Scores:</Typography>
        <Typography className={classes.subtitleDescription}>Multiply similarity, category, and tf-idf weights to find the final user-pair similarity score.</Typography>
        <br />
        <Typography>"dushyant-rathore" Final Weights</Typography>
        <Typography>Average: {Object.values(finalWeightsA).reduce((a, b) => a + b) / Object.keys(finalWeightsA).length}</Typography>
        <Typography>{Object.keys(finalWeightsA).map(item => item + ": " + finalWeightsA[item]).join(", ")}</Typography>
        <br />
        <Typography>"satish-kumar-reddy-madduri" Final Weights</Typography>
        <Typography>Average: {Object.values(finalWeightsB).reduce((a, b) => a + b) / Object.keys(finalWeightsB).length}</Typography>
        <Typography>{Object.keys(finalWeightsB).map(item => item + ": " + finalWeightsB[item]).join(", ")}</Typography>
        <br />
        <Typography className={classes.subtitleText}>Final Pair Similarity Score: {Object.values(finalWeightsA).concat(Object.values(finalWeightsB)).reduce((a, b) => a + b) / (Object.keys(finalWeightsA).length + Object.keys(finalWeightsB).length)}</Typography>
        <br />
        <Typography className={classes.subtitleText}>Top 50 User Similarity Pairs:</Typography>
        <br />
        {userSimilarities.map(item => <Typography>{item[0] + " - " + item[1] + ": " + item[2]}</Typography>)}
        <br />
        <Typography className={classes.subtitleText}>User Bio Tokens:</Typography>
        <br />
        {Object.keys(bioTokens).map((username) =>
          <>
            <Typography><b>{username}</b>:</Typography>
            <Typography className={classes.subtext}><b><i>Original</i></b>: {bios[username]}</Typography>
            <Typography className={classes.subtext}><b><i>Terms</i></b>: {bioTokens[username].join(", ")}</Typography>
            <Typography className={classes.subtext}><b><i>Word2Vec Terms</i></b>: {filteredTerms[username].join(", ")}</Typography>
            <Typography className={classes.subtext}><b><i>"Sports" Similarities</i></b>: {sportWeights[username].map(item => item[0] + ": " + item[1]).join(", ")}</Typography>
            <Typography className={classes.subtext}><b><i>"Programming" Similarities</i></b>: {programmingWeights[username].map(item => item[0] + ": " + item[1]).join(", ")}</Typography>
            <Typography className={classes.subtext}><b><i>"Food" Similarities</i></b>: {foodWeights[username].map(item => item[0] + ": " + item[1]).join(", ")}</Typography>
            <Typography className={classes.subtext}><b><i>"Hobby" Similarities</i></b>: {hobbyWeights[username].map(item => item[0] + ": " + item[1]).join(", ")}</Typography>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
