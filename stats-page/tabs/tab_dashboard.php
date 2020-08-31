<div class="flex">
    <!-- Mobile stats box -->
    <div class="general-stats-box col-lg-3 col-xs-10 d-lg-none">
        <div id="general-stats-box-0" class="flex align-center">
            <div class="flex align-center">
                <div class="flex box-center">
                    <i class="fas fa-chart-pie"></i>
                </div>
                <div class="text">
                    <h4>Bienvenue</h4>
                    <h5>Chargement...</h5>
                </div>
            </div>
        </div>
    </div>

    <div id="generalStatBoxChanger" class="general-stat-box-changer col-xs-offset-1 col-xs-2 d-lg-none flex box-center">
        <i class="fas fa-chevron-down"></i>
    </div>

    <!-- First general stats (has to be the first child) -->
    <div class="general-stats-box col-lg-3 col-xs-10 d-sm-none">
        <div id="general-stats-box-1" class="flex align-center">
            <div class="flex box-center">
                <i class="fas fa-comment-alt"></i>
            </div>
            <div class="text">
                <h4>Messages</h4>
                <h5><i class="fas fa-comments"></i> 15 541 148</h5>
            </div>
        </div>
    </div>

    <div class="general-stats-box col-lg-3 col-xs-9 d-sm-none">
        <div id="general-stats-box-2" class="flex align-center">
            <div class="flex box-center">
                <i class="fas fa-users"></i>
            </div>
            <div class="text">
                <h4>Membres</h4>
                <h5><i class="fas fa-user"></i> 99 999</h5>
            </div>
        </div>
    </div>

    <div class="general-stats-box col-lg-3 col-xs-9 d-sm-none">
        <div id="general-stats-box-3" class="flex align-center">

            <div class="flex box-center">
                <i class="fas fa-microphone"></i>
            </div>
            <div class="text">
                <h4>Temps vocal</h4>
                <h5><i class="fas fa-history"></i> 15j 15h 12s</h5>
            </div>
        </div>
    </div>

    <div class="general-stats-box col-lg-3 col-xs-9 d-sm-none">
        <div id="general-stats-box-4" class="flex align-center">

            <div class="flex box-center">
                <i class="fas fa-history"></i>
            </div>
            <div class="text">
                <h4>En ligne</h4>
                <h5><i class="fas fa-user"></i> 99 999</h5>
            </div>
        </div>
    </div>
</div>

