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
            indexType: "classic",
            indexPart: "1",
            showTitles: false,
            loading: false
        };
    }

    async componentDidMount() {
        fetchLinks().then(links => {
            this.setState({ links });
            const session = JSON.parse(localStorage.getItem("cryopod-reader"));
            if (session) {
                this.setState({
                    indexType: session.indexType,
                    indexPart: session.indexPart,
                    showTitles: session.showTitles
                });
                this.updateText(session.indexType, session.indexPart);
            } else {
                this.updateText(this.state.indexType, this.state.indexPart);
            }
        });
    };

    updateText = (type, part) => {
        localStorage.setItem("cryopod-reader", JSON.stringify({
            indexType: type,
            indexPart: part,
            showTitles: this.state.showTitles
        }));
        this.setState({ loading: true });
        fetchPost(type, part).then(post => {
            this.setState({
                text: post.text,
                title: post.title || `Part ${part}`,
                loading: false
            });
        });
        window.scrollTo(0, 0);
    };

    handleIndexTypeChange = (e, { name }) => {
        this.setState({
            indexType: name,
            indexPart: "1"
        });
        this.updateText(name, "1");
    };

    handleIndexPartChange = (e, { part }) => {
        this.setState({
            indexPart: part
        });
        this.updateText(this.state.indexType, part);
    };

    handleShowTitles = showTitles => {
        localStorage.setItem("cryopod-reader", JSON.stringify({
            indexType: this.state.indexType,
            indexPart: this.state.indexPart,
            showTitles
        }));
        this.setState({ showTitles });
    };

    handleScrollRef = scrollRef => this.setState({ scrollRef });

    render() {
        return (
            <div>
                <ReaderMenu indexType={this.state.indexType} onIndexTypeChange={this.handleIndexTypeChange} />
                <ReaderViewer {...this.state} onIndexPartChange={this.handleIndexPartChange}
                              onScrollRef={this.handleScrollRef} onShowTitles={this.handleShowTitles} />
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));
