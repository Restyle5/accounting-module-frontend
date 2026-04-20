<template>
    <div
        v-if="message"
        class="alert d-flex align-items-center gap-2"
        :class="`alert-${type}`"
        role="alert"
    >
        <span>{{ message }}</span>
        <button
            type="button"
            class="btn-close ms-auto"
            @click="$emit('close')"
        />
    </div>
</template>

<script setup>
defineProps({
    message: {
        type: String,
        default: null,
    },
    type: {
        type: String,
        default: 'success',
        validator: (val) => ['success', 'danger', 'warning', 'info'].includes(val),
    },
})

defineEmits(['close'])
</script>