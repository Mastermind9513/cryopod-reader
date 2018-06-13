import React from "react";
import { Accordion, Button, Segment, Sticky } from "semantic-ui-react";

function groupLinks(links, size) {
    const grouped = [];
    for (let i = 0; i < links.length; i += size) {
        grouped.push(links.slice(i, i + size));
    }
    return grouped;
}

function getPanels(links, type, size) {
    if (type === "classic") {
        // Book 1: 1 - 95
        // Book 2: 96 - 200
        // Book 3A: 201 - 385
        // Book 3B: 386 - 426
        // Book 3C: 427 - 490
        return [
            {
                key: "book1",
                title: "Book 1",
                links: groupLinks(links.slice(0, 95), size)
            },
            {
                key: "book2",
                title: "Book 2",
                links: groupLinks(links.slice(95, 200), size)
            },
            {
                key: "book3a",
                title: "Book 3 - Route A",
                links: groupLinks(links.slice(200, 385), size)
            },
            {
                key: "book3b",
                title: "Book 3 - Route B",
                links: groupLinks(links.slice(385, 426), size)
            },
            {
                key: "book3c",
                title: "Book 3 - Route C",
                links: groupLinks(links.slice(426), size)
            }
        ];
    } else if (type === "refresh") {
        return [
            {
                key: "refresh",
                title: "Cryopod Refresh",
                links: groupLinks(links, size)
            }
        ];
    } else {
        throw new Error(`Unknown type: ${type}`);
    }
}

/**
 * Internal component for displaying rows of links
 */
function GroupedLinks({ links, part, onIndexPartChange }) {
    return (
        <Segment basic>
            {links.map((group, i) => (
                <div key={i}>
                    {group.map(key => (
                        // eslint-disable-next-line
                        <Button key={key} part={key} active={key == part} onClick={onIndexPartChange}
                                inverted compact color="red" size="mini">{key}</Button>
                    ))}
                </div>
            ))}
        </Segment>
    );
}

/**
 * Component for navigating through parts and books
 */
export default class ReaderNavigation extends React.Component {
    render() {
        const { links, indexType, indexPart, onIndexPartChange, scrollRef } = this.props;

        const selectedLinks = links ? Object.keys(links[indexType]) : [];
        const panels = getPanels(selectedLinks, indexType, 10).map(panel => ({
            title: panel.title,
            content: {
                key: panel.key,
                content: <GroupedLinks links={panel.links} part={indexPart} onIndexPartChange={onIndexPartChange} />
            }
        }));

        return (
            <Sticky context={scrollRef}>
                <Accordion panels={panels} inverted exclusive={false} />
            </Sticky>
        );
    }
}
