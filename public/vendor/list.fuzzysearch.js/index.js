var classes = require('classes'),
    events = require('events'),
    extend = require('extend'),
    toString = require('to-string'),
    getByClass = require('get-by-class');

module.exports = function(options) {
    options = options || {};

    extend(options, {
        location: 0,
        distance: 100,
        threshold: 0.4,
        multiSearch: true,
        searchClass: 'fuzzy-search'
    });

    var fuzzy = require('./src/fuzzy'),
        list;

    var fuzzySearch = {
        search: function(searchString, columns) {
            // Substract arguments from the searchString or put searchString as only argument
            var searchArguments = options.multiSearch ? searchString.replace(/ +$/, '').split(/ +/) : [searchString];

            for (var k = 0, kl = list.items.length; k < kl; k++) {
                fuzzySearch.item(list.items[k], columns, searchArguments);
            }
        },
        item: function(item, columns, searchArguments) {
            var found = true;
            for(var i = 0; i < searchArguments.length; i++) {
                var foundArgument = false;
                for (var j = 0, jl = columns.length; j < jl; j++) {
                    if (fuzzySearch.values(item.values(), columns[j], searchArguments[i])) {
                        foundArgument = true;
                    }
                }
                if(!foundArgument) {
                    found = false;
                }
            }
            item.found = found;
        },
        values: function(values, value, searchArgument) {
            if (values.hasOwnProperty(value)) {
                var text = toString(values[value]).toLowerCase();

                if (fuzzy(text, searchArgument, options)) {
                    return true;
                }
            }
            return false;
        }
    };

    return {
        init: function(parentList) {
            list = parentList;

            events.bind(getByClass(list.listContainer, options.searchClass), 'keyup', function(e) {
                var target = e.target || e.srcElement; // IE have srcElement
                list.search(target.value, fuzzySearch.search);
            });

            return;
        },
        search: function(str, columns) {
            list.search(str, columns, fuzzySearch.search);
        },
        name: options.name || "fuzzySearch"
    };
};
