<template>
    <div class="LineChart">
        <div class="text-center chartGroupButton pt-2">
            <button class="col-md-2 col-sm-3 col-4 btn btn-success p-2 mr-1" @click="drawChart('R')">
                <font-awesome-icon icon="running"/>
                Recovered Chart
            </button>

            <button class="col-md-2 col-sm-3 col-4 btn btn-warning mr-1 p-2" @click="drawChart('C')">
                <font-awesome-icon icon="procedures"/>
                Confirmed Chart
            </button>

            <button class="col-md-2 col-sm-3 col-3 btn btn-danger mr-1 p-2" @click="drawChart('D')">
                <font-awesome-icon icon="skull-crossbones"/>
                Death Chart
            </button>
            <p class="small d-lg-none d-sm-none d-md-none" v-if="isLangTr">Grafiği daha iyi görebilmek için ekranı döndürün.</p>
            <p class="small d-lg-none d-sm-none d-md-none" v-else>Rotate the screen to see the chart better.</p>
            <div class="row canvasDiv p-5">
                <canvas id="line-chart" width="800"/>
            </div>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery'
    import Chart from 'chart.js';
    export default {
        props: {

        },
        data:function(){
            return {
                countryItem:[],
                countries:[]
            }
        },
        computed:{
            isLangTr: function () {
                return navigator.language.split("-")[0] == "tr";
            }
        },
        created() {
        },
        mounted(){

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

                        if (Date.parse(item.date) >= Date.parse("2020-3-1")) {
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
