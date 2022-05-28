	<template>
    <div class="grid" :loading="loading"> 
        <div class="col-12 lg:col-6 xl:col-4">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Percentage Of Contract Transactions (%)</span>
                        <div class="text-900 font-medium text-xl">{{blockDetail.contractPercentage}}</div>
                    </div> 
                </div> 
            </div>
        </div>  
        <div class="col-12 lg:col-6 xl:col-4">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Number Of Unique Addresses (Sent Transactions)</span>
                        <div class="text-900 font-medium text-xl">{{blockDetail.receiverCount}}</div>
                    </div> 
                </div> 
            </div>
        </div> 
        <div class="col-12 lg:col-6 xl:col-4">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Number Of Unique Addresses (Received Transactions)</span>
                        <div class="text-900 font-medium text-xl">{{blockDetail.senderCount}}</div>
                    </div> 
                </div> 
            </div>
        </div> 
        <div class="col-12 lg:col-6 xl:col-4">
            <div class="card mb-3">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Number Of Uncles</span>
                        <div class="text-900 font-medium text-xl">{{blockDetail.uncleCount}}</div>
                    </div> 
                </div> 
            </div>
        </div> 
        <div class="col-12 lg:col-6 xl:col-4">
            <div class="card mb-3">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Number Of Contracts</span>
                        <div class="text-900 font-medium text-xl">{{blockDetail.contractCount}}</div>
                    </div> 
                </div> 
            </div>
        </div> 
        <div class="col-12 lg:col-6 xl:col-4">
            <div class="card mb-3">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Number Of Events</span>
                        <div class="text-900 font-medium text-xl">{{blockDetail.eventCount}}</div>
                    </div> 
                </div> 
            </div>
        </div> 
    </div>
</template>
<script>
export default {
    props: {
        blockDetail: Object, 
        loading:Boolean
    },
    methods: {
    },
    mounted() {
    }
}
</script>
