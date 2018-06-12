import React from "react";
import { Menu, Segment } from "semantic-ui-react";

/**
 * Main menu component
 */
export default function ReaderMenu({ indexType, onIndexTypeChange }) {
    return (
        <Segment inverted attached>
            <Menu inverted pointing secondary>
                <Menu.Item header>The Cryopod to Hell</Menu.Item>
                <Menu.Item name="classic" active={indexType === "classic"} onClick={onIndexTypeChange}>Classic</Menu.Item>
                <Menu.Item name="refresh" active={indexType === "refresh"} onClick={onIndexTypeChange}>Refresh</Menu.Item>
            </Menu>
        </Segment>
    );
}
