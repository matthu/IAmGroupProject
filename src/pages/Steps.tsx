/**
 * Main projects page that shows a sub page for each project
 */

import { makeStyles, Tab, Tabs } from '@material-ui/core';
import React, { useState } from 'react';
import Sentiment from '../subpages/Sentiment';
import Storyline from '../subpages/Storyline';

export const enum SUB_PAGE {
  data = 'data',
  analysis = 'analysis',
}

const useStyles = makeStyles(theme => ({
  root: {
  },
  tabs: {
    height: '100%',
  },
  flexContainer: {
    height: '100%',
  },
  tab: {
    borderRight: `2px solid ${theme.palette.divider}`,
    textTransform: 'none',
    '& > span': {
      textAlign: 'left',
      alignItems: 'normal',
    }
  },
  subTab: {
    marginLeft: '20px',
    borderRight: `2px solid ${theme.palette.divider}`,
    textTransform: 'none',
    '& > span': {
      textAlign: 'left',
      alignItems: 'normal',
    }
  },
  filler: {
    flex: 1,
    borderRight: `2px solid ${theme.palette.divider}`,
  },
  subPageContent: {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  iframe: {
    boxSizing: 'border-box',
    margin: '0px',
    minWidth: '0px',
    width: '100%',
    height: '680px',
    minHeight: '680px',
    border: '0px',
  },
  smallIframe: {
    boxSizing: 'border-box',
    margin: '0px',
    minWidth: '0px',
    width: '100%',
    height: '420px',
    minHeight: '420px',
    border: '0px',
    '& body': {
      background: 'transparent !important',
    }
  },
  content: {
    padding: '20px',
  },
  smallImage: {
    maxWidth: 'calc(50% - 10px)',
    padding: '5px',
    cursor: 'pointer',
    opacity: 1,
    transition: 'opacity 1s',
    '&:hover': {
      opacity: 0.8,
      transition: 'opacity 300ms',
    },
  },
  fullscreenImage: {
    left: '0px',
    right: '0px',
    marginRight: 'auto',
    marginLeft: 'auto',
    width: '80vw',
    height: 'auto',
    top: '10vh',
    position: 'absolute',
    cursor: 'pointer',
  },
}));

interface ImageTileProps {
  id: string;
  src: any;
  fullscreenImageId: string | undefined;
  onClick(id: string): void;
}

function ImageTile(props: ImageTileProps) {
  const classes = useStyles();

  return (
    <img id={props.id} src={props.src} className={props.fullscreenImageId === props.id ? classes.fullscreenImage : classes.smallImage} onClick={() => props.onClick(props.id)} />
  )
}

function Steps() {
  const classes = useStyles();

  // Save current sub tab state
  const [currentSubTab, setCurrentSubTab] = useState<SUB_PAGE>(SUB_PAGE.data);

  // Show tabs and pages for the currently selected tab
  return (
    <>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={currentSubTab}
        indicatorColor="primary"
        onChange={(event: React.ChangeEvent<{}>, newTab: SUB_PAGE) => setCurrentSubTab(newTab)}
        className={classes.tabs}
        classes={{ flexContainer: classes.flexContainer }}
      >
        <Tab label="Data Extraction" value={SUB_PAGE.data} className={classes.tab} />
        <Tab label="Term Analysis" value={SUB_PAGE.analysis} className={classes.tab} />
        <div className={classes.filler} />
      </Tabs>
      <div className={classes.subPageContent}>
        { currentSubTab === SUB_PAGE.data &&
          <></>
        }
        { currentSubTab === SUB_PAGE.analysis &&
          <></>
        }
      </div>
    </>
  );
}

export default Steps;
