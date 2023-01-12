<template>
  <div class="q-pa-lg">
    <div class="row">
      <div class="col col-md-12 col-sm-12 col-xs-12">
        <q-input v-model="filter.name" label="根据姓名模糊查询" />
      </div>
    </div>
    <div class="row" style="margin-top: 10px">
      <q-btn
        color="deep-orange"
        label="清空"
        class="q-mr-xs"
        @click="onClear()"
      />
    </div>
  </div>
  <div class="q-pa-md">
    <q-table
      title="课程完成情况"
      :rows="rows"
      :columns="columns"
      row-key="id"
      v-model:pagination="pagination"
      :loading="loading"
      :filter="filter"
      @request="onRequest"
      binary-state-sort
    >
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <!-- 头像 -->
          <q-avatar size="42px">
            <img :src="props.row.avatarurl" />
          </q-avatar>
          <!-- 学生姓名 -->
          <a :href="props.row.home" target="_blank" style="padding-left: 8px">
            <span> {{ props.row.name }}</span>
          </a>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { RankingService } from "boot/ranking";
import { useQuasar } from "quasar";

// 用于过滤
class Filter {
  constructor() {
    this.name = ""; //学生姓名
  }
}

// 定义table列名
const columns = [
  { name: "ranking", label: "排名", field: "ranking", align: "center" },
  { name: "name", label: "学生姓名", field: "name", align: "left" },
  { name: "avg", label: "平均分", field: "avg", align: "left" },
  {
    name: "lab1",
    label: "lab0-0-setup-env-run-os1",
    field: "lab1",
    align: "left",
  },
  {
    name: "lab2",
    label: "lab0-1-run-os2",
    field: "lab2",
    align: "left",
  },
  {
    name: "lab3",
    label: "lab1-os3",
    field: "lab3",
    align: "left",
  },
  {
    name: "lab4",
    label: "lab2-os4",
    field: "lab4",
    align: "left",
  },
  {
    name: "lab5",
    label: "lab3-os5",
    field: "lab5",
    align: "left",
  },
  {
    name: "lab6",
    label: "lab4-os6",
    field: "lab6",
    align: "left",
  },
  {
    name: "lab7",
    label: "lab5-os8",
    field: "lab7",
    align: "left",
  },
  {
    name: "lab7_at",
    label: "最新提交时间",
    field: "lab7_at",
    align: "left",
  },
];

const $q = useQuasar();
const rows = ref([]);
const filter = ref(new Filter());
const loading = ref(false);
const pagination = ref({
  page: 1,
  rowsPerPage: 30,
  rowsNumber: 30,
});

// 请求数据
const onRequest = async (props) => {
  $q.loading.show({
    message: "刷新",
  });

  try {
    loading.value = true;

    const { page, rowsPerPage } = props.pagination;
    const size = rowsPerPage;
    await RankingService.list(page, size, filter.value.name)
      .then((res) => {
        pagination.value.rowsNumber = res.data.total;
        // clear out existing data and add new
        rows.value.splice(0, rows.value.length, ...res.data.data);
      })
      .catch((err) => {
        $q.notify({
          message: err.response.data,
          icon: "report_problem",
        });
      })
      .finally(() => {
        loading.value = false;
      });

    // don't forget to update local pagination object
    pagination.value.page = page;
    pagination.value.rowsPerPage = rowsPerPage;
  } catch (error) {
    console.log(error);
  } finally {
    $q.loading.hide();
  }
};

const onClear = async () => {
  ["name"].forEach((ele) => {
    filter.value[ele] = "";
  });
};

onMounted(async () => {
  await onRequest({
    pagination: pagination.value,
  });
});
</script>
