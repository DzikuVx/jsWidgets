var jsWidgets = jsWidgets || {};

jsWidgets.columns = (function () {

	var self = {};
	var currentTop  = new Array();

	self.setTop = function (column, value) {
		currentTop[column] = value;
	};
	
	self.getTop = function (column) {
		if (!currentTop[column]) {
			return 0;
		}else {
			return currentTop[column];
		}
	};
	
	return self;
})();

jsWidgets.widgets = (function() {

	var self = {};
	
	var columnCount = 3;
	var columnWidth = 320;
	var marginTop = 20;
	var marginLeft = 20;
	
	countWidgetsToprocess = function() {
		return $('.to-process').size();
	};
	
	getColumnNumber = function(widgetNumber) {
		return widgetNumber % columnCount;
	};
	
	getWidgetLeft = function(column) {
		return (column * columnWidth) + marginLeft;
	};
	
	getWidgetToProcess = function(row, column) {
		return $('.to-process').first();
	};
	
	process = function(widget, currentNumber) {
		
		var column = getColumnNumber(currentNumber);
		
		var height = parseInt(widget.attr('data-height'), 10);
		
		var top = jsWidgets.columns.getTop(column);
		
		top += marginTop;
		
		widget.css('top', top);
		widget.css('height', height);

		top += height;
		
		jsWidgets.columns.setTop(column, top);
		
		widget.css('left', getWidgetLeft(column));
		widget.find('.widget-number span').html(currentNumber + 1);
		widget.find('.widget-height span').html(height);
		widget.removeClass('to-process');
		widget.show();
	};
	
	self.render = function () {
		console.log('begin');
		
		var widgetsToProcess = countWidgetsToprocess();
		var watchdogThreshold = widgetsToProcess * 4;
		var watchdog = 0;
		var widget = null;

		var currentNumber = 0;
		
		while (widgetsToProcess > 0 && watchdog < watchdogThreshold) {
			watchdog++;
			
			widget = getWidgetToProcess();

			process(widget, currentNumber);
			
			currentNumber++;
			
		}

		console.log('done');
		
	};
	
    return self;
    
})();

jsWidgets.widgets.render();