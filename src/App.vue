<template>
	<div class="layout-wrapper layout-static layout-static-sidebar-inactive">
        <AppTopBar />

        <div class="layout-main-container">
            <div class="layout-main">
                <router-view />
            </div>
            <AppFooter />
        </div>
 
        <transition name="layout-mask">
            <div class="layout-mask p-component-overlay"></div>
        </transition>
	</div>
</template>

<script>
import AppTopBar from './AppTopbar.vue';
import AppFooter from './AppFooter.vue';

export default { 
    components: {
        'AppTopBar': AppTopBar, 
        'AppFooter': AppFooter,
    }
}
</script>

<style lang="scss">
@import './App.scss';
</style>
