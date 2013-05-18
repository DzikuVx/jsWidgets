var jsWidgets = jsWidgets || {};

jsWidgets.columns = (function () {

	var self = {};
	var currentTop  = new Array();

	/**
	 * Total height of widget container
	 */
	var containerHeight = 0;
	
	self.getContainerHeight = function() {
		return containerHeight - jsWidgets.widgets.getOffsetTop() + 20;
	};
	
	self.setTop = function (column, value) {
		currentTop[column] = value;
		
		if (value > containerHeight) {
			containerHeight = value;
		}
		
	};
	
	self.getTop = function (column) {
		if (!currentTop[column]) {
			return jsWidgets.widgets.getOffsetTop();
		}else {
			return currentTop[column];
		}
	};
	
	self.reset = function () {
		currentTop  = new Array();
		containerHeight = 0;
	};
	
	return self;
})();

jsWidgets.widgets = (function() {

	var self = {};
	
	var columnCount = 3;
	var columnWidth = 320;
	var marginTop = 20;
	var marginLeft = 20;
	var rowHeight = 320;
	
	countWidgetsToprocess = function() {
		return $('.to-process').size();
	};
	
	getColumnNumber = function(widgetNumber) {
		return widgetNumber % columnCount;
	};
	
	getWidgetLeft = function(column) {
		return (column * columnWidth) + marginLeft + jsWidgets.widgets.getOffsetLeft();
	};
	
	getWidgetToProcess = function(currentNumber) {
		
		var widget;
		var column = getColumnNumber(currentNumber) + 1; 
		var row = getRow(jsWidgets.columns.getTop(column)) + 1; 
		
		widget = $('.to-process[data-row=' + row + ']').first();
		
		if (widget.length > 0) {
			return widget;
		}
		
		widget = $('.to-process:not([data-row])').first();
		
		return widget;
	};

	setContainerHeight = function(value) {
		$('#widget-container').css('height', value);
	};
	
	getRow = function(bottom) {
		return Math.floor(bottom / rowHeight);
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
		widget.find('.widget-row span').html(getRow(top));
		widget.removeClass('to-process');
		widget.show();
	};
	
	getColumnCount = function() {
		columnCount = Math.floor($('#widget-container').width() / columnWidth);
	};
	
	self.getOffsetLeft = function() {
		return $('#widget-container').offset().left;
	};
	
	self.getOffsetTop = function() {
		return $('#widget-container').offset().top;
	};
	
	self.render = function () {
		console.log('begin');
		
		var start = new Date().getTime();
		
		getColumnCount();
		
		var widgetsToProcess = countWidgetsToprocess();
		var watchdogThreshold = widgetsToProcess * 4;
		var watchdog = 0;
		var widget = null;
		var currentNumber = 0;

		console.log('Widgets to position: ' + widgetsToProcess);
		
		while (widgetsToProcess > 0 && watchdog < watchdogThreshold) {
			watchdog++;
			
			widget = getWidgetToProcess(currentNumber);

			process(widget, currentNumber);
			
			widgetsToProcess--;
			
			currentNumber++;
			
		}

		setContainerHeight(jsWidgets.columns.getContainerHeight());
		
		var elapsed = new Date().getTime() - start;
		
		console.log('Widgets positioned in: ' + elapsed + 'ms');
		console.log('done');
		
	};
	
	self.reset = function() {
		
		$('.widget').addClass('to-process');
		
		jsWidgets.columns.reset();
		
		self.render();
		
	};
	
    return self;
    
})();

jsWidgets.widgets.render();

$(window).resize(function() {
	jsWidgets.widgets.reset();
});