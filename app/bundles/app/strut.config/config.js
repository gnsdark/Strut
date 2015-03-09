define(function () {
	var config = {
		slide: {
			size: {
				width: 720,
				height: 1280
			},
			overviewSize: {
				width: 72,
				height: 128
			}
		}
	};

	var temp = localStorage.getItem("910_Editor_sessionMeta");
	try {
		var sessionMeta = JSON.parse(temp);
	} catch (e) {
	}

	var sessionMeta = sessionMeta || {
		generator_index: 0
	};

	window.config = config;
	window.sessionMeta = sessionMeta;

	return config;
});