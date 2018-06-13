import axios from "axios";

// https://www.reddit.com/r/TheCryopodToHell/comments/6z1s7p/part_424b_usurper/
const classic = {
    linksURL: "https://www.reddit.com/r/TheCryopodToHell/comments/8lu4ql/cryopod_classic_index_list_v30.json",
    textURL: "https://www.reddit.com/r/TheCryopodToHell",
    regex: /\[Part (\d+)(.*)]\(https?:\/\/redd.it\/(\w+)\)|\[Part (\d+)(.*)]\(https?:\/\/www.reddit.com\/(?:r\/\w+\/)?comments\/(?:(\w+)\/_\/(\w+)|(\w+)\/(?:.*))\)/g
    //               1   2                           3    |         4   5                                                            6         7     8
};

const refresh = {
    linksURL: "https://www.reddit.com/r/TheCryopodToHell/comments/8lu5j9/cryopod_refresh_index_list.json",
    textURL: "https://www.reddit.com/r/TheCryopodToHell",
    regex: /\[Cryopod Refresh (\d+): (.+)]\(https:\/\/redd.it\/(.+)\)/g
    //                          1     2                         3
};

const links = {
    classic: {},
    refresh: {}
};

const fromPrompts = ["1", "2", "3", "4", "5", "6", "8"];
const fromKlokinator = ["7"];

export async function fetchLinks() {
    // fetch Cryopod Classic links
    const classicResponse = await axios.get(classic.linksURL);
    const classicText = classicResponse.data[0].data.children[0].data.selftext;
    let match;
    while (!!(match = classic.regex.exec(classicText))) {
        if (match[1]) {
            links.classic[match[1]] = {
                title: `Part ${match[1]}${match[2] || ""}`,
                hash: match[3]
            };
        } else if (match[4]) {
            links.classic[match[4]] = {
                title: `Part ${match[4]}${match[5] || ""}`,
                hash: match[8] || `${match[6]}/_/${match[7]}`
            };
        }
    }

    // fetch Cryopod Refresh links
    const refreshResponse = await axios.get(refresh.linksURL);
    const refreshText = refreshResponse.data[0].data.children[0].data.selftext;
    while (!!(match = refresh.regex.exec(refreshText))) {
        links.refresh[match[1]] = {
            title: `${match[1]}: ${match[2]}`,
            hash: match[3]
        };
    }

    return links;
}

export async function fetchPost(type, part) {
    let url;
    let fromComment = false;
    if (type === "classic") {
        if (fromPrompts.includes(part.toString())) {
            url = "https://www.reddit.com/comments/";
            fromComment = true;
        } else if (fromKlokinator.includes(part.toString())) {
            url = "https://www.reddit.com/r/klokinator/";
        } else {
            url = `${classic.textURL}/`;
        }
        url += links.classic[part].hash;
    } else if (type === "refresh") {
        url = `${refresh.textURL}/${links.refresh[part].hash}`;
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
