Develop Document for Dashboard of LeanIOT
===

Brief Introduction
---

It's a develop document of dashboard for LeanIOT. The dashboard provides essential features for allowing users to manage their configurations, devices, and monitor data, including user management, notification management, data visualization and so on. In this document, it mainly includes 3 parts: deployment, front end design and back end design. 

Deployment
---

Run the following script under the root directory to install all the dependencies that the service needs:
```shell
npm i -d
```
Then start the service by running the following script:
```shell
node .
```
You can reach your web service by visiting `localhost:3000/`.

Front End Design
---

### Templates

This project supports switching different templates without changing too much code. You need config your template path in the `server.js` under the `/server` and restart the service to activate the new template. In `server.js`, you can set your own template path as long as the template subject to the `standard front end data model`. 

```javascript
// Set static files paths
app.set('template', path.join(__dirname, '../client/material/template'));
app.set('js', path.join(__dirname, '../client/material/js'));
app.set('css', path.join(__dirname, '../client/material/css'));
app.set('sass', path.join(__dirname, '../client/material/sass'));
app.set('img', path.join(__dirname, '../client/material/img'));
```

### Front End Data Model

#### 1. Temporal Data (for Line Chart)

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

- liveLine: A non-interactive line chart refresh the figure in a fixed interval time. Its datasource (determined by `apiParam` and `apiUrl`) is supposed to provide a real-time data in chronological order (which means the response of every query would return the latest data).

![demo_live_line_chart](https://github.com/leaniot/dashboard/blob/master/doc/demo_live_line_chart.gif)

There is an example for detailed explanation. In our backend loopback service, it provides an API (param: `{ sensorId: sensorId }`, url: `"/sensorLatestTemporalView"`) for returning the latest sensor data in chronological order. 
```javascript
var sensorId = "{{ sensorId }}";

lineChart.liveLine(
	{ sensorId: sensorId },
	"/sensorLatestTemporalView",
	"latestTemporalChart", 
	5000
);
```

#### 2. Geo Location Data (for Map)

A `standard geo location data model` in json format:
```json
{
	
}
```

