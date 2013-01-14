(function ($, _, Backbone, Rickshaw, moment, views, collections, ColorFactory, helpers){
  "use strict";

  views.widgets.Flotr2Graph = Backbone.View.extend({

    initialize: function(options) {
      _.bindAll(this, "render", "update", "renderGraph", "updateValues", "widgetChanged");

      this.updateCollection();

      this.model.on('change', this.widgetChanged);

      this.currentColors = [];
    },

    from: function() {
      return helpers.TimeSelector.getFrom(this.model.get('range'));
    },

    to: function() {
      return helpers.TimeSelector.getCurrent(this.model.get('range'));
    },

    updateCollection: function() {
      this.collection = new collections.Datapoint({
        targets: this.model.get('targets'),
        source: this.model.get('source'),
        from: this.from(),
        to: this.to()
      });
    },

    widgetChanged: function() {
      this.updateCollection();
      this.render();
    },

    linesType: function() {
      switch(this.model.get("graph_type")) {
        case "area":
          return true;
        case "stacked":
          return true;
        case "line":
          return false;
        default:
          return false;
      }
    },

    transformDatapoints: function() {
      var that = this;
      var series = this.collection.toJSON();
      series.hasData = true;
      _.each(series, function(model, index) {
        if (model.color === undefined) {
          var color = null;
          if (that.currentColors[index] === undefined) {
            color = ColorFactory.get();
            that.currentColors.push(color);
          } else {
            color = that.currentColors[index];
          }
          model.color = color;
        }
        model.lines = { fill: that.linesType(), lineWidth: 1 };
        model.label = model.target;
        model.data = _.map(model.datapoints, function(dp) {
          return [dp[1], dp[0]];
        });
        if (model.data.length === 0) {
          series.hasData = false;
        }
        delete model.datapoints;
        delete model.target;
      });

      return series;
    },

    render: function() {
      this.$el.html(JST['templates/widgets/graph/flotr2_show']({ time: this.model.get('time') }));
      this.$graph = this.$('.graph-container');
      return this;
    },

    renderGraph: function(datapoints) {
      var width = this.$graph.parent().width();
      this.$graph.width(width);
      this.$graph.height(300-20);

      function suffixFormatter(val, axis) {
        return helpers.suffixFormatter(val, axis.tickDecimals);
      }

      function timeUnit(range, size) {
        switch(range) {
        case "30-minutes":
        case "60-minutes":
        case "3-hours":
        case "12-hours":
        case "24-hours":
        case "today":
        case "yesterday":
          return { timeFormat: "%H:%M" };
        case "3-days":
          if (size === 1) {
            return { timeFormat: "%m-%d" };
          } else {
            return { timeFormat: "%m-%d %H:%M" };
          }
          break;
        case "7-days":
        case "this-week":
        case "previous-week":
        case "4-weeks":
        case "this-month":
        case "previous-month":
          return { timeFormat: "%m-%d" };
        case "this-year":
        case "previous-year":
          return { timeFormat: "%m-%y" };
        default:
          throw "unknown rangeString: " + range;
        }
      }

      var options = {
        shadowSize: 1,
        grid: {
          outline: "",
          verticalLines: false,
          horizontalLines: false,
          labelMargin: 10
        },
        xaxis: _.extend({
          mode: "time",
          timeMode: "local",
          timeUnit: 'second'
        }, timeUnit(this.model.get('range'), parseInt(this.model.get('size'), 10))),
        yaxis: {
          tickFormatter: suffixFormatter
        },
        legend: {
          show: this.model.get("display_legend") || false,
          labelBoxBorderColor: null,
          position: "ne"
        },
        mouse: {
          track: true,
          relative: true,
          sensibility: 5,
          lineColor: "#ccc",
          trackFormatter: function(obj) {
            var dateStr = window.moment.utc(new Date(obj.x*1000)).local().format("YYYY-MM-DD HH:mm");
            var date = '<span class="date">' + dateStr + '</span>';
            var swatch = '<span class="detail_swatch" style="background-color: ' + obj.series.color + '"></span>';
            var content = swatch + obj.series.label + ": " + parseInt(obj.y, 10) + '<br>' + date;
            return content;
          }
        }
      };

      this.graph = Flotr.draw(
        this.$graph[0],
        datapoints,
        options
      );
    },

    update: function(callback) {
      var that = this;
      var options = { suppressErrors: true };

      this.updateCollection();
      return $.when(this.collection.fetch(options)).done(this.updateValues);
    },

    updateValues: function() {
      var datapoints = this.transformDatapoints();
      this.renderGraph(datapoints);
    },

    onClose: function() {
      this.model.off('change', this.render);
    }

  });

})($, _, Backbone, Rickshaw, moment, app.views, app.collections, app.helpers.ColorFactory, app.helpers);