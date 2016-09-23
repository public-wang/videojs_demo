"use strict";
var debug = require('debug')('vipabc:DataMap'),
  Promise = require('bluebird');

var Leaf = require('leafjs');
var Http = Leaf.http;
var fs = require('fs');
var moment = require('moment');
var schedule = require('node-schedule');
require('moment/locale/zh-cn');

var LeadsService = require('./app/Service/LeadsService');

function belongingCount(app ,data) {
  switch(data.Belonging) {
    case 'SEM':
    case 'NON-SEM':
    case 'OUTDOOR':
    case 'PR':
    case 'EXHIBITION':
    case 'BROADCAST':
    case 'WOM':
      app.belonging.count[data.Belonging] += 1;
      break;
    case 'PRINT MEDIA':
      app.belonging.count['PRINT_MEDIA'] += 1;
      break;
    case 'OFFICIAL WEBSITE':
      app.belonging.count['OFFICIAL_WEBSITE'] += 1;
      break;
    case 'OFFLINE PROMOTION':
      app.belonging.count['OFFLINE_PROMOTION'] += 1;
      break;
    default:
      app.belonging.count['OTHER'] += 1;
      break;
  }
}

function beginPush( app ) {
  var range = 8000 - 2000;
  var randomTime = Math.floor(Math.random() * range + 2000);
  setTimeout(function(){
    if(app.pushCount < app.queue.length) {
      var data = app.queue[app.pushCount];
      debug(data.Inputdate);
      belongingCount(app ,data);
      data.count = app.startCount + app.pushCount;
      app._sio.emit('receive', {
        data: data,
        belonging: app.belonging
      });
      app.pushCount++;
    }

    beginPush(app);
  }, randomTime);
}

//function loopRequest( cb ) {
//  return (new Promise(function (resolve, reject) {
//    return cb();
//    resolve(cb);
//  })).delay(10000).then(loopRequest).catch(function () {
//    debug("Stop Requesting....", arguments);
//  });
//}
var timeInterval;
class Datamap extends Http {
  constructor() {
    super(module);
    var self = this;
    self.koa.use(function* (next){
      yield* next;
    });
    var rule = new schedule.RecurrenceRule();
    rule.hour = 17;
    rule.minute = 20;
    rule.second = 0;

    var j = schedule.scheduleJob(rule, function(){
      self._sio.emit('clear map', {});
      clearInterval(timeInterval);
      self.bootstrap();
    });


  }

  bootstrap() {
    debug("call bootstrap!!!");
    var self = this;

    self.queue = [];
    self.pushCount = 0;
    self.lastSynLeadSn = 0;
    self.belonging = {
      count: {
        'SEM': 0,
        'NON-SEM': 0,
        'OUTDOOR': 0,
        'PR': 0,
        'PRINT_MEDIA': 0,
        'OFFICIAL_WEBSITE': 0,
        'OFFLINE_PROMOTION': 0,
        'EXHIBITION': 0,
        'BROADCAST': 0,
        'WOM': 0,
        'OTHER': 0
      }
    };
    var leadsService = new LeadsService(self);

    leadsService.getSnapshotDetail({
      "StartTime": moment().format("YYYY-MM-DD"),
      "EndTime": moment().format("YYYY-MM-DD HH:mm:ss")
    }).then(function (todayLeads) {
      self.startCount = todayLeads.length;
      debug("start time " + moment().format("YYYY-MM-DD HH:mm:ss"));
      debug("today lead init!!!");
      debug("today last lead " + self.lastSynLeadSn);
      if(todayLeads.length !== 0) {
        debug("today lend length " + todayLeads.length);
        let lead;
        for (var i = 0; i < todayLeads.length; i++) {
          lead = todayLeads[i];
          lead.Belonging = lead.Belonging.toUpperCase();
          belongingCount(self, lead);
          self.queue.push(lead);
        }
        debug("today leadSn " + lead.LeadSn);
        self.lastSynLeadSn = lead.LeadSn;
      }

      //
      //setInterval(function( ){
      //  var data1 = self.queue[self.pushCount];
      //  belongingCount(self ,data1);
      //  self.pushCount++;
      //  data1.count = self.startCount + self.pushCount;
      //  self._sio.emit('receive', {
      //    data: data1,
      //    belonging: self.belonging
      //  });
      //
      //  var data2 = self.queue[self.pushCount];
      //  belongingCount(self ,data2);
      //  self.pushCount++;
      //  data2.count = self.startCount + self.pushCount;
      //  self._sio.emit('receive', {
      //    data: data2,
      //    belonging: self.belonging
      //  });
      //}, 1000);

      timeInterval = setInterval(function loopRequest() {
        if (self.lastSynLeadSn) {
          return leadsService.getSnapshotDetail({
            "LastSynLeadSn": self.lastSynLeadSn
          }).then(function (leads) {
            //debug("today lead loop!!!");
            if(leads.length !== 0) {
              let lead;
              for (var i = 0; i < leads.length; i++) {
                lead = leads[i];
                lead.Belonging = lead.Belonging.toUpperCase();
                self.queue.push(lead);

                let delayTime = moment(lead.BatchTime).diff(lead.Inpdate,'milliseconds');

                setTimeout(function( data ){
                  return function() {
                    belongingCount(self ,data);
                    self.pushCount++;
                    data.count = self.startCount + self.pushCount;
                    self._sio.emit('receive', {
                      data: data,
                      belonging: self.belonging
                    });
                  }
                }(lead), delayTime);
              }
              self.lastSynLeadSn = lead.LeadSn;
            }
          });
        }
        else {
          return leadsService.getSnapshotDetail({
            "StartTime": moment().format("YYYY-MM-DD"),
            "EndTime": moment().format("YYYY-MM-DD HH:mm:ss")
          }).then(function (todayLeads) {
            self.startCount = todayLeads.length;
            debug("today lead "+ self.startCount);
            debug("today lead reset!!!");
            if (todayLeads.length !== 0) {
              let lead;
              for (var i = 0; i < todayLeads.length; i++) {
                lead = todayLeads[i];
                lead.Belonging = lead.Belonging.toUpperCase();
                belongingCount(self, lead);
                self.queue.push(lead);
              }

              self.lastSynLeadSn = lead.LeadSn;
            }
          });
        }
      }, 10000);

      //beginPush(self)
    });


    self.use(function(){
      this.initialize = function*(next) {
        var self = this;
        var cdn = self.config.cdn || "/static/";
        var staticVersion = fs.existsSync(".staticversion") ? fs.readFileSync(".staticversion") : 0;
        var dust = self._dust._dust;
        self.config.staticVersion = staticVersion;
        require('./lib/dust_helpers.js')(dust, self._config);
        yield* next
      }
    })
  }
}

exports = module.exports = Datamap;
