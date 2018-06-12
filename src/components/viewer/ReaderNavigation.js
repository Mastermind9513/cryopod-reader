import React from "react";
import { Button, Segment } from "semantic-ui-react";

function groupLinks(links, size) {
    const grouped = [];
    for (let i = 0; i < links.length; i += size) {
        grouped.push(links.slice(i, i + size));
    }
    return grouped;
}

export default function ReaderNavigation({ links, indexType, indexPart, indexMode, onIndexPartChange, onIndexModeChange }) {
    const selectedLinks = links ? Object.keys(links[indexMode]) : [];
    const groupedLinks = groupLinks(selectedLinks, 10);

    return (
        links && <div>
            {(indexType === "classic") && (
                <Segment basic>
                    <Button.Group>
                        <Button mode="original" onClick={onIndexModeChange} active={indexMode === "original"} inverted compact color="red">Original</Button>
                        <Button.Or text="|" />
                        <Button mode="rewrite" onClick={onIndexModeChange} active={indexMode === "rewrite"} inverted compact color="red">Rewrite</Button>
                    </Button.Group>
                </Segment>
            )}
            <Segment basic>
                {groupedLinks.map((group, i) => (
                    <div key={i}>
                        {group.map(key => (
                            <Button key={key} part={key} active={key == indexPart} onClick={onIndexPartChange}
                                    inverted compact color="red" size="mini">{key}</Button>
                        ))}
                    </div>
                ))}
            </Segment>
        </div>
    );
}
