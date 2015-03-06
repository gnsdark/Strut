define(['css!styles/strut.themes/surfaceClasses.css','lang'], function(css,lang) {
	return {
		title: 'surface',
		subtitle_all:lang.all_slides||'All Slides',
		subtitle_select:lang.select_slides||'Selected Slide',
		backgrounds: [
			{klass: 'bg-surf-grad-black'},
			{klass: 'bg-surf-grad-light'},
			{klass: 'bg-surf-grad-smoke'},
			{klass: 'bg-surf-grad-orange'},
			{klass: 'bg-surf-grad-yellow'},
			{klass: 'bg-surf-grad-grass'},
			{klass: 'bg-surf-grad-darkgreen'},
			{klass: 'bg-surf-grad-sky'},
			{klass: 'bg-surf-grad-lavender'},
			{klass: 'bg-surf-grad-purple'},
			{klass: 'bg-surf-grad-salmon'},
		]
	}
});