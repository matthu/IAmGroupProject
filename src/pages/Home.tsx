/**
 * Main home page that displays introduction content
 */

import { makeStyles, TextField, Typography } from '@material-ui/core';
import { useMemo, useState } from 'react';
import BioTokenizer from '../utils/BioTokenizer';
import Word2VecUtils from '../utils/Word2VecUtils';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
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
}));

/** The home page of the application */
function Home() {
  const classes = useStyles();

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

  const comparisonA = useMemo(() => {
    return word2VecUtility.getComparisonOfTerms(filteredTerms["dushyant-rathore"], filteredTerms["satish-kumar-reddy-madduri"]);
  }, [filteredTerms])

  const comparisonB = useMemo(() => {
    return word2VecUtility.getComparisonOfTerms(filteredTerms["satish-kumar-reddy-madduri"], filteredTerms["dushyant-rathore"]);
  }, [filteredTerms])

  /** These calculate the weights from the categories for the two users */

  const weightsA = useMemo(() => {
    return word2VecUtility.getUserCategoryWeights(filteredTerms["dushyant-rathore"], categories);
  }, [filteredTerms])

  const weightsB = useMemo(() => {
    return word2VecUtility.getUserCategoryWeights(filteredTerms["satish-kumar-reddy-madduri"], categories);
  }, [filteredTerms])
  
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
  //function to get the users and the terms 
  const handleUsernameLookup = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameLookupValue(event.target.value);
    setFilteredNames(
      Object.entries(tfidfScores)
        .filter(([username]) => username.toLowerCase().includes(event.target.value.trim().toLowerCase()))
        .reduce((acc: Scores, [username, scores]) => {
          acc[username] = scores;
          return acc;
        }, {})
    );
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

        </div>
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
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Term</TableCell>
                <TableCell>Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(filteredScores).map(([username, scores]) =>
                Object.entries(scores).map(([term, score]) =>
                  <TableRow key={`${username}-${term}`}>
                    <TableCell>{username}</TableCell>
                    <TableCell>{term}</TableCell>
                    <TableCell>{score.toFixed(10)}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
          <br />
          <TextField
            label="Lookup Username"
            variant="outlined"
            value={usernameLookupValue}
            onChange={handleUsernameLookup}
          />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Term</TableCell>
                <TableCell>Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(filteredNames).map(([username, scores]) =>
                Object.entries(scores).map(([term, score]) => (
                  <TableRow key={`${username}-${term}`}>
                    <TableCell>{username}</TableCell>
                    <TableCell>{term}</TableCell>
                    <TableCell>{score.toFixed(10)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <br />
        <p>It is a group recommender that groups users based on similarities of their bios.</p>
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
        <br />
        <Typography>"dushyant-rathore" to "satish-kumar-reddy-madduri" Average: {comparisonA.map(item => item[1]).reduce((a, b) => a + b) / comparisonA.length}</Typography>
        <Typography>{comparisonA.map(item => item[0] + ": " + item[1]).join(", ")}</Typography>
        <br />
        <Typography>"satish-kumar-reddy-madduri" to "dushyant-rathore" Average: {comparisonB.map(item => item[1]).reduce((a, b) => a + b) / comparisonB.length}</Typography>
        <Typography>{comparisonB.map(item => item[0] + ": " + item[1]).join(", ")}</Typography>
        <Typography>Pair Similarity Average: {comparisonA.concat(comparisonB).map(item => item[1]).reduce((a, b) => a + b) / (comparisonA.length + comparisonB.length)}</Typography>
        <br />
        <Typography className={classes.subtitleText}>Category Weights:</Typography>
        <br />
        <Typography>"dushyant-rathore" Category Weights</Typography>
        <Typography>{weightsA.map(item => item[0] + ": " + item[1]).join(", ")}</Typography>
        <br />
        <Typography>"satish-kumar-reddy-madduri" Category Weights</Typography>
        <Typography>{weightsB.map(item => item[0] + ": " + item[1]).join(", ")}</Typography>
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
