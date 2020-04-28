Date.prototype.diff = function (until) {
	var _day_ms = 86400000;
	var _from_ms = this.getTime();
	var _until_ms = until.getTime();
	var _ms_diff = _until_ms - _from_ms;
	return Math.round(_ms_diff / _day_ms);
}

Date.prototype.isFuture = function (until) {
	return until.getTime() - this.getTime() > 0;
}

Date.prototype.getMonthNr = function () {
	return this.getMonth() + 1
}

Date.prototype.getWeekNr = function () {
	var date = new Date(this)
	date.setHours(0, 0, 0, 0);
	date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
	var week1 = new Date(date.getFullYear(), 0, 4);
	return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 -
		3 + (week1.getDay() + 6) % 7) / 7);
}

Date.prototype.getWeekDay = function () {
	var weekdays = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
	return weekdays[this.getDay()];
}

Date.getMonthDaysLeft = function (date) {
	var _year = date.getFullYear()
	var _month = date.getMonth()
	var _endOfMonth = new Date();
	_endOfMonth.setFullYear(_year, _month + 1, 0)
	return _endOfMonth.getDate() - date.getDate() + 1
}

Date.daysArray = function (date) {
	var year = date.getFullYear()
	var month = date.getMonth()
	var day = date.getDate()
	var _days = []
	var _targetDate = new Date();
	_targetDate.setFullYear(year, month + 1, 0)
	var _actualDate = new Date();
	_actualDate.setFullYear(year, month, day)
	var d = 0
	while (_targetDate >= _actualDate) {
		_days[d] = new Date();
		_days[d].setFullYear(_actualDate.getFullYear(), _actualDate.getMonth(), _actualDate.getDate())
		d = d + 1
		_actualDate.setDate(_actualDate.getDate() + 1)
	}
	return _days
}
