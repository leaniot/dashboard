Data Monitor for LeanIOT
===

### Brief Introduction

### Deployment

### Front End Data Model

##### 1. Temporal Data (for Line Chart)

A standard temporal data model in json format:
```json
{
	"valueBound": [`upperbound`, `lowerbound`],
	"data": [ {}, {}, ... ],
	"temporalKeys": [ `Key_t1`, `Key_t2`, ... ],
	"detailKeys": [ `Key_d1`, `Key_d2`, ... ],
	"timestamps": [ `t1`, `t2`, ... ]
}
```