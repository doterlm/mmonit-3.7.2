(function(b){b.ajaxSetup({timeout:30000});b(document).ajaxError(function(g,d,f,c){MMONIT.error.json(d,c)});var a=new function(){b.ajaxSettings.traditional=true;var d=this;d.width=ko.observable(b("#main").outerWidth());d.height=ko.observable(b(window).outerHeight());d.isPhone=ko.computed(function(){return d.width()<768});d.isPortrait=ko.computed(function(){return d.width()<d.height()});d.widthColumnLed=ko.computed(function(){return 35});d.widthColumnCpu=ko.computed(function(){return d.isPhone()?0:80});d.widthColumnMem=ko.computed(function(){return d.isPhone()?0:80});d.widthColumnEvents=ko.computed(function(){return d.isPhone()?0:80});d.widthColumnStatus=ko.computed(function(){if(d.isPhone()){if(d.isPortrait()){return 0}else{return(d.width()-24-d.widthColumnLed())/2}}else{return(d.width()-24-d.widthColumnLed()-d.widthColumnCpu()-d.widthColumnMem()-d.widthColumnEvents())/2}});d.widthColumnHost=ko.computed(function(){if(d.isPhone()&&d.isPortrait()){return d.width()-24-d.widthColumnLed()}else{return d.widthColumnStatus()}});d.timeout=null;d.datatable={sort:ko.observable("led"),dir:ko.observable("yui-dt-asc")};d.numHosts=ko.observable(0);d.hosts=ko.observableArray();d.hostgroups=ko.observableArray();d.leds=ko.observableArray();d.hostgroupsLabel=ko.computed(function(){var e=Menu.getSelectedNames(d.hostgroups(),null);if(e!="All"){e="Host Group "+e}else{e="All Host Groups"}return e?e:"All"});d.ledsLabel=ko.computed(function(){var e=Menu.getSelectedNames(d.leds(),null);if(e!="All"){e=e}else{e="Any Led"}return e?e:"All"});d.selectHostGroup=function(e){Menu.select(d.hostgroups(),e.id);b.post("../../session/put",{sHostGroup:e.id});b("#status").trigger("reload")};d.selectLed=function(e){Menu.select(d.leds(),e.id);b.post("../../session/put",{sLed:e.id});b("#status").trigger("reload")};d.filter=function(){var f=b("#hostname").val();var e=Menu.getSelectedValues(d.hosts(),"id");var g=Menu.getSelectedValues(d.hostgroups(),"id");var h=Menu.getSelectedValues(d.leds(),"id");return{hostid:e.length?e:(f!==""?[-1]:null),hostgroupid:g=="-1"?null:g,led:h=="-1"?null:h,sort:d.datatable.sort(),dir:d.datatable.dir()}};d.searchHostTimeout=null;d.searchHost=function(){var e=b("#hostname").val();if(e==""){Menu.unselectAll(d.hosts())}else{Menu.selectPattern(d.hosts(),e)}b("#status").trigger("reload")};var c=new YAHOO.util.YUILoader({base:"../../lib/f/yui/2/",loadOptional:false,require:["datasource","datatable","json"],onSuccess:function(){YAHOO.util.Event.onDOMReady(function(){var h=function(q,p,r){var o=YAHOO.util.Sort.compare(q.getData("led"),p.getData("led"),r);return(o!==0)?o:YAHOO.util.Sort.compare(q.getData("hostname"),p.getData("hostname"),r)};var g=function(p,o,q,r){if(parseInt(o.getData("events"),10)>0){b(p).html('<a href="../../reports/events/?reset=true&host='+encodeURIComponent(o.getData("hostname"))+'">'+o.getData("events")+"</a>")}else{b(p).text(o.getData("events"))}};var i=function(r,p,t,u){var q=p.getData("cpu");var o=p.getData("statusid");var s=p.getData("heartbeat");if(o!=1&&s==1){b(r).html('<div class="progress" title="'+(q>0?q:0)+'%"><div class="bar '+(q<=80?"bar-success":q<=95?"bar-warning":"bar-danger")+'" style="width: '+(q>0?q:0)+'%;"></div></div>')}else{b(r).html('<div class="progress" title="not available"><div class="bar bar-gray" style="width: 100%;"></div></div>')}};var m=function(q,p,t,u){var s=p.getData("mem");var o=p.getData("statusid");var r=p.getData("heartbeat");if(o!=1&&r==1){b(q).html('<div class="progress" title="'+(s>0?s:0)+'%"><div class="bar '+(s<=80?"bar-success":s<=95?"bar-warning":"bar-danger")+'" style="width: '+(s>0?s:0)+'%;"></div></div>')}else{b(q).html('<div class="progress" title="not available"><div class="bar bar-gray" style="width: 100%;"></div></div>')}};var f=function(p,o,q,r){p.innerHTML='<img src="../../img/led'+o.getData("led")+'.png" class="table-led" alt="led">'};var e=[{key:"led",label:"*",sortable:true,sortOptions:{sortFunction:h},formatter:f},{key:"hostname",label:"Host",sortable:true,formatter:"text"},{key:"cpu",label:"%Cpu",sortable:true,formatter:i},{key:"mem",label:"%Mem",sortable:true,formatter:m},{key:"status",label:"Status",sortable:true,formatter:"text"},{key:"events",label:"Events",sortable:true,formatter:g}];var n=[{key:"led",label:"*",sortable:true,sortOptions:{sortFunction:h},formatter:f},{key:"hostname",label:"Host",sortable:true,formatter:"text"},{key:"status",label:"Status",sortable:true,formatter:"text"}];var k=new YAHOO.util.XHRDataSource("../../status/hosts/list");k.connXhrMode="cancelStaleRequests";k.connMethodPost=true;k.connTimeout=30000;k.responseType=YAHOO.util.XHRDataSource.TYPE_JSON;k.responseSchema={resultsList:"records",fields:[{key:"id",parser:"number"},{key:"led",parser:"number"},{key:"hostname",parser:"string"},{key:"cpu",parser:"number"},{key:"mem",parser:"number"},{key:"status",parser:"string"},{key:"statusid",parser:"number"},{key:"heartbeat",parser:"number"},{key:"events",parser:"number"}],metaFields:"totalRecords"};var j={selectionMode:"single",initialRequest:b.param(d.filter()),dynamicData:false,sortedBy:{key:d.datatable.sort(),dir:d.datatable.dir()}};d.myDataTable=new YAHOO.widget.DataTable("status",d.isPhone()?n:e,k,j);d.myDataTable.subscribe("renderEvent",function(o){a.numHosts(d.myDataTable.getRecordSet().getLength())});d.myDataTable.subscribe("cellClickEvent",function(q){var o=d.myDataTable.getColumn(q.target);var p=d.myDataTable.getRecord(q.target);if(ISTABLET&&o.key=="events"&&p.getData("events")>0){window.location="../../reports/events/?reset=true&host="+p.getData("hostname")}else{window.location=MMONIT.ui.location("detail?id="+p.getData("id"))}});if(!(ISPHONE||ISTABLET)){d.myDataTable.subscribe("rowMouseoverEvent",function(o){var p=d.myDataTable.getRecord(o.target);if(p){d.highlightedRowId=p.getData().id;d.myDataTable.highlightRow(p)}});d.myDataTable.subscribe("rowMouseoutEvent",function(o){var p=d.myDataTable.getRecord(o.target);if(p){d.highlightedRowId=null;d.myDataTable.unhighlightRow(p)}});d.myDataTable.subscribe("setSelectionsEvent",function(){var o=d.myDataTable.getRecordSet().getRecords();for(var p=0;p<o.length;p++){var q=o[p].getData();if(q.id==d.highlightedRowId){d.myDataTable.highlightRow(o[p].getId())}}})}var l=function(p,o){var r=(o==YAHOO.widget.DataTable.CLASS_DESC);var q=function(u,t){var s=YAHOO.util.Sort.compare(u.led,t.led,r);return(s!==0)?s:YAHOO.util.Sort.compare(u.hostname,t.hostname,r)};if(p==="led"){return q}else{if(r){return function(t,s){return(t[p]>s[p])?-1:(t[p]<s[p])?1:0}}else{return function(t,s){return(t[p]<s[p])?-1:(t[p]>s[p])?1:0}}}};d.myDataTable.doBeforeLoadData=function(o,p,r){if(p.error){MMONIT.error.json(p,null,null,d.myDataTable);clearTimeout(d.timeout);return false}var q=d.myDataTable.getState();if(q){j.sortedBy.key=q.sortedBy.key;j.sortedBy.dir=q.sortedBy.dir}p.results.sort(l(j.sortedBy.key,j.sortedBy.dir));clearTimeout(d.timeout);d.timeout=setTimeout(function(){b("#status").trigger("reload")},5000);return true};b("#status").on("reload",function(o){k.sendRequest(b.param(d.filter()),{success:d.myDataTable.onDataReturnReplaceRows,scope:d.myDataTable,argument:d.myDataTable.getState()})});d.resize=function(){var p=d.myDataTable.getColumn("hostname");var o=d.myDataTable.getColumn("status");d.myDataTable.setColumnWidth(p,d.widthColumnHost());d.myDataTable.setColumnWidth(o,d.widthColumnStatus());if(d.isPhone()){if(d.isPortrait()){d.myDataTable.hideColumn(o);d.myDataTable.reorderColumn(o,1)}else{d.myDataTable.showColumn(o);d.myDataTable.reorderColumn(o,2)}}};d.resize()})}});b.getJSON("../../map/id",function(e){d.hosts(Menu.JSONMapToMenu(e.map.id.host).sort(Menu.sortByName));d.hostgroups(Menu.JSONMapToMenu(e.map.id.hostgroup).sort(Menu.sortByName));d.hostgroups.unshift(Menu.JSONToMenu([{id:"-1",name:"All"}])[0]);d.leds(Menu.JSONToMenu([{id:"-1",name:"All"},{id:"0",name:"<img class='btn-led-img' src='../../img/led0.png'>"},{id:"1",name:"<img class='btn-led-img' src='../../img/led1.png'>"},{id:"2",name:"<img class='btn-led-img' src='../../img/led2.png'>"},{id:"3",name:"<img class='btn-led-img' src='../../img/led3.png'>"}]));Menu.select(d.leds(),-1);Menu.select(d.hostgroups(),-1);Menu.selectPattern(d.hosts(),"");b("#hostname").val("").on("change input paste search",function(f){clearTimeout(d.searchHostTimeout);d.searchHostTimeout=setTimeout(d.searchHost,300)}).on("keyup",function(f){if(f.which==13){b(f.target).blur()}}).blur(function(f){b.post("../../session/put",{sHostName:b(f.target).val()})});b("#drilldownReset").on("click",function(f){b.post("../../session/delete?key=sHostGroup&key=sLed&key=sHostName");b("#hostname").val("");Menu.select(d.leds(),-1);Menu.select(d.hostgroups(),-1);Menu.unselectAll(d.hosts());b("#status").trigger("reload")});b.getJSON("../../session/get?key=sHostGroup&key=sLed&key=sHostName",function(g){var f={led:b(document).getUrlParam("led"),host:b(document).getUrlParam("host"),hostgroup:b(document).getUrlParam("hostgroup")};if(f.led){Menu.select(d.leds(),f.led)}else{if(g.sLed){Menu.select(d.leds(),g.sLed)}}if(f.hostgroup){Menu.select(d.hostgroups(),f.hostgroup)}else{if(g.sHostGroup){Menu.select(d.hostgroups(),g.sHostGroup)}}if(f.host){Menu.selectPattern(d.hosts(),decodeURIComponent(f.host));b("#hostname").val(f.host)}else{if(g.sHostName){Menu.selectPattern(d.hosts(),g.sHostName);b("#hostname").val(g.sHostName)}}c.insert()})})};ko.applyBindings(a);b(document).on("vclick",function(c){if(!b(c.target).parents(".btn").length){b(".btn-group").removeClass("open")}});b(window).on("resize orientationchange",function(c){a.width(b("#main").outerWidth());a.height(b(window).outerHeight());a.resize()})})(jQuery);