import React from 'react';
import { AppBar, makeStyles, Tab, Tabs } from '@material-ui/core';
import { PAGE } from '../App';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: '0px 4px 4px 0px rgb(0 0 0 / 5%), 0px 1px 12px 0px rgb(0 0 0 / 20%)',
    background: 'linear-gradient(142deg, rgba(71,86,214,1) 11%, rgba(21,133,198,1) 50%, rgba(85,71,214,1) 92%)',
  },
  nav: {
    marginLeft: '10vw',
    marginRight: '10vw',
  },
  indicator: {
    backgroundColor: 'white'
  },
}));

interface NavProps {
  currentTab: string;
  onChangeTab:(tab: PAGE) => void;
}

function Nav(props: NavProps) {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.root}>
      <Tabs
          className={classes.nav}
          value={props.currentTab}
          onChange={(event: React.ChangeEvent<{}>, newTab: PAGE) => props.onChangeTab(newTab)}
          indicatorColor="secondary"
          textColor="inherit"
          aria-label="full width tabs example"
          classes={{indicator: classes.indicator}}
        >
          <Tab label="Home" value={PAGE.home} />
          <Tab label="About" value={PAGE.about} />
          <Tab label="Projects" value={PAGE.projects} />
        </Tabs>
    </AppBar>
  );
}

export default Nav;
