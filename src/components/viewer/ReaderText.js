import React from "react";
import { Button, Container, Dimmer, Header, Loader, Popup } from "semantic-ui-react";
import ReactMarkdown from "react-markdown";

/**
 * Component for displaying title and text
 */
export default function ReaderText({ links, indexType, indexPart, text, title, loading, onIndexPartChange }) {
    indexPart = parseInt(indexPart, 10);
    const prevExists = links && !!(links[indexType][indexPart - 1]);
    const nextExists = links && !!(links[indexType][indexPart + 1]);

    return (
        <Container>
            <Dimmer active={loading}>
                <Loader>Loading</Loader>
            </Dimmer>
            {prevExists && (<Popup trigger={<Button floated="left" onClick={() => onIndexPartChange({}, { part: indexPart - 1 })} icon="arrow left"
                                                    inverted compact color="red" />} content="Previous part"  />)}
            {nextExists && (<Popup trigger={<Button floated="right" onClick={() => onIndexPartChange({}, { part: indexPart + 1 })} icon="arrow right"
                                                    inverted compact color="red" />} content="Next part" />)}
            <Header inverted textAlign="center">{title}</Header>
            <hr />
            <ReactMarkdown source={text} />
            <hr />
            {prevExists && (<Popup trigger={<Button floated="left" onClick={() => onIndexPartChange({}, { part: indexPart - 1 })} icon="arrow left"
                                                    inverted compact color="red" />} content="Previous part"  />)}
            {nextExists && (<Popup trigger={<Button floated="right" onClick={() => onIndexPartChange({}, { part: indexPart + 1 })} icon="arrow right"
                                                    inverted compact color="red" />} content="Next part" />)}
        </Container>
    );
};
