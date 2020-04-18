<template>
    <div class="LineChart">
        <div class="row flex-row-reverse chartGroupButton mr-2 ml-2">
            <div class="col-lg-2 col-md-4 col-sm-4 col-4 p-1">
                <button class="col-md-12 btn btn-success" @click="drawChart('R')">
                    <font-awesome-icon icon="running"/>
                    <p class="mb-0">Recovered Case</p>
                </button>
            </div>

            <div class="col-lg-2 col-md-4 col-sm-4 col-4 p-1">
                <button class="col-md-12 btn btn-warning" @click="drawChart('C')">
                    <font-awesome-icon icon="procedures"/>
                    <p class="mb-0">Confirmed Case</p>
                </button>
            </div>

            <div class="col-lg-2 col-md-4 col-sm-4 col-4 p-1">
                <button class="col-md-12 btn btn-danger" @click="drawChart('D')">
                    <font-awesome-icon icon="skull-crossbones"/>
                    <p class="mb-0">Death Case</p>
                </button>
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
        data: function () {
            return {
                countryItem: [],
                countries: []
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

            this.countries = this.$route.params.countryStr.split("-");
            fetch("https://pomber.github.io/covid19/timeseries.json")
                .then(r => r.json())
                .then(json => {
                    this.countryItem = json;
                    this.drawChart('D');
                });
        },
        methods: {
            drawChart: function (type) {
                var dataObject = [];
                var dateObject = [];
                var detailMessage = null;


                var colorArr = ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#FF0000", "#000", "#FF0", "#999"];
                var colorIndex = 0;
                this.countries.forEach(country => {

                    var datesArr = [];
                    var confirmedArr = [];
                    var deathsArr = [];
                    var recoveredArr = [];

                    // //gün gün tarihler dönülür.
                    Object.keys(this.countryItem[country]).map(index => {
                        var item = this.countryItem[country][index];

                        var parsedItemDate = item.date.split("-");
                        if (parsedItemDate[1].length == 1) parsedItemDate[1] = "0" + parsedItemDate[1];
                        if (parsedItemDate[2].length == 1) parsedItemDate[2] = "0" + parsedItemDate[2];
                        item.date = parsedItemDate[0] + "-" + parsedItemDate[1] + "-" + parsedItemDate[2];

                        if (Date.parse(item.date) >= Date.parse("2020-03-01")) {
                            datesArr.push(item.date);
                            confirmedArr.push(item.confirmed);
                            deathsArr.push(item.deaths);
                            recoveredArr.push(item.recovered);
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
                        sourceData = recoveredArr;
                        detailMessage = "Recovered Statistic";
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


            }
        }
    };
</script>
