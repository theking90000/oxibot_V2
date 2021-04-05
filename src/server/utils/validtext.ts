const Filter = require('bad-words'),
    filter = new Filter({ placeHolder : "\*" });

export default (text : string) => {
    return filter.clean(text.toString());

}