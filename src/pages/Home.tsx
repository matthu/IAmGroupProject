/**
 * Main home page that displays introduction content
 */

 import { makeStyles, TextField, Typography } from '@material-ui/core';
import { useMemo, useState } from 'react';
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
   const utility = new Word2VecUtils();
 
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
         <TextField label="Top 10 Similar Words" variant="outlined" onChange={(e) => setWord(e.target.value)}/>
         <br />
         {similarities.map((item) => <Typography>{item[0]}: {item[1]}</Typography>)}
       </div>
     </div>
   );
 }
 
 export default Home;
 