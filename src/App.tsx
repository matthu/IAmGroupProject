import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import Nav from './components/Nav';
import About from './pages/About';
import Home from './pages/Home';
import Projects from './pages/Projects';

export const enum PAGE {
  home = 'home',
  about = 'about',
  projects = 'projects'
}

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(0deg, rgba(221,223,247,1) 0%, rgba(255,255,255,1) 100%);',
  },
  body: {
    overflow: 'auto',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    // height: '100%',
    flex: 1,
    display: 'flex',
    marginLeft: '10vw',
    marginRight: '10vw',
    marginTop: '20px',
    marginBottom: '20px',
  },
}));

function App() {
  const classes = useStyles();

  const [currentTab, setCurrentTab] = useState<PAGE>(PAGE.home);

  return (
    <div className={classes.root}>
      <Nav
        currentTab={currentTab}
        onChangeTab={(tab: PAGE) => setCurrentTab(tab)}
      />
      <div className={classes.body}>
        <div className={classes.content}>
          { currentTab === PAGE.home &&
            <Home />
          }
          { currentTab === PAGE.about &&
            <About />
          }
          { currentTab === PAGE.projects &&
            <Projects />
          }
        </div>
      </div>
    </div>
  );
}

export default App;
