import { $t } from "@/plugins/i18n";

export default {
  path: "/setting",
  redirect: "/setting/index",
  meta: {
    icon: "uil:setting",
    title: $t("menus.setting")
  },
  children: [
    {
      path: "/setting/index",
      name: "Setting",
      component: () => import("@/views/setting/index.vue"),
      meta: {
        title: $t("menus.setting")
      }
    }
  ]
} as RouteConfigsTable;
