<template>
  <div class="dashboard">
    <div>
      <b-row style="margin:auto">
        <b-col cols="auto" class="p-1">
          <b-pagination
          v-model="currentPage"
          :total-rows="num_of_rows"
          aria-controls="dashboard-table"
          align="right"
          :per-page="rowsPerPage"
          ></b-pagination>
        </b-col>
        <b-col cols="auto" class="p-1" style="margin-left:15pt">
          Rows per page <b-form-select v-model="rowsPerPage" :options="pageLengthOptions" style="width:50pt" align="right"></b-form-select>
        </b-col>
      </b-row>
    </div>

    <b-table
      id="dashboard-table"
      striped
      hover
      bordered
      class="tbl_dashboard"
      :fields="fields"
      :items="filtered"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :per-page="rowsPerPage"
      :current-page="currentPage"
    >
      <template slot="top-row" slot-scope="{ fields }">
        <td v-for="field in fields" :key="field.key">
          <input v-if="field.filter" v-model="filters[field.key]" placeholder="filter">
        </td>
      </template>
      <template #thead-top>
        <b-tr>
          <b-th colspan="1"><span class="sr-only">ID</span></b-th>
          <b-th variant="light" colspan="4">Metadata</b-th>
          <b-th variant="info" colspan="2">Builds</b-th>
          <b-th variant="primary" colspan="1">Workers</b-th>
        </b-tr>
      </template>
      <template #cell(m_run_id)="data">
        <a :href="`https://github.com/magma/magma/actions/runs/${data.value}`" target="_blank">{{ data.value }}</a>
      </template>
      <template #cell(b_agw)="data">
        <b-icon v-on:click="show_json(data.value.msg)" :icon="`${data.value.icon}`" scale="2" :variant="`${data.value.variant}`"></b-icon>
      </template>
      <template #cell(b_feg)="data">
        <b-icon v-on:click="show_json(data.value.msg)" :icon="`${data.value.icon}`" scale="2" :variant="`${data.value.variant}`"></b-icon>
      </template>
      <template #cell(w_spirent)="data">
        <b-icon v-on:click="show_html(data.value.msg)" :icon="`${data.value.icon}`" scale="2" :variant="`${data.value.variant}`"></b-icon>
      </template>
    </b-table>
  </div>
</template>

<script>
import DashboardDataService from "../services/DashboardDataService";
import { onValue } from "firebase/database";

export default {
  name: "dashboard",
  data() {
    return {
      db_data: {},
      sortBy: 'm_time',
      sortDesc: true,
      items: [],
      filters: {
        branch: '',
        actor: '',
      },
      fields: [
          {
            key: 'build_id',
            label: 'Build ID',
            sortable: false
          },
          {
            key: 'm_time',
            label: 'Time',
            sortable: false,
            formatter: value => {
              var date = new Date(value*1000);
              return date.toLocaleString("en-US", { year: '2-digit', month: 'numeric', day: 'numeric' , hour: 'numeric', minute: 'numeric'})
            },
          },
          {
            key: 'm_run_id',
            label: 'Run',
          },
          {
            key: 'm_branch',
            label: 'Branch',
            filter: true
          },
          {
            key: 'm_actor',
            label: 'Actor',
            filter: true
          },
          {
            key: 'b_agw',
            label: 'AGW',
            formatter: value => {
              let newValue = {
                "icon": "check-square-fill",
                "variant": "success",
                "msg": value
              }
              if (value == null) {
                newValue.icon = "square"
                newValue.variant = "secondary"
              } else if (value.valid != true) {
                newValue.icon = "x-square-fill"
                newValue.variant = "danger"
              }
              return newValue
            }
          },
          {
            key: 'b_feg',
            label: 'FEG',
            formatter: value => {
              let newValue = {
                "icon": "check-square-fill",
                "variant": "success",
                "msg": value
              }
              if (value == null) {
                newValue.icon = "square"
                newValue.variant = "secondary"
              } else if (value.valid != true) {
                newValue.icon = "x-square-fill"
                newValue.variant = "danger"
              }
              return newValue
            }
          },
          {
            key: 'w_spirent',
            label: 'FB Spirent',
            formatter: value => {
              let newValue = {
                "icon": "square",
                "variant": "secondary",
                "msg": value.report
              }
              if (value.verdict == "pass") {
                newValue.icon = "check-square-fill"
                newValue.variant = "success"
              } else if(value.verdict == "fail") {
                newValue.icon = "x-square-fill"
                newValue.variant = "danger"
              }
              return newValue
            }
          },
        ],
      currentPage: 1,
      rowsPerPage: 20,
      pageLengthOptions: [
        { value: 20, text: '20' },
        { value: 50, text: '50' },
        { value: 100, text: '100' },
      ]
    };
  },
  computed: {
    num_of_rows() {
      return this.items.length
    },
    filtered () {
      const filtered = this.items.filter(item => {
        return Object.keys(this.filters).every(key =>
            String(item[key]).includes(this.filters[key]))
      })
      return filtered.length > 0 ? filtered : []
    }
  },
  methods: {
    onDataChange(dbObject) {
      this.db_data = dbObject;
      this.items = []
      for (const [key, build] of Object.entries(dbObject.builds)) {
        // get reports
        var spirent_report = (key in dbObject.workers.fb_lab_spirent.reports) ? dbObject.workers.fb_lab_spirent.reports[key] : {"verdict": "not_present"};
        var branch_path = build.metadata["github:ref"].split('/')
        var branch_name = branch_path[branch_path.length - 1]
        this.items.push(
          {
            build_id: key,
            m_time: build.metadata.timestamp,
            m_run_id: build.metadata["github:run_id"],
            m_actor: build.metadata["github:actor"],
            m_branch: branch_name,
            b_agw: build.agw,
            b_feg: build.feg,
            w_spirent: spirent_report,
          })
      }
      //console.log(this.items)
    },
    show_html: function (message) {
      var wnd = window.open("", "Test Report", "_blank");
      wnd.document.body.innerHTML = "";
      wnd.document.write('<title>Report</title>');
      wnd.document.write(message);
    },
    show_json: function (message) {
      var htmlStringify = require('html-stringify');
      var data = htmlStringify(message);
      var wnd = window.open("", "JSON View", "_blank");
      wnd.document.body.innerHTML = "";
      wnd.document.write('<title>JSON</title>');
      wnd.document.write(data);
    }
  },
  mounted() {
    let dbRef = DashboardDataService.getAll()
    onValue(dbRef, (snapshot) => {
      this.onDataChange(snapshot.val())
    });
  }
};
</script>

<style>
.dashboard {
  width: 90%;
  margin-top: 20pt;
  margin-left: auto;
  margin-right: auto;
}
</style>