<div class="w-100p flex wrap align-center">

    <div class="w-100p flex mobile-wrap">
        <!-- Graph 1 (Messages) -->
        <div class="stats-box large col-lg-8 col-xs-12">
            <div class="col-lg-9 col-xs-12">

                <canvas id="chartDashboardMessages" width="100%"></canvas>
                <script>
                    drawChart("chartDashboardMessages", {
                        "datasets": {
                            labels: DATAS_statsDatas.readableDate,
                            datasets: [{
                                label: 'Messages',
                                data: [12, 19, 3, 15, 2, 3],
                                backgroundColor: 'rgba(114,137,218,0.4)',
                                borderColor: '#4a64b8',
                                borderWidth: 1
                            }]
                        }
                    });
                </script>
            </div>
            <div class="stats-info col-lg-3 d-sm-none">
                <div class="flex align-center primary-stats">
                    <h1 class="font-family-arial" data-stats-id="dashboard" data-stats-method="total" data-stats-type="messages">99 999</h1>
                </div>
                <h4 class="font-family-arial">Messages</h4>
                <div class="flex align-center secondary-stats">
                    <h3 class="font-family-arial" data-stats-method="average-indicator" data-stats-id="dashboard" data-stats-type="messages">
                        <span class="indicator equal">=</span> ...
                    </h3>
                    <h5><i class="fas fa-comment-alt"></i></h5>
                </div>
                <h5 class="font-family-arial">De plus qu'en moyenne</h5>
            </div>
            <div class="stats-info-mobile d-lg-none col-xs-12 flex">
                <div class="primary-stats">
                    <h3 class="no-break font-family-arial">99 999</h3>
                    <h5 class="font-family-arial">Messages</h5>
                </div>
                <div class="separator"></div>
                <div class="secondary-stats">
                    <h3 class="no-break font-family-arial">+ 18 999</h3>
                    <h5 class="font-family-arial">De plus qu'en moyenne</h5>
                </div>
            </div>
        </div>

        <!-- Stats #2 - Mentions/Pings -->
        <div class="stats-box right small col-lg-4 col-xs-12 flex box-center">
            <div class="head d-sm-none">
                <h4><i class="fas fa-at"></i> Mentions / Pings</h4>
            </div>
            <div class="body">
                <div class="flex wrap center">
                    <div class="flex text align-center d-sm-none">
                        <h1>75 621</h1>
                        <h2><i class="fas fa-at"></i></h2>
                    </div>
                    <div class="flex mobile-text d-lg-none align-center">
                        <h2>75 621</h2>
                        <h4><i class="fas fa-at"></i></h4>
                    </div>
                    <h4>Mentions envoyées</h4>
                    <h5 class="moyenne"><i class="fas fa-chevron-up"></i> <strong>16</strong> de plus qu'en moyenne</h5>
                </div>
            </div>
        </div>
    </div>

    <!-- Second stats line -->
    <div class="w-100p flex mobile-wrap">
        <!-- Small: doughnut joins vs leaves -->
        <div class="stats-box small col-lg-4 col-xs-12 static">
            <div class="head static">
                <h4><i class="fas fa-users"></i> Arrivés vs Départs</h4>
            </div>
            <div class="flex center">
                <div class="body flex center">
                    <canvas id="chartDashboardInOut" width="80%"></canvas>
                    <script>
                        drawPieChart("chartDashboardInOut", {
                            "datasets": {
                                labels: ['Arrivés', 'Départs'],
                                datasets: [{
                                    label: 'Membres',
                                    data: [36, 12],
                                    backgroundColor: ["#5b78da", "#3f56a0"],
                                    borderColor: ["#5b78da", "#3f56a0"],
                                    hoverColor: ["#3f56a0", "#5b78da"],
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                type: "doughnut"
                            }
                        });
                    </script>
                </div>
            </div>
        </div>

        <!-- Large: dashboard member line chart -->
        <div class="stats-box large right col-lg-8 col-xs-12">
            <div class="col-lg-9 col-xs-12">

                <canvas id="chartDashboardMembers" width="100%"></canvas>
                <script>
                    drawChart("chartDashboardMembers", {
                        datasets: {
                            labels: DATAS_statsDatas.readableDate,
                            datasets: [{
                                label: 'Membres',
                                data: [368, 374, 387, 371, 373, 374],
                                backgroundColor: 'rgba(114,137,218,0.4)',
                                borderColor: '#4a64b8',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            beginAtZero: false
                        }
                    });
                </script>
            </div>
            <div class="stats-info col-lg-3 d-sm-none">
                <div class="flex align-center primary-stats">
                    <h1 class="font-family-arial">99 999</h1>
                </div>
                <h4 class="font-family-arial">Messages</h4>
                <div class="flex align-center secondary-stats">
                    <h3 class="font-family-arial">
                        <span class="indicator plus">+</span> 18 999
                    </h3>
                    <h5><i class="fas fa-comment-alt"></i></h5>
                </div>
                <h5 class="font-family-arial">De plus qu'en moyenne</h5>
            </div>
            <div class="stats-info-mobile d-lg-none col-xs-12 flex">
                <div class="primary-stats">
                    <h3 class="no-break font-family-arial">99 999</h3>
                    <h5 class="font-family-arial">Messages</h5>
                </div>
                <div class="separator"></div>
                <div class="secondary-stats">
                    <h3 class="no-break font-family-arial">+ 18 999</h3>
                    <h5 class="font-family-arial">De plus qu'en moyenne</h5>
                </div>
            </div>
        </div>
    </div>

    <!-- Thrid stats line -->
    <div class="w-100p flex mobile-wrap">
        <!-- Large: voice line graph -->
        <div class="stats-box large col-lg-8 col-xs-12">
            <div class="col-lg-9 col-xs-12">

                <canvas id="chartDashboardVoice" width="100%"></canvas>
                <script>
                    drawChart("chartDashboardVoice", {
                        "datasets": {
                            labels: DATAS_statsDatas.readableDate,
                            datasets: [{
                                label: 'Temps en vocal',
                                data: DATAS_statsDatas.voice,
                                backgroundColor: 'rgba(114,137,218,0.4)',
                                borderColor: '#4a64b8',
                                borderWidth: 1
                            }],
                        },
                        "settings": {
                            tooltip: {
                                label: ": {label}",
                                formula: "time"
                            }
                        }
                    });
                </script>
            </div>
            <div class="stats-info col-lg-3 d-sm-none">
                <div class="flex align-center primary-stats">
                    <h1 class="font-family-arial" data-stats-id="dashboard" data-stats-method="total" data-stats-format="time" data-stats-type="voice">...</h1>
                </div>
                <h4 class="font-family-arial">Temps vocal</h4>
                <div class="flex align-center secondary-stats">
                    <h3 class="font-family-arial" data-stats-method="average-indicator" data-stats-id="dashboard" data-stats-type="voice" data-stats-format="time">
                        <span class="indicator plus">+</span> 18 999
                    </h3>
                    <h5><i class="fas fa-microphone"></i></h5>
                </div>
                <h5 class="font-family-arial">De plus qu'en moyenne</h5>
            </div>
            <div class="stats-info-mobile d-lg-none col-xs-12 flex">
                <div class="primary-stats">
                    <h3 class="no-break font-family-arial">99 999</h3>
                    <h5 class="font-family-arial">Messages</h5>
                </div>
                <div class="separator"></div>
                <div class="secondary-stats">
                    <h3 class="no-break font-family-arial">+ 18 999</h3>
                    <h5 class="font-family-arial">De plus qu'en moyenne</h5>
                </div>
            </div>
        </div>

        <!-- Stats #2 - Mentions/Pings -->
        <div class="stats-box right small col-lg-4 col-xs-12 flex box-center">
            <div class="head d-sm-none">
                <h4><i class="fas fa-at"></i> Mentions / Pings</h4>
            </div>
            <div class="body">
                <div class="flex wrap center">
                    <div class="flex text align-center d-sm-none">
                        <h1>75 621</h1>
                        <h2><i class="fas fa-at"></i></h2>
                    </div>
                    <div class="flex mobile-text d-lg-none align-center">
                        <h2>75 621</h2>
                        <h4><i class="fas fa-at"></i></h4>
                    </div>
                    <h4>Mentions envoyées</h4>
                    <h5 class="moyenne"><i class="fas fa-chevron-up"></i> <strong>16</strong> de plus qu'en moyenne</h5>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    firstStatTabLoaded();
    overwriteStats("dashboard");
</script>