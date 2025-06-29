import { createRouter, createWebHistory } from 'vue-router'

import { components } from '@/router/asyncRouter'

import OrderPaidList from '@/views/order/PaidList/PaidList.vue'
import ShippedOrderList from '@/views/order/ShippedList/ShippedList.vue'
import CanceledOrderList from '@/views/order/CanceledList/CanceledList.vue'
import CompletedOrderList from '@/views/order/CompletedList/CompletedList.vue'
import OrderAllList from '@/views/order/AllList/AllList.vue'

import AfterSalesPendingApproveList from '@/views/order-after-sales/PendingApproveList/PendingApproveList.vue'
import AfterSalesPendingRefundList from '@/views/order-after-sales/PendingRefundList/PendingRefundList.vue'
import AfterSalesCompletedList from '@/views/order-after-sales/CompletedList/CompletedList.vue'
import AfterSalesAllList from '@/views/order-after-sales/AllList/AllList.vue'

import CategoryList from '@/views/cat_and_attr/Category/CategoryList.vue'
import AttributeList from '@/views/cat_and_attr/Attribute/AttributeList.vue'

import ProductList from '@/views/product/ProductList/ProductList.vue'
import ProductDetail from '@/views/product/ProductDetail/ProductDetail.vue'

const Components = Object.assign({}, components, {
  Layout: () => import('@/components/layout/index.vue'),
  LayoutSystem: () => import('@/components/layout/layout-system.vue'),
  Redirect: () => import('@/components/layout/redirect.vue'),
  LayoutBlank: () => import('@/components/layout/blank.vue'),
})

// 静态路由页面
export const allowRouter = [
  {
    name: 'HomeRoot',
    path: '/',
    component: Components['Layout'],
    redirect: '/home',
    meta: { title: '首页', icon: 'el-icon-eleme' },
    children: [
      {
        name: 'Home',
        path: '/home',
        component: Components['workplace'],
        meta: { title: '首页', icon: 'el-icon-house' },
      },
    ],
  },

  {
    name: 'OrderRoot',
    path: '/order',
    component: Components['Layout'],
    redirect: '/order/paid/list',
    meta: { title: '订单', icon: 'el-icon-Goods' },
    children: [
      {
        name: 'PaidOrderList',
        path: '/order/paid/list',
        component: OrderPaidList,
        meta: { title: '待发货', icon: 'el-icon-sell' },
      },
      {
        name: 'ShippedOrderList',
        path: '/order/shipped/list',
        component: ShippedOrderList,
        meta: { title: '已发货', icon: 'el-icon-TakeawayBox' },
      },

      {
        name: 'CompletedOrderList',
        path: '/order/completed/list',
        component: CompletedOrderList,
        meta: { title: '已完成', icon: 'el-icon-TakeawayBox' },
      },
      {
        name: 'CanceledOrderList',
        path: '/order/canceled/list',
        component: CanceledOrderList,
        meta: { title: '已取消', icon: 'el-icon-TakeawayBox' },
      },
      {
        name: 'AllOrderList',
        path: '/order/all/list',
        component: OrderAllList,
        meta: { title: '全部', icon: 'el-icon-TakeawayBox' },
      },
    ],
  },

  {
    name: 'AfterSalesRoot',
    path: '/after-sales',
    component: Components['Layout'],
    redirect: '/order/aftersales/pending-approve/list',
    meta: { title: '售后', icon: 'el-icon-Goods' },
    children: [
      {
        name: 'AfterSalesPendingApproveList',
        path: '/order/aftersales/pending-approve/list',
        component: AfterSalesPendingApproveList,
        meta: { title: '待审核', icon: 'el-icon-sell' },
      },
      {
        name: 'AfterSalesPendingRefundList',
        path: '/order/aftersales/pending-refund/list',
        component: AfterSalesPendingRefundList,
        meta: { title: '待退款', icon: 'el-icon-sell' },
      },
      {
        name: 'AfterSalesCompletedList',
        path: '/order/aftersales/completed/list',
        component: AfterSalesCompletedList,
        meta: { title: '已完成', icon: 'el-icon-sell' },
      },
      {
        name: 'AfterSalesAllList',
        path: '/order/aftersales/all/list',
        component: AfterSalesAllList,
        meta: { title: '全部', icon: 'el-icon-sell' },
      },
    ],
  },

  {
    name: 'CatAttrRoot',
    path: '/cat_and_attr',
    component: Components['Layout'],
    redirect: '/cat_and_attr/category/list',
    meta: { title: '分类与属性', icon: 'el-icon-Goods' },
    children: [
      {
        name: 'CategoryList',
        path: '/cat_and_attr/category/list',
        component: CategoryList,
        meta: { title: '分类列表', icon: 'el-icon-sell' },
      },
      {
        name: 'AttributeList',
        path: '/cat_and_attr/attribute/list',
        component: AttributeList,
        meta: { title: '属性列表', icon: 'el-icon-sell' },
      },
    ],
  },

  {
    name: 'ProductRoot',
    path: '/product',
    component: Components['Layout'],
    redirect: '/product/list',
    meta: { title: '商品管理', icon: 'el-icon-Goods' },
    children: [
      {
        name: 'ProductList',
        path: '/product/list',
        component: ProductList,
        meta: { title: '商品列表', icon: 'el-icon-sell' },
      },
      {
        name: 'ProductDetail',
        path: '/product/detail',
        component: ProductDetail,
        meta: { title: '商品信息', icon: 'el-icon-sell', hidden: true },
      },
    ],
  },

  {
    name: 'RequestLogRoot',
    path: '/request-log',
    component: Components['Layout'],
    redirect: '/request-log/list',
    meta: { title: '操作日志', icon: 'el-icon-document' },
    children: [
      {
        name: 'RequestLog',
        path: '/request-log/list',
        component: Components['RequestLog'],
        meta: { title: '操作日志', icon: 'el-icon-document' },
      },
    ],
  },
  {
    name: 'ErrorPage',
    path: '/error',
    meta: { title: '错误页面', icon: 'el-icon-eleme', hidden: true },
    component: Components['Layout'],
    redirect: '/error/404',
    children: [
      {
        name: '401',
        path: '/error/401',
        component: Components['401'],
        meta: { title: '401', icon: 'el-icon-tools' },
      },
      {
        name: '404',
        path: '/error/404',
        component: Components['404'],
        meta: { title: '404', icon: 'el-icon-tools' },
      },
    ],
  },
  {
    name: 'Login',
    path: '/login',
    component: Components['Login'],
    meta: { title: '登录', icon: 'el-icon-eleme', hidden: true },
  },
  {
    name: 'Register',
    path: '/register',
    component: Components['Register'],
    meta: { title: '注册', icon: 'el-icon-eleme', hidden: true },
  },
  {
    name: 'ChangePassword',
    path: '/change-password',
    component: Components['ChangePassword'],
    meta: { title: '修改密码', icon: 'el-icon-eleme', hidden: true },
  },
]

const router = createRouter({
  history: createWebHistory(), // createWebHistory
  routes: allowRouter,
})

export default router
