<template>
  <q-page class="container" style="background: #343E59;">
    <div
      class="row q-col-gutter-md q-px-md q-pt-md justify-center"
      key="lineSmall"
    >
      <div class="col-md-3" v-for="i in 1" :key="i">
        <apex-line-small :bgColorCard="colors[i - 1]" :ref="'lineSmall0'" :title="'nr_free_pages'"></apex-line-small>
      </div>
      <div class="col-md-3" v-for="i in 1" :key="i+1">
        <apex-line-small :bgColorCard="colors[i]" :ref="'lineSmall1'" :title="'numa_hit'"></apex-line-small>
      </div>
      <div class="col-md-3" v-for="i in 1" :key="i+2">
        <apex-line-small :bgColorCard="colors[i + 1]" :ref="'lineSmall' + 2" :title="'numa_miss'"></apex-line-small>
      </div>
      <div class="col-md-3" v-for="i in 1" :key="i+3">
        <apex-line-small :bgColorCard="colors[i + 2]" :ref="'lineSmall' + 3" :title="'pgfault'"></apex-line-small>
      </div>
            <div class="col-md-6" v-for="i in 1" :key="i+8">
        <apex-line-small :bgColorCard="colors[i + 1]" :ref="'lineSmall' + 4" :title="'nr_shmem'"></apex-line-small>
      </div>
      <div class="col-md-6" v-for="i in 1" :key="i+9">
        <apex-line-small :bgColorCard="colors[i + 2]" :ref="'lineSmall' + 5" :title="'pgactivate'"></apex-line-small>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  components: {
    ApexLineSmall: () => import('components/ApexLineSmall')
  },
  data () {
    return {
      series: [ {
        data: []
      }],
      loading: true,
      dialog: true,
      colors: [
        'linear-gradient( 135deg, #ABDCFF 10%, #0396FF 100%)',
        'linear-gradient( 135deg, #2AFADF 10%, #4C83FF 100%)',
        'linear-gradient( 135deg, #FFD3A5 10%, #FD6585 100%)',
        'linear-gradient( 135deg, #EE9AE5 10%, #5961F9 100%)'
      ]
    }
  },
  mounted () {
    // console.log(this.$refs.radial1)
    this.getData(0, 'nr_free_pages')
    this.getData(1, 'numa_hit')
    this.getData(2, 'numa_miss')
    this.getData(3, 'pgfault')
    this.getData(4, 'nr_shmem')
    this.getData(5, 'pgactivate')
    setInterval(this.getData, 5000, 0, 'nr_free_pages')
    setInterval(this.getData, 5000, 1, 'numa_hit')
    setInterval(this.getData, 5000, 2, 'numa_miss')
    setInterval(this.getData, 5000, 3, 'pgfault')
    setInterval(this.getData, 5000, 4, 'nr_shmem')
    setInterval(this.getData, 5000, 5, 'pgactivate')
  },
  created () {
    this.$q.loading.show({
      backgroundColor: 'purple-10',
      delay: 0
    })
    setTimeout(() => {
      this.$q.loading.hide()
    }, 1300)
  },
  methods: {
    async getData (index, metric) {
      try {
        let { data } = await this.$axios.get('/api/v1/usage', {
          params: {
            metric: metric
          }
        })
        let meanData = data.map((value) => {
          return value.mean
        })
        let inData = [{
          data: meanData
        }]
        if (index === 0) {
          this.$refs.lineSmall0[0].$refs.realtimeChart.updateSeries(inData)
        } else if (index === 1) {
          this.$refs.lineSmall1[0].$refs.realtimeChart.updateSeries(inData)
        } else if (index === 2) {
          this.$refs.lineSmall2[0].$refs.realtimeChart.updateSeries(inData)
        } else if (index === 3) {
          this.$refs.lineSmall3[0].$refs.realtimeChart.updateSeries(inData)
        } else if (index === 4) {
          this.$refs.lineSmall4[0].$refs.realtimeChart.updateSeries(inData)
        } else if (index === 5) {
          this.$refs.lineSmall5[0].$refs.realtimeChart.updateSeries(inData)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>
