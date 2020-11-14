setTimeout(() => {
    addComponent("layout", "statsLayout");
    components.jquery_layout.load("ajax/displayData/stats/stats-page/stats-page/statsLayout.php");
}, 1000);

// Global Options
let GlobalOptions = {

    selectedTimerange: 2, // Default selected timerange
    premium: 0, // Note: changing this value wont do anything :)

    lastSelectedPrefix: null
}

// You need to call refreshStatsDatas(timerange) in order to access stats datas.
let DATAS_statsDatas = {}

var dataRefreshState = { state: 0, overwriteStats: false };

// Creating statsDatas from default timerange
refreshStatsDatas(GlobalOptions.selectedTimerange)


/* StatsTabs list
(set preload to true to keep the tab loaded in order to make the navigation faster) */

let preloadedStatsTabs = {
    "statTab1": { url: "tab_dashboard.html", preload: true },
    "statTab2": { url: "tab_my_stats.html", preload: true },
    "statTab3": { url: "tab_messages.html", preload: true },
    "statTab4": { url: "tab_members.html", preload: true }
}

// When fully loaded, hide the global-container then reveal the stats layout
function statLayoutLoaded() {

    let statLayoutTabsInterval = setInterval(() => {
        if (dataRefreshState.state == 2) {
            clearInterval(statLayoutTabsInterval);
            preloadStatTabs();
        }
    }, 500);

    function preloadStatTabs() {
        // Before hiding globalContainer, load statstabs
        console.group("Loading statsTabs:");

        Object.keys(preloadedStatsTabs).forEach((statTab, i) => {

            let statTabContainer = $(`#${statTab}`);

            statTabContainer.load(`ajax/displayData/stats/stats-page/stats-page/tabs/${preloadedStatsTabs[statTab].url}`);

            console.log(`[${Math.round(((i+1)/Object.keys(preloadedStatsTabs).length)*100)}%] Pre-Loaded #${statTab} tab`);
            if (i + 1 >= Object.keys(preloadedStatsTabs).length) console.groupEnd();

        });
    }
}


var firstStatTabAlreadyLoaded = false;

// Once the first statTab is loaded, remove globalContainer
function firstStatTabLoaded() {

    if (firstStatTabAlreadyLoaded == true)
        return;

    firstStatTabAlreadyLoaded = true;

    console.log("Layout fully loaded, removing globalContainer's classes")

    components.globalContainer.classList.forEach(elementClass => {
        components.globalContainer.classList.remove(elementClass);
    });

    components.globalLoaderContainer.innerHTML = "";

    // Mobile sideNav
    addComponent("mobileSideNav", "side-nav-mobile");
    addComponent("sideNav", "side-nav");

    components.mobileSideNav.addEventListener("click", () => {
        components.jquery_sideNav.animate({ "left": "0%" }, 800);
    });

    addComponent("statTab1", "statTab1");
    loadedTab = components.statTab1;

    addComponent("generalStatsBoxDashboard", "general-stats-box-0");
    let dashboardGeneralStatsBox = [0, 4];

    loadStatTab("statTab1");

    setInterval(() => {

        if (loadedTab.id == "statTab1") changeDashboarGeneralStat();

    }, 4000);

    function changeDashboarGeneralStat() {
        components.generalStatsBoxDashboard.innerHTML =
            document.getElementById(`general-stats-box-${(dashboardGeneralStatsBox[0]+1)}`).innerHTML;

        components.generalStatsBoxDashboard.classList.add("fade-in-static");
        setTimeout(() => { components.generalStatsBoxDashboard.classList.remove("fade-in-static") }, 500);

        if (dashboardGeneralStatsBox[0] + 1 == dashboardGeneralStatsBox[1])
            dashboardGeneralStatsBox[0] = -1;

        dashboardGeneralStatsBox[0]++;
    }
}

// Get the device screen size
let deviceScreenSize = $("#device-screen-size-sm").is(":visible") ? "sm" : "lg";

let loadedTab;

