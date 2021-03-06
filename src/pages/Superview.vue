<template>
  <q-page ref = "xpage">
  <div class="treemap">
    <!-- The SVG structure is explicitly defined in the template with attributes derived from component data -->
    <svg :height="height" style="margin-left: 0px;" :width="width" class="svg-class">
      <g style="shape-rendering: crispEdges;" transform="translate(0,20)">
        <!-- We can use Vue transitions too! -->
        <transition-group name="list" tag="g" class="depth" v-if="selectedNode">
          <!-- Generate each of the visible squares at a given zoom level (the current selected node) -->
          <g
            class="children"
            v-for="(children) in selectedNode._children"
            :key="'c_' + children.id"
            >

            <!-- Generate the children squares (only visible on hover of a square) -->
            <rect
              v-for="child in children._children"
              class="child"
              :id="child.id"
              :key="child.id"
              :height="y(child.y1) - y(child.y0)"
              :width="x(child.x1) - x(child.x0)"
              :x="x(child.x0)"
              :y="y(child.y0)"
              >
            </rect>

            <!--
              The visible square rect element.
              You can attribute directly an event, that fires a method that changes the current node,
              restructuring the data tree, that reactivly gets reflected in the template.
            -->
            <rect
              class="parent"
              v-on:click="selectNode"
              ref=rect
              :id="children.id"
              :key="children.id"
              :x="x(children.x0)"
              :y="y(children.y0)"
              :width="x(children.x1 - children.x0 + children.parent.x0)"
              :height="y(children.y1 - children.y0 + children.parent.y0)"
              :style="{ fill: color[getIndexFromID(children.id)]}"
              >

              <!-- The title attribute -->
              <title>{{ children.data.name }} | {{ children.value }}</title>
            </rect>

            <!-- The visible square text element with the title and value of the child node -->
            <text
              dy="1em"
              :key="'t_' + children.id"
              :x="x(children.x0) + 6"
              :y="y(children.y0) + 6"
              style="fill-opacity: 1;"
              >
              {{ children.data.name }}
            </text>
          </g>
        </transition-group>

        <!-- The top most element, representing the previous node -->
        <g class="grandparent">

          <rect
            :height="margin.top"
            :width="width"
            :y="(margin.top * -1)"
            v-on:click="selectNode"
            :id="parentId">
          </rect>

          <!-- The visible square text element with the id (basically a breadcumb, if you will) -->
          <text
            dy=".65em"
            x="6"
            y="-14">

            {{ selectedNode.id }}
          </text>
        </g>
      </g>
    </svg>
  </div>
  </q-page>
</template>

<script>
import { scaleLinear, scaleOrdinal } from 'd3-scale'
import { json } from 'd3-request'
import { hierarchy, treemap } from 'd3-hierarchy'

// To be explicit about which methods are from D3 let's wrap them around an object
// Is there a better way to do this?
let d3 = {
  scaleLinear: scaleLinear,
  scaleOrdinal: scaleOrdinal,
  json: json,
  hierarchy: hierarchy,
  treemap: treemap
}

