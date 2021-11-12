<template>
  <div class="dashboard">
    <b-table
      striped
      hover
      bordered
      class="tbl_dashboard"
      :fields="fields"
      :items="items"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
    >
      <template #thead-top>
        <b-tr>
          <b-th colspan="1"><span class="sr-only">ID</span></b-th>
          <b-th variant="light" colspan="3">Metadata</b-th>
          <b-th variant="info" colspan="1">Builds</b-th>
          <b-th variant="primary" colspan="1">Workers</b-th>
        </b-tr>
      </template>
      <template #cell(m_run_id)="data">
        <a :href="`https://github.com/magma/magma/actions/runs/${data.value}`" target="_blank">{{ data.value }}</a>
      </template>
      <template #cell(b_agw)="data">
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
      fields: [
          {
            key: 'build_id',
            label: 'Build ID',
            sortable: false
          },
          {
            key: 'm_time',
            label: 'Time',
            sortable: false
          },
          {
            key: 'm_run_id',
            label: 'Run',
          },
          {
            key: 'm_actor',
            label: 'Actor',
          },
          {
            key: 'b_agw',
            label: 'AGW',
            formatter: value => {
              let newValue = {
                "icon": "check-square-fill",
                "variant": "success",
                "msg": value.artifacts
              }
              if (value.valid != true) {
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
    };
  },
  methods: {
    onDataChange(dbObject) {
      this.db_data = dbObject;
      this.items = []
      for (const [key, build] of Object.entries(dbObject.builds)) {
        var date = new Date(build.metadata.timestamp*1000);
        // get reports
        var spirent_report = (key in dbObject.workers.fb_lab_spirent.reports) ? dbObject.workers.fb_lab_spirent.reports[key] : {"verdict": "not_present"};
        this.items.push(
          {
            build_id: key,
            m_time: date.toLocaleString("en-US", { year: '2-digit', month: 'numeric', day: 'numeric' , hour: 'numeric', minute: 'numeric'}),
            m_run_id: build.metadata["github:run_id"],
            m_actor: build.metadata["github:actor"],
            b_agw: build.agw,
            w_spirent: spirent_report,
          })
      }
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
.tbl_dashboard {
  width: 90%;
  margin-top: 20pt;
  margin-left: auto;
  margin-right: auto;
}
</style>
