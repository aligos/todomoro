var chart;
/*
 * Function to draw the column chart
 */
function builtColumn(chartData) {

  chart = $('#container-column').highcharts({

    chart: {
      type: 'column'
    },

    title: {
      text: 'Monthly Todos'
    },

    credits: {
      enabled: false
    },

    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ]
    },

    yAxis: {
      min: 0,
      title: {
        text: 'Todos'
      }
    },

    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:f}</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
    },

    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },

    series: chartData

  });
}

/*
 * Call the function to built the chart when the template is rendered
 */
Template.chart.onRendered(function() {
  Tracker.autorun(function() {
    var data = Todos.find().fetch();

    // if there is no data, abort!
    if (!data || data === []) return;

    // Group data by listId
    data = _.groupBy(data, function(todo) {
      return todo.listId
    });

    // Array that contains the data for the chart
    var chartData = [];
    // Iterate over each list
    _.each(data, function(list) {
      // Create an object which contains the name and data for the list
      var listData = {};
      // Get the name/id of the list
      // This can be changed to use an actual name

      //listData.name = Lists.findOne(list[0].listId).name; //this is work too
      var listSource = Lists.findOne(list[0].listId)
      if (listSource) {
        listData.name = listSource.name;
      } else {
        listData.name = "unknown list"
      }

      // Count the numbers of todos per month
      listData.data = _.pluck(list, 'bulan');
      listData.data = _.countBy(listData.data, function(bulan) {
        return bulan
      });
      // Add default values to all of the month - just in case there is no todo
      // so that the chart is still able to display everything correctly
      listData.data = _.defaults(listData.data, {
        Jan: 0,
        Feb: 0,
        Mar: 0,
        Apr: 0,
        May: 0,
        Jun: 0,
        Jul: 0,
        Aug: 0,
        Sep: 0,
        Oct: 0,
        Nov: 0,
        Dec: 0
      });
      listData.data = _.toArray(listData.data);
      chartData.push(listData);
    });

    // if there is no chart, built it
    if (!chart) {
      builtColumn(chartData);
      return;
    }

    // Otherwise, simply update the data if there is chartData
    if (chartData.length !== 0) {
      chart.highcharts().series[0].update({
        data: chartData
      });
    }
  });
});

Template.chart.events({
	'click .render-chart': function() {
		document.location.reload(true);
	}
});