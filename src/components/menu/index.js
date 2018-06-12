import React from "react";
import { Menu } from "semantic-ui-react";

export default function ReaderMenu({ indexType, onIndexTypeChange }) {
    return (
        <Menu>
            <Menu.Item header>The Cryopod to Hell</Menu.Item>
            <Menu.Item name="classic" active={indexType === "classic"} onClick={onIndexTypeChange}>Classic</Menu.Item>
            <Menu.Item name="refresh" active={indexType === "refresh"} onClick={onIndexTypeChange}>Refresh</Menu.Item>
        </Menu>
    );
}
