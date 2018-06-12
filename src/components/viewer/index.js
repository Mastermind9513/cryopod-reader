import React from "react";
import { Grid } from "semantic-ui-react";

import ReaderText from "./ReaderText";
import ReaderNavigation from "./ReaderNavigation";

/**
 * Main reader component
 */
export default function ReaderViewer(props) {
    return (
        <Grid columns={2} divided inverted>
            <Grid.Column width={4} color="black">
                <ReaderNavigation {...props} />
            </Grid.Column>
            <Grid.Column width={12} color="black">
                <ReaderText {...props} />
            </Grid.Column>
        </Grid>
    );
}
