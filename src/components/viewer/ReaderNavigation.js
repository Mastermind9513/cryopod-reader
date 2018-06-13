import React from "react";
import { Button, Segment } from "semantic-ui-react";

function groupLinks(links, size) {
    const grouped = [];
    for (let i = 0; i < links.length; i += size) {
        grouped.push(links.slice(i, i + size));
    }
    return grouped;
}

export default function ReaderNavigation({ links, indexType, indexPart, onIndexPartChange }) {
    const selectedLinks = links ? Object.keys(links[indexType]) : [];
    const groupedLinks = groupLinks(selectedLinks, 10);

    return (
        links && <div>
            <Segment basic>
                {groupedLinks.map((group, i) => (
                    <div key={i}>
                        {group.map(key => (
                            // eslint-disable-next-line
                            <Button key={key} part={key} active={key == indexPart} onClick={onIndexPartChange}
                                    inverted compact color="red" size="mini">{key}</Button>
                        ))}
                    </div>
                ))}
            </Segment>
        </div>
    );
}
