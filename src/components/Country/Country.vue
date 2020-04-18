<template>
    <div class="Country">
        <div style="height: 100px;" class="countryItemLabel">
            <div style="height: 80%">{{countryNameStr}}</div>
            <div class="text-left mb-0" style="height: 64px">
                <img :src="flagUrl"/>
            </div>
        </div>
    </div>
</template>

<script>
    import flagJson from "../../../countryNameToCode";
    export default {
        name: 'Country',
        props: {
            data: Array,
            countryName: String
        },
        computed: {
            flagUrl: function () {
                return "https://www.countryflags.io/" + flagJson[this.countryName] + "/shiny/64.png"
            }
        },
        data() {
            return {
                countryNameStr: this.countryName,
            }
        }
    };
</script>
