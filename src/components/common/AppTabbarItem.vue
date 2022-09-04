<script lang="ts" setup>
import { useParent } from '@/hooks/common/relation';
import { AppTabbarProvideKey } from './AppTabber';

interface AppTabbarItemProps {
  name?: string | number;
}

const props = withDefaults(defineProps<AppTabbarItemProps>(), {});
</script>

<template>
  <div>Item</div>
</template>