function loadStatTab(tabId, loadUrl) {

    if (!components[tabId]) {
        addComponent(tabId, tabId);
    }

    if (tabId == "statTab") components[`jquery_${tabId}`].load(loadUrl);

    if (loadedTab != null) {

        loadedTab.classList.remove("fade-in");
        loadedTab.classList.add("fade-out-static");

        document.getElementById(`nav_${loadedTab.id}`).classList.remove("active");
        document.getElementById(`nav_${tabId}`).classList.add("active");

        setTimeout(() => {

            loadedTab.classList.remove("fade-out-static");
            loadedTab.style.display = "none";

            components[tabId].style.display = "block";
            components[tabId].classList.add("fade-in");

            loadedTab = components[tabId];

        }, 500)
    }

    if (components.sideNav.style.left == "0%") components.jquery_sideNav.animate({ "left": "-100%" }, 500);

}

// Refresh stats datas
function refreshStatsDatas(timerange) {

    if (timerange == null)
        timerange = GlobalOptions.selectedTimerange;

    if (!DATAS_timeranges[timerange]) return console.warn("Warning » Couldn't refresh datas. Timerange id specified doesn't exist.")
    GlobalOptions.selectedTimerange = timerange;

    if (!DATAS_timeranges[GlobalOptions.selectedTimerange])
        return console.error(`Error: Cannot refresh statsDatas; "${timerange}" timerange ID doesn't exist.`);

    dataRefreshState.state = 1;
    console.group("Refreshing stats datas: (From " + DATAS_timeranges[GlobalOptions.selectedTimerange][1].length + " total stats elements)");

    DATAS_statsDatas.baseTimerange = timerange ? timerange : GlobalOptions.selectedTimerange;

    // Refresh stats data (maybe create a separate function)
    Object.keys(DATAS_timeranges[GlobalOptions.selectedTimerange][1][0][0])
        .forEach((statsKeys, i) => {

                console.log(`[${Math.round(((i+1)/Object.keys(DATAS_timeranges[GlobalOptions.selectedTimerange][1][0][0]).length)*100)}%] Getting stats from "${statsKeys}" label.`)
                DATAS_statsDatas[statsKeys] = [];

                DATAS_timeranges[GlobalOptions.selectedTimerange][1].forEach(
                    (timerangeStats, i) => {
                        DATAS_statsDatas[statsKeys].push(timerangeStats[0][statsKeys]);
                        console.log(`DATAS_statsDatas[${statsKeys}].push(${timerangeStats[0][statsKeys]})`);
                    }
                );

                if (i + 1 >= Object.keys(DATAS_timeranges[GlobalOptions.selectedTimerange][1][0][0]).length) {
                    console.warn(DATAS_statsDatas)
                    console.groupEnd();
                    setTimeout(() => {
                        dataRefreshState.state = 2;
                        if (dataRefreshState.overwriteStats != false)
                            overwriteStats(dataRefreshState.overwriteStats);
                    }, 2000);
                }

            }

        );
}

