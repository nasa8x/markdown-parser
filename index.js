
module.exports = {

    _patterns: [

        {
            name: 'blockquote',
            regex: /<blockquote.*?>([\s\S]*?)<\/blockquote>/gim,
            callback: function (matches) {
                return '> ' + this.trim(matches[1]);
            }
        },

        {

            name: 'pre-code',
            regex: /<pre.*?>.*?<code.*?>([\s\S]*?)<\/code>.*?<\/pre>/gim,
            callback: function (matches) {
                return '```\n' + this.escape(matches[1]) + '\n```';
                //return '\n```\n$1\n```\n';
            }
        },

        {
            name: 'code',
            regex: /<code.*?>([\s\S]*?)<\/code>/gim,
            callback: function (matches) {
                return '```' + this.escape(matches[1]) + '```';
            }
        },

        {
            name: 'pre',
            regex: /<pre.*?>([\s\S]*?)<\/pre>/gim,
            callback: function (matches) {
                return '\n```\n' + this.escape(matches[1]) + '\n```\n';
            }
        },

        {
            name: 'heading',
            regex: /<h(\d*).*?>(.*?)<\/h\d*>/im,
            callback: function (matches) {
                var count = parseInt(matches[1]);
                var string = '';
                for (var x = 0; x < count; x++) {
                    string += '#'
                }
                return string + ' ' + this.trim(matches[2]) + '\n';
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
            regex: /<ul.*?>([\s\S]*?)<\/ul>/im,
            callback: function (matches) {
                var html = matches[1];
                var regex = /<li>([\s\S]*?)<\/li>/i;
                var m = [];
                while (m = regex.exec(html)) {
                    if (m) {
                        html = this.trim(html.replace(regex, '* $1{x}'));
                    }
                }
                return html.replace(/{x}/g, '\n');;

            }
        },
        {
            name: 'ol',
            regex: /<ol.*?>([\s\S]*?)<\/ol>/im,
            callback: function (matches) {
                var html = matches[1];
                var regex = /<li>([\s\S]*?)<\/li>/i;
                var m = [];
                while (m = regex.exec(html)) {
                    if (m) {
                        html = this.trim(html.replace(regex, '1. $1{x}'));
                    }
                }
                return html.replace(/{x}/g, '\n');
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
            name: 'style',
            regex: /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gim,
            callback: function () {
                return '';
            }
        },

        {
            name: 'script',
            regex: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gim,
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

    escape: function (html) {
        return html
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },

    decode: function (str) {

        return str.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&quot;/g, '"').replace(/&#(\d+);/g, function (match, dec) {
            return String.fromCharCode(dec);
        });

    },
    trim: function (str) {
        return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
    },
    parse: function (html, regexs) {
        var _t = this;
        if (html && html.length > 0) {

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
                            txt = p.callback.call(_t, matches);
                        }

                        html = html.replace(p.regex, txt);
                    }
                }
            });
        }
        return this.decode(html);
    }
}