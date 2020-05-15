function normalizeTimer(data) {
	var _maxTimer = 0
	for (i = 0; i < data.length; i++) {
		if (data[i].timer > _maxTimer) {
			_maxTimer = data[i].timer
		}
	}
	for (i = 0; i < data.length; i++) {
		data[i].timer = data[i].timer / _maxTimer * 100
	}
	return data
}

function extractData(ucs, deliverables) {
	let ucsDict = {};
	for (i = 0; i < ucs.length; i++) {
		ucsDict[ucs[i].uc] = ucs[i]
	}
	var _data = []
	for (i = 0; i < deliverables.length; i++) {
		if (deliverables[i].target !== "deliverables") continue;
		var _dueDate = new Date(deliverables[i].dueDate)
		var _dueDateString = sprintf('%04d/%02d/%02d %02d:%02d (w%s, %s)', _dueDate.getFullYear(), _dueDate
		.getMonthNr(),
		_dueDate.getDate(), _dueDate.getHours(), _dueDate.getMinutes(), _dueDate.getWeekNr(), _dueDate
		.getWeekDay())
		var _deltaDays = new Date().diff(_dueDate);
		var isFuture = new Date().isFuture(_dueDate);
		if (isFuture) {
			_data.push({
				uc: deliverables[i].uc,
				uc_link: "link" in ucsDict[deliverables[i].uc] ? ucsDict[deliverables[i].uc].link : "#",
				deliverable: deliverables[i].deliverable,
				link: "link" in deliverables[i] ? deliverables[i].link : "goback.html",
				type: deliverables[i].type,
				days: _deltaDays,
				timer: _deltaDays,
				dueDate: _dueDateString
			})
		}
	}
	normalizeTimer(_data)
	return _data
}

function extractLinks(data) {
	let _data = []
	for (i = 0; i < data.length; i++) {
		if (data[i].target !== "links") continue;
		_data.push({
			link: data[i].link,
			text: data[i].description
		})
	}
	return _data
}

function dataReader(url, map) {
	return $.getJSON(url).then(jsonData => { // check if data is good then pass it on
		if (! jsonData.hasOwnProperty("feed") || ! jsonData.feed.hasOwnProperty("entry")) {
			document.getElementById("dropInvalidFileMsgHere").innerHTML = "Found invalid data format.";
			return;
		}
		map["srcData"] = jsonData;
		return map;
	}).then(map => { // check title and set column names
		with (title = map.srcData.feed.title.$t) {
			map["title"] = title;
			for (row of map.db) {
				if (row.tag !== title) continue;
				map["cols"] = getColumnsLabels(map.srcData.feed.entry, row.loi);
				return map;
		}	}
	}).then(map => { // match data to columns
		with (columns = map.cols, json = {}, values = [], currentRow = "", counter = 0, entry = {}) {
			for (entry of map.srcData.feed.entry) {
				with (entryCell = entry.gs$cell) {
					if (entryCell.row == "1") continue;
					if (currentRow !== entryCell.row) {
						if (!$.isEmptyObject(json)) values.push(json);
						json = {};
						currentRow = entryCell.row;
					}
					json[map.cols[entryCell.col]] = entryCell.$t;
				}
			}
			values.push(json);
			return { rel: map.title, values: values };
}	});	}