// Fetch all stats elements and overwrite them
function overwriteStats(prefixId) {

    /* To avoid rewritting every elements, the prefix has to be added
    in front of every elements that needs to be overwritten with the data-stats-id attribute
    Example: <div data-stats-id="dashboard" data-stats-type="messages" data-stats-method="total">
    Then, <script>overwriteStats("dashboard");</script> will only overwrite dashboard stats. */

    // Checking if any stats elements has the specified data-stats-id
    let statsElementsSize = $(`*[data-stats-id=${prefixId}]`).length;
    if (statsElementsSize <= 0)
        return console.warn(`Cannot overwrite stats. Couldn't find any stats-elements with "${prefixId}" as data-stats-id.`)

    // Checking if stats have been refreshed before overwriting stats
    if (dataRefreshState.state < 2) return dataRefreshState.overwriteStats = prefixId;

    // Log (group)
    console.group("Filling/Overwritting stats-elements based on " + prefixId + " stats-data-id:");


    $(`*[data-stats-id=${prefixId}]`).each((i, statElement) => {

        // Getting attributes
        let method = statElement.getAttribute("data-stats-method");
        let type = statElement.getAttribute("data-stats-type");
        let format = statElement.getAttribute("data-stats-format") || null;
        let result = 0;

        let subMethods = method.split("-");

        // Calculs methods
        if (method === "total") {
            DATAS_statsDatas[type].forEach((stats) => {
                result += stats;
            });
        } else if (method === "set") {

            result = DATAS_statsDatas[type][DATAS_statsDatas[type].length - 1];

        } else if (subMethods[0] === "global") { /* Global Stats */

            result = DATAS_globalStats.total[type];

        } else if (subMethods[0] === "average") {

            // Getting the average value for any dataType
            // I hope you like maths...

            let baseTimerangeDatas = 0;
            DATAS_statsDatas[type].forEach((stats) => {
                baseTimerangeDatas += stats;
            });

            if (+new Date() - DATAS_globalStats.infos.botJoinTime >
                DATAS_timeranges[DATAS_statsDatas.baseTimerange + 1] ?
                DATAS_timeranges[DATAS_statsDatas.baseTimerange + 1][0] :
                DATAS_timeranges[DATAS_timeranges.length - 1][0] * 2) {

                if (DATAS_timeranges[DATAS_statsDatas.baseTimerange + 1]) {

                    let upperTimerangeDatas = 0;

                    DATAS_timeranges[DATAS_statsDatas.baseTimerange + 1][1].forEach(
                        (timerangeStats) => {
                            upperTimerangeDatas += timerangeStats[0][type];
                        }
                    );

                    result = Math.round(
                        baseTimerangeDatas - (upperTimerangeDatas /
                            (DATAS_timeranges[DATAS_statsDatas.baseTimerange + 1][0] /
                                DATAS_timeranges[DATAS_statsDatas.baseTimerange][0]))
                    );

                } else {

                    let actualTimestamp = +new Date();

                    if (actualTimestamp - DATAS_globalStats.infos.botJoinTime >
                        (DATAS_timeranges[DATAS_statsDatas.baseTimerange][0] * 2)) {
                        if (DATAS_globalStats.total[type]) {

                            result = Math.round(
                                baseTimerangeDatas - (DATAS_globalStats.total[type] /
                                    ((actualTimestamp - DATAS_globalStats.infos.botJoinTime) /
                                        DATAS_timeranges[DATAS_statsDatas.baseTimerange][0]))
                            );

                        } else
                            console.warn(`Warning » Cannot get globalStats.total of "${type}".`)
                    }
                }
            } else
                result = 0;

        } else if (subMethods[0] === "comparison") {

            result = DATAS_statsDatas[type][DATAS_statsDatas[type].length - 1] -
                DATAS_statsDatas[type][0];

        } else {
            console.warn(`Cannot find any "${subMethods[0]}" method.`)
            result = 0;
        }


        let subFormattedResult = [result, result < 0 ? "-" : "+"];
        let statsTextIndicator = null;
        result = Math.abs(result);

        // Format results if needed
        // This can be done using data-stats-format
        if (format) {
            if (format === "time") {

                result = toTimeFormat(result);

            } else if (format === "reduce") {

                result = result < 99999 ? roundToTwo(result) :
                    result < 1000000 ? roundToTwo(result / 1000) + "k" :
                    roundToTwo(result / 1000000) + "M";

            } else if (format === "readable" || format === "reduce") {

                let parts = x.toString().split(".");
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                result = parts.join(".");

            }
        } else {}

        result = subFormattedResult[1] == "-" ?
            '-' + result : result;

        // Sub-methods options
        if (method.split("-")[1]) {

            // Add the + / - indicator if needed
            if (method.split("-")[1] == "indicator") {

                result = `<span class="indicator ${
                    subFormattedResult[0] == 0 ? "equal" :
                    subFormattedResult[0] > 0 ? "plus" : "minus"
                }">${
                    subFormattedResult[0] == 0 ? "=" :
                    subFormattedResult[0] > 0 ? "+" : "-"
                }</span> ${result}`;

                statsTextIndicator = subFormattedResult[0] > 0 ? "plus" : "moins";

            } else if (method.split("-")[1] == "chevron") {

                result = subFormattedResult[0] == 0 ? '<i class="fas fa-chevron-up"></i> ' :
                    subFormattedResult[0] > 0 ? '<i class="fas fa-chevron-up"></i> ' :
                    '<i class="fas fa-chevron-down"></i> ';
                result += subFormattedResult[0];
                result += ` de ${subFormattedResult[0] > 0 ? "plus" : "moins"} qu'en moyenne`

                statsTextIndicator = subFormattedResult[0] > 0 ? "plus" : "moins";

            } else if (method.split("-")[1] == "simpleIndicator") {

                result = subFormattedResult[0] == 0 ? "+" : subFormattedResult[0] > 0 ? "+" : "-";
                result += subFormattedResult[0];
                statsTextIndicator = subFormattedResult[0] > 0 ? "plus" : "moins";

            }
        }

        // Check for childrens node to be filled:
        if (subMethods.includes("text")) {
            for (let child of statElement.parentNode.parentNode.children) {

                let dataTypeAttribute = child.getAttribute("data-stats-type");

                if (dataTypeAttribute) {

                    if (dataTypeAttribute == "stats-text-indicator") {
                        child.innerHTML = child.innerHTML.replace(/{indicator}/g, statsTextIndicator ? statsTextIndicator : "k")
                    }

                }
            }
        }

        // Then return the result as element's inner html
        statElement.innerHTML = result;

        // Log
        console.groupCollapsed(`[${ Math.round(((i+1)/statsElementsSize)*100)}%] Processing stats-element #${i}`);
        console.info({ method: method, type: type, result: result });
        console.groupEnd();

        // groupEnd if last stat-element
        if ((i + 1) >= statsElementsSize) console.groupEnd();

    });

    // Edit timetamp modal
    let timestampModal = $(`#${prefixId}_timespampModal`);

    if (timestampModal) {

        let timestampModalContent = "";
        DATAS_timeranges.forEach((timerange, i) => {
            timestampModalContent +=
                `<div onclick="updateTimerange(${i}, true)" class="modal-selector
            ${GlobalOptions.selectedTimerange == i ? "active" :
            timerange[3] == 1 ? GlobalOptions.premium == true ? "premium" : "premium-locked" : ""}">
                <i class="
            ${GlobalOptions.selectedTimerange == i ? "fas fa-clock" :
            timerange[3] == 1 ? "fas fa-star" : "far fa-clock"}
                fontawesome-icon"></i> ${timerange[2]}</div>`;

            if (i + 1 == DATAS_timeranges.length)
                return timestampModal.html(timestampModalContent);
        });

    }

    let timestampIndicatorButton = $(`#${prefixId}_timerangeIndicatorButton`);
    if (timestampIndicatorButton)
        timestampIndicatorButton.html(DATAS_timeranges[GlobalOptions.selectedTimerange][2]);

    // Set the actual
    GlobalOptions.lastSelectedPrefix = prefixId;

}

