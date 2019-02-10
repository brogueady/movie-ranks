export const urlEncode = (url:string): string => {
    const newurl = encodeURI(url.slice(0))
    return newurl.replace(/#/g, '%23');
}