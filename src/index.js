import React from "react";
import ReactDOM from "react-dom";
import ReactMarkdown from "react-markdown";
import "semantic-ui-css/semantic.min.css";

import fetchText from "./service";
import ReaderMenu from "./components/menu";
import ReaderViewer from "./components/viewer";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            indexType: "classic", // TODO: types: "classic", "refresh"
            indexPart: 1,
            indexMode: "original", // TODO: modes: "original", "rewrite" (classic), null (refresh)
            text: ""
        };
    }

    async componentDidMount() {
        const { indexType, indexPart, indexMode } = this.state;

        const session = localStorage.getItem("cryopod-reader");
        if (session) {
            this.setState({
                indexType: session.indexType,
                indexPart: session.indexPart,
                indexMode: session.indexMode
            });
        } else {
            const text = await fetchText(indexType, indexPart, indexMode);
            this.setState({ text });
        }
    };

    handleIndexTypeChange = (e, { name }) => {
        this.setState({
            indexType: name,
            indexPart: 1,
            indexMode: (name === "classic") ? "original" : null
        });
    };

    render() {
        return (
            <div>
                <ReaderMenu onIndexTypeChange={this.handleIndexTypeChange} />
                <ReaderViewer />
                <ReactMarkdown source={this.state.text} />
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));
