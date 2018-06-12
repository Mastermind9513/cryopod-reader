import React from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";

import { fetchLinks, fetchPost } from "./service";
import ReaderMenu from "./components/menu";
import ReaderViewer from "./components/viewer";
import "./styles/styles.css";

/**
 * Main application component
 */
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            links: null,
            indexType: "classic", // TODO: types: "classic", "refresh"
            indexPart: "1",
            indexMode: "original", // TODO: modes: "original", "rewrite" (classic), null (refresh)
            text: "",
            title: "",
            loading: false
        };
    }

    async componentDidMount() {
        const links = await fetchLinks();
        this.setState({ links });

        const session = JSON.parse(localStorage.getItem("cryopod-reader"));
        if (session) {
            this.setState({
                indexType: session.indexType,
                indexPart: session.indexPart,
                indexMode: session.indexMode
            });
            this.updateText(session.indexType, session.indexPart, session.indexMode);
        } else {
            this.updateText(this.state.indexType, this.state.indexPart, this.state.indexMode);
        }
    };

    updateText = (type, part, mode) => {
        localStorage.setItem("cryopod-reader", JSON.stringify({
            indexType: type,
            indexPart: part,
            indexMode: mode
        }));
        this.setState({ loading: true });
        fetchPost(type, part, mode).then(post => {
            this.setState({
                text: post.text,
                title: post.title || `Part ${part}`,
                loading: false
            });
        });
    };

    handleIndexTypeChange = (e, { name }) => {
        const mode = (name === "classic") ? "original" : "refresh";
        this.setState({
            indexType: name,
            indexPart: "1",
            indexMode: mode
        });
        this.updateText(name, "1", mode);
    };

    handleIndexPartChange = (e, { part }) => {
        this.setState({
            indexPart: part
        });
        this.updateText(this.state.indexType, part, this.state.indexMode);
    };

    handleIndexModeChange = (e, { mode }) => {
        this.setState({
            indexMode: mode
        });
        // if moving to "original", but beyond part 472C in "rewrite", then just go back to 472C
        let part = (mode === "original" && parseInt(this.state.indexPart, 10) > 472) ? "472" : this.state.indexPart;
        this.updateText(this.state.indexType, part, mode);
    };

    render() {
        return (
            <div>
                <ReaderMenu indexType={this.state.indexType} onIndexTypeChange={this.handleIndexTypeChange} />
                <ReaderViewer {...this.state} onIndexPartChange={this.handleIndexPartChange} onIndexModeChange={this.handleIndexModeChange} />
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));
