import axios from "axios";
import keys from "./keys";

const fromPrompts = ["1", "2", "3", "4", "5", "6", "8"];
const fromKlokinator = ["7"];

const instance = axios.create({
    baseURL: "https://www.reddit.com/r/"
});

export default async function fetchText(type, part, mode) {
    let url = "";
    if (type === "classic") {
        if (mode === "original") {
            url += `${keys.classic.original.key}/${keys.classic.original[part]}`
        } else if (mode === "rewrite") {
            if (fromPrompts.includes(part.toString())) {
                url += `WritingPrompts/${keys.classic.rewrite[part]}`
            } else if (fromKlokinator.includes(part.toString())) {
                url += `klokinator/${keys.classic.rewrite[part]}`
            }
        } else {
            throw new Error(`Unknown mode: ${mode}`)
        }
    } else if (type === "refresh") {
        url += `${keys.refresh.key}/${keys.refresh[part]}`
    } else {
        throw new Error(`Unknown type: ${type}`);
    }

    const response = await instance.get(url + ".json");
    return response.data[0].data.children[0].data.selftext;
};
