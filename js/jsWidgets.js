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
		var column = getColumnNumber(currentNumber); 
		var row = getRow(jsWidgets.columns.getTop(column)) + 1; 
		
		widget = $('#widget-container div.to-process[data-row=' + row + ']').first();
		
		if (widget.length > 0) {
			return widget;
		}
		
		widget = $('#widget-container div.to-process:not([data-row])').first();
		
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
		widget.find('div.widget-number span').html(currentNumber + 1);
		widget.find('div.widget-height span').html(height);
		widget.find('div.widget-row span').html(getRow(top));
		widget.removeClass('to-process');
		widget.show();
		
		return false;
	};
	
	self.computeColumnCount = function() {
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
		
		self.computeColumnCount();
		
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
		
		$('div.widget').addClass('to-process');
		
		jsWidgets.columns.reset();
		
		self.render();
		
	};

	self.getColumnCount = function() {
		return columnCount;
	};
	
    return self;
    
})();

jsWidgets.filter = (function () {

	var self = {};
	
	var opened = true;
	
	var filter = null;
	
	getFilter = function() {
		if (!filter) {
			filter = $('#filter-container');
		}
	};
	
	self.hide = function() {

		getFilter();
		
		filter.addClass('hidden');
		
		$('#widget-container').addClass('no-filter');
		
		jsWidgets.widgets.reset();
		opened = false;
	};
	
	self.show = function() {
		
		getFilter();
		
		filter.removeClass('hidden');
		
		$('#widget-container').removeClass('no-filter');
		
		jsWidgets.widgets.reset();
		opened = true;
	};
	
	self.toggle = function() {
		
		if (opened) {
			self.hide();
		}else {
			self.show();
		}
		
		return false;
	};
	
	return self;
})();

jsWidgets.filter.show();

var columns = jsWidgets.widgets.getColumnCount();

$(window).resize(function() {
	
	jsWidgets.widgets.computeColumnCount();
	if (jsWidgets.widgets.getColumnCount() != columns) {
		
		columns = jsWidgets.widgets.getColumnCount();
		
		jsWidgets.widgets.reset();
	}
	
	return false;
});