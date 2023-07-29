const got = require('@/utils/got');
const cheerio = require('cheerio');
const { parseDate } = require('@/utils/parse-date');

module.exports = async (ctx) => {
    const { cid } = ctx.params;
    if (cid === undefined) {
        return;
    }
    const baseUrl = `https://www.dm530w.org/view/${cid}.html`;
    const { data: response } = await got({
        method: 'get',
        url: baseUrl,
    });
    const $ = cheerio.load(response);
    let items = $(`#main0  [target="_self"]`).map((index, item) => {
        const { title, href } = item.attribs;
        const link = 'https://www.dm530w.org' + href;
        return {
            title,
            link,
            description: $('.info').text(),
            pubDate: parseDate('2023-07-29'),
        };
    });
    items = [...items];

    const seen = new Map();
    items.forEach((item) => {
        if (!seen.has(item.title)) {
            seen.set(item.title, item);
        }
    });
    items = [...seen.values()].reverse();

    ctx.state.data = {
        title: $('title').text(),
        link: baseUrl,
        item: items,
    };
};
