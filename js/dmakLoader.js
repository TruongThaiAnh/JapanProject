;(function () {

	"use strict";

	// Create a safe reference to the DrawMeAKanji object for use below.
	var DmakLoader = function (uri) {
		this.uri = uri;
	};

	/**
	 * Gather SVG data information for a given set of characters.
	 */
	DmakLoader.prototype.load = function (text, callback) {
		var paths = [],
			nbChar = text.length,
			done = 0,
			i,
			callbacks = {
				done: function (index, data) {
					paths[index] = data;
					done++;
					if (done === nbChar) {
						callback(paths);
					}
				},
				error: function (index, msg) {
					// On error, mark this char as empty and continue
					console.warn("DmakLoader: could not load SVG for char index " + index + ":", msg);
					paths[index] = [];
					done++;
					if (done === nbChar) {
						callback(paths);
					}
				}
			};

		for (i = 0; i < nbChar; i++) {
			loadSvg(this.uri, i, text.charCodeAt(i).toString(16), callbacks);
		}
	};

	/**
	 * Try to load a SVG file matching the given char code.
	 */
	function loadSvg(uri, index, charCode, callbacks) {
		var xhr = new XMLHttpRequest(),
			code = ("00000" + charCode).slice(-5);

		// Skip space character and ideographic space
		if (code === "00020" || code === "03000") {
			callbacks.done(index, []);
			return;
		}

		xhr.open("GET", uri + code + ".svg", true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					try {
						var result = parseResponse(xhr.response, code);
						callbacks.done(index, result);
					} catch (e) {
						console.error("DmakLoader: parseResponse error for code " + code + ":", e);
						callbacks.error(index, e.message);
					}
				} else {
					callbacks.error(index, "HTTP " + xhr.status + " for " + code + ".svg");
				}
			}
		};
		xhr.send();
	}

	/**
	 * Parse SVG response and extract stroke paths and text positions.
	 */
	function parseResponse(response, code) {
		var data = [],
			groups = [],
			i;

		// Parse as HTML instead of XML to avoid namespace/getElementById issues.
		// XML parsing in browsers doesn't process DTD ATTLIST declarations,
		// so getElementById() fails for IDs like "kvg:065e5".
		var tempDiv = document.createElement("div");
		tempDiv.innerHTML = response;

		// Find root stroke group by ID
		var rootEl = null;
		var allGs = tempDiv.querySelectorAll("g");
		for (i = 0; i < allGs.length; i++) {
			if (allGs[i].getAttribute("id") === "kvg:" + code) {
				rootEl = allGs[i];
				break;
			}
		}

		if (!rootEl) {
			console.warn("DmakLoader: no element found for id 'kvg:" + code + "'");
			return data;
		}

		// Get all text elements for stroke order numbers
		var texts = tempDiv.querySelectorAll("text");

		// Recursive function to extract path data
		function __parse(element) {
			if (!element) return;
			var children = element.childNodes, j;

			for (j = 0; j < children.length; j++) {
				var child = children[j];
				if (child.nodeType !== 1) continue; // Skip text nodes
				var tag = child.tagName.toLowerCase();
				if (tag === "g") {
					groups.push(child.getAttribute("id"));
					__parse(child);
					groups.splice(groups.indexOf(child.getAttribute("id")), 1);
				} else if (tag === "path") {
					data.push({
						"path": child.getAttribute("d"),
						"groups": groups.slice(0)
					});
				}
			}
		}

		__parse(rootEl);

		// Add stroke order text positions
		for (i = 0; i < texts.length; i++) {
			if (data[i]) {
				var transform = texts[i].getAttribute("transform");
				if (transform) {
					var parts = transform.split(" ");
					data[i].text = {
						"value": texts[i].textContent,
						"x": parts[4] || "0",
						"y": (parts[5] || "0)").replace(")", "")
					};
				}
			}
		}

		return data;
	}

	window.DmakLoader = DmakLoader;
}());