<template>
  <q-page class="">
    <div class="q-pa-md">
      <div class="row justify-around">
        <div class="col-6">
            <iframe src="http://10.36.54.195:3000/d-solo/2R6Lv10nk/cpu0?orgId=1&panelId=2&refresh=1s" width="100%" height="100%" frameborder="0"></iframe>
        </div>
        <div class="col-6">
            <iframe src="http://10.36.54.195:3000/d-solo/2R6Lv10nk/cpu0?orgId=1&panelId=3&refresh=1s" width="100%" height="100%" frameborder="0"></iframe>
        </div>
      </div>
      <div class="row justify-around">
        <div class="col-6">
            <iframe src="http://10.36.54.195:3000/d-solo/2R6Lv10nk/cpu0?orgId=1&panelId=3&refresh=1s" width="100%" height="100%" frameborder="0"></iframe>
        </div>
        <div class="col-6">
            <iframe src="http://10.36.54.195:3000/d-solo/2R6Lv10nk/cpu0?orgId=1&panelId=3&refresh=1s" width="100%" height="100%" frameborder="0"></iframe>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  mounted () {
    console.log(this.$route.params.keyValue)
  }

}

</script>

<style scoped>
.pink-custom {
  color: #D705DC;
}
</style>
