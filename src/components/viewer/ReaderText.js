import React from "react";
import { Container, Dimmer, Header, Loader } from "semantic-ui-react";
import ReactMarkdown from "react-markdown";

/**
 * Component for displaying title and text
 */
export default function ReaderText({ text, title, loading }) {
    return (
        <Container>
            <Dimmer active={loading}>
                <Loader>Loading</Loader>
            </Dimmer>
            <Header inverted textAlign="center">{title}</Header>
            <ReactMarkdown source={text} />
        </Container>
    );
};
