export const getTags = (arr) => {
    const tagsArray = []
    if (arr && arr.length) {
        arr.forEach((tag) => {
            if (tag && tag.name) {
                if (tag.name.ru) {
                    tagsArray.push(tag.name.ru);
                }
            }
            if (typeof tag === "string") {
                tagsArray.push(tag);
            }
        });
    }
    return tagsArray
};