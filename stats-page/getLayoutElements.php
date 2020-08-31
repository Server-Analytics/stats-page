<div id="loaderGlobalContainer"></div>
<div id="device-screen-size-sm" class="d-lg-none"></div>

<script>
    // All default timeranges
    // [timestamp in ms, [], name, bool: locked for premium]
    let DATAS_timeranges = [
        [86400000, [], "Ces dernières 24 heures", 0],
        [86400000 * 2, [], "Ces dernières 48 heures", 0],
        [86400000 * 7, [], "Ces derniers 7 jours", 0],
        [86400000 * 28, [], "Ces derniers 28 jours", 0],
        [2592000000, [], "Ces derniers 31 jours", 0],
    ];

    // Global stats
    let DATAS_globalStats = {
        total: {
            messages: 151456
        },
        infos: {
            botJoinTime: 1595808000000
        }
    }

    // TO DO: fetch from BDD
    let actualDate = +new Date();

    let DATAS_statsDataRange = [
        [{
            date: actualDate,
            readableDate: formatTime(actualDate, 0, "FR"),
            messages: 15,
            voice: 5874
        }],
        [{
            date: actualDate - 46400000 * 2,
            readableDate: formatTime(actualDate - (46400000 * 2), 0, "FR"),
            messages: 13,
            voice: 10547
        }],
        [{
            date: actualDate - (46400000 * 10),
            messages: 14,
            readableDate: formatTime(actualDate - (46400000 * 10), 0, "FR"),
            voice: 387
        }],
        [{
            date: actualDate - (46400000 * 6),
            readableDate: formatTime(actualDate - (46400000 * 6), 0, "FR"),
            messages: 12,
            voice: 1254
        }]
    ];


    console.group("Sorting all datas in each timerange:")

    // Then compute all datas related to each timerange
    DATAS_timeranges.forEach((timerange, i) => {

        console.log(`[${Math.round(((i+1)/DATAS_timeranges.length)*100)}%] Computing datas for "${timerange[2]}" timerange...`);
        timerange[1] = DATAS_statsDataRange.filter((e) => e[0].date > actualDate - timerange[0]);

        if (i + 1 >= DATAS_timeranges.length) console.groupEnd();

    });

    // Processing stats into different timeranges

    // Add globalcontainer as a component
    addComponent("globalLoaderContainer", "loaderGlobalContainer");

    // Display loader
    setLoader(components.globalLoaderContainer, {
        "size": "5em",
        "subText": {
            "autoText": true
        }
    });
</script>

<!-- ChartJS -->
<script src="../src/components/chartjs.js"></script>

<!-- CSS files -->
<link href="../src/css/themes/global/pages/client/stats/layout.css" rel="stylesheet">

<!-- Layout container -->
<div id="statsLayout" class="statsLayout"></div>

<!-- JS scripts -->
<script src="../src/js/pages/client/stats/layout.js"></script>