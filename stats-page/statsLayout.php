<div class="side-nav col-lg-2 fade-in" id="side-nav">
    <div class="w-100p flex small-profile align-center">
        <img src="../src/components/images/background-loop1.png">
        <div class="text">
            <h4>Nom du serveur</h4>
            <h5>36.5k membres</h5>
        </div>
    </div>

    <div class="categorie">
        <p>statistiques</p>
    </div>
    <div class="nav-element flex" id="nav_statTab1" onclick="loadStatTab('statTab1')">
        <p><i class="fas fa-tachometer-alt"></i> Dashboard</p>
    </div>
    <div class="nav-element flex" id="nav_statTab2" onclick="loadStatTab('statTab2')">
        <p><i class="fas fa-chart-bar"></i> Mes stats</p>
    </div>
    <div class="nav-element flex" id="nav_statTab3" onclick="loadStatTab('statTab3')">
        <p><i class="fas fa-comments"></i> Messages</p>
    </div>
    <div class="nav-element flex" id="nav_statTab4" onclick="loadStatTab('statTab4')">
        <p><i class="fas fa-users"></i> Membres</p>
    </div>

    <div class="categorie">
        <p>avancé</p>
    </div>
    <div class="nav-element flex">
        <p><i class="fas fa-chart-line"></i> Projections</p>
    </div>
    <div class="nav-element flex">
        <p><i class="fas fa-crop"></i> Stats Avancées</p>
    </div>

    <div class="categorie">
        <p>paramètres</p>
    </div>
    <div class="nav-element flex">
        <p><i class="fas fa-star"></i> Server Premium</p>
    </div>
    <div class="nav-element flex">
        <p><i class="fas fa-cog"></i> Paramètres</p>
    </div>
    <div class="nav-element flex">
        <p><i class="fas fa-download"></i> Données</p>
    </div>
</div>

<div class="mobile-side-nav col-xs-2 d-lg-none fade-in" id="side-nav-mobile">
    <div class="nav-element large flex box-center">
        <i class="fas fa-bars"></i>
    </div>
    <hr>
    <div class="nav-element flex box-center">
        <i class="fas fa-tachometer-alt"></i>
    </div>
    <div class="nav-element flex box-center">
        <i class="fas fa-chart-bar"></i>
    </div>
    <div class="nav-element flex box-center">
        <i class="fas fa-comments"></i>
    </div>
    <div class="nav-element flex box-center">
        <i class="fas fa-users"></i>
    </div>
    <hr>
    <div class="nav-element flex box-center">
        <i class="fas fa-chart-line"></i>
    </div>
    <div class="nav-element flex box-center">
        <i class="fas fa-crop"></i>
    </div>
    <hr>
    <div class="nav-element flex box-center">
        <i class="fas fa-star"></i>
    </div>
    <div class="nav-element flex box-center">
        <i class="fas fa-cog"></i>
    </div>
    <div class="nav-element flex box-center">
        <i class="fas fa-download"></i>
    </div>
</div>

<div class="flex">

    <!-- Dashboard -->
    <div id="statTab1" class="statTab">
        <div class="line-center">
            <h1 style="color:#fff;">Chargement...</h1>
        </div>
    </div>

    <!-- Mes stats -->
    <div id="statTab2" class="statTab">
        <div class="line-center">
            <h1 style="color:#fff;">Chargement...</h1>
        </div>
    </div>

    <!-- Messages -->
    <div id="statTab3" class="statTab">
        <div class="line-center">
            <h1 style="color:#fff;">Chargement...</h1>
        </div>
    </div>

    <!-- Membres -->
    <div id="statTab4" class="statTab">
        tab 4
    </div>

    <!-- Not loaded -->
    <div id="statTab" class="statTab">

    </div>

</div>

<button class="devtool reload-button" onclick='components.jquery_globalContainer.load("ajax/getData/stats/getLayoutElements.php");'>Reload</button>

<script>
    statLayoutLoaded();
</script>