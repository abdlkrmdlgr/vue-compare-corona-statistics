<template>
    <div class="LineChart">
        <div class="text-left pl-3 d-md-block d-lg-block d-none d-sm-none">
            <router-link to="/">
                        <span class="btn btn-warning">
                            <font-awesome-icon icon="share" rotation="180" flip="horizontal"/>
                        </span>
            </router-link>
        </div>
        <div class="row flex-row-reverse chartGroupButton mr-2 ml-2">
            <div class="col-lg-2 col-md-4 col-sm-4 col-4 p-1 ">
                <button class="col-md-12 btn btn-success font-weight-bold blackButtonText chartTypeR"
                        @click="drawChart($event,'R')">
                    <font-awesome-icon icon="percentage" size="2x"/>
                    <p class="mb-0">Case/Death</p>
                </button>
            </div>

            <div class="col-lg-2 col-md-4 col-sm-4 col-4 p-1">
                <button class="col-md-12 btn btn-info font-weight-bold blackButtonText chartTypeC"
                        @click="drawChart($event,'C')">
                    <font-awesome-icon icon="procedures" size="2x"/>
                    <p class="mb-0">Confirmed Case</p>
                </button>
            </div>

            <div class="col-lg-2 col-md-4 col-sm-4 col-4 p-1">
                <button class="col-md-12 btn btn-danger font-weight-bold blackButtonText chartTypeD"
                        @click="drawChart($event,'D')">
                    <font-awesome-icon icon="skull-crossbones" size="2x"/>
                    <p class="mb-0">Death Case</p>
                </button>
            </div>
        </div>
        <hr/>

        <div class="container pl-3 pt-2">
            <div class="row justify-content-center ">
                <div>
                    <font-awesome-icon icon="calendar-alt"/>
                </div>
                <div>
                    <v-md-date-range-picker
                            :presets="presets"
                            :start-date="startDate"
                            :end-date="endDate"
                            @change="customHandleDateChange">
                    </v-md-date-range-picker>

                </div>
            </div>
        </div>
        <div>
            <p class="small d-lg-none d-sm-none d-md-none" v-if="isLangTr">Grafiği daha iyi görebilmek için ekranı
                döndürün.</p>
            <p class="small d-lg-none d-sm-none d-md-none" v-else>Rotate the screen to see the chart better.</p>
            <div class="row canvasDiv m-2">
                <canvas id="line-chart" width="800" height="520"/>
            </div>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery'
    import Chart from 'chart.js';

    export default {
        props: {},
        components: {
        },
        data: function () {
            return {
                countryItem: [],
                countries: [],
                language: "tr",
                startDate: "0",
                endDate: "0",
                chartType: 'D',
                presets: [{
                    label: '',
                    range: []
                }]
            }
        },
        computed: {
            isLangTr: function () {
                return navigator.language.split("-")[0] == "tr";
            }
        },
        created() {
        },
        mounted() {
            $(".activator-wrapper label").html("<span class='badge badge-info'>Select Date Range</span>");
            $(".mdrp__activator .activator-wrapper .text-field").css("border","none");
            this.countries = this.$route.params.countryStr.split("-");
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
                    this.handleDateChange(new Date(), true);
                });
        },
        methods: {
            drawChart: function (event, type) {
                var dataObject = [];
                var dateObject = [];
                var detailMessage = null;
                this.chartType = type;

                $(".chartGroupButton button").each(function (index, item) {
                    $(item).removeClass("whiteButtonText");
                    $(item).addClass("blackButtonText");
                });

                $(event.currentTarget).removeClass("blackButtonText");
                $(event.currentTarget).addClass("whiteButtonText");

                var colorArr = ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#FF0000", "#000", "#FF0", "#999",
                    "#00FF00","#0000FF","#FFFF00","#00FFFF","#FF00FF","#C0C0C0","#808080","#800000",
                    "#808000","#008000","#800080","#008080","#000080"];

                var colorIndex = 0;
                this.countries.forEach(country => {

                    var datesArr = [];
                    var confirmedArr = [];
                    var deathsArr = [];
                    var caseDeathRatioArr = [];

                    // //gün gün tarihler dönülür.
                    Object.keys(this.countryItem[country]).map(index => {

                        let yesterdaysItem = null;
                        if (index!=0){
                            yesterdaysItem = this.countryItem[country][index - 1];
                        }
                        var item = this.countryItem[country][index];

                        var parsedItemDate = item.date.split("-");
                        if (parsedItemDate[1].length === 1) parsedItemDate[1] = "0" + parsedItemDate[1];
                        if (parsedItemDate[2].length === 1) parsedItemDate[2] = "0" + parsedItemDate[2];
                        item.date = parsedItemDate[0] + "-" + parsedItemDate[1] + "-" + parsedItemDate[2];

                        if (Date.parse(item.date) >= Date.parse(this.startDate) && Date.parse(item.date) <= Date.parse(this.endDate)) {
                            datesArr.push(item.date);

                            let confirmedCount = item.confirmed;
                            let deathsCount = item.deaths;
                            // let caseDeathRatio = item.recovered;
                            let caseDeathRatio =  deathsCount / confirmedCount;

                            if (yesterdaysItem!=null){
                                confirmedCount = confirmedCount - yesterdaysItem.confirmed;
                                deathsCount = deathsCount - yesterdaysItem.deaths;
                                caseDeathRatio = confirmedCount / deathsCount;
                            }

                            confirmedArr.push(confirmedCount);
                            deathsArr.push(deathsCount);
                            caseDeathRatioArr.push(caseDeathRatio);
                        }
                    });

                    dateObject = datesArr;

                    var sourceData = null;

                    if (type === "D") {
                        sourceData = deathsArr;
                        detailMessage = "Death Statistic";
                    } else if (type === "C") {
                        sourceData = confirmedArr;
                        detailMessage = "Confirmed Statistic";
                    } else if (type === "R") {
                        sourceData = caseDeathRatioArr;
                        detailMessage = "Case / Death ratio. One person died in as many cases as the numbers on the left of the table.";
                    }

                    dataObject.push(
                        {
                            data: sourceData,
                            label: country,
                            borderColor: colorArr[colorIndex],
                            fill: false
                        }
                    );
                    colorIndex += 1;
                });

                $(".canvasDiv canvas").remove();
                $(".canvasDiv").html('<canvas id="line-chart" width="800" height="320"/>');

                new Chart(document.getElementById("line-chart"), {
                    type: 'line',
                    data: {
                        labels: dateObject,
                        datasets: dataObject
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'Corona Statistic - ' + detailMessage
                        }
                    }
                });
            },
            customHandleDateChange: function (date) {
                this.handleDateChange(date, false);
            },
            handleDateChange: function (date, isDefault) {
                if (isDefault) {
                    this.startDate = date.getFullYear() + "-" + (date.getMonth()<10?"0"+date.getMonth():date.getMonth()) + "-01";
                    const nextMonth = date.getMonth() + 1;
                    var tempEndDate = new Date(date.getFullYear(), nextMonth, 0);
                    this.endDate = tempEndDate.getFullYear() + "-" +
                        (tempEndDate.getMonth()+1<10?"0"+(tempEndDate.getMonth()+1):tempEndDate.getMonth()+1)
                        + "-" + tempEndDate.getDate();
                } else {
                    this.startDate = new Date(date[0])+"";
                    this.endDate = new Date(new Date(new Date(Date.parse(date[1])).setHours(23)).setMinutes(59))+"";
                }
                $(".chartType" + this.chartType).click();
            }
        }
    };
</script>
<style>
    .whiteButtonText {
        color: white !important;
    }

    .whiteButtonText:hover {
        color: white !important;
    }

    .blackButtonText {
        color: black !important;
    }

    .blackButtonText:hover {
        color: white !important;
    }

</style>
