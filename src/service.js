import axios from "axios";

const original = {
    linksURL: "https://www.reddit.com/r/klokinator/comments/7qo9tr/index_list.json",
    textURL: "https://www.reddit.com/r/klokinator",
    regex: /\[Part (\d+).*]\(https:\/\/redd.it\/(.+)\)/g
};

const rewrite = {
    linksURL: "https://www.reddit.com/r/TheCryopodToHell/comments/8lu4ql/cryopod_classic_index_list_v30.json",
    textURL: "https://www.reddit.com/r/TheCryopodToHell",
    regex: /\[Part (\d+).*]\(https:\/\/redd.it\/(.+)\)|\[Part (\d+).*]\(https:\/\/www.reddit.com\/comments\/(.+)\/_\/(.+)\)/g
};

const refresh = {
    linksURL: "https://www.reddit.com/r/TheCryopodToHell/comments/8lu5j9/cryopod_refresh_index_list.json",
    textURL: "https://www.reddit.com/r/TheCryopodToHell",
    regex: /\[Cryopod Refresh (\d+): .+]\(https:\/\/redd.it\/(.+)\)/g
};

const links = {
    original: {},
    rewrite: {},
    refresh: {}
};

const fromPrompts = ["1", "2", "3", "4", "5", "6", "8"];
const fromKlokinator = ["7"];

export async function fetchLinks() {
    // fetch Cryopod Classic - Original links
    const originalResponse = await axios.get(original.linksURL);
    const originalText = originalResponse.data[0].data.children[0].data.selftext;
    let match;
    while (!!(match = original.regex.exec(originalText))) {
        links.original[match[1]] = match[2];
    }

    // fetch Cryopod Classic - Rewrite links
    const rewriteResponse = await axios.get(rewrite.linksURL);
    const rewriteText = rewriteResponse.data[0].data.children[0].data.selftext;
    while (!!(match = rewrite.regex.exec(rewriteText))) {
        if (match[1] && match[2]) {
            links.rewrite[match[1]] = match[2];
        } else if (match[3] && match[4] && match[5]) {
            links.rewrite[match[3]] = `${match[4]}/_/${match[5]}`;
        } else {
            throw new Error(`Invalid match: ${match[0]}`);
        }
    }

    // fetch Cryopod Refresh links
    const refreshResponse = await axios.get(refresh.linksURL);
    const refreshText = refreshResponse.data[0].data.children[0].data.selftext;
    while (!!(match = refresh.regex.exec(refreshText))) {
        links.refresh[match[1]] = match[2];
    }

    return links;
}

export async function fetchPost(type, part, mode) {
    let url;
    let fromComment = false;
    if (type === "classic") {
        if (mode === "original") {
            url = `${original.textURL}/${links.original[part]}`;
        } else if (mode === "rewrite") {
            if (fromPrompts.includes(part.toString())) {
                url = "https://www.reddit.com/comments/";
                fromComment = true;
            } else if (fromKlokinator.includes(part.toString())) {
                url = `${original.textURL}/`;
            } else {
                url = `${rewrite.textURL}/`;
            }
            url += links.rewrite[part];
        } else {
            throw new Error(`Unknown mode: ${mode}`);
        }
    } else if (type === "refresh") {
        url = `${refresh.textURL}/${links.refresh[part]}`;
    } else {
        throw new Error(`Unknown type: ${type}`);
    }

    const response = await axios.get(url + ".json");
    if (fromComment) {
        return {
            text: response.data[1].data.children[0].data.body
        };
    } else {
        return {
            text: response.data[0].data.children[0].data.selftext,
            title: response.data[0].data.children[0].data.title
        };
    }
}