// Draws a chart
function drawChart(canvasId, options) {

    // Checking if stats have been refreshed before drawing chart
    let chartInterval = setInterval(() => {
        if (dataRefreshState.state == 2) {
            clearInterval(chartInterval);
            drawChartOnceRefreshedDatas();
        }
    }, 500);

    function drawChartOnceRefreshedDatas() {

        // Get options
        if (!options) options = {};
        if (!options.settings) options.settings = {};
        let chartLabels = options.datasets.labels;
        let dataGroupsPerGraph = 40;

        // If we have less than 3 labels in each datasets, create empty labels
        if (chartLabels.length <= 3)
            chartLabels.unshift("Aucune données", "Aucune données", "Aucune données");

        // Minimal group size depending on labels number (In MS)
        let statsGroupSize = options.externalDatas.timestamps ?
            (options.externalDatas.timestamps[0] - options.externalDatas.timestamps[
                options.externalDatas.timestamps.length - 1
            ]) / dataGroupsPerGraph : 0;

        console.log(`statsGroupSize = ${statsGroupSize}`);
        console.log(options)

        // Checking datasets lenght, adding elements if needed
        options.datasets.datasets.forEach(dataset => {
            if (dataset.data.length < chartLabels.length) {
                while (dataset.data.length + 1 <= chartLabels.length) {
                    dataset.data.unshift(0);
                }
            }

            if (options.externalDatas && options.externalDatas.timestamps) {

                let datasetGrouppedDatas = [];
                dataset.data.forEach((data, i) => {
                    datasetGrouppedDatas.push([data, Math.floor(
                        options.externalDatas.timestamps[i] / statsGroupSize)]);
                });

                datasetGrouppedDatas = groupBy(datasetGrouppedDatas, [1]);
                dataset.data.length = 0;
                chartLabels.length = 0;

                Object.keys(datasetGrouppedDatas).forEach((chartDataKey) => {
                    i++;
                    let dataGroupValue = 0;
                    let dataGroupLabel = 0;

                    datasetGrouppedDatas[chartDataKey]
                        .forEach((chartDataRow) => {
                            if (options.externalDatas.processMethod == "sum") {
                                dataGroupValue += chartDataRow[0];
                            } else if (options.externalDatas.processMethod == "set") {
                                dataGroupValue = chartDataRow[0];
                            }
                            dataGroupLabel = chartDataRow[1];
                        })

                    dataset.data.push(dataGroupValue)
                    chartLabels.push(formatTime(dataGroupLabel * statsGroupSize))

                });
            }
        });

        // Draw Chart
        let ctx = document.getElementById(canvasId).getContext('2d');
        let chartjs = new Chart(ctx, {
            type: 'line',
            data: options.datasets,
            options: {
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: options.options ?
                                options.options.beginAtZero != null ?
                                options.options.beginAtZero : true : true,

                            callback: function(label) {
                                return options.settings.tooltip ?
                                    options.settings.tooltip.formula ?
                                    options.settings.tooltip.formula == "time" ? toTimeFormat(label) :
                                    label : label : label;
                            }
                        },
                        display: deviceScreenSize == "sm" ? false : true
                    }],
                    xAxes: [{
                        gridLines: {
                            display: false
                        },
                        display: false,
                    }]
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            let label = data.datasets[tooltipItem.datasetIndex].label || '';

                            if (label) {
                                label += options.settings.tooltip ? options.settings.tooltip.label ? options.settings.tooltip.label.replace(/{label}/g, tooltipItem.yLabel) : `: ${ tooltipItem.yLabel }` : `: ${ tooltipItem.yLabel }`;
                            }

                            if (options.settings.tooltip && options.settings.tooltip.formula) {

                                label = data.datasets[tooltipItem.datasetIndex].label;

                                if (options.settings.tooltip.formula == "time") {

                                    label += options.settings.tooltip.label.replace(/{label}/g,
                                        toTimeFormat(tooltipItem.yLabel)
                                    );

                                }
                            }

                            return label;
                        }
                    }
                }
            }
        });
    }
}

