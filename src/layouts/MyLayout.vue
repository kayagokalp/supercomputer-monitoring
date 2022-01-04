<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated class="shadow-8">
      <q-toolbar class="bg-custom-blue-dark">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="fas fa-bars" />
        </q-btn>

        <q-toolbar-title>
          Supercomputer Monitoring
        </q-toolbar-title>

        <q-btn
          style="background: #36384c"
          @click="$q.fullscreen.toggle()"
          :icon="$q.fullscreen.isActive ? 'fas fa-compress' : 'fas fa-expand'"
        />
        <!-- <div>Quasar v{{ $q.version }}</div> -->
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      content-class="bg-custom-blue-dark"
      :breakpoint="400"
      overlay
      elevated
      behavior="mobile"
    >
    <q-scroll-area style="height: calc(100% - 10px); margin-top: 10px;">
      <q-list class="text-white" >
        <q-item-label header>Menu</q-item-label>
        <q-item clickable to="/" exact active-class="text-purple-3">
          <q-item-section avatar>
            <q-icon name="fas fa-home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/dashboard" exact active-class="text-purple-3">
          <q-item-section avatar>
            <q-icon name="fas fa-chart-bar" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/superview" exact active-class="text-purple-3">
          <q-item-section avatar>
            <q-icon name="fas fa-sync" />
          </q-item-section>
          <q-item-section>
            <q-item-label>SuperView</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: false
    }
  },
  methods: {
    openURL
  }
}
</script>

<style>
.bg-custom-blue-dark {
  background: #2B2D3E;
}
</style>
