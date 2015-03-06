define(['libs/etch', 'css!styles/etch_extension/EtchOverrides.css','lang'],
function(etch,css,lang) {
    'use strict';
    _.extend(etch.config.buttonClasses, {
        default: [
            '<group>', 'bold', 'italic', '</group>',
            '<group>', 'unordered-list', 'ordered-list', '</group>',
            '<group>', 'justify-left', 'justify-center', '</group>',
            '<group>', 'link', '</group>',
            'font-family', 'font-size',
            '<group>', 'color', '</group>',
            '<group>', 'clear-formatting', '</group>']
        });

    var noText = [
        'link',
        'clear-formatting',
        'ordered-list',
        'unordered-list'
    ];

    etch.buttonElFactory = function(button) {
        var viewData = {
            button: button,
            title: lang[button]||button.replace('-', ' '),
            display: button.substring(0, 1).toUpperCase()
        };

        if (noText.indexOf(button) > -1)
            viewData.display = ''

        switch (button) {
            case 'font-size':
                viewData.title = viewData.title == 'font'?'Choose the font size':viewData.title;
                return JST['strut.etch_extension/fontSizeSelection'](viewData);
            case 'font-family':
                viewData.title = viewData.title == 'font'?'Choose the font family':viewData.title;
                return JST['strut.etch_extension/fontFamilySelection'](viewData);
            case 'color':
                viewData.title = viewData.title == 'color'?'Choose Color':viewData.title;
                return JST['strut.etch_extension/colorChooser'](viewData);
            default:
                if (button.indexOf('justify') !== -1) {
                    viewData.icon = button.substring(button.indexOf('-')+1, button.length);
                    return JST['strut.etch_extension/align'](viewData);
                } else {
                    return JST['strut.etch_extension/defaultButton'](viewData);
                }
        }
    };

    etch.groupElFactory = function() {
        return $('<div class="btn-group">')
    };

    return {
        initialize: function() {
        }
    }
});