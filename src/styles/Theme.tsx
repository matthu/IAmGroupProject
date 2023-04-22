/**
 * Main theme of the UI, setting default colors etc
 */

import { createTheme } from "@material-ui/core";

const theme = createTheme({
    palette: {
        primary: {
            main: "#349F02",
        },
        secondary: {
            main: "#444",
        },
    },
});

export default theme;