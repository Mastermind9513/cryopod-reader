import React from "react";
import { Grid } from "semantic-ui-react";

import ReaderNavigation from "./ReaderNavigation";
import ReaderText from "./ReaderText";

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
                <div ref={props.onScrollRef}>
                    <ReaderText {...props} />
                </div>
            </Grid.Column>
        </Grid>
    );
}
