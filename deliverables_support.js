var normalizeTimer = function (data) {
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

var extractData = function (ucs, deliverables) {
	let ucsDict = {};
	for (i = 0; i < ucs.length; i++) {
		ucsDict[ucs[i].uc] = ucs[i]
	}
	var _data = []
	for (i = 0; i < deliverables.length; i++) {
		var _dueDate = new Date(deliverables[i].dueDate)
		var _dueDateString = sprintf('%04d/%02d/%02d %02d:%02d (w%s, %s)', _dueDate.getFullYear(), _dueDate
			.getMonthNr(),
			_dueDate.getDate(), _dueDate.getHours(), _dueDate.getMinutes(), _dueDate.getWeekNr(), _dueDate
			.getWeekDay())
		var _deltaDays = new Date().diff(_dueDate)
		if (_deltaDays >= 0)
			_data.push({
				uc: deliverables[i].uc,
				uc_link: ucsDict[deliverables[i].uc].link,
				deliverable: "deliverable" in deliverables[i] ? deliverables[i].deliverable : "goback.html",
				link: deliverables[i].link,
				type: deliverables[i].type,
				days: _deltaDays,
				timer: _deltaDays,
				dueDate: _dueDateString
			})
	}
	normalizeTimer(_data)
	return _data
}
