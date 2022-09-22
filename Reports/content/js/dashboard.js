/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8722627737226277, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Add car - GET-1"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "Guest log in - POST"], "isController": false}, {"data": [1.0, 500, 1500, "Stage of creation of API - POST"], "isController": false}, {"data": [0.875, 500, 1500, "Add an expense - POST"], "isController": false}, {"data": [0.875, 500, 1500, "Incorrect data entry in the \"Mileage\" field - POST"], "isController": false}, {"data": [1.0, 500, 1500, "Add car - GET-0"], "isController": false}, {"data": [1.0, 500, 1500, "Cars brands - GET-0"], "isController": false}, {"data": [1.0, 500, 1500, "Instructions - GET"], "isController": false}, {"data": [0.5, 500, 1500, "Login with valid login details & Remember me option ON - POST"], "isController": false}, {"data": [0.0, 500, 1500, "Password Reset with Valid Email - POST"], "isController": false}, {"data": [0.875, 500, 1500, "Log Out - GET"], "isController": false}, {"data": [0.75, 500, 1500, "Password reset with invalid email - POST"], "isController": false}, {"data": [1.0, 500, 1500, "Cars brands - GET-1"], "isController": false}, {"data": [0.875, 500, 1500, "Add car - POST"], "isController": false}, {"data": [0.75, 500, 1500, "Remove Car - DELETE"], "isController": false}, {"data": [0.5, 500, 1500, "Sign in - POST"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "Add car - GET"], "isController": false}, {"data": [1.0, 500, 1500, "Instructions - GET-0"], "isController": false}, {"data": [1.0, 500, 1500, "Cars - GET"], "isController": false}, {"data": [0.96, 500, 1500, "Cars brands - GET"], "isController": false}, {"data": [0.875, 500, 1500, "Add car and incorrect mileage - POST"], "isController": false}, {"data": [1.0, 500, 1500, "Instructions - GET-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 274, 0, 0.0, 343.3284671532848, 51, 4421, 151.5, 770.5, 1075.0, 3129.75, 5.962053461942283E-4, 3.962278530004454E-4, 1.6010949056598822E-4], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Add car - GET-1", 20, 0, 0.0, 70.25, 51, 176, 56.0, 135.3000000000001, 174.2, 176.0, 0.1918152435574055, 0.09497102390977011, 0.02865989478933891], "isController": false}, {"data": ["Guest log in - POST", 7, 0, 0.0, 751.8571428571429, 160, 1500, 680.0, 1500.0, 1500.0, 1500.0, 0.42968510220367073, 0.16784574304830888, 0.16029268461113497], "isController": false}, {"data": ["Stage of creation of API - POST", 7, 0, 0.0, 202.57142857142858, 56, 415, 91.0, 415.0, 415.0, 415.0, 0.45094376087096566, 0.15545229256587, 0.2034531421117052], "isController": false}, {"data": ["Add an expense - POST", 4, 0, 0.0, 216.74999999999997, 55, 559, 126.5, 559.0, 559.0, 559.0, 0.5323396326856535, 0.1845513375033271, 0.3004807692307692], "isController": false}, {"data": ["Incorrect data entry in the \"Mileage\" field - POST", 4, 0, 0.0, 238.75, 65, 700, 95.0, 700.0, 700.0, 700.0, 0.4983181761554753, 0.17275678958515014, 0.2403995888875047], "isController": false}, {"data": ["Add car - GET-0", 20, 0, 0.0, 111.2, 54, 187, 95.5, 182.5000000000001, 187.0, 187.0, 0.19195884402384128, 0.07273440574340861, 0.028681350718405975], "isController": false}, {"data": ["Cars brands - GET-0", 22, 0, 0.0, 200.13636363636365, 143, 271, 199.5, 251.79999999999998, 268.74999999999994, 271.0, 0.2151841780942507, 0.0788027995950625, 0.029419711848823332], "isController": false}, {"data": ["Instructions - GET", 19, 0, 0.0, 160.89473684210526, 57, 390, 152.0, 226.0, 390.0, 390.0, 4.1344563773148583E-5, 6.381037011616497E-5, 1.4059191710688274E-5], "isController": false}, {"data": ["Login with valid login details & Remember me option ON - POST", 7, 0, 0.0, 716.2857142857143, 554, 1012, 611.0, 1012.0, 1012.0, 1012.0, 0.4240368306275745, 0.27661777622970685, 0.1922008458020354], "isController": false}, {"data": ["Password Reset with Valid Email - POST", 7, 0, 0.0, 2973.0, 2291, 4421, 2677.0, 4421.0, 4421.0, 4421.0, 0.370350775091265, 0.11247958110681974, 0.15810175387545633], "isController": false}, {"data": ["Log Out - GET", 4, 0, 0.0, 282.75, 57, 758, 158.0, 758.0, 758.0, 758.0, 0.4658746797111577, 0.15832459818308875, 0.14331105870020963], "isController": false}, {"data": ["Password reset with invalid email - POST", 4, 0, 0.0, 474.99999999999994, 53, 1068, 389.5, 1068.0, 1068.0, 1068.0, 0.4764173415912339, 0.1651642151024297, 0.19773180681276797], "isController": false}, {"data": ["Cars brands - GET-1", 22, 0, 0.0, 62.63636363636363, 51, 189, 54.5, 69.5, 171.29999999999976, 189.0, 0.2155636990730761, 0.12146509215348135, 0.02947159948264712], "isController": false}, {"data": ["Add car - POST", 4, 0, 0.0, 316.25, 55, 652, 279.0, 652.0, 652.0, 652.0, 0.5747126436781609, 0.20260865660919541, 0.2379669540229885], "isController": false}, {"data": ["Remove Car - DELETE", 4, 0, 0.0, 350.25, 58, 690, 326.5, 690.0, 690.0, 690.0, 0.5019450370184465, 0.17058288367423766, 0.1955820993851173], "isController": false}, {"data": ["Sign in - POST", 32, 0, 0.0, 770.625, 541, 1122, 733.5, 1059.8, 1119.4, 1122.0, 6.963037371076343E-5, 5.563120067589682E-5, 2.1139006276692953E-5], "isController": false}, {"data": ["Add car - GET", 23, 0, 0.0, 240.91304347826087, 54, 1096, 158.0, 599.4000000000005, 1028.199999999999, 1096.0, 5.004832699094459E-5, 4.126989463702169E-5, 1.5098223644304573E-5], "isController": false}, {"data": ["Instructions - GET-0", 16, 0, 0.0, 106.125, 67, 141, 95.5, 138.9, 141.0, 141.0, 0.1636108923951612, 0.06534849120080169, 0.027801069606209032], "isController": false}, {"data": ["Cars - GET", 3, 0, 0.0, 85.66666666666667, 55, 139, 63.0, 139.0, 139.0, 139.0, 0.41516745087185164, 0.13055070232493773, 0.13028041101577637], "isController": false}, {"data": ["Cars brands - GET", 25, 0, 0.0, 295.9600000000001, 53, 1011, 266.0, 450.20000000000033, 871.1999999999996, 1011.0, 5.43999787552851E-5, 4.818435618265975E-5, 1.5100244102931871E-5], "isController": false}, {"data": ["Add car and incorrect mileage - POST", 4, 0, 0.0, 211.0, 53, 610, 90.5, 610.0, 610.0, 610.0, 0.5324813631522897, 0.1846004725772098, 0.39052099973375937], "isController": false}, {"data": ["Instructions - GET-1", 16, 0, 0.0, 73.8125, 53, 292, 57.0, 153.40000000000015, 292.0, 292.0, 0.1637599279456317, 0.19766335052812578, 0.02782639400638664], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 274, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
