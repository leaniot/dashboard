Dashboard for LeanIOT
===

### Brief Introduction

### Deployment

### Front End Data Model

##### 1. Temporal Data (for Line Chart)

A `standard temporal data model` in json format:
```json
{
	"valueBound": ["upperbound", "lowerbound"],
	"data": [ {}, {}, ... ],
	"temporalKeys": [ "Key_t1", "Key_t2", ... ],
	"detailKeys": [ "Key_d1", "Key_d2", ... ],
	"timestamps": [ "t1", "t2", ... ]
}
```

A json data subject to the `standard temporal data model` could be easily visualized by invoking all of the methods of object `lineChart` in `client/js/line-chart.js`. For the time being, `lineChart` supports:

- liveLine: A non-interactive line chart refresh the figure in a fixed interval time. Its datasource (determined by `apiParam` and `apiUrl`) is going to provide a real-time data in chronological order (which means the response of every query would return the latest data).

![demo_live_line_chart](https://github.com/leaniot/dashboard/blob/master/doc/demo_live_line_chart.gif)