<?php
// For security reasons, we communicate with the database only once.
include_once("../../../../../../src/php/config/oldDatabasePdo.php");
?>
    <div id="loaderGlobalContainer"></div>
    <div id="device-screen-size-sm" class="d-lg-none"></div>

    <script>
        // All default timeranges
        // [timestamp in ms, [], name, bool: locked for premium]
        let DATAS_timeranges = [
            [86400000, [], "Ces dernières 24 heures", 0],
            [86400000 * 2, [], "Ces 48 dernières heures", 0],
            [86400000 * 7, [], "Ces 7 derniers jours", 0],
            [86400000 * 28, [], "Ces 28 derniers jours", 0],
            [2592000000, [], "Ces derniers 31 jours", 0],
            [2592000000 * 3, [], "Ces 3 derniers mois", 1],
            [2592000000 * 12, [], "Cette dernière année", 1],
            [+new Date(), [], "Depuis toujours", 1],

        ];

        <?php 
            $guildId = intval(htmlspecialchars($_GET['id']));
            $guildInfos = $oldPDO->query("SELECT * FROM serveurs WHERE id = $guildId")->fetch();
        ?>

        // Global stats/infos
        let DATAS_globalStats = {
            total: {
                messages: <?php echo $guildInfos['messages']; ?>,
                voice_time: <?php echo $guildInfos['voice_time'] / 1000; ?>,
                type_time: <?php echo $guildInfos['type_time'] / 1000; ?>,
            },
            infos: {
                statsAccuracyDivider: 7200000,
                botJoinTime: <?php echo $guildInfos['joinedDate']; ?>,
                guildID: guildId
            },
            app: {
                advancedDebugging: false // Enable/Disable advanced debugging
            }
        }

        // TO DO: fetch from BDD
        let actualDate = +new Date();

        let DATAS_statsDataRange = [

            <?php 
        foreach($oldPDO->query("SELECT * FROM suivi_semi_horaire WHERE serveur = $guildId LIMIT 5000") AS $statsReport) {
        
        ?>

            [{
                date: (<?php echo $statsReport['date']; ?> * DATAS_globalStats.infos.statsAccuracyDivider),
                readableDate: formatTime((<?php echo $statsReport['date']; ?> * DATAS_globalStats.infos.statsAccuracyDivider), 0, "FR"),

                messages: <?php echo $statsReport['messages']; ?>,
                voice_time: <?php echo $statsReport['voice_time']; ?> / 1000,
                mentions: <?php echo $statsReport['mentions']; ?>,
                typetime: <?php echo $statsReport['type_time']; ?> / 1400,
                deletedMessages: <?php echo $statsReport['suppr']; ?>,

                members: <?php echo $statsReport['membres']; ?>,
                //usersLeaves: <?php echo explode(",",$statsReport['joins-leaves'])[1]; ?>,
                //usersJoins: <?php echo explode(",",$statsReport['joins-leaves'])[0]; ?>,
            }],

            <?php } ?>
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
    <script src="ajax/displayData/stats/stats-page/stats-page/js/layout.js"></script>