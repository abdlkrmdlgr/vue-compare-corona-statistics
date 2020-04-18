<template>
    <div class="CountryList container">
        <div class="row">
            <div class="col-md-1 col-sm-4 col-2 text-left text-info">
                <font-awesome-icon icon="chart-line" size="4x"/>
            </div>
            <div class="col-md-11 col-sm-8 col-10 text-right">
                <h3 class="text-danger bv-d-sm-down-none">
                    Heyyy! Compare Corona Stats by Country of Your Choice
                </h3>
                <h6 class="text-danger d-md-none d-lg-none">
                    Heyyy! Compare Corona Stats by Country of Your Choice
                </h6>
                <p class="text-right small">
                    <a target="_blank" href="https://twitter.com/bortecoder">
                        <font-awesome-icon icon="at" class="mr-1"/>
                        bortecoder
                    </a>
                    <br/>
                    <span class="text-primary">
                    <a target="_blank" href="https://twitter.com/bortecoder">
                    <font-awesome-icon icon="code" class="mr-1"/>
                        Abdülkerim DÜLGER
                    </a>
                    </span>
                </p>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-md-6 float-left mb-1">
                <input id="searchInput"
                       type="text"
                       placeholder="Filter Country"
                       class="form-control"
                       @keydown.enter="searchEnterKey"
                       @keyup="handleCountrySearch">
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12 col-12 float-left mb-1 text-center">
                <router-link :to="{ name: 'chart', params: { countryStr: this.selectedCountryStr }}"
                             class="form-control btn btn-info col-lg-9 col-md-8 col-sm-9 col-9 mr-sm-0 mb-1 mr-sm-1 ">
                    <font-awesome-icon icon="chart-line"/>
                    Show Chart
                </router-link>
                <button class="form-control btn btn-warning col-lg-2 col-md-2 col-sm-2 col-3 mb-1"
                        @click="clearFilterClick">
                    <font-awesome-icon icon="brush"/>
                </button>
            </div>
        </div>
        <div class="col-md-12 selectedCountryList"></div>
        <hr/>
        <div v-for="(item,name) in countryItem" :key="name"
             class="col-lg-3 col-md-4 col-sm-6 col-6 float-left mb-1 countryItem"
             @click="handleCountryClick($event,name)">
            <div class="countryItemInnerDiv p-1 border text-danger text-right h6 font-weight-bold text-white">
                <Country :data="item" :countryName="name"/>
            </div>
        </div>
        <button @click="topFunction" class="btn btn-danger scrollToTopButton">
            <font-awesome-icon icon="arrow-circle-up"/>
        </button>
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

                    var sortedCountry = ["United States","Russia","Spain", "France", "Italy", "Portugal", "Germany", "Finland", "Norway", "Australia",
                        "Greece", "Denmark", "Czechia", "China", "India",
                        "Hungary","Kazakhstan", "Bosnia and Herzegovina", "Azerbaijan", "Turkey"];

                    sortedCountry.forEach(item => {
                        var sortedCountryData = {};
                        sortedCountryData[item] = json[item];
                        json = Object.assign(sortedCountryData, json);
                    });
                    this.countryItem = json;
                });
        },
        mounted() {
            this.focusSearchInput();
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

                this.selectedCountry = [];
                this.handleCountrySearch();
                this.focusSearchInput();
            },
            handleCountryClick: function (e, countryName) {
                var selectorClass = "text-white bg-info";
                var item = $(e.currentTarget.firstChild);
                if (item.hasClass(selectorClass)) {
                    item.removeClass(selectorClass);
                    item.addClass("text-danger");
                    $(".badge:contains(" + countryName + ")").remove();
                    this.selectedCountry.splice(this.selectedCountry.indexOf(countryName), 1);
                } else {
                    item.addClass(selectorClass);
                    item.removeClass("text-danger");
                    // this.selectedCountryBadge.push("<span class=\"countryBadge pointer badge badge-info p-2\">" + countryName + "</span>")
                    this.selectedCountry.push(countryName);
                    $(".selectedCountryList").append("<span onclick='handleBadgeClick(this)' class=\"countryBadge pointer badge badge-info p-2 mr-1\">#" + countryName + "</span>");
                }
            },
            topFunction: function () {
                $("html, body").animate({
                    scrollTop: 0
                }, 1000);
                return false;
            },
            focusSearchInput:function () {
                $("#searchInput").focus();
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
        height: 90px;
    }

    .countryItem .countryItemInnerDiv:focus {
        color: #fff !important;
        transition: background-color 0.5s ease;
        background-color: #17a2b8 !important;
    }

    .scrollToTopButton {
        position: fixed;
        bottom: 20px;
        right: 30px;
        z-index: 99;
        cursor: pointer;

    }
</style>
