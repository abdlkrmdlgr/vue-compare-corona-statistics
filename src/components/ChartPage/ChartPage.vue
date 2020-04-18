<template>
    <div class="ChartPage">
        <div class="col-md-12 text-center">
            <h3>Selected Countries Comparable Line Chart</h3>
            <span class="badge badge-info mr-1 p-2 d-none" v-for="country in selectedCountry" :key="country">#{{country}}</span>
            <p class="text-left">
                <router-link to="/">
                <span class="btn btn-warning">
                    <font-awesome-icon icon="share" rotation="180" flip="horizontal"/>
                    Back to Country List
                </span>
                </router-link>
            </p>
        </div>
<!--        <div class="col-md-12 text-left mb-2">-->
<!--            <router-link to="/">-->
<!--                <span class="btn btn-warning">-->
<!--&lt;!&ndash;                    <font-awesome-icon icon="share" rotation="180" flip="horizontal" spin="1" style="animation-direction: reverse;"/>&ndash;&gt;-->
<!--                    <font-awesome-icon icon="share" rotation="180" flip="horizontal"/>-->
<!--                    Back to Country List-->
<!--                </span>-->
<!--            </router-link>-->
<!--        </div>-->
        <hr/>
        <LineChart/>
    </div>
</template>

<script>
    import LineChart from "@/components/LineChart/LineChart";
    export default {
        components: {LineChart},
        props: {

        },
        data:function () {
            return {
                selectedCountry:[]
            };
        },
        created() {
            this.selectedCountry = this.$route.params.countryStr.split("-");
        }
    };
</script>
