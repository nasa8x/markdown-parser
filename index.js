
module.exports = {
    
        _patterns: [
            {
                name: 'heading',
                regex: /<h(\d*).*?>([\s\S]*?)<\/h\d*>/gim,
                callback: function (matches) {
                    var count = parseInt(matches[1]);
                    var string = '';
                    for (var x = 0; x < count; x++) {
                        string += '#'
                    }
                    return string + ' $2\n';
                }
            },
            {
                name: 'p',
                //regex: /<p>([\s\S]*?)<\/p>/gim,
                regex: /<p.*?>(.*?)<\/p>/gmi,
                callback: function () {
                    return '\n$1\n';
                }
    
            },
    
    
            {
                name: 'ul',
                regex: /<ul.*?>([\s\S]*?)<\/ul>/gim,
                callback: function (matches) {
                    var html = matches[1];
                    var regex = /<li>([\s\S]*?)<\/li>/gim;
                    var m = [];
                    while (m = regex.exec(html)) {
                        if (m) {
                            html = html.replace(regex, '* $1\n');
                        }
                    }
                    return html;
    
                }
            },
            {
                name: 'ol',
                regex: /<ol.*?>([\s\S]*?)<\/ol>/gim,
                callback: function (matches) {
                    var html = matches[1];
                    var regex = /<li>([\s\S]*?)<\/li>/gim;
                    var m = [];
                    while (m = regex.exec(html)) {
                        if (m) {
                            html = html.replace(regex, '1. $1\n');
                        }
                    }
                    return html;
                }
            },

             {
                name: 'code',
                regex: /<code.*?>([\s\S]*?)<\/code>/gim,
                callback: function () {
                    return '```$1```';
                }
            },
    
            {
                name: 'pre',
                regex: /<pre.*?>([\s\S]*?)<\/pre>/gim,
                callback: function () {
                    return '\n```$1```\n';
                }
            },
    
           
    
            {
                name: 'blockquote',
                regex: /<blockquote>([\s\S]*?)<\/blockquote>/gim,
                callback: function () {
                    return '\n> $1\n';
                }
            },
    
            {
                name: 'bold',
                regex: /<(?:b|strong)>([\s\S]*?)<\/\w*>/gim,
                callback: function () {
                    return '**$1**';
                }
            },
    
            {
                name: 'italic',
                regex: /<(?:i|em)>([\s\S]*?)<\/\w*>/gim,
                callback: function () {
                    return '*$1*';
                }
            },
            {
                name: 'del',
                regex: /<del.*?>([\s\S]*?)<\/\w*>/gim,
                callback: function () {
                    return '~~$1~~';
                }
            },
    
            {
                name: 'br',
                regex: /<br.*?>/gim,
                callback: function () {
                    return '\n';
                }
            },
            {
                name: 'hr',
                regex: /<hr.*?>/gim,
                callback: function () {
                    return '\n* * *\n';
                }
            },
    
            {
                name: 'div',
                regex: /<div.*?>(.*?)<\/div>/gim,
                callback: function () {
                    return '$1\n';
                }
            },
            {
                name: 'a',
                regex: /<a.*? href="([^"]+)".*?>([^<]+)<\/a>/gim,
                callback: function () {
                    return '[$2]($1 "$2")';
                }
    
            },
            {
                name: 'image',
                regex: /<img.*?src\s*=\s*['\"]([^'\"]*?)['\"][^>]*?>/gim,
                callback: function () {
                    return '![]($1)';
                }
            },
    
            {
                name: 'script',
                regex: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                callback: function () {
                    return '';
                }
            },
    
            {
                name: 'html',
                regex: /<(?:.)*?>/gm,
                callback: function () {
                    return '';
                }
            },
    
    
        ],
        parse: function (html, regexs) {
    
            if (html && html.length > 0) {
                html = html.replace(/(<(code|pre|script|style|textarea)[^]+?<\/\2)|(^|>)\s+|\s+(?=<|$)/g, "$1$3");
    
                if (regexs) {
                    regexs = Array.isArray(regexs) ? regexs : [regexs];
                    this._patterns.concat(regexs);
                }
                this._patterns.forEach(function (p) {
                    var matches = [];
                    while (matches = p.regex.exec(html)) {
                        // console.log(matches);
                        if (matches) {
                            var txt = '$1';
                            if (p.callback && typeof (p.callback) === 'function') {
                                txt = p.callback(matches);
                            }
    
                            html = html.replace(p.regex, txt).trim();
                        }
                    }
                });
            }
            return html;
        }
    }