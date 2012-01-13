var fs = require('fs'),
    util = require('util'),
    undefined;

String.prototype.escapeHTML = function () {
    return this.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

util.puts([
"<!DOCTYPE html>",
"<html lang='en'><head><meta http-equiv='content-type' content='text/html; charset=UTF-8' /></head><body>",
"<div id='search'><input type='search' placeholder='Search' autosave='searchdoc' results='10' id='search-field' autocomplete='off' /></div>",
"<ul id='static-list'>"
].join("\n"));

var categories = [
    'Global Objects',
    'Functions and function scope',
    'Statements',
    'Operators',
    'Misc'
];
var dat = JSON.parse(fs.readFileSync('htdocs/index.json'));
var categoryItems = {};
dat.forEach(function (x) {
    if (!categoryItems[x.category]) {
        categoryItems[x.category] = [];
    }
    categoryItems[x.category].push(x);
});
categories.forEach(function (category) {
    var ret = [];
    ret.push('<li class="category"><span>' + category + '</span><ul>');
    categoryItems[category].forEach(function (line) {
        var html = '<li class="sub ' + (line.deprecated || line.obsolete ? 'deprecated' : '' ) + '"><a href="' + line.url + '"><div><span class="searchable">' + line.title + '</span>';
        if (line.esversion) {
            html += '<span class="tag es es' +  line.esversion.escapeHTML() + '">ES' + line.esversion.escapeHTML() + '</span>';
        }
        if (line.nonstandard) {
            html += '<span class="tag nonstandard">NS</span>';
        }
        if (line.deprecated) {
            html += '<span class="tag deprecated">Deprecated</span>';
        }
        if (line.obsolete) {
            html += '<span class="tag obsolete">Obsolete</span>';
        }
        html += '</div></a></li>';
        ret.push(html);
    });
    ret.push('</ul></li>');
    util.puts(ret.join("\n"));
});

util.puts([
"</ul></body></html>",
].join("\n"));
