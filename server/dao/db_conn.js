/**
 * Created by gong on 2017/6/15.
 *
 * [[[ IMPORTANT NODE ]]]
 *
 * Scaffold code. Remove this file later.
 * (Dashboard should not connect MongoDB directly. Use backend API instead.)
 *
 */
'use strict';

var mongodb = require('mongodb');
var mongoUrl = 'mongodb://leaniot:leaniot@119.254.211.60:37017/leaniot?authSource=leaniot';

var mongo;

mongodb.MongoClient.connect(mongoUrl).then(function(db) {
  console.log('MongoDB connected.');
  mongo = db;
}).catch(function(err) {
  console.log('Failed to connect MongoDB: ' + err.message);
});

/**
 * 取最近一条数据。
 *
 * @param {string} coll
 * @param {string} sensor_id
 * @return {Promise.<object>}
 */
exports.latest = function(coll, sensor_id) {
  return mongo.collection(coll).find({
    sensor_id: sensor_id
  }, {
    _id: false, timestamp: true, payload: true
  }).sort({timestamp: -1}).limit(1).toArray().then(function(arr) {
    return arr.length === 1 ? arr[0] : {};
  });
}

/**
 * 取一个时间段内的完整数据。
 *
 * @param {string} coll
 * @param {string} sensor_id
 * @param {number} start_ts
 * @param {number} end_ts
 * @return {Promise.<Array>}
 */
exports.history = function(coll, sensor_id, start_ts, end_ts) {
  return mongo.collection(coll).find({
    sensor_id: sensor_id,
    timestamp: {
      $gte: start_ts,
      $lte: end_ts
    }
  }, {
    _id: false, timestamp: true, payload: true
  }).sort({timestamp: 1}).toArray()
}

/**
 * 取一个时间段内的数据，下降采样。
 *
 * @param {string} coll
 * @param {string} sensor_id
 * @param {number} start_ts
 * @param {number} end_ts
 * @param {number} buckets
 * @return {Promise.<Array>}
 */
exports.downsample = function (coll, sensor_id, start_ts, end_ts, buckets) {
  return mongo.collection(coll).aggregate([
    {
      $match: {
        sensor_id: sensor_id,
        timestamp: {
          $gte: start_ts,
          $lte: end_ts
        }
      }
    },
    {
      $bucketAuto: {
        groupBy: "$timestamp",
        buckets: buckets,
        output: {
          timestamp: { $last: "$timestamp" },
          payload: { $last: "$payload" }   // $max, $min, $first, $last, $avg
        }
      }
    }
  ]).project({_id: false}).sort({timestamp: 1}).toArray();
}
