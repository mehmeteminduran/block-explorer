<template>
	<DataTable :value="addresses" :paginator="true" class="p-datatable-gridlines" :rows="10" :loading="loading">
		<Column header="Address" :style="{ width: '200px' }">
			<template #body="{ data }">
				<span style="margin-left: .5em; vertical-align: middle" class="image-text">{{
						data.Address
				}}</span>
			</template>
		</Column>
		<Column header="Amount (ETH)" :style="{ width: '200px' }">
			<template #body="{ data }">
				<span style="margin-left: .5em; vertical-align: middle" class="image-text">{{
						data.Amount
				}}</span>
			</template>
		</Column>
		<Column header="Is Contract Address?" :style="{ width: '200px' }">
			<template #body="{ data }">
				<span :class="'customer-badge status-' + (data.IsContract ? 'qualified' : 'proposal')">{{
						data.IsContract
							? `YES` : `NO`
				}}</span>
			</template>
		</Column>
	</DataTable>
</template>

<script>
export default {
	props: {
		addresses: Array,
		loading:Boolean
	},
	methods: { 
	},
	mounted() {
	}
}
</script>
<style scoped lang="scss">
@import '../assets/demo/badges.scss';
</style>