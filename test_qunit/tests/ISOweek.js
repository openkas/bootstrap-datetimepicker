$(function () {

  // Container elements
  var datepickerElement;
  var datepickerInput;
  var datepickerWidget
  var datepickerInstance;

  // Reference resources
  var datepickerHTML = $('#widgetHTML').html();
  var container = $('#container');

  //Sample ISO week dates based on wikipedia
  //http://en.wikipedia.org/wiki/ISO_week_date#Examples
  var dates = [
    ['2004-W53-6 12:00:00', '2005', 'Jan', '1', '12', '00', '00'],
    ['2004-W53-7 12:00:00','2005','Jan','2','12','00','00'],
    ['2005-W52-6 12:00:00','2005','Dec','31','12','00','00'],
    ['2007-W01-1 12:00:00','2007','Jan','1','12','00','00'],
    ['2007-W52-7 12:00:00','2007','Dec','30','12','00','00'],
    ['2008-W01-1 12:00:00','2007','Dec','31','12','00','00'],
    ['2008-W01-2 12:00:00','2008','Jan','1','12','00','00'],
    ['2008-W52-7 12:00:00','2008','Dec','28','12','00','00'],
    ['2009-W01-1 12:00:00','2008','Dec','29','12','00','00'],
    ['2009-W01-2 12:00:00','2008','Dec','30','12','00','00'],
    ['2009-W01-3 12:00:00','2008','Dec','31','12','00','00'],
    ['2009-W01-4 12:00:00','2009','Jan','1','12','00','00'],
    ['2009-W53-4 12:00:00','2009','Dec','31','12','00','00'],
    ['2009-W53-5 12:00:00','2010','Jan','1','12','00','00'],
    ['2009-W53-6 12:00:00','2010','Jan','2','12','00','00'],
    ['2009-W53-7 12:00:00','2010','Jan','3','12','00','00']
  ];

  function setupWidget(config) {
    // Get elements
    datepickerElement = $(datepickerHTML).appendTo(container);
    datepickerInput = datepickerElement.find('input');

    // Setups
    datepickerInput.data('format', 'YYYY-Www-d hh:mm:ss');

    // Attach the datetimepicker
    datepickerElement.datetimepicker({
      language: 'pt-BR',
      weekNumbers: true,
      weekStart: 1,
      collapse: false
    });

    // Datepicker widget
    datepickerInstance = datepickerElement.data('datetimepicker');
    datepickerWidget = datepickerInstance.widget.eq(0);
  }

  // Default teardown

  function defaultTeardown() {
    datepickerInstance.destroy();
    container.empty();
  }

  module('ISO week format manual input',{
    setup : function(){

      setupWidget({
        format : 'YYYY-Www-d hh:mm:ss',
        params : {
          language: 'pt-BR', 
          weekNumbers : true,
          weekStart : 1,
          collapse: false
        }
      });

    },
    teardown : function(){
      defaultTeardown();
    }
  });

  $.each(dates,function(index,value){
    test('Parsing ' + value[0],function(){
      datepickerInput.val(value[0]);
      datepickerInput.trigger('change');

      var widgetYear = datepickerWidget.find('.year.active').text();
      var widgetMonth = datepickerWidget.find('.month.active').text();
      var widgetDay = datepickerWidget.find('.day.active').text();
      var widgetHour = datepickerWidget.find('.timepicker-hour').text();
      var widgetMinute = datepickerWidget.find('.timepicker-minute').text();
      var widgetSecond = datepickerWidget.find('.timepicker-second').text();

      strictEqual(widgetYear,value[1],'Year should be equal to '+value[1]);
      strictEqual(widgetMonth,value[2],'Month should be equal to '+value[2]);
      strictEqual(widgetDay,value[3],'Day should be equal to '+value[3]);
      strictEqual(widgetHour,value[4],'Hour should be equal to '+value[4]);
      strictEqual(widgetMinute,value[5],'Minute should be equal to '+value[5]);
      strictEqual(widgetSecond,value[6],'Second should be equal to '+value[6]);
    });    
  });

  module('ISO week format datepicker input', {
    setup: function () {

      setupWidget({
        format: 'YYYY-Www-d hh:mm:ss',
        params: {
          language: 'pt-BR',
          weekNumbers: true,
          weekStart: 1,
          collapse: false
        }
      });

      // Since datepicker auto calculates dates relative to current date
      // we can't determine how much we have to press the arrows to reach
      // the dates in the sample set. Instead, we trigger a manual parse
      // near the sample dates, so that the picker's year picker is near
      // our sample dates. 
      datepickerInput.val('2000-W1-1 00:00:00');
      datepickerInput.trigger('change');

      // Then start at the year picker
      datepickerWidget.find('.datepicker-days .switch').trigger('click');
      datepickerWidget.find('.datepicker-months .switch').trigger('click');

    },
    teardown: function () {
      defaultTeardown();
    }
  });

  $.each(dates, function (index, value) {

    var year = value[1];
    var month = value[2];
    var day = value[3];
    var hour = value[4];
    var minute = value[5];
    var second = value[6];

    test('Parsing ' + month + ' ' + day + ', ' + year + ' ' + hour + ':' + minute + ':' + second,
      function () {

        datepickerWidget.find('.datepicker-years .year').filter(function () {
          return $(this).text() === year
        }).trigger('click');
        datepickerWidget.find('.datepicker-months .month').filter(function () {
          return $(this).text() === month
        }).trigger('click');
        datepickerWidget.find('.datepicker-days .day:not(.old):not(.new)').filter(function () {
          return $(this).text() === day
        }).trigger('click');
        datepickerWidget.find('.timepicker-hours .hour').filter(function () {
          return $(this).text() === hour
        }).trigger('click');
        datepickerWidget.find('.timepicker-minutes .minute').filter(function () {
          return $(this).text() === minute
        }).trigger('click');
        datepickerWidget.find('.timepicker-seconds .second').filter(function () {
          return $(this).text() === second
        }).trigger('click');

        strictEqual(datepickerInput.val(), value[0], 'Value should be ' + value[0]);

      });
  });

});