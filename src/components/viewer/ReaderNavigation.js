import React from "react";
import { Accordion, Button, Popup, Segment, Sticky } from "semantic-ui-react";

function groupLinks(links, size) {
    const grouped = [];
    for (let i = 0; i < links.length; i += size) {
        grouped.push(links.slice(i, i + size));
    }
    return grouped;
}

function getPanels(links, type, showTitles, size) {
    if (type === "classic") {
        // Book 1: 1 - 95
        const book1 = links.slice(0, 95);
        // Book 2: 96 - 200
        const book2 = links.slice(95, 200);
        // Book 3A: 201 - 385
        const book3a = links.slice(200, 385);
        // Book 3B: 386 - 426
        const book3b = links.slice(385, 426);
        // Book 3C: 427 - 490
        const book3c = links.slice(426);
        return [
            {
                key: "book1",
                title: "Book 1",
                links: showTitles ? book1 : groupLinks(book1, size)
            },
            {
                key: "book2",
                title: "Book 2",
                links: showTitles ? book2 : groupLinks(book2, size)
            },
            {
                key: "book3a",
                title: "Book 3 - Route A",
                links: showTitles ? book3a : groupLinks(book3a, size)
            },
            {
                key: "book3b",
                title: "Book 3 - Route B",
                links: showTitles ? book3b : groupLinks(book3b, size)
            },
            {
                key: "book3c",
                title: "Book 3 - Route C",
                links: showTitles ? book3c : groupLinks(book3c, size)
            }
        ];
    } else if (type === "refresh") {
        return [
            {
                key: "refresh",
                title: "Cryopod Refresh",
                links: showTitles ? links : groupLinks(links, size)
            }
        ];
    } else {
        throw new Error(`Unknown type: ${type}`);
    }
}

/* eslint-disable */

/**
 * Internal component for displaying rows of links
 */
function GroupedLinks({ links, part, onIndexPartChange }) {
    return (
        <Segment basic>
            {links.map((group, i) => (
                <div key={i}>
                    {group.map(key => (
                        <Button key={key} part={key} active={key == part} onClick={onIndexPartChange}
                                inverted compact color="red" size="mini">{key}</Button>
                    ))}
                </div>
            ))}
        </Segment>
    );
}

/**
 * Internal component for displaying titled links
 */
function TitledLinks({ reference, links, part, onIndexPartChange }) {
    return (
        <Segment basic>
            {links.map(key => (
                <div key={key}>
                    <Button part={key} active={key == part} onClick={onIndexPartChange}
                            inverted compact color="red" size="tiny">{reference[key].title}</Button>
                </div>
            ))}
        </Segment>
    );
}

/* eslint-enable */

/**
 * Component for navigating through parts and books
 */
export default class ReaderNavigation extends React.Component {
    render() {
        const { links, indexType, indexPart, showTitles, onIndexPartChange, onShowTitles, scrollRef } = this.props;

        const selectedReference = links ? links[indexType] : {};
        const selectedLinks = links ? Object.keys(links[indexType]) : [];

        const panels = getPanels(selectedLinks, indexType, showTitles, 10).map(panel => ({
            title: panel.title,
            content: {
                key: panel.key,
                content: showTitles ? <TitledLinks reference={selectedReference} links={panel.links} part={indexPart} onIndexPartChange={onIndexPartChange} /> :
                                      <GroupedLinks links={panel.links} part={indexPart} onIndexPartChange={onIndexPartChange} />
            }
        }));

        return (
            <Sticky context={scrollRef}>
                <Button.Group floated="right" inverted compact color="red" size="tiny">
                    <Popup trigger={<Button active={!showTitles} onClick={() => onShowTitles(false)} icon="grid layout" />} content="Show part numbers only" />
                    <Popup trigger={<Button active={showTitles} onClick={() => onShowTitles(true)} icon="list layout" />} content="Show part titles" />
                </Button.Group>
                <Accordion panels={panels} inverted exclusive={false} />
            </Sticky>
        );
    }
}
