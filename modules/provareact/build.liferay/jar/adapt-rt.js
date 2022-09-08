Liferay.Loader.define("provareact@0.1.0/adapt-rt", ['module', 'exports', 'require'], function (module, exports, require) {
	var define = undefined;
	var global = window;
	{
		var PATH_CONTEXT = Liferay.ThemeDisplay.getPathContext();

		if (PATH_CONTEXT.indexOf("/") === 0) {
			PATH_CONTEXT = PATH_CONTEXT.substr(1);
		}
		if (PATH_CONTEXT !== "") {
			PATH_CONTEXT += "/";
		}

		function adaptStaticURL(url) {
			return PATH_CONTEXT + "o/provareact-0.1.0/" + url;
		}

		module.exports = {
			adaptStaticURL: adaptStaticURL
		};
	}
});