export default {
  name: 'Treemap',
  // the component's data
  data () {
    return {
      jsonData: null,
      rootNode: {},
      margin: {
        top: 20,
        right: 0,
        bottom: 0,
        left: 0
      },
      width: 0,
      height: 0,
      selected: null,
      selectedDashboard: null,
      color: {}
    }
  },
  // You can do whatever when the selected node changes
  watch: {
    selectedNode (newData, oldData) {
      if (newData._children) {
        for (let i = 0; i < newData._children.length; i++) {
          this.color.push(this.mapColor(0))
        }
      }
      console.log('The selected node changed...')
    }
  },
  // In the beginning...
  mounted () {
    const {
      width,
      height
    } = this.$refs.xpage.$el.getBoundingClientRect()
    this.width = width
    this.height = height
    setInterval(this.get_data, 3000)
    var that = this
    // An array with colors
    that.color = []
    // loads the data and calls the initialization methods
    d3.json('../static/example_dolap.json',
      function (error, data) {
        if (error) console.log(error)
        that.jsonData = data
        that.initialize()
        that.accumulate(that.rootNode, that)
        that.treemap(that.rootNode)
      }
    )
  },
  // The reactive computed variables that fire rerenders
  computed: {
    // The grandparent id
    parentId () {
      if (this.selectedNode.parent === undefined || this.selectedNode.parent === null) {
        return this.selectedNode.id
      } else {
        return this.selectedNode.parent.id
      }
    },
    // Returns the x position within the current domain
    // Maybe it can be replaced by a vuejs method
    x () {
      return d3.scaleLinear()
        .domain([0, this.width])
        .range([0, this.width])
    },
    // Returns the y position within the current domain
    // Maybe it can be replaced by a vuejs method
    y () {
      return d3.scaleLinear()
        .domain([0, this.height - this.margin.top - this.margin.bottom])
        .range([0, this.height - this.margin.top - this.margin.bottom])
    },
    // The D3 function that recursively subdivides an area into rectangles
    treemap () {
      return d3.treemap()
        .size([this.width, this.height])
        .round(false)
        .paddingInner(0)
    },
    rectColor () {
      return id => { return { fill: this.color[id % 24] } }
    },
    // The current selected node
    selectedNode () {
      let node = null

      if (this.selected) {
        let nd = this.getNodeById(this.rootNode, this.selected, this)

        if (nd._children) {
          node = nd
        } else {
          node = nd.parent
        }
      } else {
        node = this.rootNode
      }

      // Recalculates the y and x domains
      this.x.domain([node.x0, node.x0 + (node.x1 - node.x0)])
      this.y.domain([node.y0, node.y0 + (node.y1 - node.y0)])

      return node
    }
  },
  methods: {
    mapColor (value) {
      var hue = ((1 - value) * 120).toString(10)
      return ['hsl(', hue, ',100%,50%)'].join('')
    },
    getIndexFromID (idSTR) {
      var matches = idSTR.match(/\d+$/)
      return parseInt(matches[0], 10)
    },
    // Called once, to create the hierarchical data representation
    initialize () {
      let that = this

      if (that.jsonData) {
        that.rootNode = d3.hierarchy(that.jsonData)
          .eachBefore(function (d) { d.id = (d.parent ? d.parent.id + '.' : '') + d.data.name })
          .sum((d) => d.value)
          .sort(function (a, b) {
            return b.height - a.height || b.value - a.value
          })
        that.rootNode.x = that.rootNode.y = 0
        that.rootNode.x1 = that.width
        that.rootNode.y1 = that.height
        that.rootNode.depth = 0
      }
    },

    async get_data () {
      let llcMiss = await this.$axios.get('/api/v1/usage')
      let totalRef = await this.$axios.get('/api/v1/usaget2')
      if (llcMiss.data && totalRef.data) {
        for (let i = 0; i < llcMiss.data.length; i++) {
          if (llcMiss.data[i].mean != null && totalRef.data[i].mean != null) {
            let keyList = Object.keys(llcMiss.data[i])
            for (let j = 1; j < keyList.length; j++) {
              this.color[j - 1] = this.mapColor(llcMiss.data[i][keyList[j]] / totalRef.data[i][keyList[j]])
              if (llcMiss.data[i][keyList[j]] / totalRef.data[i][keyList[j]] > 1) {
                console.log('bigger than 1')
              }
            }
          }
        }
      }
      // console.log(this.color)
      /*
      let randomColor = (Math.random())
      this.color[2] = this.mapColor(randomColor)
      this.color[0] = this.mapColor(randomColor)
      */
      // console.log(this.selectedNode._children.length)
      // this.color.push(this.mapColor(0.2))
      this.$forceUpdate()
    },
    // Calculates the accumulated value (sum of children values) of a node - its weight,
    // represented afterwards in the area of its square
    accumulate (d, context) {
      d._children = d.children

      if (d._children) {
        d.value = d._children.reduce(function (p, v) { return p + context.accumulate(v, context) }, 0)
        return d.value
      } else {
        return d.value
      }
    },
    // Helper method - gets a node by its id attribute
    getNodeById (node, id, context) {
      if (node.id === id) {
        return node
      } else if (node._children) {
        for (var i = 0; i < node._children.length; i++) {
          var nd = context.getNodeById(node._children[i], id, context)
          if (nd) {
            return nd
          }
        }
      }
    },
    // When a user clicks a square, changes the selected data attribute
    // which fires the computed selectedNode, which in turn finds the Node by the id of the square clicked
    // and the template reflects the changes
    selectNode (event) {
      this.selected = event.target.id
      let nd = this.getNodeById(this.rootNode, this.selected, this)
      if (!nd._children) {
        this.$router.push({ name: 'customDashboard', params: { keyValue: nd.id } })
      }
    }
  }
}
</script>

<style scoped>

text {
  pointer-events: none;
}

.grandparent text {
  font-weight: bold;
}

rect {
  fill: none;
  stroke: #fff;
}

rect.parent,
.grandparent rect {
  stroke-width: 2px;
}

.grandparent rect {
  fill: orange;
}

.grandparent:hover rect {
  fill: #ee9700;
}

.children rect.parent,
.grandparent rect {
  cursor: pointer;
}

.children rect.parent {
  fill: #bbb;
  fill-opacity: .5;
}

.children:hover rect.child {
  fill: #bbb;
}

.children text{
  font-size: 0.8em;
}

.grandparent text{
  font-size: 0.9em;
}

.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active for <2.1.8 */ {
  opacity: 0;
}

</style>
