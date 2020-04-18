<template>
    <div class="CountryList container">
        <div class="row">
            <div class="col-md-12 col-sm-4 col-2 text-center">
                <div class="vueLogo" style="width: 64px; height: 64px;"></div>
            </div>
            <div class="col-md-12 col-sm-8 col-10 text-right">
                <h5 class="text-danger">
                    <!--            <FontAwesomeIcon icon=faExclamationTriangle className="mr-2" width={32}/>-->
                    Heyyy! Compare Corona Stats by Country of Your Choice
                </h5>
                <p class="text-right small">

                    <a target="_blank" href="http://corona.abdulkerimdulger.com">
                        <font-awesome-icon icon="link" class="mr-1"/>
                        corona.abdulkerimdulger.com
                    </a>
                    <br/>

                    <a target="_blank" href="https://twitter.com/bortecoder">
                        <font-awesome-icon icon="at" class="mr-1"/>
                        bortecoder
                    </a>
                    <br/>
                    <span class="text-primary">
                    <font-awesome-icon icon="code" class="mr-1"/>
                    Abdülkerim DÜLGER
                    </span>
                </p>
            </div>
        </div>

        <div class="row form-group p-3">
            <div class="col-md-6 float-left mb-1">
                <input id="searchInput"
                       type="text"
                       placeholder="Filter Country"
                       class="form-control"
                       @keydown.enter="searchEnterKey"
                       @keyup="handleCountrySearch">
            </div>
            <div class="col-md-6 float-left mb-1">
                <button class="form-control btn btn-warning col-md-5 mr-1 mb-1" @click="clearFilterClick">
                    <font-awesome-icon icon="brush"/>
                    Clear Filter
                </button>
                <router-link :to="{ name: 'chart', params: { countryStr: this.selectedCountryStr }}"
                             class="form-control btn btn-info col-md-6 mb-1">
                    <font-awesome-icon icon="chart-line"/>
                    Show Comparable Chart
                </router-link>
            </div>
        </div>
        <div class="col-md-12 selectedCountryList"></div>
        <hr/>
        <div v-for="(item,name) in countryItem" :key="name"
             class="col-md-3 float-left mb-2 countryItem"
             @click="handleCountryClick($event,name)">
            <div class="countryItemInnerDiv p-2 border text-danger padding-10 text-right h2 font-weight-bold text-white">
                <Country :data="item" :countryName="name"/>
            </div>
        </div>
    </div>
</template>
<script>
    import Country from "@/components/Country/Country";
    import $ from 'jquery'

    export default {
        name: 'App',
        components: {
            Country
        },
        data: function () {
            return {
                countryItem: this.countryData,
                flags: this.flags,
                selectedCountry: [],
                selectedCountryBadge: [],
            };
        },
        computed: {
            selectedCountryStr: function () {
                return this.selectedCountry.join("-")
            }
        },
        created() {
            this.selectedCountry = [];
            this.selectedCountryBadge = [];

            fetch("https://pomber.github.io/covid19/timeseries.json")
                .then(r => r.json())
                .then(json => {

                    json["Palestine"] = json["West Bank and Gaza"];
                    json["United States"] = json["US"];
                    delete json["West Bank and Gaza"];
                    delete json["US"];
                    delete json["MS Zaandam"];
                    delete json["Diamond Princess"];

                    this.countryItem = json;


                });
        },
        methods: {
            searchEnterKey: function () {
                $(".countryItem[style='display: block;']")[0].click();
            },
            handleCountrySearch: function () {
                $(".countryItem").css("display", "none");
                $(".countryItemLabel").each(function () {
                    if ($(this).text().toLowerCase().match($("#searchInput").val().toLowerCase())) {
                        this.parentElement.parentElement.parentElement.style.display = "block";
                    }
                });
            },
            clearFilterClick: function () {
                $("#searchInput").val("");
                $(".selectedCountryList").html("");

                $(".countryItem .countryItemInnerDiv").removeClass("text-white bg-info");
                $(".countryItem .countryItemInnerDiv").addClass("text-danger");

                this.handleCountrySearch();
            },
            handleCountryClick: function (e, countryName) {
                var selectorClass = "text-white bg-info";
                var item = $(e.currentTarget.firstChild);
                if (item.hasClass(selectorClass)) {
                    item.removeClass(selectorClass);
                    item.addClass("text-danger");
                    $(".badge:contains(" + countryName + ")").remove()
                } else {
                    item.addClass(selectorClass);
                    item.removeClass("text-danger");
                    // this.selectedCountryBadge.push("<span class=\"countryBadge pointer badge badge-info p-2\">" + countryName + "</span>")
                    this.selectedCountry.push(countryName);
                    $(".selectedCountryList").append("<span onclick='handleBadgeClick(this)' class=\"countryBadge pointer badge badge-info p-2 mr-1\">#" + countryName + "</span>");
                }
            }
        }
    }
</script>

<style>
    .countryItem div {
        border-radius: 5px;
        cursor: pointer;
    }

    .vueLogo {
        background-color: transparent;
        background-image: url("../../assets/logo.png");
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
    }

    .countryItemInnerDiv {
        height: 150px;
    }

    .countryItem .countryItemInnerDiv:hover {
        color: #fff !important;
        transition: background-color 0.5s ease;
        background-color: #17a2b8 !important;
    }
</style>
