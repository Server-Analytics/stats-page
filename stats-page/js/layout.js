setTimeout(() => {
    addComponent("layout", "statsLayout");
    components.jquery_layout.load("ajax/displayData/stats/stats-page/stats-page/statsLayout.php");
}, 1000);

// Global Options
let GlobalOptions = {
    // Default selecte timerange
    selectedTimerange: 2,

    // Premium
    // Note: changing this value wont do anything :)
    premium: 0,
    lastSelectedPrefix: null
}

// You need to call refreshStatsDatas(timerange) in order to access stats datas.
let DATAS_statsDatas = {}

// Creating statsDatas from default timerange
refreshStatsDatas(GlobalOptions.selectedTimerange)


// StatsTabs to keep loaded during navigation
let preloadedStatsTabs = {
    "statTab1": "tab_dashboard.html",
    "statTab2": "tab_my_stats.html",
    "statTab3": "tab_messages.html",
    "statTab4": "tab_members.html"
}

// When fully loaded, hide the global-container then reveal the stats layout
function statLayoutLoaded() {

    // Before hiding globalContainer, load statstabs
    console.group("Loading statsTabs:");

    Object.keys(preloadedStatsTabs).forEach((statTab, i) => {

        let statTabContainer = $(`#${statTab}`);

        statTabContainer.load(`ajax/displayData/stats/stats-page/stats-page/tabs/${preloadedStatsTabs[statTab]}`);

        console.log(`[${Math.round(((i+1)/Object.keys(preloadedStatsTabs).length)*100)}%] Pre-Loaded #${statTab} tab`);
        if (i + 1 >= Object.keys(preloadedStatsTabs).length) console.groupEnd();

    });
}

// Once the first statTab is loaded, remove globalContainer
function firstStatTabLoaded() {

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
                }
            );

            if (i + 1 >= Object.keys(DATAS_timeranges[GlobalOptions.selectedTimerange][1][0][0]).length) console.groupEnd();

        });
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
            } else {
                result = 0;
            }
        }

        let subFormattedResult = [result, result < 0 ? "-" : "+"];
        let statsTextIndicator = null;
        result = Math.abs(result);

        // Format results if needed
        // This can be done using data-stats-format
        if (format) {
            if (format == "time") {

                result =
                    result < 60 ? `${result}s` :
                    result < 3600 ? `${Math.round(result/60)}min` :
                    result < 3600 * 399 ? `${Math.round(result/3600)}h` :
                    `${Math.round(result/3600*24)}j`;

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
                    subFormattedResult[0] > 1 ? "plus" : "minus"
                }">${
                    subFormattedResult[0] == 0 ? "=" :
                    subFormattedResult[0] > 1 ? "+" : "-"
                }</span> ${result}`;

                statsTextIndicator = subFormattedResult[0] > 1 ? "plus" : "moins";

            } else if (method.split("-")[1] == "chevron") {
                // Indicator alternative
            } else if (method.split("-")[1] == "simpleIndicator") {

                result = subFormattedResult[0] == 0 ? "+" : subFormattedResult[0] > 1 ? "+" : "-";
                statsTextIndicator = subFormattedResult[0] > 1 ? "plus" : "moins";

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

    // Set the actual
    GlobalOptions.lastSelectedPrefix = prefixId;

}

// Draw line chart
function drawChart(canvasId, options) {

    if (!options) options = {};
    if (!options.settings) options.settings = {};

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
                        beginAtZero: options.options ? options.options.beginAtZero != null ? options.options.beginAtZero : true : true
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
                        var label = data.datasets[tooltipItem.datasetIndex].label || '';

                        if (label) {
                            label += options.settings.tooltip ? options.settings.tooltip.label ? options.settings.tooltip.label.replace(/{label}/g, tooltipItem.yLabel) : `: ${tooltipItem.yLabel}` : `: ${tooltipItem.yLabel}`;
                        }

                        if (options.settings.tooltip && options.settings.tooltip.formula) {

                            label = data.datasets[tooltipItem.datasetIndex].label;

                            if (options.settings.tooltip.formula == "time") {

                                label += options.settings.tooltip.label.replace(/{label}/g,
                                    tooltipItem.yLabel < 60 ? `${tooltipItem.yLabel}s` :
                                    tooltipItem.yLabel < 3600 * 2 ? `${Math.round(tooltipItem.yLabel/60)} mins` :
                                    tooltipItem.yLabel < 3600 * 24 ? `${Math.round(tooltipItem.yLabel/3600)}h` :
                                    `${Math.round(tooltipItem.yLabel/3600)}j`
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

// Change timerange
function updateTimerange(timerangeID, isModal) {

    // Closing modal
    if (isModal || isModal == true) {
        let = timerangeModalElement = $(`#${GlobalOptions.lastSelectedPrefix}_timerangeModal`);
        if (timerangeModalElement)
            closeModal(`${GlobalOptions.lastSelectedPrefix}_timerangeModal`);
    }

    // Updating stats
    refreshStatsDatas(timerangeID);
    overwriteStats(GlobalOptions.lastSelectedPrefix);

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