// Change timerange
function updateTimerange(timerangeID, isModal) {

    // Closing modal
    if (isModal || isModal == true) {
        let = timerangeModalElement = $(`#${ GlobalOptions.lastSelectedPrefix }_timerangeModal`);
        if (timerangeModalElement)
            closeModal(`${GlobalOptions.lastSelectedPrefix}_timerangeModal`);
    }

    // Updating stats
    refreshStatsDatas(timerangeID);

    // Reload the tab
    if (loadedTab)
        $(`#${ loadedTab.id }`).load(`ajax/displayData/stats/stats-page/stats-page/tabs/${preloadedStatsTabs[loadedTab.id].url}`);

}

// Draw pie chart
function drawPieChart(canvasId, options) {
    let ctx = document.getElementById(canvasId).getContext('2d');
    let chartjs = new Chart(ctx, {
        type: options.options.type,
        data: options.datasets,
        options: {
            legend: {
                display: false
            },
            title: {
                display: false
            },
            aspectRatio: 1.4,
        }
    });
}

function groupBy(xs, key) {
    return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

function toTimeFormat(timeInSeconds) {
    return timeInSeconds < 60 ? `${timeInSeconds}s` :
        timeInSeconds < 3600 ? `${Math.round(timeInSeconds/60)}min` :
        timeInSeconds < 3600 * 399 ? `${Math.round(timeInSeconds/3600)}h` :
        `${Math.round(timeInSeconds/(3600*24))}j`;
}

function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
}